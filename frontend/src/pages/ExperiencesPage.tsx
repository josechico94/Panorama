import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, MapPin, ChevronRight, Sparkles } from 'lucide-react'
import { experiencesApi } from '@/lib/api'

// ── Categorie con gradiente Disney-style ──
const CATEGORIES = [
  { id: '',          label: 'Tutte',     emoji: '\u2728', gradient: 'linear-gradient(135deg,#BB00FF,#9000CC)',  glow: 'rgba(187,0,255,0.4)'  },
  { id: 'romantica', label: 'Romantica', emoji: '\uD83D\uDD6F\uFE0F', gradient: 'linear-gradient(135deg,#FF4D6D,#C9184A)',  glow: 'rgba(255,77,109,0.4)' },
  { id: 'colazione', label: 'Colazione', emoji: '\u2615',  gradient: 'linear-gradient(135deg,#F4A261,#E76F51)',  glow: 'rgba(244,162,97,0.4)' },
  { id: 'pasta',     label: 'Pasta',     emoji: '\uD83C\uDF5D', gradient: 'linear-gradient(135deg,#E9C46A,#F4A261)',  glow: 'rgba(233,196,106,0.4)'},
  { id: 'aperitivo', label: 'Aperitivo', emoji: '\uD83C\uDF79', gradient: 'linear-gradient(135deg,#48CAE4,#0096C7)',  glow: 'rgba(72,202,228,0.4)' },
  { id: 'budget',    label: 'Budget',    emoji: '\uD83D\uDCB6', gradient: 'linear-gradient(135deg,#52B788,#2D6A4F)',  glow: 'rgba(82,183,136,0.4)' },
  { id: 'serata',    label: 'Serata',    emoji: '\uD83C\uDF19', gradient: 'linear-gradient(135deg,#5E60CE,#3A0CA3)',  glow: 'rgba(94,96,206,0.4)'  },
]

// ── Budget con colore progressivo ──
const BUDGETS = [
  { label: 'Tutti',  value: '',   color: '#BB00FF', bg: 'rgba(187,0,255,0.12)'  },
  { label: '< 15',   value: '15', color: '#52B788', bg: 'rgba(82,183,136,0.12)' },
  { label: '< 30',   value: '30', color: '#E9C46A', bg: 'rgba(233,196,106,0.12)'},
  { label: '< 50',   value: '50', color: '#F4A261', bg: 'rgba(244,162,97,0.12)' },
  { label: '< 80',   value: '80', color: '#FF4D6D', bg: 'rgba(255,77,109,0.12)' },
]

