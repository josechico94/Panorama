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
    const { outcome } = await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
          style={{
            position: 'fixed', bottom: 80, left: 16, right: 16, zIndex: 50,
            background: 'var(--bg2)',
            border: '1px solid rgba(187,0,255,0.25)',
            borderRadius: 16, padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
            boxShadow: '0 8px 32px rgba(187,0,255,0.2)',
          }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#BB00FF,#9000CC)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 18 }}>🗺️</span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'var(--text)', fontSize: 13, fontWeight: 700 }}>Installa FafApp</p>
            <p style={{ color: 'var(--text-3)', fontSize: 11 }}>Aggiungila alla schermata home</p>
          </div>
          <button onClick={install} style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 9,
            background: 'linear-gradient(135deg,#BB00FF,#9000CC)', color: '#fff',
            border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
          }}>
            <Download size={12} /> Installa
          </button>
          <button onClick={() => setShow(false)} style={{ padding: 4, borderRadius: 6, border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--text-3)' }}>
            <X size={15} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
