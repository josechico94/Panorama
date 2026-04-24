import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── Welcome Email ──
export const sendWelcomeEmail = async (to: string, name: string) => {
  await transporter.sendMail({
    from: `"FAF App" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Benvenuto su FAF App 🎉',
    html: `
      <h2>Ciao ${name} 👋</h2>
      <p>Grazie per esserti registrato su FAF App.</p>
      <p>Divertiti a scoprire eventi, locali e molto altro 🚀</p>
    `,
  });
};

// ── Password Reset Email ──
export const sendPasswordResetEmail = async (to: string, resetUrl: string) => {
  await transporter.sendMail({
    from: `"FAF App" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Reimposta la tua password 🔒',
    html: `
      <h2>Reset della password</h2>
      <p>Hai richiesto di reimpostare la password.</p>
      <p>Clicca sul pulsante qui sotto:</p>

      <a href="${resetUrl}" 
         style="
           display:inline-block;
           padding:12px 20px;
           background:#7c3aed;
           color:white;
           text-decoration:none;
           border-radius:8px;
           margin-top:10px;
         ">
         Reimposta password
      </a>

      <p style="margin-top:20px;">
        Se non hai richiesto tu questa operazione, ignora questa email.
      </p>
    `,
  });
};