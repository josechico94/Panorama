import mongoose, { Schema, Document } from 'mongoose';

export interface IExperienceStop {
  placeId: mongoose.Types.ObjectId;
  order: number;
  note: string; // "Inizia qui con un aperitivo"
  duration: number; // minuti consigliati
}

export interface IExperience extends Document {
  title: string;
  slug: string;
  emoji: string;
  tagline: string;
  description: string;
  category: string; // romantica | colazione | pasta | aperitivo | serata | budget
  estimatedCost: number; // € totali stimati
  duration: number; // minuti totali
  stops: IExperienceStop[];
  tags: string[];
  coverImage: string;
  active: boolean;
  featured: boolean;
  city: string;
  createdAt: Date;
}

const StopSchema = new Schema<IExperienceStop>({
  placeId:  { type: Schema.Types.ObjectId, ref: 'Place', required: true },
  order:    { type: Number, required: true },
  note:     { type: String, default: '' },
  duration: { type: Number, default: 60 },
})

const ExperienceSchema = new Schema<IExperience>({
  title:         { type: String, required: true },
  slug:          { type: String, required: true, unique: true },
  emoji:         { type: String, default: '✨' },
  tagline:       { type: String, default: '' },
  description:   { type: String, default: '' },
  category:      { type: String, required: true },
  estimatedCost: { type: Number, default: 0 },
  duration:      { type: Number, default: 120 },
  stops:         [StopSchema],
  tags:          [String],
  coverImage:    { type: String, default: '' },
  active:        { type: Boolean, default: true },
  featured:      { type: Boolean, default: false },
  city:          { type: String, default: 'bologna' },
  createdAt:     { type: Date, default: Date.now },
})

ExperienceSchema.index({ city: 1, active: 1 })

export const Experience = mongoose.model<IExperience>('Experience', ExperienceSchema)
