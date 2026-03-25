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

// GET /api/v1/places/nearby?lat=&lng=&radius=&exclude=
router.get('/nearby', async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius = '1000', limit = '6', exclude } = req.query;
    if (!lat || !lng) { res.status(400).json({ error: 'lat e lng richiesti' }); return; }
    
    const latN = parseFloat(String(lat));
    const lngN = parseFloat(String(lng));
    const radiusM = parseInt(String(radius));
    
    // Convert radius in meters to degrees (approximate)
    const latDelta = radiusM / 111320;
    const lngDelta = radiusM / (111320 * Math.cos(latN * Math.PI / 180));
    
    const excludeIds = exclude ? String(exclude).split(',') : [];
    
    const places = await Place.find({
      'meta.active': true,
      _id: { $nin: excludeIds },
      'location.coordinates.lat': { $gte: latN - latDelta, $lte: latN + latDelta },
      'location.coordinates.lng': { $gte: lngN - lngDelta, $lte: lngN + lngDelta },
    })
    .limit(parseInt(String(limit)))
    .select('name slug category media location priceRange meta.views')
    .lean();
    
    // Sort by distance
    const withDist = places.map(p => {
      const dlat = (p.location?.coordinates?.lat || 0) - latN;
      const dlng = (p.location?.coordinates?.lng || 0) - lngN;
      return { ...p, distance: Math.round(Math.sqrt(dlat*dlat + dlng*dlng) * 111320) };
    }).sort((a, b) => a.distance - b.distance);
    
    res.json({ data: withDist });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

export default router;
