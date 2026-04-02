import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download } from 'lucide-react'



export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setTimeout(() => setShow(true), 30000)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const install = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          style={{
            position: 'fixed', bottom: 80, left: 16, right: 16, zIndex: 50,
            background: 'var(--bg2)',
            border: '1px solid rgba(187,0,255,0.25)',
            borderRadius: 18,
            padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
            boxShadow: '0 8px 32px rgba(187,0,255,0.2)',
          }}
        >
          <img src="/icons/icon-192.png" alt="faf" style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, display: 'block' }} />
          <div style={{ flex: 1 }}>
            <p style={{ color: 'var(--text)', fontSize: 13, fontWeight: 700, marginBottom: 2 }}>
              Installa FafApp
            </p>
            <p style={{ color: 'var(--text-3)', fontSize: 11 }}>
              Aggiungila alla schermata home
            </p>
          </div>
          <button
            onClick={install}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '8px 13px', borderRadius: 10,
              background: 'linear-gradient(135deg, #BB00FF, #9000CC)',
              color: '#fff', border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 700, flexShrink: 0,
              boxShadow: '0 2px 10px rgba(187,0,255,0.35)',
            }}
          >
            <Download size={12} /> Installa
          </button>
          <button
            onClick={() => setShow(false)}
            style={{
              padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer',
              background: 'transparent', color: 'var(--text-3)', flexShrink: 0,
            }}
          >
            <X size={15} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
