import { z } from 'zod';
import nodemailer from 'nodemailer';
import type { WeeklyStats } from './venueStats';

const MODEL = 'claude-haiku-4-5-20251001';

const ReportSchema = z.object({
  subject: z.string().min(5).max(80),
  headline: z.string().min(5).max(120),
  paragraphs: z.array(z.string().max(400)).min(1).max(3),
  recommendation: z.string().min(10).max(300),
});
export type Report = z.infer<typeof ReportSchema>;

const fmtDate = (d: Date) => d.toLocaleDateString('it-IT', { day: '2-digit', month: 'long' });
const delta = (curr: number, prev: number) =>
  prev === 0 ? (curr > 0 ? '+100%' : '0%') : `${curr >= prev ? '+' : ''}${Math.round(((curr - prev) / prev) * 100)}%`;

/**
 * El modelo NO calcula: recibe los números ya agregados y sólo los redacta.
 * Cualquier cifra que no esté en este bloque no debe aparecer en el texto.
 */
function buildFactsBlock(s: WeeklyStats): string {
  return [
    `locale: ${s.placeName} (categoria: ${s.category})`,
    `settimana: ${fmtDate(s.from)} - ${fmtDate(new Date(s.to.getTime() - 86400000))}`,
    `visualizzazioni scheda: ${s.views} (settimana precedente: ${s.prevViews}, variazione ${delta(s.views, s.prevViews)})`,
    `visitatori unici: ${s.uniqueVisitors}`,
    `apparizioni in home/liste: ${s.impressions}`,
    `coupon scaricati: ${s.downloads} (settimana precedente: ${s.prevDownloads})`,
    `coupon utilizzati in negozio: ${s.redeems} (settimana precedente: ${s.prevRedeems})`,
    `tasso di download (download/visualizzazioni): ${s.downloadRate}%`,
    `tasso di utilizzo (utilizzi/download): ${s.redeemRate}%`,
    `media della categoria per tasso di utilizzo: ${s.categoryRedeemRate}%`,
    `coupon attivi in questo momento: ${s.activeCoupons}`,
    s.topCoupon
      ? `coupon migliore: "${s.topCoupon.title}" — ${s.topCoupon.downloads} download, ${s.topCoupon.redeems} utilizzi`
      : 'coupon migliore: nessuno',
    s.bestDay ? `giorno con più visite: ${s.bestDay}` : 'giorno con più visite: dato non disponibile',
  ].join('\n');
}

const SYSTEM_PROMPT = `Sei l'assistente di FAF App e scrivi il report settimanale destinato al titolare di un locale a Bologna.

Regole tassative:
- Scrivi in italiano, tono professionale, diretto, senza entusiasmo forzato e senza emoji.
- Usa ESCLUSIVAMENTE i numeri contenuti nel blocco DATI. Non inventare, non stimare, non arrotondare cifre non fornite.
- Se un dato è zero, dillo con chiarezza invece di nasconderlo.
- Il titolare non è un tecnico: niente gergo di marketing o di analisi dati.
- La raccomandazione deve essere una sola azione concreta ed eseguibile questa settimana dalla sua dashboard (es. creare un coupon per un giorno preciso, modificare la percentuale di sconto, aggiornare gli orari).
- Se il tasso di utilizzo è sotto la media della categoria, segnalalo senza colpevolizzare e spiega cosa cambiare.

Rispondi SOLO con un oggetto JSON valido, senza testo prima o dopo, senza blocchi di codice markdown:
{"subject": string, "headline": string, "paragraphs": [string], "recommendation": string}`;

