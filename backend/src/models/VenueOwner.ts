import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IVenueOwner extends Document {
  email: string;
  password: string;
  name: string;
  placeId: mongoose.Types.ObjectId;
  createdAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const VenueOwnerSchema = new Schema<IVenueOwner>({
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  name:     { type: String, required: true },
  placeId:  { type: Schema.Types.ObjectId, ref: 'Place', required: true },
  createdAt:{ type: Date, default: Date.now },
});

VenueOwnerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
VenueOwnerSchema.methods.comparePassword = async function(c: string) {
  return bcrypt.compare(c, this.password);
};

export const VenueOwner = mongoose.model<IVenueOwner>('VenueOwner', VenueOwnerSchema);
