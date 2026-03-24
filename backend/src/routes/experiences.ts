import { Router, Request, Response } from 'express';
import { Experience } from '../models/Experience';
import { requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/v1/experiences — lista pubblica
router.get('/', async (req: Request, res: Response) => {
  try {
    const { city = 'bologna', category, budget, featured } = req.query;
    const filter: Record<string, any> = { active: true, city };
    if (category) filter.category = category;
    if (featured) filter.featured = true;
    if (budget) {
      const b = parseInt(String(budget));
      filter.estimatedCost = { $lte: b };
    }
    const experiences = await Experience.find(filter)
      .populate('stops.placeId', 'name slug media location category contact')
      .sort({ featured: -1, createdAt: -1 })
      .lean();
    res.json({ data: experiences });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/v1/experiences/:slug
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const exp = await Experience.findOne({ slug: req.params.slug, active: true })
      .populate('stops.placeId', 'name slug media location category contact hours priceRange tags')
      .lean();
    if (!exp) { res.status(404).json({ error: 'Non trovata' }); return; }
    res.json({ data: exp });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ── Admin CRUD ──
router.post('/', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const body = { ...req.body };
    if (!body.slug && body.title) {
      body.slug = body.title.toLowerCase()
        .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i').replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
        + '-' + Date.now().toString(36);
    }
    const exp = await Experience.create(body);
    res.status(201).json({ data: exp });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.put('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const exp = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exp) { res.status(404).json({ error: 'Non trovata' }); return; }
    res.json({ data: exp });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.delete('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
