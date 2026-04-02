import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { couponsApi } from '@/lib/api'
import { useUserStore } from '@/store'

const NOTIFIED_KEY = 'cityapp_notified_coupons'

function getNotified(): string[] {
  try { return JSON.parse(localStorage.getItem(NOTIFIED_KEY) || '[]') } catch { return [] }
}
function markNotified(id: string) {
  const list = getNotified()
  if (!list.includes(id)) {
    localStorage.setItem(NOTIFIED_KEY, JSON.stringify([...list, id]))
  }
}

async function requestPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  const result = await Notification.requestPermission()
  return result === 'granted'
}

function sendNotification(title: string, body: string, url: string) {
  if (Notification.permission !== 'granted') return
  const n = new Notification(title, {
    body,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: url, // prevents duplicate notifications
  })
  n.onclick = () => {
    window.focus()
    window.location.href = url
    n.close()
  }
  setTimeout(() => n.close(), 8000)
}

export default function CouponNotifications() {
  const { isLoggedIn } = useUserStore()

  const { data } = useQuery({
    queryKey: ['my-coupons-notify'],
    queryFn: couponsApi.myList,
    enabled: isLoggedIn(),
    staleTime: 0,
    refetchInterval: 1000 * 60 * 60, // check every hour
    refetchOnWindowFocus: true,
  })

  useEffect(() => {
    if (!isLoggedIn() || !data?.data) return

    const checkCoupons = async () => {
      const granted = await requestPermission()
      if (!granted) return

      const notified = getNotified()
      const now = Date.now()

      for (const uc of data.data) {
        if (uc.status !== 'active') continue
        const coupon = uc.couponId
        if (!coupon) continue

        const until = new Date(coupon.validUntil).getTime()
        const daysLeft = Math.ceil((until - now) / (1000 * 60 * 60 * 24))
        const place = uc.placeId

        // Notify at 3 days and 1 day
        const key3 = `${uc._id}_3d`
        const key1 = `${uc._id}_1d`

        if (daysLeft <= 3 && daysLeft > 1 && !notified.includes(key3)) {
          sendNotification(
            `⏰ Coupon in scadenza — ${place?.name || 'Locale'}`,
            `"${coupon.title}" scade tra ${daysLeft} giorni. Usalo prima che sia troppo tardi!`,
            `/coupon/${coupon._id}`
          )
          markNotified(key3)
        }

        if (daysLeft <= 1 && daysLeft >= 0 && !notified.includes(key1)) {
          sendNotification(
            `🚨 Ultimo giorno! — ${place?.name || 'Locale'}`,
            `"${coupon.title}" scade OGGI. Non perdere lo sconto!`,
            `/coupon/${coupon._id}`
          )
          markNotified(key1)
        }
      }
    }

    checkCoupons()
  }, [data, isLoggedIn])

  // This component renders nothing — it's a background service
  return null
}
