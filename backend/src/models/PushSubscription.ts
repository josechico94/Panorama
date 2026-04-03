import mongoose, { Schema, Document } from 'mongoose'

export interface IPushSubscription extends Document {
  userId: mongoose.Types.ObjectId
  endpoint: string
  p256dh: string
  auth: string
  createdAt: Date
}

const PushSubscriptionSchema = new Schema({
  userId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
  endpoint: { type: String, required: true, unique: true },
  p256dh:   { type: String, required: true },
  auth:     { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

export const PushSubscription = mongoose.model<IPushSubscription>('PushSubscription', PushSubscriptionSchema)
