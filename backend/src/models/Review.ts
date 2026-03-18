import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  placeId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  placeId:   { type: Schema.Types.ObjectId, ref: 'Place',  required: true, index: true },
  userId:    { type: Schema.Types.ObjectId, ref: 'User',   required: true },
  rating:    { type: Number, required: true, min: 1, max: 5 },
  comment:   { type: String, default: '', maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
});

// One review per user per place
ReviewSchema.index({ placeId: 1, userId: 1 }, { unique: true });

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
