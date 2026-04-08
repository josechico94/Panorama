import cron from 'node-cron'
import { Coupon } from '../models/Coupon'
import { UserCoupon } from '../models/UserCoupon'
import { sendPushToUser } from '../routes/push'

export function startCronJobs() {

  // ── Every day at 9:00 — notify expiring coupons ──
  cron.schedule('0 9 * * *', async () => {
    console.log('[CRON] Checking expiring coupons...')
    try {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setUTCHours(23, 59, 59, 999)
      const today = new Date()
      today.setUTCHours(0, 0, 0, 0)

      // Find coupons expiring in exactly 1 day
      const expiringSoon = await Coupon.find({
        active: true,
        validUntil: { $gte: today, $lte: tomorrow },
      }).populate('placeId', 'name').lean()

      for (const coupon of expiringSoon) {
        // Find all users who have this coupon active
        const userCoupons = await UserCoupon.find({
          couponId: coupon._id,
          status: 'active',
        }).lean()

        const placeName = (coupon.placeId as any)?.name || 'il locale'

        for (const uc of userCoupons) {
          try {
            await sendPushToUser(String(uc.userId), {
              title: '⏰ Coupon in scadenza!',
              body: `"${coupon.title}" da ${placeName} scade domani. Usalo prima che sia troppo tardi!`,
              url: `/coupon/${coupon._id}`,
            })
          } catch {}
        }
      }

      console.log(`[CRON] Notified ${expiringSoon.length} expiring coupons`)
    } catch (e: any) {
      console.error('[CRON] Error:', e.message)
    }
  }, { timezone: 'Europe/Rome' })

  // ── Every day at 10:00 — notify new coupons ──
  cron.schedule('0 10 * * *', async () => {
    console.log('[CRON] Checking new coupons...')
    try {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      const newCoupons = await Coupon.find({
        active: true,
        createdAt: { $gte: yesterday },
      }).populate('placeId', 'name').lean()

      if (newCoupons.length > 0) {
        console.log(`[CRON] ${newCoupons.length} new coupons — sending push to all subscribers`)
        const { PushSubscription } = await import('../models/PushSubscription')
        const allSubs = await PushSubscription.distinct('userId')
        for (const userId of allSubs) {
          for (const coupon of newCoupons) {
            const placeName = (coupon.placeId as any)?.name || 'un locale'
            try {
              await sendPushToUser(String(userId), {
                title: '🎫 Nuova offerta disponibile!',
                body: `${placeName} ha appena aggiunto un nuovo coupon. Scaricalo prima che finisca!`,
                url: '/offerte',
              })
            } catch {}
          }
        }
        console.log(`[CRON] Push inviati a ${allSubs.length} utenti`)
      }
    } catch (e: any) {
      console.error('[CRON] Error:', e.message)
    }
  }, { timezone: 'Europe/Rome' })

  console.log('[CRON] Jobs scheduled')
}
