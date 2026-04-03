import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, X } from 'lucide-react'

const STEPS = [
  {
    emoji: '🗺️',
    title: 'Scopri Bologna',
    subtitle: 'La città fatta di archi',
    description: 'Localizza velocemente il tuo prossimo locale preferito. Bologna ha oltre 200 posti da scoprire — ristoranti storici, bar alla moda, negozi unici e luoghi culturali nascosti. Usa i filtri per categoria, cerca per nome o attiva "Vicino a me" per trovare subito cosa c\'è a portata di mano. Ogni posto ha foto, orari, contatti e le offerte attive del momento.',
    color: '#BB00FF',
    bg: 'linear-gradient(160deg, #1A0033 0%, #07070F 100%)',
    visual: (
      <div style={{ position: 'relative', width: 220, height: 220, margin: '0 auto' }}>
        {/* Map-like visual */}
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(187,0,255,0.08)', border: '1px solid rgba(187,0,255,0.2)' }} />
        <div style={{ position: 'absolute', inset: 24, borderRadius: '50%', background: 'rgba(187,0,255,0.06)', border: '1px solid rgba(187,0,255,0.15)' }} />
        <div style={{ position: 'absolute', inset: 48, borderRadius: '50%', background: 'rgba(187,0,255,0.08)', border: '1px solid rgba(187,0,255,0.2)' }} />
        {/* Center pin */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-60%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', background: 'linear-gradient(135deg,#BB00FF,#9000CC)', boxShadow: '0 8px 32px rgba(187,0,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ transform: 'rotate(45deg)', fontSize: 18 }}>🗺️</span>
          </div>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(187,0,255,0.4)', marginTop: 2 }} />
        </div>
        {/* Floating place dots */}
        {[
          { top: '20%', left: '15%', emoji: '🍕', delay: 0 },
          { top: '25%', right: '12%', emoji: '🍸', delay: 0.2 },
          { bottom: '22%', left: '20%', emoji: '🏛️', delay: 0.4 },
          { bottom: '18%', right: '18%', emoji: '🛍️', delay: 0.6 },
        ].map((dot, i) => (
          <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + dot.delay, type: 'spring' }}
            style={{ position: 'absolute', ...dot, width: 32, height: 32, borderRadius: 10, background: 'var(--bg2)', border: '1px solid rgba(187,0,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
            {dot.emoji}
          </motion.div>
        ))}
      </div>
    ),
  },
  {
    emoji: '🎫',
    title: 'Coupon Esclusivi',
    subtitle: 'Risparmia ogni volta',
    description: 'Approfitta dei tuoi sconti nel locale più vicino. Ogni giorno i partner faf pubblicano offerte esclusive — dal 10% su una cena al cocktail in omaggio. Scarica il coupon gratis, ricevi il tuo QR code personale e mostralo al locale per riscattare lo sconto immediatamente. Zero commissioni, zero complicazioni, solo vantaggi reali.',
    color: '#4ade80',
    bg: 'linear-gradient(160deg, #001A0D 0%, #07070F 100%)',
    visual: (
      <div style={{ position: 'relative', width: 220, height: 220, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Coupon card */}
        <motion.div initial={{ rotateY: -15, scale: 0.9 }} animate={{ rotateY: 0, scale: 1 }} transition={{ duration: 0.6 }}
          style={{ width: 180, background: 'var(--bg2)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 16px 48px rgba(0,0,0,0.4)' }}>
          <div style={{ height: 80, background: 'linear-gradient(135deg,#001A0D,#003320)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <span style={{ fontSize: 36 }}>🍸</span>
            <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(74,222,128,0.2)', border: '1px solid rgba(74,222,128,0.4)', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 800, color: '#4ade80', fontFamily: 'DM Mono' }}>-50%</div>
          </div>
          <div style={{ padding: '12px 14px' }}>
            <p style={{ color: 'var(--text-3)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 4 }}>Enoteca Italiana</p>
            <p style={{ color: 'var(--text)', fontSize: 13, fontWeight: 700 }}>Sangria in omaggio</p>
            {/* Mini QR */}
            <div style={{ display: 'flex', gap: 2, marginTop: 10, justifyContent: 'center' }}>
              {Array.from({ length: 6 }).map((_, r) => (
                <div key={r} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {Array.from({ length: 6 }).map((_, c) => (
                    <div key={c} style={{ width: 4, height: 4, borderRadius: 1, background: Math.random() > 0.4 ? 'var(--text)' : 'transparent' }} />
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
    emoji: '✨',
    title: 'Esperienze Uniche',
    subtitle: 'Bologna come non l\'hai mai vista',
    description: 'Goditi le esperienze che Bologna ha da offrirti. Dal tramonto sul Portico di San Luca all\'aperitivo nel Quadrilatero, dalla passeggiata tra i portici al mercato dell\'Albani — ogni esperienza faf è un itinerario curato con tappe, tempi e costi stimati. Perfetto per chi visita Bologna per la prima volta o per chi vuole riscoprirla con occhi completamente nuovi.',
    color: '#f59e0b',
    bg: 'linear-gradient(160deg, #1A1000 0%, #07070F 100%)',
    visual: (
      <div style={{ position: 'relative', width: 220, height: 220, margin: '0 auto' }}>
        {/* Experience cards stacked */}
        {[
          { rotate: -8, top: 20, left: 10, emoji: '🏛️', label: 'Portici di San Luca', color: '#f59e0b' },
          { rotate: 4, top: 40, left: 30, emoji: '🍷', label: 'Aperitivo Bolognese', color: '#BB00FF' },
          { rotate: 0, top: 60, left: 20, emoji: '🚶', label: 'Tour Centro Storico', color: '#4ade80' },
        ].map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.15 }}
            style={{ position: 'absolute', width: 160, left: card.left, top: card.top, transform: `rotate(${card.rotate}deg)`, background: 'var(--bg2)', border: `1px solid ${card.color}30`, borderRadius: 16, padding: '10px 12px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: `${card.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{card.emoji}</div>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{card.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    ),
  },
  {
    emoji: '🚀',
    title: 'Sei pronto!',
    subtitle: 'Benvenuto su FafApp',
    description: 'Entra a far parte della community faf e vivi Bologna in modo completamente diverso. Registrati gratis con email o Google in 30 secondi — salva i tuoi posti preferiti, tieni traccia di tutti i coupon scaricati, scopri nuove esperienze ogni settimana e non perderti nessuna offerta esclusiva. faf è completamente gratuito, sempre.',
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
  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  const next = () => {
    if (isLast) { onDone(); return }
    setStep(s => s + 1)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9998, background: current.bg, display: 'flex', flexDirection: 'column', transition: 'background 0.5s ease' }}>

      {/* Skip */}
      <div style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onDone} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 20, border: 'none', background: 'rgba(255,255,255,0.08)', color: 'var(--text-3)', cursor: 'pointer', fontSize: 12 }}>
          Salta <X size={12} />
        </button>
      </div>

      {/* Visual */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: -20 }} transition={{ duration: 0.35 }}>
            {current.visual}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Text */}
      <div style={{ padding: '0 28px 40px' }}>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: current.color, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'DM Mono' }}>
              {current.subtitle}
            </p>
            <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 36, fontWeight: 700, color: 'var(--text)', lineHeight: 1.05, marginBottom: 14 }}>
              {current.title}
            </h2>
            <p style={{ color: 'var(--text-3)', fontSize: 15, lineHeight: 1.65 }}>
              {current.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', margin: '24px 0 20px' }}>
          {STEPS.map((_, i) => (
            <motion.div key={i} animate={{ width: i === step ? 24 : 6, background: i === step ? current.color : 'rgba(255,255,255,0.2)' }}
              style={{ height: 6, borderRadius: 3, cursor: 'pointer', transition: 'background 0.3s' }}
              onClick={() => setStep(i)} />
          ))}
        </div>

        {/* CTA */}
        <motion.button whileTap={{ scale: 0.97 }} onClick={next}
          style={{ width: '100%', padding: '15px', borderRadius: 16, border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: `linear-gradient(135deg, ${current.color}, ${current.color}CC)`, color: '#fff', boxShadow: `0 4px 20px ${current.color}50` }}>
          {isLast ? '🚀 Inizia a esplorare' : 'Avanti'} {!isLast && <ChevronRight size={18} />}
        </motion.button>
      </div>
    </div>
  )
}
