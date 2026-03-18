import mongoose, { Schema, Document } from 'mongoose';

export type Category = 'eat' | 'drink' | 'shop' | 'walk' | 'culture' | 'sport' | 'night';

export interface IPlace extends Document {
  name: string;
  slug: string;
  city: string;
  category: Category;
  tags: string[];
  description: string;
  shortDescription: string;
  media: {
    coverImage: string;
    gallery: string[];
  };
  location: {
    address: string;
    neighborhood: string;
    coordinates: { lat: number; lng: number };
  };
  hours: {
    [key: string]: { open: string; close: string; closed: boolean } | null;
  };
  priceRange: 1 | 2 | 3 | 4;
  contact: {
    phone?: string;
    website?: string;
    instagram?: string;
    email?: string;
  };
  meta: {
    featured: boolean;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    views: number;
  };
}

const DayScheduleSchema = new Schema({
  open: String,
  close: String,
  closed: { type: Boolean, default: false },
}, { _id: false });

const PlaceSchema = new Schema<IPlace>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  city: { type: String, required: true, lowercase: true, index: true },
  category: {
    type: String,
    required: true,
    enum: ['eat', 'drink', 'shop', 'walk', 'culture', 'sport', 'night'],
    index: true,
  },
  tags: [{ type: String, trim: true, lowercase: true }],
  description: { type: String, default: '' },
  shortDescription: { type: String, default: '', maxlength: 160 },
  media: {
    coverImage: { type: String, default: '' },
    gallery: [String],
  },
  location: {
    address: { type: String, default: '' },
    neighborhood: { type: String, default: '' },
    coordinates: {
      lat: { type: Number, default: 44.4949 },
      lng: { type: Number, default: 11.3426 },
    },
  },
  hours: {
    monday: { type: DayScheduleSchema, default: null },
    tuesday: { type: DayScheduleSchema, default: null },
    wednesday: { type: DayScheduleSchema, default: null },
    thursday: { type: DayScheduleSchema, default: null },
    friday: { type: DayScheduleSchema, default: null },
    saturday: { type: DayScheduleSchema, default: null },
    sunday: { type: DayScheduleSchema, default: null },
  },
  priceRange: { type: Number, enum: [1, 2, 3, 4], default: 2 },
  contact: {
    phone: String,
    website: String,
    instagram: String,
    email: String,
  },
  meta: {
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    views: { type: Number, default: 0 },
  },
}, {
  timestamps: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Auto-generate slug from name
PlaceSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() + '-' + Date.now().toString(36);
  }
  this.meta.updatedAt = new Date();
  next();
});

// Virtual: is open now
PlaceSchema.virtual('isOpenNow').get(function () {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const now = new Date();
  const dayName = days[now.getDay()];
  const schedule = this.hours?.[dayName];
  if (!schedule || schedule.closed) return false;
  const [oh, om] = schedule.open.split(':').map(Number);
  const [ch, cm] = schedule.close.split(':').map(Number);
  const current = now.getHours() * 60 + now.getMinutes();
  const openMin = oh * 60 + om;
  const closeMin = ch * 60 + cm;
  return current >= openMin && current <= closeMin;
});

export const Place = mongoose.model<IPlace>('Place', PlaceSchema);
