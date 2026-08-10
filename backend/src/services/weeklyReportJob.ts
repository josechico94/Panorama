import { VenueOwner } from '../models/VenueOwner';
import { getWeeklyStats, lastWeekRange } from './venueStats';
import { generateReport, sendVenueReportEmail } from './venueReport';

/**
 * Recorre todos los venue owners y les manda el reporte de la semana anterior.
 * Secuencial y con pausa entre envíos: son decenas de locales, no miles,
 * y así no chocamos con el rate limit de Gmail ni con el de la API.
 */
export async function runWeeklyReports(range = lastWeekRange()) {
  const owners = await VenueOwner.find().select('email name placeId').lean();
  let sent = 0;
  let skipped = 0;

  console.log(`[REPORT] Inizio: ${owners.length} locali, settimana ${range.from.toISOString().slice(0, 10)}`);

  for (const owner of owners) {
    try {
      const stats = await getWeeklyStats(String(owner.placeId), range);
      if (!stats) { skipped++; continue; }

      // Sin actividad y sin cupones activos: el reporte vacío hace más daño que bien.
      // Ese caso lo cubre el agente de reactivación, con otro tono.
      if (stats.views === 0 && stats.downloads === 0 && stats.activeCoupons === 0) {
        skipped++;
        continue;
      }

      const report = await generateReport(stats);
      await sendVenueReportEmail(owner.email, stats, report);
      sent++;
      await new Promise((r) => setTimeout(r, 1500));
    } catch (e: any) {
      console.error(`[REPORT] Errore per ${owner.email}: ${e.message}`);
    }
  }

  console.log(`[REPORT] Fine: ${sent} inviati, ${skipped} saltati`);
  return { sent, skipped, total: owners.length };
}
