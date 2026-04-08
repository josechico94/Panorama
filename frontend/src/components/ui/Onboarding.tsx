import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, X, Check } from 'lucide-react'
import { useAppStore } from '@/store'

// ── Interessi selezionabili ──
const INTERESTS = [
  { id: 'mangiare',   emoji: '🍝', label: 'Mangiare',    color: '#E9C46A' },
  { id: 'aperitivo',  emoji: '🍹', label: 'Aperitivo',   color: '#BB00FF' },
  { id: 'cultura',    emoji: '🏛️', label: 'Cultura',     color: '#48CAE4' },
  { id: 'shopping',   emoji: '🛍️', label: 'Shopping',    color: '#F4A261' },
  { id: 'sport',      emoji: '⚽', label: 'Sport',       color: '#52B788' },
  { id: 'nightlife',  emoji: '🌙', label: 'Vita notturna', color: '#5E60CE' },
  { id: 'romantica',  emoji: '🕯️', label: 'Romantico',   color: '#FF4D6D' },
  { id: 'famiglia',   emoji: '👨‍👩‍👧', label: 'Famiglia',   color: '#4ade80' },
]

const STEPS = [
  {
    id: 'scopri',
    emoji: '🗺️',
    title: 'Scopri Bologna',
    subtitle: 'La città fatta di archi',
    description: 'Localizza velocemente il tuo prossimo locale preferito. Bologna ha oltre 200 posti da scoprire — ristoranti storici, bar alla moda, negozi unici e luoghi culturali nascosti.',
    color: '#BB00FF',
    bg: 'linear-gradient(160deg, #1A0033 0%, #07070F 100%)',
    visual: (
      <div style={{ position: 'relative', width: 220, height: 220, margin: '0 auto' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(187,0,255,0.08)', border: '1px solid rgba(187,0,255,0.2)' }} />
        <div style={{ position: 'absolute', inset: 24, borderRadius: '50%', background: 'rgba(187,0,255,0.06)', border: '1px solid rgba(187,0,255,0.15)' }} />
        <div style={{ position: 'absolute', inset: 48, borderRadius: '50%', background: 'rgba(187,0,255,0.08)', border: '1px solid rgba(187,0,255,0.2)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-60%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', background: 'linear-gradient(135deg,#BB00FF,#9000CC)', boxShadow: '0 8px 32px rgba(187,0,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ transform: 'rotate(45deg)', fontSize: 18 }}>🗺️</span>
          </div>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(187,0,255,0.4)', marginTop: 2 }} />
        </div>
        {[
          { top: '20%', left: '15%', emoji: '🍕' },
          { top: '25%', right: '12%', emoji: '🍸' },
          { bottom: '22%', left: '20%', emoji: '🏛️' },
          { bottom: '18%', right: '18%', emoji: '🛍️' },
        ].map((dot, i) => (
          <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.15, type: 'spring' }}
            style={{ position: 'absolute', ...dot, width: 32, height: 32, borderRadius: 10, background: 'var(--bg2)', border: '1px solid rgba(187,0,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
            {dot.emoji}
          </motion.div>
        ))}
      </div>
    ),
  },
  {
    id: 'coupon',
    emoji: '🎫',
    title: 'Coupon Esclusivi',
    subtitle: 'Risparmia ogni volta',
    description: 'Scarica coupon gratis, ricevi il tuo QR code personale e mostralo al locale per riscattare lo sconto immediatamente. Zero commissioni, zero complicazioni.',
    color: '#4ade80',
    bg: 'linear-gradient(160deg, #001A0D 0%, #07070F 100%)',
    visual: (
      <div style={{ position: 'relative', width: 220, height: 220, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div initial={{ rotateY: -15, scale: 0.9 }} animate={{ rotateY: 0, scale: 1 }} transition={{ duration: 0.6 }}
          style={{ width: 180, background: 'var(--bg2)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 16px 48px rgba(0,0,0,0.4)' }}>
          <div style={{ height: 80, background: 'linear-gradient(135deg,#001A0D,#003320)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <span style={{ fontSize: 36 }}>🍸</span>
            <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(74,222,128,0.2)', border: '1px solid rgba(74,222,128,0.4)', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 800, color: '#4ade80', fontFamily: 'DM Mono' }}>-50%</div>
          </div>
          <div style={{ padding: '12px 14px' }}>
            <p style={{ color: 'var(--text-3)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 4 }}>Enoteca Italiana</p>
            <p style={{ color: 'var(--text)', fontSize: 13, fontWeight: 700 }}>Sangria in omaggio</p>
            <div style={{ display: 'flex', gap: 2, marginTop: 10, justifyContent: 'center' }}>
              {Array.from({ length: 6 }).map((_, r) => (
                <div key={r} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {Array.from({ length: 6 }).map((_, cc) => (
                    <div key={cc} style={{ width: 4, height: 4, borderRadius: 1, background: (r + cc) % 3 !== 0 ? 'var(--text)' : 'transparent' }} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: 'interessi',
    emoji: '✨',
    title: 'Cosa ti piace?',
    subtitle: 'Personalizza la tua esperienza',
    description: 'Seleziona i tuoi interessi — la Home mostrerà i posti più rilevanti per te.',
    color: '#BB00FF',
    bg: 'linear-gradient(160deg, #1A0033 0%, #07070F 100%)',
    visual: null, // handled separately
  },
  {
    id: 'ready',
    emoji: '🚀',
    title: 'Sei pronto!',
    subtitle: 'Benvenuto su FafApp',
    description: 'Registrati gratis con email o Google in 30 secondi — salva i tuoi posti, coupon esclusivi ed esperienze uniche a Bologna.',
    color: '#BB00FF',
    bg: 'linear-gradient(160deg, #1A0033 0%, #07070F 100%)',
    visual: (
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', inset: -16, borderRadius: '50%', background: 'radial-gradient(circle, rgba(187,0,255,0.25), transparent 70%)' }} />
          <img src="/icons/icon-192.png" alt="faf" style={{ width: 100, height: 100, borderRadius: 26, boxShadow: '0 12px 48px rgba(187,0,255,0.5)', position: 'relative' }} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'DM Sans', fontSize: 36, fontWeight: 800, color: '#BB00FF', letterSpacing: '-0.04em', lineHeight: 1 }}>faf</p>
          <p style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 14, color: 'var(--text-3)', marginTop: 4 }}>Find and Fun Bologna</p>
        </div>
      </motion.div>
    ),
  },
]

export default function Onboarding({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const { setActiveCategory } = useAppStore()
  const current = STEPS[step]
  const isLast = step === STEPS.length - 1
  const isInterests = current.id === 'interessi'

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const next = () => {
    if (isLast) {
      // Salva il primo interesse selezionato come categoria attiva
      if (selectedInterests.length > 0) {
        // Mappa interesse → categoria app
        const catMap: Record<string, string> = {
          mangiare: 'ristorante', aperitivo: 'bar', cultura: 'cultura',
          shopping: 'shopping', sport: 'sport', nightlife: 'bar',
          romantica: 'ristorante', famiglia: 'cultura',
        }
        const firstCat = catMap[selectedInterests[0]]
        if (firstCat) setActiveCategory(firstCat as any)
      }
      onDone()
      return
    }
    setStep(s => s + 1)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9998,
      background: current.bg,
      display: 'flex', flexDirection: 'column',
      transition: 'background 0.5s ease',
    }}>

      {/* Skip */}
      <div style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onDone} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 20, border: 'none', background: 'rgba(255,255,255,0.08)', color: 'var(--text-3)', cursor: 'pointer', fontSize: 12 }}>
          Salta <X size={12} />
        </button>
      </div>

      {/* Visual / Interests grid */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: -20 }} transition={{ duration: 0.35 }}
            style={{ width: '100%', maxWidth: 400 }}>
            {isInterests ? (
              <div>
                <p style={{ textAlign: 'center', color: 'var(--text-3)', fontSize: 13, marginBottom: 20 }}>
                  Seleziona uno o più interessi
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                  {INTERESTS.map((interest) => {
                    const isSelected = selectedInterests.includes(interest.id)
                    return (
                      <motion.button
                        key={interest.id}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => toggleInterest(interest.id)}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                          padding: '14px 8px', borderRadius: 16, border: 'none', cursor: 'pointer',
                          background: isSelected ? `${interest.color}22` : 'rgba(255,255,255,0.05)',
                          outline: isSelected ? `2px solid ${interest.color}` : '1px solid rgba(255,255,255,0.1)',
                          position: 'relative', transition: 'all 0.2s',
                          boxShadow: isSelected ? `0 4px 16px ${interest.color}33` : 'none',
                        }}
                      >
                        {isSelected && (
                          <div style={{
                            position: 'absolute', top: 6, right: 6,
                            width: 16, height: 16, borderRadius: '50%',
                            background: interest.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Check size={10} color="#fff" strokeWidth={3} />
                          </div>
                        )}
                        <span style={{ fontSize: 28 }}>{interest.emoji}</span>
                        <span style={{
                          fontSize: 10, fontWeight: 600, textAlign: 'center',
                          color: isSelected ? interest.color : 'var(--text-3)',
                          lineHeight: 1.2,
                        }}>
                          {interest.label}
                        </span>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            ) : (
              current.visual
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Text + CTA */}
      <div style={{ padding: '0 28px 40px' }}>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: current.color, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'DM Mono' }}>
              {current.subtitle}
            </p>
            <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 32, fontWeight: 700, color: 'var(--text)', lineHeight: 1.05, marginBottom: 10 }}>
              {current.title}
            </h2>
            <p style={{ color: 'var(--text-3)', fontSize: 14, lineHeight: 1.6 }}>
              {current.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', margin: '20px 0 16px' }}>
          {STEPS.map((_, i) => (
            <motion.div key={i}
              animate={{ width: i === step ? 24 : 6, background: i === step ? current.color : 'rgba(255,255,255,0.2)' }}
              style={{ height: 6, borderRadius: 3, cursor: 'pointer', transition: 'background 0.3s' }}
              onClick={() => setStep(i)}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.button whileTap={{ scale: 0.97 }} onClick={next}
          style={{
            width: '100%', padding: '15px', borderRadius: 16, border: 'none', cursor: 'pointer',
            fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: `linear-gradient(135deg, ${current.color}, ${current.color}CC)`,
            color: '#fff', boxShadow: `0 4px 20px ${current.color}50`,
            opacity: isInterests && selectedInterests.length === 0 ? 0.6 : 1,
          }}>
          {isLast ? '🚀 Inizia a esplorare' : isInterests ? `Continua${selectedInterests.length > 0 ? ` (${selectedInterests.length})` : ''}` : 'Avanti'}
          {!isLast && <ChevronRight size={18} />}
        </motion.button>

        {/* Skip interests */}
        {isInterests && (
          <button onClick={() => setStep(s => s + 1)} style={{ width: '100%', marginTop: 10, padding: '8px', border: 'none', background: 'transparent', color: 'var(--text-3)', cursor: 'pointer', fontSize: 13 }}>
            Salta per ora
          </button>
        )}
      </div>
    </div>
  )
}
