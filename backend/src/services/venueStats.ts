import mongoose from 'mongoose';
import { Event } from '../models/Event';
import { Place } from '../models/Place';
import { Coupon } from '../models/Coupon';
import { UserCoupon } from '../models/UserCoupon';

export interface WeeklyStats {
  placeId: string;
  placeName: string;
  category: string;
  from: Date;
  to: Date;
  views: number;                 // aperturas de la ficha
  uniqueVisitors: number;
  impressions: number;           // veces que apareció en listas/banner
  downloads: number;             // cupones descargados
  redeems: number;               // cupones canjeados
  downloadRate: number;          // downloads / views (%)
  redeemRate: number;            // redeems / downloads (%)
  prevViews: number;
  prevDownloads: number;
  prevRedeems: number;
  topCoupon: { title: string; downloads: number; redeems: number } | null;
  bestDay: string | null;        // día de la semana con más vistas
  categoryRedeemRate: number;    // benchmark: media de la categoría (%)
  activeCoupons: number;
}

const WEEKDAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];

const pct = (num: number, den: number) => (den > 0 ? Math.round((num / den) * 1000) / 10 : 0);

/** Ventana [inicio, fin) de la semana anterior, en horario de Roma. */
export function lastWeekRange(reference = new Date()): { from: Date; to: Date } {
  const to = new Date(reference);
  to.setUTCHours(0, 0, 0, 0);
  const daysSinceMonday = (to.getUTCDay() + 6) % 7;
  to.setUTCDate(to.getUTCDate() - daysSinceMonday); // lunes de esta semana
  const from = new Date(to);
  from.setUTCDate(from.getUTCDate() - 7);           // lunes anterior
  return { from, to };
}

async function countEvents(placeId: mongoose.Types.ObjectId, type: string, from: Date, to: Date) {
  return Event.countDocuments({ placeId, type, ts: { $gte: from, $lt: to } });
}

export async function getWeeklyStats(
  placeIdRaw: string | mongoose.Types.ObjectId,
  range = lastWeekRange(),
): Promise<WeeklyStats | null> {
  const placeId = new mongoose.Types.ObjectId(String(placeIdRaw));
  const place = await Place.findById(placeId).select('name category').lean();
  if (!place) return null;

  const { from, to } = range;
  const prevFrom = new Date(from);
  prevFrom.setUTCDate(prevFrom.getUTCDate() - 7);

  const [
    views, impressions, uniqueVisitorsAgg, prevViews,
    downloads, redeems, prevDownloads, prevRedeems,
    activeCoupons, byDay, topCouponAgg, categoryBenchmark,
  ] = await Promise.all([
    countEvents(placeId, 'place_view', from, to),
    countEvents(placeId, 'place_impression', from, to),
    Event.aggregate([
      { $match: { placeId, type: 'place_view', ts: { $gte: from, $lt: to } } },
      { $group: { _id: { $ifNull: ['$userId', '$anonId'] } } },
      { $count: 'n' },
    ]),
    countEvents(placeId, 'place_view', prevFrom, from),

    UserCoupon.countDocuments({ placeId, downloadedAt: { $gte: from, $lt: to } }),
    UserCoupon.countDocuments({ placeId, usedAt: { $gte: from, $lt: to } }),
    UserCoupon.countDocuments({ placeId, downloadedAt: { $gte: prevFrom, $lt: from } }),
    UserCoupon.countDocuments({ placeId, usedAt: { $gte: prevFrom, $lt: from } }),

    Coupon.countDocuments({ placeId, active: true, validUntil: { $gte: new Date() } }),

    Event.aggregate([
      { $match: { placeId, type: 'place_view', ts: { $gte: from, $lt: to } } },
      { $group: { _id: { $dayOfWeek: '$ts' }, n: { $sum: 1 } } },
      { $sort: { n: -1 } },
      { $limit: 1 },
    ]),

    UserCoupon.aggregate([
      { $match: { placeId, downloadedAt: { $gte: from, $lt: to } } },
      {
        $group: {
          _id: '$couponId',
          downloads: { $sum: 1 },
          redeems: { $sum: { $cond: [{ $eq: ['$status', 'used'] }, 1, 0] } },
        },
      },
      { $sort: { downloads: -1 } },
      { $limit: 1 },
      { $lookup: { from: 'coupons', localField: '_id', foreignField: '_id', as: 'coupon' } },
    ]),

    // Benchmark: tasa media de canje de los locales de la misma categoría
    (async () => {
      const peers = await Place.find({ category: place.category, 'meta.active': true })
        .select('_id').lean();
      const peerIds = peers.map((p: any) => p._id);
      if (!peerIds.length) return 0;
      const [d, r] = await Promise.all([
        UserCoupon.countDocuments({ placeId: { $in: peerIds }, downloadedAt: { $gte: from, $lt: to } }),
        UserCoupon.countDocuments({ placeId: { $in: peerIds }, usedAt: { $gte: from, $lt: to } }),
      ]);
      return pct(r, d);
    })(),
  ]);

  const top = topCouponAgg[0];

  return {
    placeId: String(placeId),
    placeName: (place as any).name,
    category: (place as any).category,
    from,
    to,
    views,
    uniqueVisitors: uniqueVisitorsAgg[0]?.n || 0,
    impressions,
    downloads,
    redeems,
    downloadRate: pct(downloads, views),
    redeemRate: pct(redeems, downloads),
    prevViews,
    prevDownloads,
    prevRedeems,
    topCoupon: top
      ? { title: top.coupon?.[0]?.title || 'Coupon', downloads: top.downloads, redeems: top.redeems }
      : null,
    bestDay: byDay[0] ? WEEKDAYS_IT[byDay[0]._id - 1] : null,
    categoryRedeemRate: categoryBenchmark as number,
    activeCoupons,
  };
}
