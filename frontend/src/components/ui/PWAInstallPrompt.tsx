import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Smartphone } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Don't show if already installed or dismissed recently
    const lastDismissed = localStorage.getItem('pwa_dismissed')
    if (lastDismissed && Date.now() - parseInt(lastDismissed) < 7 * 24 * 60 * 60 * 1000) return

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Show after 30 seconds
      setTimeout(() => setVisible(true), 30000)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setVisible(false)
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setVisible(false)
    setDismissed(true)
    localStorage.setItem('pwa_dismissed', Date.now().toString())
  }

  if (!visible || dismissed) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          position: 'fixed', bottom: 80, left: 12, right: 12, zIndex: 55,
          background: 'rgba(15,15,26,0.98)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(232,98,42,0.3)',
          borderRadius: 18, padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(232,98,42,0.1)',
          maxWidth: 480, margin: '0 auto',
        }}
      >
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#e8622a,#f0884a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Smartphone size={18} color="white" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: '#f0ede8', fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Installa CityApp</p>
          <p style={{ color: 'rgba(240,237,232,0.45)', fontSize: 11, lineHeight: 1.4 }}>Aggiungila alla schermata home per un accesso rapido</p>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <button onClick={handleDismiss} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', color: 'rgba(240,237,232,0.4)' }}>
            <X size={14} />
          </button>
          <button onClick={handleInstall} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', background: '#e8622a', color: '#fff', fontSize: 12, fontWeight: 700 }}>
            <Download size={12} /> Installa
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
