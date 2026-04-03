// ── FafApp Email Utility ──
// Uses Resend.com — add RESEND_API_KEY to Render environment variables
// Get your free API key at https://resend.com

const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const FROM_EMAIL = 'noreply@faf-app.com'
const APP_URL = process.env.FRONTEND_URL || 'https://faf-app.com'

interface EmailPayload {
  to: string
  subject: string
  html: string
}

async function sendEmail(payload: EmailPayload): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.log(`[EMAIL] No RESEND_API_KEY — skipping email to ${payload.to}: ${payload.subject}`)
    return false
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `FafApp <${FROM_EMAIL}>`,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      }),
    })
    if (!res.ok) {
      const err = await res.json()
      console.error('[EMAIL] Error:', err)
      return false
    }
    console.log(`[EMAIL] Sent to ${payload.to}: ${payload.subject}`)
    return true
  } catch (e: any) {
    console.error('[EMAIL] Failed:', e.message)
    return false
  }
}

// ── Email Templates ──

export async function sendWelcomeEmail(to: string, name: string) {
  return sendEmail({
    to,
    subject: 'Benvenuto su FafApp! 🎉',
    html: `
      <div style="font-family:DM Sans,sans-serif;max-width:560px;margin:0 auto;background:#07070F;color:#F0EDE8;border-radius:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#BB00FF,#9000CC);padding:32px;text-align:center">
          <h1 style="font-size:36px;font-weight:800;color:#fff;margin:0;letter-spacing:-0.02em">faf</h1>
          <p style="color:rgba(255,255,255,0.8);font-style:italic;margin:4px 0 0">Find and Fun Bologna</p>
        </div>
        <div style="padding:32px">
          <h2 style="font-size:22px;font-weight:700;margin-bottom:12px">Ciao ${name}! 👋</h2>
          <p style="color:rgba(240,237,232,0.7);line-height:1.6;margin-bottom:20px">
            Benvenuto su FafApp — la tua porta d'ingresso a Bologna.<br>
            Ora puoi scoprire i migliori locali, scaricare coupon esclusivi e vivere esperienze uniche.
          </p>
          <a href="${APP_URL}" style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#BB00FF,#9000CC);color:#fff;text-decoration:none;border-radius:12px;font-weight:700;font-size:15px">
            Esplora Bologna →
          </a>
        </div>
        <div style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;color:rgba(240,237,232,0.3)">
          © 2026 FafApp · Bologna · <a href="${APP_URL}" style="color:#BB00FF;text-decoration:none">faf-app.com</a>
        </div>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(to: string, resetToken: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${resetToken}`
  return sendEmail({
    to,
    subject: 'Recupera la tua password — FafApp',
    html: `
      <div style="font-family:DM Sans,sans-serif;max-width:560px;margin:0 auto;background:#07070F;color:#F0EDE8;border-radius:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#BB00FF,#9000CC);padding:32px;text-align:center">
          <h1 style="font-size:36px;font-weight:800;color:#fff;margin:0">faf</h1>
        </div>
        <div style="padding:32px">
          <h2 style="font-size:20px;font-weight:700;margin-bottom:12px">Recupera la password 🔐</h2>
          <p style="color:rgba(240,237,232,0.7);line-height:1.6;margin-bottom:24px">
            Hai richiesto di reimpostare la password. Clicca il pulsante qui sotto — il link è valido per 1 ora.
          </p>
          <a href="${resetUrl}" style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#BB00FF,#9000CC);color:#fff;text-decoration:none;border-radius:12px;font-weight:700">
            Reimposta password
          </a>
          <p style="color:rgba(240,237,232,0.35);font-size:12px;margin-top:24px">
            Se non hai richiesto il reset, ignora questa email.
          </p>
        </div>
      </div>
    `,
  })
}

export async function sendCouponExpiryEmail(to: string, name: string, couponTitle: string, placeName: string, couponId: string, expiryDate: string) {
  const couponUrl = `${APP_URL}/coupon/${couponId}`
  return sendEmail({
    to,
    subject: `⏰ Il tuo coupon scade domani — ${couponTitle}`,
    html: `
      <div style="font-family:DM Sans,sans-serif;max-width:560px;margin:0 auto;background:#07070F;color:#F0EDE8;border-radius:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#BB00FF,#9000CC);padding:32px;text-align:center">
          <h1 style="font-size:36px;font-weight:800;color:#fff;margin:0">faf</h1>
        </div>
        <div style="padding:32px">
          <h2 style="font-size:20px;font-weight:700;margin-bottom:8px">Ciao ${name}! ⏰</h2>
          <p style="color:rgba(240,237,232,0.7);line-height:1.6;margin-bottom:20px">
            Il tuo coupon <strong style="color:#BB00FF">"${couponTitle}"</strong> da <strong>${placeName}</strong> scade il <strong>${expiryDate}</strong>.<br>
            Non perdere questa offerta!
          </p>
          <a href="${couponUrl}" style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#BB00FF,#9000CC);color:#fff;text-decoration:none;border-radius:12px;font-weight:700">
            Usa il coupon ora →
          </a>
        </div>
      </div>
    `,
  })
}

export async function sendCouponUsedNotification(to: string, venueName: string, couponTitle: string, userName: string) {
  return sendEmail({
    to,
    subject: `✅ Coupon utilizzato — ${couponTitle}`,
    html: `
      <div style="font-family:DM Sans,sans-serif;max-width:560px;margin:0 auto;background:#07070F;color:#F0EDE8;border-radius:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#BB00FF,#9000CC);padding:32px;text-align:center">
          <h1 style="font-size:36px;font-weight:800;color:#fff;margin:0">faf</h1>
        </div>
        <div style="padding:32px">
          <h2 style="font-size:20px;font-weight:700;margin-bottom:8px">Nuovo coupon riscattato! 🎉</h2>
          <p style="color:rgba(240,237,232,0.7);line-height:1.6">
            <strong>${userName}</strong> ha appena riscattato il coupon <strong style="color:#BB00FF">"${couponTitle}"</strong> presso <strong>${venueName}</strong>.
          </p>
        </div>
      </div>
    `,
  })
}
