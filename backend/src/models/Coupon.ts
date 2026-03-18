import mongoose, { Schema, Document } from 'mongoose';

export type DiscountType = 'percentage' | 'fixed' | 'freebie';

export interface ICoupon extends Document {
  placeId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  conditions: string;
  validFrom: Date;
  validUntil: Date;
  maxUses: number | null;
  usesCount: number;
  active: boolean;
  createdAt: Date;
}

const CouponSchema = new Schema<ICoupon>({
  placeId:       { type: Schema.Types.ObjectId, ref: 'Place', required: true, index: true },
  title:         { type: String, required: true, trim: true },
  description:   { type: String, default: '' },
  discountType:  { type: String, enum: ['percentage','fixed','freebie'], default: 'percentage' },
  discountValue: { type: Number, default: 0 },
  conditions:    { type: String, default: '' },
  validFrom:     { type: Date, required: true },
  validUntil:    { type: Date, required: true },
  maxUses:       { type: Number, default: null },
  usesCount:     { type: Number, default: 0 },
  active:        { type: Boolean, default: true },
  createdAt:     { type: Date, default: Date.now },
});

// Virtual: is expired
CouponSchema.virtual('isExpired').get(function() {
  return new Date() > this.validUntil;
});
CouponSchema.virtual('isValid').get(function() {
  const now = new Date();
  const withinDates = now >= this.validFrom && now <= this.validUntil;
  const hasUses = this.maxUses === null || this.usesCount < this.maxUses;
  return this.active && withinDates && hasUses;
});

export const Coupon = mongoose.model<ICoupon>('Coupon', CouponSchema);
