import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin';
import { User } from '../models/User';
import { VenueOwner } from '../models/VenueOwner';

const router = Router();
const sign = (payload: object, expiresIn = '7d') =>
  jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn } as any);

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
    const user = await User.create({ email, password, name });
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

// ── Venue owner login ──
router.post('/venue/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const owner = await VenueOwner.findOne({ email: email?.toLowerCase() });
  if (!owner || !(await owner.comparePassword(password))) {
    res.status(401).json({ error: 'Credenziali non valide' }); return;
  }
  const token = sign({ id: owner._id, role: 'venue_owner', placeId: owner.placeId.toString() });
  res.json({ token, owner: { id: owner._id, email: owner.email, name: owner.name, placeId: owner.placeId } });
});

export default router;
