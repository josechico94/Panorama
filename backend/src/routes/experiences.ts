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
function makeSlug(title: string) {
  return title.toLowerCase()
    .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i').replace(/[òóôõö]/g, 'o').replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
    + '-' + Date.now().toString(36);
}

function sanitizeBody(body: any) {
  const b = { ...body };
  if (!b.slug && b.title) b.slug = makeSlug(b.title);

  // ✅ Fix stops: accetta ObjectId sia come stringa 24 char che come oggetto MongoDB
  if (Array.isArray(b.stops)) {
    b.stops = b.stops
      .map((s: any) => {
        // placeId può arrivare come stringa "abc123..." o come oggetto { _id: "..." }
        const pid = s.placeId?._id ?? s.placeId
        return { ...s, placeId: String(pid) }
      })
      .filter((s: any) => {
        const valid = s.placeId && /^[a-f0-9]{24}$/i.test(s.placeId)
        if (!valid) console.warn('[experience] stop scartato — placeId non valido:', s.placeId)
        return valid
      })
      .map((s: any, i: number) => ({
        placeId: s.placeId,
        order: s.order ?? i + 1,
        note: s.note || '',
        duration: parseInt(s.duration) || 60,
      }));

    console.log(`[experience] stops salvati: ${b.stops.length}`)
  }
  return b;
}

router.post('/', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const body = sanitizeBody(req.body);
    const exp = await Experience.create(body);
    const populated = await Experience.findById(exp._id).populate('stops.placeId', 'name slug media location category');
    res.status(201).json({ data: populated });
  } catch (e: any) {
    console.error('experience create error:', e.message);
    res.status(400).json({ error: e.message });
  }
});

router.put('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const body = sanitizeBody(req.body);
    const exp = await Experience.findByIdAndUpdate(req.params.id, body, { new: true })
      .populate('stops.placeId', 'name slug media location category');
    if (!exp) { res.status(404).json({ error: 'Non trovata' }); return; }
    res.json({ data: exp });
  } catch (e: any) {
    console.error('experience update error:', e.message);
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
