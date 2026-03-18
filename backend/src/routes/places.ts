import { Router, Request, Response } from 'express';
import { Place } from '../models/Place';

const router = Router();

// GET /api/v1/places — list with filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { city = 'bologna', category, neighborhood, open_now, featured, search, limit = '20', page = '1' } = req.query;

    const filter: Record<string, unknown> = { 'meta.active': true, city };
    if (category) filter.category = category;
    if (neighborhood) filter['location.neighborhood'] = new RegExp(neighborhood as string, 'i');
    if (featured === 'true') filter['meta.featured'] = true;
    if (search) {
      filter.$or = [
        { name: new RegExp(search as string, 'i') },
        { tags: new RegExp(search as string, 'i') },
        { shortDescription: new RegExp(search as string, 'i') },
      ];
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    let places = await Place.find(filter)
      .sort({ 'meta.featured': -1, 'meta.createdAt': -1 })
      .skip(skip)
      .limit(limitNum)
      .lean({ virtuals: true });

    if (open_now === 'true') {
      places = places.filter((p: any) => p.isOpenNow);
    }

    const total = await Place.countDocuments(filter);

    res.json({
      data: places,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch places' });
  }
});

// GET /api/v1/places/featured
router.get('/featured', async (_req: Request, res: Response) => {
  try {
    const places = await Place.find({ 'meta.active': true, 'meta.featured': true })
      .limit(8)
      .lean({ virtuals: true });
    res.json({ data: places });
  } catch {
    res.status(500).json({ error: 'Failed to fetch featured places' });
  }
});

// GET /api/v1/places/:slug
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const place = await Place.findOneAndUpdate(
      { slug: req.params.slug, 'meta.active': true },
      { $inc: { 'meta.views': 1 } },
      { new: true }
    ).lean({ virtuals: true });

    if (!place) {
      res.status(404).json({ error: 'Place not found' });
      return;
    }
    res.json({ data: place });
  } catch {
    res.status(500).json({ error: 'Failed to fetch place' });
  }
});

export default router;
