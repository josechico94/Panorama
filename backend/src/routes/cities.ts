import { Router, Request, Response } from 'express';
import { Place } from '../models/Place';

const router = Router();

// GET /api/v1/cities
router.get('/', async (_req: Request, res: Response) => {
  try {
    const cities = await Place.distinct('city', { 'meta.active': true });
    const citiesWithMeta = cities.map((city: string) => ({
      id: city,
      name: city.charAt(0).toUpperCase() + city.slice(1),
      country: 'Italy',
      isDefault: city === 'bologna',
    }));
    res.json({ data: citiesWithMeta });
  } catch {
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

export default router;
