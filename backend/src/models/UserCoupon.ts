import mongoose, { Schema, Document } from 'mongoose';
import crypto from 'crypto';

export interface IUserCoupon extends Document {
  userId: mongoose.Types.ObjectId;
  couponId: mongoose.Types.ObjectId;
  placeId: mongoose.Types.ObjectId;
  uniqueCode: string;       // UUID per questo user+coupon — embedded nel QR
  downloadedAt: Date;
  usedAt: Date | null;
  status: 'active' | 'used' | 'expired';
}

const UserCouponSchema = new Schema<IUserCoupon>({
  userId:       { type: Schema.Types.ObjectId, ref: 'User',   required: true },
  couponId:     { type: Schema.Types.ObjectId, ref: 'Coupon', required: true },
  placeId:      { type: Schema.Types.ObjectId, ref: 'Place',  required: true },
  uniqueCode:   { type: String, unique: true, default: () => crypto.randomUUID() },
  downloadedAt: { type: Date, default: Date.now },
  usedAt:       { type: Date, default: null },
  status:       { type: String, enum: ['active','used','expired'], default: 'active' },
});

// One user can only claim one coupon per coupon ID
UserCouponSchema.index({ userId: 1, couponId: 1 }, { unique: true });

export const UserCoupon = mongoose.model<IUserCoupon>('UserCoupon', UserCouponSchema);
