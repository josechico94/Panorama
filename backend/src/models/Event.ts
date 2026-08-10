import mongoose, { Schema, Document } from 'mongoose';

export type EventType =
  | 'place_impression'   // la ficha apareció en una lista/banner
  | 'place_view'         // el usuario abrió el detalle del local
  | 'coupon_impression'  // el cupón apareció en el banner del home
  | 'coupon_view'        // el usuario abrió el detalle del cupón
  | 'coupon_download'    // el usuario descargó el QR
  | 'coupon_redeem'      // el local escaneó y canjeó
  | 'experience_view'
  | 'search';

export const EVENT_TYPES: EventType[] = [
  'place_impression', 'place_view',
  'coupon_impression', 'coupon_view', 'coupon_download', 'coupon_redeem',
  'experience_view', 'search',
];

export type EventSource = 'home' | 'explore' | 'banner' | 'map' | 'search' | 'push' | 'experience' | 'detail' | 'venue' | 'other';

export interface IEvent extends Document {
  type: EventType;
  userId: mongoose.Types.ObjectId | null;
  anonId: string;               // id de dispositivo para usuarios no logueados
  placeId: mongoose.Types.ObjectId | null;
  couponId: mongoose.Types.ObjectId | null;
  experienceId: mongoose.Types.ObjectId | null;
  source: EventSource;
  query: string;                // solo para type: 'search'
  ts: Date;
}

const EventSchema = new Schema<IEvent>({
  type:         { type: String, enum: EVENT_TYPES, required: true },
  userId:       { type: Schema.Types.ObjectId, ref: 'User', default: null },
  anonId:       { type: String, default: '' },
  placeId:      { type: Schema.Types.ObjectId, ref: 'Place', default: null },
  couponId:     { type: Schema.Types.ObjectId, ref: 'Coupon', default: null },
  experienceId: { type: Schema.Types.ObjectId, ref: 'Experience', default: null },
  source:       { type: String, default: 'other' },
  query:        { type: String, default: '', maxlength: 120 },
  ts:           { type: Date, default: Date.now },
}, { versionKey: false });

// Consulta principal del reporte: eventos de un local en una ventana de fechas
EventSchema.index({ placeId: 1, ts: -1, type: 1 });
// Benchmark por categoría y agregados globales
EventSchema.index({ type: 1, ts: -1 });
// Futuro: recomendación personalizada / historial del usuario
EventSchema.index({ userId: 1, ts: -1 });

// Los eventos crudos se borran a los 180 días. Los agregados semanales
// se guardan aparte (VenueReport), así la colección no crece sin control.
EventSchema.index({ ts: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 180 });

export const Event = mongoose.model<IEvent>('Event', EventSchema);
