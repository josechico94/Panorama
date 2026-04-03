import { Router, Request, Response } from 'express'
import webpush from 'web-push'
import { PushSubscription } from '../models/PushSubscription'
import { requireUser } from '../middleware/auth'
import type { AuthRequest } from '../middleware/auth'

const router = Router()

// Configure VAPID
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:admin@faf-app.com',
  process.env.VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
)

// GET /api/v1/push/vapid-public-key
router.get('/vapid-public-key', (_req: Request, res: Response) => {
  res.json({ key: process.env.VAPID_PUBLIC_KEY })
})

// POST /api/v1/push/subscribe
router.post('/subscribe', requireUser, async (req: AuthRequest, res: Response) => {
  try {
    const { endpoint, keys } = req.body
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      res.status(400).json({ error: 'Subscription data mancante' }); return
    }
    await PushSubscription.findOneAndUpdate(
      { endpoint },
      { userId: req.userId, endpoint, p256dh: keys.p256dh, auth: keys.auth },
      { upsert: true, new: true }
    )
    res.json({ success: true })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

// POST /api/v1/push/unsubscribe
router.post('/unsubscribe', requireUser, async (req: AuthRequest, res: Response) => {
  try {
    await PushSubscription.deleteOne({ endpoint: req.body.endpoint })
    res.json({ success: true })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

// Helper: send push to a user
export async function sendPushToUser(userId: string, payload: { title: string; body: string; icon?: string; url?: string }) {
  const subs = await PushSubscription.find({ userId })
  const payloadStr = JSON.stringify({
    title: payload.title,
    body: payload.body,
    icon: payload.icon || '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    url: payload.url || '/',
    timestamp: Date.now(),
  })
  const results = await Promise.allSettled(
    subs.map(sub =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payloadStr
      ).catch(async (err: any) => {
        // Remove invalid subscriptions
        if (err.statusCode === 410 || err.statusCode === 404) {
          await PushSubscription.deleteOne({ _id: sub._id })
        }
        throw err
      })
    )
  )
  return results
}

export default router
