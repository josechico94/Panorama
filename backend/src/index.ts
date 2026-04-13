import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import placesRouter     from './routes/places';
import adminRouter      from './routes/admin';
import authRouter       from './routes/auth';
import citiesRouter     from './routes/cities';
import couponsRouter    from './routes/coupons';
import venueRouter      from './routes/venue';
import reviewsRouter    from './routes/reviews';
import superadminRouter from './routes/superadmin';
import experiencesRouter  from './routes/experiences';
import pushRouter from './routes/push';
import categoriesRouter from './routes/categories';
import { startCronJobs } from './utils/cronJobs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/push', pushRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.post('/dev/setup-venue', async (req, res) => {
  try {
    const { Place } = await import('./models/Place');
    const { VenueOwner } = await import('./models/VenueOwner');
    const { email = 'osteria@test.com', password = 'test123', name = "Osteria dell'Orsa", placeName = 'Osteria' } = req.body;
    const place = await (Place as any).findOne({ name: new RegExp(placeName, 'i') });
    if (!place) {
      const all = await (Place as any).find().select('name');
      res.status(404).json({ error: 'Posto non trovato', available: all.map((p: any) => p.name) });
      return;
    }
    await (VenueOwner as any).deleteOne({ email });
    await (VenueOwner as any).create({ email, password, name, placeId: place._id });
    res.json({ ok: true, credentials: { email, password }, place: place.name });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

app.use('/api/v1/places',     placesRouter);
app.use('/api/v1/cities',     citiesRouter);
app.use('/api/v1/admin',      adminRouter);
app.use('/api/v1/auth',       authRouter);
app.use('/api/v1/coupons',    couponsRouter);
app.use('/api/v1/venue',      venueRouter);
app.use('/api/v1/reviews',    reviewsRouter);
app.use('/api/v1/superadmin', superadminRouter);
app.use('/api/v1/experiences', experiencesRouter);
app.use('/api/v1/categories',  categoriesRouter);

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

connectDB().then(() => {
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`)
    startCronJobs()
  });
});

export default app;
