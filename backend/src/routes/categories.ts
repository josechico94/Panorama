import { Router, Request, Response } from 'express';
import { Category } from '../models/Category';
import { requireAdmin } from '../middleware/auth';

const router = Router();

const DEFAULT_CATEGORIES = [
  { id: 'eat',     label: 'Mangiare',  emoji: '🍽️', color: '#f97316', isDefault: true, order: 0 },
  { id: 'drink',   label: 'Bere',      emoji: '🍹', color: '#a855f7', isDefault: true, order: 1 },
  { id: 'shop',    label: 'Shopping',  emoji: '🛍️', color: '#ec4899', isDefault: true, order: 2 },
  { id: 'walk',    label: 'Passeggio', emoji: '🚶', color: '#22c55e', isDefault: true, order: 3 },
  { id: 'culture', label: 'Cultura',   emoji: '🏛️', color: '#3b82f6', isDefault: true, order: 4 },
  { id: 'sport',   label: 'Sport',     emoji: '⚡',  color: '#84cc16', isDefault: true, order: 5 },
  { id: 'night',   label: 'Notte',     emoji: '🌙', color: '#6366f1', isDefault: true, order: 6 },
]

// ── Seed defaults se non esistono ──
async function seedDefaults() {
  for (const cat of DEFAULT_CATEGORIES) {
    await Category.updateOne({ id: cat.id }, { $setOnInsert: cat }, { upsert: true })
  }
}

// GET /api/v1/categories — pubblico, usato dal frontend
router.get('/', async (_req: Request, res: Response) => {
  try {
    await seedDefaults()
    const cats = await Category.find().sort({ order: 1, createdAt: 1 }).lean()
    res.json({ data: cats })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

// POST /api/v1/categories — solo admin
router.post('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id, label, emoji, color } = req.body
    if (!id || !label) { res.status(400).json({ error: 'id e label richiesti' }); return }
    const count = await Category.countDocuments()
    const cat = await Category.create({ id, label, emoji: emoji || '📍', color: color || '#BB00FF', isDefault: false, order: count })
    res.status(201).json({ data: cat })
  } catch (e: any) {
    if (e.code === 11000) res.status(400).json({ error: 'ID già esistente' })
    else res.status(400).json({ error: e.message })
  }
})

// PUT /api/v1/categories/:id — solo admin
router.put('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const cat = await Category.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    )
    if (!cat) { res.status(404).json({ error: 'Non trovata' }); return }
    res.json({ data: cat })
  } catch (e: any) { res.status(400).json({ error: e.message }) }
})

// DELETE /api/v1/categories/:id — solo admin, non elimina default
router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const cat = await Category.findOne({ id: req.params.id })
    if (!cat) { res.status(404).json({ error: 'Non trovata' }); return }
    if (cat.isDefault) { res.status(400).json({ error: 'Non puoi eliminare le categorie di default' }); return }
    await Category.deleteOne({ id: req.params.id })
    res.json({ success: true })
  } catch (e: any) { res.status(500).json({ error: e.message }) }
})

export default router
