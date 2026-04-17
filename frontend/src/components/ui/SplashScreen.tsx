import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TAGLINE = 'Fast and Fun Bologna'

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'logo' | 'text' | 'out'>('logo')
  const [typedText, setTypedText] = useState('')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('text'), 1000)
    return () => clearTimeout(t1)
  }, [])

  useEffect(() => {
    if (phase !== 'text') return
    let i = 0
    const interval = setInterval(() => {
      i++
      setTypedText(TAGLINE.slice(0, i))
      if (i >= TAGLINE.length) {
        clearInterval(interval)
        setTimeout(() => setPhase('out'), 1500)
      }
    }, 60)
    return () => clearInterval(interval)
  }, [phase])

  useEffect(() => {
    if (phase === 'out') {
      const t = setTimeout(onDone, 600)
      return () => clearTimeout(t)
    }
  }, [phase, onDone])

  return (
    <AnimatePresence>
      {phase !== 'out' && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'linear-gradient(160deg, #9000CC 0%, #BB00FF 45%, #7700AA 100%)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          {/* Ambient circles */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', top: '-20%', left: '-20%', width: '60%', height: '60%', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', filter: 'blur(40px)' }} />
            <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '50%', borderRadius: '50%', background: 'rgba(0,0,0,0.15)', filter: 'blur(40px)' }} />
          </div>

          {/* ── Logo icona ── */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}
          >
            {/* Icona tonda */}
            <img
              src="/icons/icon-512.png"
              alt="faf icon"
              style={{
                width: 110,
                height: 110,
                borderRadius: 28,
                boxShadow: '0 16px 60px rgba(0,0,0,0.35)',
              }}
            />

            {/* ✅ Scritta "Faf" bianca sotto l'icona */}
            <img
              src="/icons/Faf_Scritta_Bianca_png.png"
              alt="faf"
              style={{
                height: 52,
                width: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.25))',
              }}
            />
          </motion.div>

          {/* ── Typewriter tagline ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginTop: 24 }}
          >
            <div style={{ height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AnimatePresence>
                {phase === 'text' && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontStyle: 'italic',
                      fontSize: 17,
                      fontWeight: 400,
                      color: 'rgba(255,255,255,0.75)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {typedText}
                    {typedText.length < TAGLINE.length && (
                      <span style={{ animation: 'blink 0.7s infinite', opacity: 1 }}>|</span>
                    )}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── Bottom loader bar ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)', width: 120 }}
          >
            <div style={{ height: 2, background: 'rgba(255,255,255,0.15)', borderRadius: 1, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 3.5, ease: 'linear' }}
                style={{ height: '100%', background: 'rgba(255,255,255,0.7)', borderRadius: 1 }}
              />
            </div>
          </motion.div>

          <style>{`
            @keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0 } }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