/** Reporte determinista, sin LLM. Se usa como fallback y garantiza que el mail siempre sale. */
export function fallbackReport(s: WeeklyStats): Report {
  const paragraphs = [
    `Nell'ultima settimana la tua scheda è stata visualizzata ${s.views} volte da ${s.uniqueVisitors} persone diverse (${delta(s.views, s.prevViews)} rispetto alla settimana precedente).`,
    `${s.downloads} coupon scaricati e ${s.redeems} utilizzati in negozio. Il tasso di utilizzo è del ${s.redeemRate}%, contro una media di categoria del ${s.categoryRedeemRate}%.`,
  ];
  if (s.topCoupon) {
    paragraphs.push(`Il coupon che ha funzionato meglio è "${s.topCoupon.title}": ${s.topCoupon.downloads} download e ${s.topCoupon.redeems} utilizzi.`);
  }
  return {
    subject: `FAF App — il tuo report settimanale (${s.redeems} coupon utilizzati)`,
    headline: `${s.views} visualizzazioni e ${s.redeems} coupon utilizzati`,
    paragraphs,
    recommendation: s.activeCoupons === 0
      ? 'Al momento non hai nessun coupon attivo: crea una nuova offerta dalla dashboard per tornare visibile in home.'
      : `Il tuo giorno più forte è stato ${s.bestDay || 'il weekend'}: prova un coupon dedicato ai giorni più deboli per distribuire meglio gli ingressi.`,
  };
}

export async function generateReport(s: WeeklyStats): Promise<Report> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return fallbackReport(s);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 900,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: `DATI\n${buildFactsBlock(s)}` }],
      }),
    });
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`API ${response.status}`);
    const data: any = await response.json();
    const text = (data.content || [])
      .filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join('')
      .replace(/```json|```/g, '')
      .trim();

    return ReportSchema.parse(JSON.parse(text));
  } catch (e: any) {
    console.error(`[REPORT] LLM fallito per ${s.placeName}: ${e.message} — uso il fallback`);
    return fallbackReport(s);
  }
}

// ── Email ──────────────────────────────────────────────────────────────

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

function statRow(label: string, value: string | number) {
  return `<td style="padding:12px 8px;text-align:center;border:1px solid #ede9fe;border-radius:8px;">
    <div style="font-size:22px;font-weight:700;color:#7c3aed;">${value}</div>
    <div style="font-size:12px;color:#6b7280;">${label}</div>
  </td>`;
}

export function renderReportHtml(s: WeeklyStats, r: Report): string {
  const dashboardUrl = `${process.env.FRONTEND_URL || 'https://faf-app.com'}/venue/dashboard`;
  return `
  <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;color:#1f2937;">
    <p style="font-size:13px;color:#6b7280;margin:0 0 4px;">FAF App — report settimanale</p>
    <h2 style="margin:0 0 16px;font-size:20px;">${r.headline}</h2>

    <table style="width:100%;border-collapse:separate;border-spacing:6px;margin-bottom:20px;">
      <tr>
        ${statRow('visualizzazioni', s.views)}
        ${statRow('download', s.downloads)}
        ${statRow('utilizzati', s.redeems)}
      </tr>
    </table>

    ${r.paragraphs.map((p) => `<p style="line-height:1.6;margin:0 0 12px;">${p}</p>`).join('')}

    <div style="background:#f5f3ff;border-left:3px solid #7c3aed;padding:14px 16px;margin:20px 0;border-radius:6px;">
      <strong style="display:block;margin-bottom:6px;">Cosa fare questa settimana</strong>
      <span style="line-height:1.6;">${r.recommendation}</span>
    </div>

    <a href="${dashboardUrl}" style="display:inline-block;padding:12px 20px;background:#7c3aed;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
      Apri la dashboard
    </a>

    <p style="margin-top:28px;font-size:12px;color:#9ca3af;">
      Dati riferiti al periodo ${fmtDate(s.from)} — ${fmtDate(new Date(s.to.getTime() - 86400000))}.
    </p>
  </div>`;
}

export async function sendVenueReportEmail(to: string, s: WeeklyStats, r: Report) {
  await transporter.sendMail({
    from: `"FAF App" <${process.env.EMAIL_USER}>`,
    to,
    subject: r.subject,
    html: renderReportHtml(s, r),
  });
}
