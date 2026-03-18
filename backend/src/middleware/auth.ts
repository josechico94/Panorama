import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  adminId?: string;
  userId?: string;
  venueOwnerId?: string;
  placeId?: string;
}

const secret = () => process.env.JWT_SECRET || 'secret';

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) { res.status(401).json({ error: 'Unauthorized' }); return; }
  try {
    const p = jwt.verify(token, secret()) as { id: string; role: string };
    if (!['admin','superadmin'].includes(p.role)) { res.status(403).json({ error: 'Forbidden' }); return; }
    req.adminId = p.id;
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
};

export const requireUser = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) { res.status(401).json({ error: 'Unauthorized' }); return; }
  try {
    const p = jwt.verify(token, secret()) as { id: string; role: string };
    if (p.role !== 'user') { res.status(403).json({ error: 'Forbidden' }); return; }
    req.userId = p.id;
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
};

export const requireVenueOwner = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) { res.status(401).json({ error: 'Unauthorized' }); return; }
  try {
    const p = jwt.verify(token, secret()) as { id: string; role: string; placeId: string };
    if (p.role !== 'venue_owner') { res.status(403).json({ error: 'Forbidden' }); return; }
    req.venueOwnerId = p.id;
    req.placeId = p.placeId;
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
};

export const requireAuth = requireAdmin; // backward compat
