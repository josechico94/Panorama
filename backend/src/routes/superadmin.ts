import { Router, Request, Response } from 'express';
import { requireAdmin, AuthRequest } from '../middleware/auth';
import { Place } from '../models/Place';
import { User } from '../models/User';
import { Admin } from '../models/Admin';
import { VenueOwner } from '../models/VenueOwner';
import { Coupon } from '../models/Coupon';
import { UserCoupon } from '../models/UserCoupon';
import { Review } from '../models/Review';
import multer from 'multer';
import cloudinary from '../config/cloudinary';

const router = Router();
router.use(requireAdmin);
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// ── GLOBAL STATS ──
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const [places, users, coupons, userCoupons, reviews, venueOwners] = await Promise.all([
      Place.countDocuments(),
      User.countDocuments(),
      Coupon.countDocuments({ active: true }),
      UserCoupon.countDocuments(),
      Review.countDocuments(),
      VenueOwner.countDocuments(),
    ]);
    const activeCoupons = await Coupon.countDocuments({
      active: true,
      validFrom:  { $lte: new Date() },
      validUntil: { $gte: new Date() },
    });
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('name email createdAt');
    const topPlaces = await Place.find({ 'meta.active': true }).sort({ 'meta.views': -1 }).limit(5).select('name meta.views category');
    const byCategory = await Place.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]);
    res.json({ data: { places, users, coupons, activeCoupons, userCoupons, reviews, venueOwners, recentUsers, topPlaces, byCategory } });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// ── PLACES ──
router.get('/places', async (req: Request, res: Response) => {
  try {
    const { city, category, search, page = '1', limit = '20' } = req.query;
    const filter: Record<string, any> = {};
    if (city) filter.city = city;
    if (category) filter.category = category;
    if (search) filter.name = new RegExp(String(search), 'i');
    const skip = (parseInt(String(page)) - 1) * parseInt(String(limit));
    const [places, total] = await Promise.all([
      Place.find(filter).sort({ 'meta.createdAt': -1 }).skip(skip).limit(parseInt(String(limit))),
      Place.countDocuments(filter),
    ]);
    res.json({ data: places, total });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

router.post('/places', async (req: Request, res: Response) => {
  try {
    const body = { ...req.body };
    if (!body.slug && body.name) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i').replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-').replace(/-+/g, '-').trim()
        + '-' + Date.now().toString(36);
    }
    const place = new Place(body);
    await place.save();
    res.status(201).json({ data: place });
  } catch (e: any) {
    if (e.code === 11000) res.status(400).json({ error: 'Slug già esistente' });
    else res.status(400).json({ error: e.message });
  }
});

router.put('/places/:id', async (req: Request, res: Response) => {
  try {
    const place = await Place.findByIdAndUpdate(req.params.id,
      { ...req.body, 'meta.updatedAt': new Date() }, { new: true, runValidators: true });
    if (!place) { res.status(404).json({ error: 'Non trovato' }); return; }
    res.json({ data: place });
  } catch (e: any) { res.status(400).json({ error: e.message }); }
});

router.delete('/places/:id', async (req: Request, res: Response) => {
  try {
    await Place.findByIdAndDelete(req.params.id);
    await Coupon.deleteMany({ placeId: req.params.id });
    await VenueOwner.deleteMany({ placeId: req.params.id });
    res.json({ success: true });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// ── USERS ──
router.get('/users', async (req: Request, res: Response) => {
  try {
    const { search, page = '1', limit = '20' } = req.query;
    const filter: Record<string, any> = {};
    if (search) filter.$or = [
      { name: new RegExp(String(search), 'i') },
      { email: new RegExp(String(search), 'i') },
    ];
    const skip = (parseInt(String(page)) - 1) * parseInt(String(limit));
    const [users, total] = await Promise.all([
      User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(parseInt(String(limit))),
      User.countDocuments(filter),
    ]);
    res.json({ data: users, total });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

router.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await UserCoupon.deleteMany({ userId: req.params.id });
    await Review.deleteMany({ userId: req.params.id });
    res.json({ success: true });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// ── COUPONS ──
router.get('/coupons', async (req: Request, res: Response) => {
  try {
    const { placeId, active, page = '1', limit = '20' } = req.query;
    const filter: Record<string, any> = {};
    if (placeId) filter.placeId = placeId;
    if (active !== undefined) filter.active = active === 'true';
    const skip = (parseInt(String(page)) - 1) * parseInt(String(limit));
    const [coupons, total] = await Promise.all([
      Coupon.find(filter).populate('placeId', 'name').sort({ createdAt: -1 }).skip(skip).limit(parseInt(String(limit))),
      Coupon.countDocuments(filter),
    ]);
    res.json({ data: coupons, total });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

router.put('/coupons/:id', async (req: Request, res: Response) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) { res.status(404).json({ error: 'Non trovato' }); return; }
    res.json({ data: coupon });
  } catch (e: any) { res.status(400).json({ error: e.message }); }
});

router.delete('/coupons/:id', async (req: Request, res: Response) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    await UserCoupon.deleteMany({ couponId: req.params.id });
    res.json({ success: true });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// ── REVIEWS ──
router.get('/reviews', async (req: Request, res: Response) => {
  try {
    const { placeId, page = '1', limit = '20' } = req.query;
    const filter: Record<string, any> = {};
    if (placeId) filter.placeId = placeId;
    const skip = (parseInt(String(page)) - 1) * parseInt(String(limit));
    const [reviews, total] = await Promise.all([
      Review.find(filter).populate('userId', 'name email').populate('placeId', 'name').sort({ createdAt: -1 }).skip(skip).limit(parseInt(String(limit))),
      Review.countDocuments(filter),
    ]);
    res.json({ data: reviews, total });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

router.delete('/reviews/:id', async (req: Request, res: Response) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// ── VENUE OWNERS ──
router.get('/venue-owners', async (_req: Request, res: Response) => {
  try {
    const owners = await VenueOwner.find().select('-password').populate('placeId', 'name city');
    res.json({ data: owners });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

router.post('/venue-owners', async (req: Request, res: Response) => {
  try {
    const { email, password, name, placeId } = req.body;
    if (!email || !password || !name || !placeId) {
      res.status(400).json({ error: 'Tutti i campi richiesti' }); return;
    }
    await VenueOwner.deleteOne({ email: email.toLowerCase() });
    const owner = await VenueOwner.create({ email, password, name, placeId });
    res.status(201).json({ data: { id: owner._id, email: owner.email, name: owner.name, placeId: owner.placeId } });
  } catch (e: any) {
    if (e.code === 11000) res.status(400).json({ error: 'Email già registrata' });
    else res.status(400).json({ error: e.message });
  }
});

router.delete('/venue-owners/:id', async (req: Request, res: Response) => {
  try {
    await VenueOwner.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// ── IMAGE UPLOAD ──
router.post('/upload', upload.single('image'), async (req: Request, res: Response) => {
  if (!req.file) { res.status(400).json({ error: 'No file' }); return; }
  try {
    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const result = await cloudinary.uploader.upload(base64, {
      folder: 'cityapp',
      transformation: [{ width: 1200, height: 800, crop: 'fill', quality: 'auto' }],
    });
    res.json({ url: result.secure_url });
  } catch { res.status(500).json({ error: 'Upload failed' }); }
});

export default router;
