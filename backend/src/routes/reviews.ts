import { Router, Request, Response } from 'express';
import { Review } from '../models/Review';
import { requireUser, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/v1/reviews/place/:placeId
router.get('/place/:placeId', async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ placeId: req.params.placeId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const total = reviews.length;
    const avg = total > 0
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / total) * 10) / 10
      : 0;

    const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(r => dist[r.rating] = (dist[r.rating] || 0) + 1);

    res.json({ data: reviews, stats: { avg, total, distribution: dist } });
  } catch (e: any) {
    res.status(500).json({ error: 'Failed' });
  }
});

// POST /api/v1/reviews/place/:placeId
router.post('/place/:placeId', requireUser, async (req: AuthRequest, res: Response) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      res.status(400).json({ error: 'Rating 1-5 obbligatorio' }); return;
    }
    const existing = await Review.findOne({ placeId: req.params.placeId, userId: req.userId });
    if (existing) {
      res.status(400).json({ error: 'Hai già recensito questo posto' }); return;
    }
    const review = await Review.create({
      placeId: req.params.placeId,
      userId: req.userId,
      rating,
      comment: comment || '',
    });
    const populated = await review.populate('userId', 'name');
    res.status(201).json({ data: populated });
  } catch (err: any) {
    if (err.code === 11000) res.status(400).json({ error: 'Hai già recensito questo posto' });
    else res.status(500).json({ error: 'Failed' });
  }
});

// DELETE /api/v1/reviews/:id
router.delete('/:id', requireUser, async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, userId: req.userId });
    if (!review) { res.status(404).json({ error: 'Non trovato' }); return; }
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed' });
  }
});

// GET /api/v1/reviews/experience/:experienceId
router.get('/experience/:experienceId', async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ experienceId: req.params.experienceId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    const total = reviews.length;
    const avg = total > 0 ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / total) * 10) / 10 : 0;
    const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(r => dist[r.rating] = (dist[r.rating] || 0) + 1);
    res.json({ data: reviews, stats: { avg, total, distribution: dist } });
  } catch (e: any) { res.status(500).json({ error: 'Failed' }); }
});

// POST /api/v1/reviews/experience/:experienceId
router.post('/experience/:experienceId', requireUser, async (req: AuthRequest, res: Response) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) { res.status(400).json({ error: 'Rating 1-5 obbligatorio' }); return; }
    const existing = await Review.findOne({ experienceId: req.params.experienceId, userId: req.userId });
    if (existing) { res.status(400).json({ error: 'Hai già recensito questa esperienza' }); return; }
    const review = await Review.create({ experienceId: req.params.experienceId, userId: req.userId, rating, comment: comment || '' });
    const populated = await review.populate('userId', 'name');
    res.status(201).json({ data: populated });
  } catch (err: any) {
    if (err.code === 11000) res.status(400).json({ error: 'Hai già recensito questa esperienza' });
    else res.status(500).json({ error: 'Failed' });
  }
});

export default router;
