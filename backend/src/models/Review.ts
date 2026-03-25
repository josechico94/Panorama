import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  placeId?: mongoose.Types.ObjectId;
  experienceId?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  placeId:      { type: Schema.Types.ObjectId, ref: 'Place',      index: true },
  experienceId: { type: Schema.Types.ObjectId, ref: 'Experience', index: true },
  userId:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating:       { type: Number, required: true, min: 1, max: 5 },
  comment:      { type: String, default: '', maxlength: 500 },
  createdAt:    { type: Date, default: Date.now },
});

// One review per user per place or experience
ReviewSchema.index({ placeId: 1, userId: 1 }, { unique: true, sparse: true });
ReviewSchema.index({ experienceId: 1, userId: 1 }, { unique: true, sparse: true });

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
