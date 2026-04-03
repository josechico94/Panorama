import { motion, AnimatePresence } from 'framer-motion'
import { Bell, BellOff, Check } from 'lucide-react'
import { useState } from 'react'
import { usePushNotifications } from '@/hooks/usePushNotifications'
import { useUserStore } from '@/store'

export default function NotificationBell() {
  const { permission, subscribed, subscribe, unsubscribe } = usePushNotifications()
  const { isLoggedIn } = useUserStore()
  const [loading, setLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)

  if (!isLoggedIn()) return null
  if (!('Notification' in window)) return null

  const handleClick = async () => {
    setLoading(true)
    if (subscribed) {
      await unsubscribe()
    } else {
      const ok = await subscribe()
      if (ok) {
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      }
    }
    setLoading(false)
  }

  const isBlocked = permission === 'denied'

  return (
    <>
      <button
        onClick={handleClick}
        disabled={loading || isBlocked}
        title={isBlocked ? 'Notifiche bloccate dal browser' : subscribed ? 'Disattiva notifiche' : 'Attiva notifiche'}
        style={{
          width: 34, height: 34, borderRadius: 9,
          background: subscribed ? 'rgba(187,0,255,0.12)' : 'var(--surface)',
          border: `1px solid ${subscribed ? 'rgba(187,0,255,0.3)' : 'var(--border)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: isBlocked ? 'not-allowed' : 'pointer',
          color: subscribed ? '#BB00FF' : 'var(--text-3)',
          transition: 'all 0.2s', opacity: isBlocked ? 0.4 : 1,
          position: 'relative',
        }}
      >
        {loading
          ? <span style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid rgba(187,0,255,0.3)', borderTopColor: '#BB00FF', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
          : subscribed
          ? <Bell size={14} fill="#BB00FF" />
          : <BellOff size={14} />
        }
        {/* Active dot */}
        {subscribed && (
          <span style={{ position: 'absolute', top: 5, right: 5, width: 6, height: 6, borderRadius: '50%', background: '#4ade80', border: '1.5px solid var(--bg)' }} />
        )}
      </button>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            style={{
              position: 'fixed', bottom: 90, left: '50%',
              zIndex: 9999,
              background: 'var(--bg2)', border: '1px solid rgba(187,0,255,0.25)',
              borderRadius: 14, padding: '12px 18px',
              display: 'flex', alignItems: 'center', gap: 10,
              boxShadow: '0 8px 32px rgba(187,0,255,0.2)',
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(74,222,128,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={13} color="#4ade80" />
            </div>
            <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600 }}>
              Notifiche attivate! 🎉
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}
