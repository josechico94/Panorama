import { useState, useEffect } from 'react'
import { useUserStore } from '@/store'

const VAPID_PUBLIC_KEY = 'BPRTx71eoeImwMk0fLFTnJM-A5ztQpVXilnpIyjGMqXvlpeqSX1Iq2xiJQl7yRSAB0EC_aKGnxANu1Y6_EY3oKQ'
const API = 'https://panoramabo.onrender.com/api/v1'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  return new Uint8Array([...rawData].map(c => c.charCodeAt(0)))
}

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [subscribed, setSubscribed] = useState(false)
  const { token, isLoggedIn } = useUserStore()

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission)
      if (Notification.permission === 'granted') checkSubscription()
    }
  }, [])

  const checkSubscription = async () => {
    if (!('serviceWorker' in navigator)) return
    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.getSubscription()
    setSubscribed(!!sub)
  }

  const subscribe = async (): Promise<boolean> => {
    if (!isLoggedIn() || !token) return false
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false

    try {
      // Request permission
      const perm = await Notification.requestPermission()
      setPermission(perm)
      if (perm !== 'granted') return false

      // Get SW registration
      const reg = await navigator.serviceWorker.ready

      // Subscribe to push
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })

      // Send to backend
      const res = await fetch(`${API}/push/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(sub.toJSON()),
      })

      if (res.ok) {
        setSubscribed(true)
        return true
      }
      return false
    } catch (e) {
      console.error('Push subscribe error:', e)
      return false
    }
  }

  const unsubscribe = async () => {
    if (!('serviceWorker' in navigator)) return
    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.getSubscription()
    if (sub) {
      await sub.unsubscribe()
      await fetch(`${API}/push/unsubscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ endpoint: sub.endpoint }),
      })
      setSubscribed(false)
    }
  }

  return { permission, subscribed, subscribe, unsubscribe }
}
