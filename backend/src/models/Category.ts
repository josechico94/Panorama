import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  id: string;
  label: string;
  emoji: string;
  color: string;
  isDefault: boolean;
  order: number;
}

const CategorySchema = new Schema<ICategory>({
  id:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  label:     { type: String, required: true, trim: true },
  emoji:     { type: String, required: true, default: '📍' },
  color:     { type: String, required: true, default: '#BB00FF' },
  isDefault: { type: Boolean, default: false },
  order:     { type: Number, default: 0 },
}, { timestamps: true });

export const Category = mongoose.model<ICategory>('Category', CategorySchema);
