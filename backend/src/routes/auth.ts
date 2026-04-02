import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Admin } from '../models/Admin';
import { User } from '../models/User';
import { VenueOwner } from '../models/VenueOwner';

const router = Router();
const sign = (payload: object, expiresIn = '7d') =>
  jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn } as any);

const GOOGLE_CLIENT_ID     = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const FRONTEND_URL         = process.env.FRONTEND_URL || 'https://panorama-frontend.vercel.app';
const BACKEND_URL          = process.env.BACKEND_URL  || 'https://panoramabo.onrender.com';

// ── Admin login ──
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) { res.status(400).json({ error: 'Email e password richiesti' }); return; }
  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin || !(await admin.comparePassword(password))) {
    res.status(401).json({ error: 'Credenziali non valide' }); return;
  }
  const token = sign({ id: admin._id, role: admin.role });
  res.json({ token, admin: { id: admin._id, email: admin.email, name: admin.name, role: admin.role } });
});

router.get('/me', async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) { res.status(401).json({ error: 'No token' }); return; }
  try {
    const p = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    const admin = await Admin.findById(p.id).select('-password');
    if (!admin) { res.status(401).json({ error: 'Not found' }); return; }
    res.json({ admin });
  } catch { res.status(401).json({ error: 'Invalid token' }); }
});

// ── User register ──
router.post('/user/register', async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) { res.status(400).json({ error: 'Tutti i campi sono richiesti' }); return; }
  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) { res.status(400).json({ error: 'Email già registrata' }); return; }
    const user = await User.create({ email, password, name, provider: 'local' });
    const token = sign({ id: user._id, role: 'user' });
    res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err: any) {
    if (err.code === 11000) res.status(400).json({ error: 'Email già registrata' });
    else res.status(500).json({ error: 'Registrazione fallita' });
  }
});

// ── User login ──
router.post('/user/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() });
  if (!user || !(await user.comparePassword(password))) {
    res.status(401).json({ error: 'Credenziali non valide' }); return;
  }
  const token = sign({ id: user._id, role: 'user' });
  res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
});

// ── User /me ──
router.get('/user/me', async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) { res.status(401).json({ error: 'No token' }); return; }
  try {
    const p = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    const user = await User.findById(p.id).select('-password');
    if (!user) { res.status(401).json({ error: 'Not found' }); return; }
    res.json({ user });
  } catch { res.status(401).json({ error: 'Invalid token' }); }
});

// ── Forgot password ──
router.post('/user/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) { res.status(400).json({ error: 'Email richiesta' }); return; }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) { res.json({ message: 'Se l\'email esiste riceverai un link' }); return; }
    const token = crypto.randomBytes(32).toString('hex');
    (user as any).resetPasswordToken = token;
    (user as any).resetPasswordExpires = new Date(Date.now() + 3600000);
    await user.save();
    console.log(`[RESET] Link: ${FRONTEND_URL}/reset-password?token=${token}`);
    res.json({ message: 'Se l\'email esiste riceverai un link' });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// ── Reset password ──
router.post('/user/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) { res.status(400).json({ error: 'Token e password richiesti' }); return; }
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    } as any);
    if (!user) { res.status(400).json({ error: 'Token non valido o scaduto' }); return; }
    user.password = password;
    (user as any).resetPasswordToken = undefined;
    (user as any).resetPasswordExpires = undefined;
    await user.save();
    const jwtToken = sign({ id: user._id, role: 'user' });
    res.json({ message: 'Password aggiornata', token: jwtToken });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// ─────────────────────────────────────────────
// GOOGLE OAUTH
// ─────────────────────────────────────────────

router.get('/user/google', (_req: Request, res: Response) => {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${BACKEND_URL}/api/v1/auth/user/google/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

router.get('/user/google/callback', async (req: Request, res: Response) => {
  const { code, error } = req.query;
  if (error || !code) {
    res.redirect(`${FRONTEND_URL}/accedi?error=google_cancelled`); return;
  }
  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: String(code),
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: `${BACKEND_URL}/api/v1/auth/user/google/callback`,
        grant_type: 'authorization_code',
      }),
    });
    const tokenData = await tokenRes.json() as any;
    if (!tokenData.access_token) throw new Error('No access token');

    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const googleUser = await userRes.json() as any;
    const { id: googleId, email, name, picture } = googleUser;

    let user = await User.findOne({ $or: [{ providerId: googleId, provider: 'google' }, { email }] } as any);
    if (!user) {
      user = await User.create({ name, email, provider: 'google', providerId: googleId, avatar: picture });
    } else {
      (user as any).providerId = googleId;
      if (!(user as any).avatar) (user as any).avatar = picture;
      await user.save();
    }

    const jwtToken = sign({ id: user._id, role: 'user' });
    res.redirect(`${FRONTEND_URL}/auth-callback?token=${jwtToken}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`);
  } catch (e: any) {
    console.error('Google OAuth error:', e.message);
    res.redirect(`${FRONTEND_URL}/accedi?error=google_failed`);
  }
});

// ── Venue owner login ──
router.post('/venue/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const owner = await VenueOwner.findOne({ email: email?.toLowerCase() });
  if (!owner) { res.status(401).json({ error: 'Credenziali non valide' }); return; }
  const bcrypt = await import('bcryptjs');
  const valid = await bcrypt.compare(password, owner.password);
  if (!valid) { res.status(401).json({ error: 'Credenziali non valide' }); return; }
  if (!owner.placeId) { res.status(400).json({ error: 'Account non associato a nessun locale. Contatta il Super Admin.' }); return; }
  const token = sign({ id: owner._id, role: 'venue_owner', placeId: owner.placeId.toString() });
  res.json({ token, owner: { id: owner._id, email: owner.email, name: owner.name, placeId: owner.placeId } });
});

export default router;
