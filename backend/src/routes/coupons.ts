import { Router, Request, Response } from 'express';
import { Coupon } from '../models/Coupon';
import { UserCoupon } from '../models/UserCoupon';
import { requireUser } from '../middleware/auth';
import type { AuthRequest } from '../middleware/auth';
import { sendPushToUser } from './push';

const router = Router();

// GET /api/v1/coupons/active
router.get('/active', async (_req: Request, res: Response) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const coupons = await Coupon.find({
      active: true,
      validUntil: { $gte: startOfToday },
      validFrom:  { $lte: endOfDay },
      $or: [{ maxUses: null }, { $expr: { $lt: ['$usesCount', '$maxUses'] } }],
    })
    .populate('placeId', 'name slug location media category')
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

    res.json({ data: coupons });
  } catch (e: any) {
    res.status(500).json({ error: 'Failed' });
  }
});

// GET /api/v1/coupons/my/list
router.get('/my/list', requireUser, async (req: AuthRequest, res: Response) => {
  try {
    const userCoupons = await UserCoupon.find({ userId: req.userId })
      .populate({ path: 'couponId' })
      .populate('placeId', 'name slug media location category')
      .sort({ downloadedAt: -1 })
      .lean();
    res.json({ data: userCoupons });
  } catch (e: any) {
    res.status(500).json({ error: 'Failed' });
  }
});

// GET /api/v1/coupons/validate/:uniqueCode
router.get('/validate/:uniqueCode', async (req: Request, res: Response) => {
  try {
    const uc = await UserCoupon.findOne({ uniqueCode: req.params.uniqueCode.toLowerCase() })
      .populate('couponId')
      .populate('userId', 'name email')
      .populate('placeId', 'name');

    if (!uc) { res.status(404).json({ error: 'Coupon non trovato', valid: false }); return; }
    if (uc.status === 'used') {
      res.json({ valid: false, reason: 'Già utilizzato', usedAt: uc.usedAt, userCoupon: uc });
      return;
    }
    const theCoupon = uc.couponId as any;
    if (new Date() > theCoupon.validUntil) {
      await UserCoupon.findByIdAndUpdate(uc._id, { status: 'expired' });
      res.json({ valid: false, reason: 'Scaduto', userCoupon: uc });
      return;
    }
    res.json({ valid: true, userCoupon: uc });
  } catch (e: any) {
    res.status(500).json({ error: 'Errore validazione' });
  }
});

// POST /api/v1/coupons/use/:uniqueCode
router.post('/use/:uniqueCode', async (req: Request, res: Response) => {
  try {
    const uc = await UserCoupon.findOne({ uniqueCode: req.params.uniqueCode.toLowerCase() });
    if (!uc) { res.status(404).json({ error: 'Non trovato' }); return; }
    if (uc.status !== 'active') { res.status(400).json({ error: 'Non utilizzabile' }); return; }
    await UserCoupon.findByIdAndUpdate(uc._id, { status: 'used', usedAt: new Date() });

    // Push notification: coupon used confirmation
    try {
      await sendPushToUser(String(uc.userId), {
        title: '✅ Coupon utilizzato!',
        body: 'Il tuo sconto è stato applicato con successo. Grazie!',
        url: '/profilo',
      })
    } catch {}

    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: 'Errore' });
  }
});

// GET /api/v1/coupons/place/:placeId
router.get('/place/:placeId', async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now); startOfToday.setUTCHours(0, 0, 0, 0);
    const endOfToday = new Date(now); endOfToday.setUTCHours(23, 59, 59, 999);
    const coupons = await Coupon.find({
      placeId: req.params.placeId, active: true,
      validUntil: { $gte: startOfToday }, validFrom: { $lte: endOfToday },
    }).lean();
    res.json({ data: coupons });
  } catch (e: any) {
    res.status(500).json({ error: 'Failed' });
  }
});

// POST /api/v1/coupons/:id/claim
router.post('/:id/claim', requireUser, async (req: AuthRequest, res: Response) => {
  try {
    const theCoupon = await Coupon.findById(req.params.id)
      .populate('placeId', 'name')
    if (!theCoupon) { res.status(404).json({ error: 'Coupon non trovato' }); return; }

    const now = new Date();
    const startOfToday = new Date(now); startOfToday.setUTCHours(0, 0, 0, 0);
    const endOfToday = new Date(now); endOfToday.setUTCHours(23, 59, 59, 999);

    const isActive = theCoupon.active
      && theCoupon.validUntil >= startOfToday
      && theCoupon.validFrom <= endOfToday;

    if (!isActive) { res.status(400).json({ error: 'Coupon non più valido' }); return; }
    if (theCoupon.maxUses !== null && theCoupon.usesCount >= theCoupon.maxUses) {
      res.status(400).json({ error: 'Coupon esaurito' }); return;
    }

    const existing = await UserCoupon.findOne({ userId: req.userId, couponId: theCoupon._id });
    if (existing) {
      res.status(400).json({ error: 'Hai già scaricato questo coupon', userCoupon: existing });
      return;
    }

    const userCoupon = await UserCoupon.create({
      userId: req.userId,
      couponId: theCoupon._id,
      placeId: theCoupon.placeId,
    });

    await Coupon.findByIdAndUpdate(theCoupon._id, { $inc: { usesCount: 1 } });

    // Push notification: coupon claimed
    const placeName = (theCoupon.placeId as any)?.name || 'il locale'
    try {
      await sendPushToUser(String(req.userId), {
        title: '🎫 Coupon scaricato!',
        body: `Hai ottenuto "${theCoupon.title}" da ${placeName}. Mostralo per riscattare lo sconto!`,
        url: `/coupon/${theCoupon._id}`,
      })
    } catch {}

    res.status(201).json({ data: userCoupon });
  } catch (err: any) {
    if (err.code === 11000) {
      res.status(400).json({ error: 'Hai già scaricato questo coupon' });
    } else {
      res.status(500).json({ error: 'Errore nel riscatto' });
    }
  }
});

// GET /api/v1/coupons/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const theCoupon = await Coupon.findById(req.params.id)
      .populate('placeId', 'name slug location media category contact hours')
      .lean();
    if (!theCoupon) { res.status(404).json({ error: 'Coupon not found' }); return; }
    res.json({ data: theCoupon });
  } catch (e: any) {
    res.status(500).json({ error: 'Failed' });
  }
});

export default router;
