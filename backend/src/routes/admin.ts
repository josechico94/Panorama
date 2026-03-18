import { Router, Request, Response } from 'express';
import multer from 'multer';
import { Place } from '../models/Place';
import { requireAuth, AuthRequest } from '../middleware/auth';
import cloudinary from '../config/cloudinary';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// All admin routes require auth
router.use(requireAuth);

// GET /api/v1/admin/places
router.get('/places', async (req: Request, res: Response) => {
  try {
    const { city, category, active, page = '1', limit = '50' } = req.query;
    const filter: Record<string, unknown> = {};
    if (city) filter.city = city;
    if (category) filter.category = category;
    if (active !== undefined) filter['meta.active'] = active === 'true';

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const places = await Place.find(filter)
      .sort({ 'meta.createdAt': -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await Place.countDocuments(filter);
    res.json({ data: places, total });
  } catch {
    res.status(500).json({ error: 'Failed to fetch places' });
  }
});

// GET /api/v1/admin/stats
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const total = await Place.countDocuments();
    const active = await Place.countDocuments({ 'meta.active': true });
    const featured = await Place.countDocuments({ 'meta.featured': true });
    const byCategory = await Place.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    const topViewed = await Place.find({ 'meta.active': true })
      .sort({ 'meta.views': -1 })
      .limit(5)
      .select('name meta.views category');

    res.json({ total, active, featured, byCategory, topViewed });
  } catch {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// POST /api/v1/admin/places
router.post('/places', async (req: Request, res: Response) => {
  try {
    const place = new Place(req.body);
    await place.save();
    res.status(201).json({ data: place });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'A place with this name already exists' });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// PUT /api/v1/admin/places/:id
router.put('/places/:id', async (req: Request, res: Response) => {
  try {
    const place = await Place.findByIdAndUpdate(
      req.params.id,
      { ...req.body, 'meta.updatedAt': new Date() },
      { new: true, runValidators: true }
    );
    if (!place) { res.status(404).json({ error: 'Place not found' }); return; }
    res.json({ data: place });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/v1/admin/places/:id
router.delete('/places/:id', async (req: Request, res: Response) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) { res.status(404).json({ error: 'Place not found' }); return; }
    res.json({ message: 'Place deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// POST /api/v1/admin/upload
router.post('/upload', upload.single('image'), async (req: Request, res: Response) => {
  if (!req.file) { res.status(400).json({ error: 'No file uploaded' }); return; }

  try {
    const base64 = req.file.buffer.toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'cityapp',
      transformation: [{ width: 1200, height: 800, crop: 'fill', quality: 'auto' }],
    });

    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error: any) {
    // Fallback if Cloudinary not configured
    res.status(500).json({ error: 'Upload failed. Configure Cloudinary in .env' });
  }
});

export default router;

// POST /api/v1/admin/venue-owners — create venue owner account
import { VenueOwner } from '../models/VenueOwner';

router.post('/venue-owners', async (req: Request, res: Response) => {
  try {
    const { email, password, name, placeId } = req.body;
    if (!email || !password || !name || !placeId) {
      res.status(400).json({ error: 'Tutti i campi richiesti' }); return;
    }
    const owner = await VenueOwner.create({ email, password, name, placeId });
    res.status(201).json({ data: { id: owner._id, email: owner.email, name: owner.name, placeId: owner.placeId } });
  } catch (err: any) {
    if (err.code === 11000) res.status(400).json({ error: 'Email già registrata' });
    else res.status(400).json({ error: err.message });
  }
});

router.get('/venue-owners', async (_req: Request, res: Response) => {
  try {
    const owners = await VenueOwner.find().select('-password').populate('placeId', 'name');
    res.json({ data: owners });
  } catch { res.status(500).json({ error: 'Failed' }); }
});

// POST /api/v1/admin/dev/create-venue — DEV ONLY, no auth needed
// Remove this route before going to production
router.post('/dev/create-venue', async (req: Request, res: Response) => {
  if (process.env.NODE_ENV === 'production') {
    res.status(404).json({ error: 'Not found' }); return;
  }
  try {
    const { email, password, name, placeName } = req.body;

    // Find place by name
    const place = await Place.findOne({
      name: new RegExp(placeName, 'i'),
      city: 'bologna'
    });
    if (!place) {
      const allPlaces = await Place.find({ city: 'bologna' }).select('name');
      res.status(404).json({
        error: `Posto non trovato: "${placeName}"`,
        available: allPlaces.map((p: any) => p.name)
      }); return;
    }

    // Check if owner already exists
    const existing = await VenueOwner.findOne({ email: email.toLowerCase() });
    if (existing) {
      await VenueOwner.deleteOne({ email: email.toLowerCase() });
    }

    const owner = await VenueOwner.create({ email, password, name, placeId: place._id });
    res.status(201).json({
      success: true,
      message: `Venue owner creato per "${place.name}"`,
      credentials: { email, password },
      loginUrl: '/locale/login',
      owner: { id: owner._id, email: owner.email, name: owner.name, placeId: place._id, placeName: place.name }
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});
