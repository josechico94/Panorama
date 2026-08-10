import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { z } from 'zod';
import { Event, EVENT_TYPES } from '../models/Event';

const router = Router();

// La ingesta es pública (también trackeamos usuarios no logueados),
// así que va con rate limit propio: 120 batches/min por IP.
const ingestLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

const objectId = z.string().refine((v) => mongoose.Types.ObjectId.isValid(v), 'ObjectId non valido');

const EventInput = z.object({
  type: z.enum(EVENT_TYPES as [string, ...string[]]),
  placeId: objectId.optional(),
  couponId: objectId.optional(),
  experienceId: objectId.optional(),
  source: z.string().max(20).optional(),
  query: z.string().max(120).optional(),
  ts: z.coerce.date().optional(),
});

const BatchInput = z.object({
  anonId: z.string().max(64).optional(),
  events: z.array(EventInput).min(1).max(50),
});

/** Si viene un JWT de usuario válido lo asociamos; si no, el evento queda anónimo. */
function optionalUserId(req: Request): string | null {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  try {
    const p = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string; role: string };
    return p.role === 'user' ? p.id : null;
  } catch {
    return null;
  }
}

// POST /api/v1/events — ingesta en lote desde el frontend
router.post('/', ingestLimiter, async (req: Request, res: Response) => {
  try {
    const parsed = BatchInput.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Payload non valido' });
      return;
    }

    const userId = optionalUserId(req);
    const { anonId = '', events } = parsed.data;
    const now = Date.now();

    const docs = events.map((e) => ({
      type: e.type,
      userId: userId ? new mongoose.Types.ObjectId(userId) : null,
      anonId,
      placeId: e.placeId ? new mongoose.Types.ObjectId(e.placeId) : null,
      couponId: e.couponId ? new mongoose.Types.ObjectId(e.couponId) : null,
      experienceId: e.experienceId ? new mongoose.Types.ObjectId(e.experienceId) : null,
      source: e.source || 'other',
      query: e.query || '',
      // Ignoramos timestamps del cliente fuera de rango (reloj mal configurado)
      ts: e.ts && Math.abs(now - e.ts.getTime()) < 1000 * 60 * 60 * 24 ? e.ts : new Date(),
    }));

    // ordered:false → un documento inválido no tira todo el lote abajo
    await Event.insertMany(docs, { ordered: false });
    res.status(202).json({ ok: true, received: docs.length });
  } catch (e: any) {
    // El tracking nunca debe romper la experiencia del usuario
    console.error('POST /events error:', e.message);
    res.status(202).json({ ok: false });
  }
});

export default router;
