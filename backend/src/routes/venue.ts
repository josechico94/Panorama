import { Router, Response } from 'express';
import { requireVenueOwner, AuthRequest } from '../middleware/auth';
import { Place } from '../models/Place';
import { Coupon } from '../models/Coupon';
import { UserCoupon } from '../models/UserCoupon';

const router = Router();
router.use(requireVenueOwner);

function fixDate(dateStr: string, endOfDay: boolean): Date {
  if (!dateStr) return new Date();
  // Always extract just the date part (YYYY-MM-DD) and set local Italian time
  const datePart = String(dateStr).split('T')[0];
  const parts = datePart.split('-');
  const y = parseInt(parts[0]);
  const m = parseInt(parts[1]) - 1;
  const d = parseInt(parts[2]);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return new Date(dateStr);
  // Italy is UTC+1 (UTC+2 in summer). Use noon UTC to be safe in any timezone.
  // Start of day: midnight Italy = 23:00 UTC prev day. Use 00:00 UTC (safe).
  // End of day: 23:59 Italy = 22:59 UTC. Use 23:59 UTC (generous, always valid).
  if (endOfDay) {
    return new Date(Date.UTC(y, m, d, 23, 59, 59));
  }
  return new Date(Date.UTC(y, m, d, 0, 0, 0));
}

router.get('/me', async (req: AuthRequest, res: Response) => {
  try {
    const place = await Place.findById(req.placeId);
    if (!place) { res.status(404).json({ error: 'Locale non trovato' }); return; }
    res.json({ data: place });
  } catch (e: any) {
    console.error('GET /me error:', e.message);
    res.status(500).json({ error: 'Failed' });
  }
});

router.put('/me', async (req: AuthRequest, res: Response) => {
  try {
    const allowed = ['name','shortDescription','description','tags','location','contact','hours','priceRange','media'];
    const update: Record<string, any> = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    }
    update['meta.updatedAt'] = new Date();
    const place = await Place.findByIdAndUpdate(req.placeId, update, { new: true });
    res.json({ data: place });
  } catch (e: any) {
    console.error('PUT /me error:', e.message);
    res.status(500).json({ error: 'Failed' });
  }
});

router.get('/coupons', async (req: AuthRequest, res: Response) => {
  try {
    const coupons = await Coupon.find({ placeId: req.placeId }).sort({ createdAt: -1 });
    res.json({ data: coupons });
  } catch (e: any) {
    console.error('GET /coupons error:', e.message);
    res.status(500).json({ error: 'Failed' });
  }
});

router.post('/coupons', async (req: AuthRequest, res: Response) => {
  try {
    const title = req.body.title;
    const description = req.body.description;
    const discountType = req.body.discountType;
    const discountValue = req.body.discountValue;
    const conditions = req.body.conditions;
    const validFrom = req.body.validFrom;
    const validUntil = req.body.validUntil;
    const maxUses = req.body.maxUses;

    if (!title || !validFrom || !validUntil) {
      res.status(400).json({ error: 'Titolo e date obbligatori' });
      return;
    }

    const fromDate = fixDate(String(validFrom), false);
    const untilDate = fixDate(String(validUntil), true);

    console.log('Creating coupon:', title, '| from:', fromDate.toISOString(), '| until:', untilDate.toISOString());

    const newCoupon = await Coupon.create({
      placeId: req.placeId,
      title: title,
      description: description,
      discountType: discountType,
      discountValue: discountValue,
      conditions: conditions,
      validFrom: fromDate,
      validUntil: untilDate,
      maxUses: maxUses || null,
    });

    res.status(201).json({ data: newCoupon });
  } catch (e: any) {
    console.error('POST /coupons error:', e.message);
    res.status(400).json({ error: e.message });
  }
});

router.put('/coupons/:id', async (req: AuthRequest, res: Response) => {
  try {
    const existing = await Coupon.findOne({ _id: req.params.id, placeId: req.placeId });
    if (!existing) { res.status(404).json({ error: 'Non trovato' }); return; }

    const updateData: Record<string, any> = { ...req.body };

    if (updateData.validFrom && !String(updateData.validFrom).includes('T')) {
      updateData.validFrom = fixDate(String(updateData.validFrom), false);
    }
    if (updateData.validUntil && !String(updateData.validUntil).includes('T')) {
      updateData.validUntil = fixDate(String(updateData.validUntil), true);
    }

    const updated = await Coupon.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ data: updated });
  } catch (e: any) {
    console.error('PUT /coupons/:id error:', e.message);
    res.status(500).json({ error: 'Failed' });
  }
});

router.delete('/coupons/:id', async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await Coupon.findOneAndDelete({ _id: req.params.id, placeId: req.placeId });
    if (!deleted) { res.status(404).json({ error: 'Non trovato' }); return; }
    await UserCoupon.deleteMany({ couponId: req.params.id });
    res.json({ success: true });
  } catch (e: any) {
    console.error('DELETE /coupons/:id error:', e.message);
    res.status(500).json({ error: 'Failed' });
  }
});

router.get('/coupons/:id/stats', async (req: AuthRequest, res: Response) => {
  try {
    const theCoupon = await Coupon.findOne({ _id: req.params.id, placeId: req.placeId });
    if (!theCoupon) { res.status(404).json({ error: 'Non trovato' }); return; }
    const total = await UserCoupon.countDocuments({ couponId: req.params.id });
    const used = await UserCoupon.countDocuments({ couponId: req.params.id, status: 'used' });
    const recent = await UserCoupon.find({ couponId: req.params.id })
      .populate('userId', 'name email')
      .sort({ downloadedAt: -1 })
      .limit(20);
    const rate = total ? Math.round((used / total) * 100) : 0;
    res.json({ data: { coupon: theCoupon, total: total, used: used, conversionRate: rate, recent: recent } });
  } catch (e: any) {
    console.error('GET /coupons/:id/stats error:', e.message);
    res.status(500).json({ error: 'Failed' });
  }
});

export default router;