export default function ExperiencesPage() {
  const [activeCategory, setActiveCategory] = useState('')
  const [activeBudget, setActiveBudget]     = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['experiences', activeCategory, activeBudget],
    queryFn: () => {
      const params: any = {}
      if (activeCategory) params.category = activeCategory
      if (activeBudget)   params.budget   = activeBudget
      return experiencesApi.list(params)
    },
  })

  const experiences = data?.data ?? []
  const activeCat   = CATEGORIES.find(c => c.id === activeCategory) ?? CATEGORIES[0]

  return (
    <div className="max-w-2xl mx-auto">

      {/* ── Hero ── */}
      <div style={{ padding: '24px 16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span className="accent-line" />
          <span style={{ fontFamily: 'DM Mono', fontSize: 9, color: 'var(--meta-color)', letterSpacing: '0.28em', textTransform: 'uppercase' }}>Bologna</span>
        </div>
        <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(32px,8vw,48px)', fontWeight: 700, color: 'var(--text)', lineHeight: 0.95, fontStyle: 'italic', marginBottom: 10 }}>
          Esperienze<br />
          <em style={{ color: 'var(--accent)', fontWeight: 300 }}>da vivere</em>
        </h1>
        <p style={{ color: 'var(--text-3)', fontSize: 13, fontStyle: 'italic', fontFamily: 'Cormorant Garamond,serif' }}>
          Itinerari curati per scoprire il meglio di Bologna
        </p>
      </div>

      {/* ── Categorie Spotify+Disney style ── */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }} className="no-scrollbar">
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id
            return (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.93 }}
                whileHover={{ scale: 1.04 }}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  flexShrink: 0,
                  width: 82,
                  height: 82,
                  borderRadius: 16,
                  border: 'none',
                  cursor: 'pointer',
                  background: isActive ? cat.gradient : 'var(--surface)',
                  boxShadow: isActive ? `0 6px 24px ${cat.glow}` : 'none',
                  outline: isActive ? 'none' : '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 7,
                  transition: 'all 0.2s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Glow interno quando attivo */}
                {isActive && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.2), transparent 65%)',
                    pointerEvents: 'none',
                  }} />
                )}
                <span style={{ fontSize: 26, lineHeight: 1 }}>{cat.emoji}</span>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  color: isActive ? '#fff' : 'var(--text-2)',
                  fontFamily: 'DM Sans',
                  letterSpacing: '-0.01em',
                  maxWidth: 72, textAlign: 'center',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {cat.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* ── Budget filter — pillole colorate ── */}
      <div style={{ padding: '0 16px 20px' }}>
        {/* Label */}
        <p style={{ fontFamily: 'DM Mono', fontSize: 9, color: 'var(--meta-color)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 10 }}>
          Budget
        </p>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }} className="no-scrollbar">
          {BUDGETS.map(b => {
            const isActive = activeBudget === b.value
            return (
              <motion.button
                key={b.value}
                whileTap={{ scale: 0.92 }}
                onClick={() => setActiveBudget(b.value)}
                style={{
                  flexShrink: 0,
                  padding: '7px 14px',
                  borderRadius: 100,
                  border: `1.5px solid ${isActive ? b.color : 'var(--border)'}`,
                  background: isActive ? b.bg : 'var(--surface)',
                  color: isActive ? b.color : 'var(--text-2)',
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: 'DM Sans',
                  cursor: 'pointer',
                  transition: 'all 0.18s',
                  boxShadow: isActive ? `0 0 12px ${b.bg}` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  whiteSpace: 'nowrap',
                }}
              >
                {/* Dot colorato */}
                <span style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: isActive ? b.color : 'var(--border)',
                  display: 'inline-block',
                  flexShrink: 0,
                  transition: 'background 0.18s',
                }} />
                {b.value ? `€${b.label}` : b.label}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* ── Divider con categoria attiva ── */}
      <div style={{ padding: '0 16px 14px' }}>
        <p style={{ fontFamily: 'DM Mono', fontSize: 9, color: 'var(--meta-color)', letterSpacing: '0.22em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,transparent,rgba(187,0,255,0.2))' }} />
          {isLoading ? 'Caricamento...' : `${experiences.length} esperienze`}
          <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,rgba(187,0,255,0.2),transparent)' }} />
        </p>
      </div>

      {/* ── Results ── */}
      <div style={{ padding: '0 16px 32px' }}>
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[1,2,3].map(i => <div key={i} className="skeleton rounded-2xl" style={{ height: 192 }} />)}
          </div>
        ) : experiences.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 20px' }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>🔍</p>
            <p style={{ color: 'var(--text)', fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Nessuna esperienza trovata</p>
            <p style={{ color: 'var(--meta-color)', fontSize: 13 }}>Prova a cambiare categoria o budget</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {experiences.map((exp: any, i: number) => (
              <ExperienceCard key={exp._id} exp={exp} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ExperienceCard({ exp, index }: { exp: any; index: number }) {
  const stops = exp.stops ?? []
  const hours = Math.floor(exp.duration / 60)
  const mins  = exp.duration % 60

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
    >
      <Link to={`/esperienze/${exp.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
            overflow: 'hidden',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(187,0,255,0.35)'
            e.currentTarget.style.boxShadow = '0 4px 24px rgba(187,0,255,0.12)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          {/* Cover */}
          <div style={{ position: 'relative', aspectRatio: '16/7', overflow: 'hidden', background: '#111' }}>
            {exp.coverImage ? (
              <img src={exp.coverImage} alt={exp.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>
                {exp.emoji}
              </div>
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,7,15,0.85) 0%, transparent 60%)' }} />

            {exp.featured && (
              <div style={{ position: 'absolute', top: 12, left: 12 }}>
                <span style={{ background: 'linear-gradient(135deg,#BB00FF,#9000CC)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  <Sparkles size={9} /> In evidenza
                </span>
              </div>
            )}

            <div style={{ position: 'absolute', top: 12, right: 12 }}>
              <span style={{ background: 'rgba(7,7,15,0.75)', backdropFilter: 'blur(8px)', color: '#f0ede8', fontSize: 12, fontWeight: 800, padding: '4px 10px', borderRadius: 10, fontFamily: 'DM Mono,monospace', border: '1px solid rgba(255,255,255,0.1)' }}>
                ~€{exp.estimatedCost}
              </span>
            </div>

            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 16px 12px' }}>
              <h2 style={{ color: 'var(--text)', fontSize: 22, fontWeight: 700, fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', lineHeight: 1.1, marginBottom: 4, textShadow: '0 1px 4px rgba(255, 255, 255, 0.5)' }}>
                {exp.emoji} {exp.title}
              </h2>
              <p style={{ color: 'var(--text-2)', fontSize: 12 }}>{exp.tagline}</p>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-3)' }}>
                <Clock size={11} color="#BB00FF" />
                {hours > 0 ? `${hours}h` : ''}{mins > 0 ? ` ${mins}min` : ''}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-3)' }}>
                <MapPin size={11} color="#BB00FF" />
                {stops.length} {stops.length === 1 ? 'tappa' : 'tappe'}
              </span>
              {exp.tags?.slice(0,3).map((tag: string) => (
                <span key={tag} style={{ fontSize: 9, color: 'var(--text-3)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: 100 }}>#{tag}</span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {stops.slice(0,3).map((stop: any, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {i > 0 && <ChevronRight size={12} style={{ color: 'rgba(240,237,232,0.2)', flexShrink: 0 }} />}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: 'rgba(255,255,255,0.05)' }}>
                      {stop.placeId?.media?.coverImage
                        ? <img src={stop.placeId.media.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>📍</div>
                      }
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 80 }}>
                      {stop.placeId?.name}
                    </span>
                  </div>
                </div>
              ))}
              {stops.length > 3 && (
                <span style={{ fontSize: 11, color: 'var(--text-3)', marginLeft: 4 }}>+{stops.length - 3} altri</span>
              )}
              <ChevronRight size={14} style={{ marginLeft: 'auto', color: '#BB00FF', flexShrink: 0 }} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
