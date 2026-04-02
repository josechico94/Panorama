import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Euro, MapPin, ChevronRight, Sparkles } from 'lucide-react'
import { experiencesApi } from '@/lib/api'

const CATEGORIES = [
  { id: '', label: 'Tutte', emoji: '✨' },
  { id: 'romantica', label: 'Romantica', emoji: '🕯️' },
  { id: 'colazione', label: 'Colazione', emoji: '☕' },
  { id: 'pasta', label: 'Pasta', emoji: '🍝' },
  { id: 'aperitivo', label: 'Aperitivo', emoji: '🍹' },
  { id: 'budget', label: 'Budget', emoji: '💶' },
  { id: 'serata', label: 'Serata', emoji: '🌙' },
]

const BUDGETS = [
  { label: 'Tutti', value: '' },
  { label: '< €15', value: '15' },
  { label: '< €30', value: '30' },
  { label: '< €50', value: '50' },
  { label: '< €80', value: '80' },
]

export default function ExperiencesPage() {
  const [activeCategory, setActiveCategory] = useState('')
  const [activeBudget, setActiveBudget] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['experiences', activeCategory, activeBudget],
    queryFn: () => {
      const params: any = {}
      if (activeCategory) params.category = activeCategory
      if (activeBudget) params.budget = activeBudget
      return experiencesApi.list(params)
    },
  })

  const experiences = data?.data ?? []

  return (
    <div className="max-w-2xl mx-auto">
      {/* Hero */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="accent-line" />
          <span className="font-mono-dm text-[var(--text-3)] text-[9px] tracking-[0.28em] uppercase">Bologna</span>
        </div>
        <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(32px,8vw,48px)', fontWeight: 700, color: 'var(--text)', lineHeight: 0.95, fontStyle: 'italic' }}>
          Esperienze<br />
          <em style={{ color: 'var(--accent)', fontWeight: 300 }}>da vivere</em>
        </h1>
        <p className="text-[var(--text-3)] text-sm mt-3">Itinerari curati per scoprire il meglio di Bologna</p>
      </div>

      {/* Category filters */}
      <div className="px-4 mb-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
              flexShrink: 0, padding: '6px 14px', borderRadius: 100, border: 'none', cursor: 'pointer',
              background: activeCategory === cat.id ? 'var(--accent)' : 'rgba(255,255,255,0.06)',
              color: activeCategory === cat.id ? '#fff' : 'rgba(240,237,232,0.6)',
              fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.2s',
            }}>
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Budget filters */}
      <div className="px-4 mb-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {BUDGETS.map(b => (
            <button key={b.value} onClick={() => setActiveBudget(b.value)} style={{
              flexShrink: 0, padding: '5px 12px', borderRadius: 100, fontSize: 11, fontWeight: 600, cursor: 'pointer',
              border: `1px solid ${activeBudget === b.value ? 'var(--accent)' : 'rgba(255,255,255,0.1)'}`,
              background: activeBudget === b.value ? 'rgba(232,98,42,0.15)' : 'transparent',
              color: activeBudget === b.value ? 'var(--accent)' : 'rgba(240,237,232,0.45)',
              transition: 'all 0.15s',
            }}>
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="px-4 pb-8">
        {isLoading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="skeleton rounded-2xl h-48" />)}
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-[var(--text-2)] text-sm">Nessuna esperienza trovata</p>
          </div>
        ) : (
          <div className="space-y-4">
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
  const mins = exp.duration % 60

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
    >
      <Link to={`/esperienze/${exp.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20, overflow: 'hidden', transition: 'border-color 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(232,98,42,0.35)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
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

            {/* Featured badge */}
            {exp.featured && (
              <div style={{ position: 'absolute', top: 12, left: 12 }}>
                <span style={{ background: 'rgba(232,98,42,0.9)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  <Sparkles size={9} /> In evidenza
                </span>
              </div>
            )}

            {/* Cost badge */}
            <div style={{ position: 'absolute', top: 12, right: 12 }}>
              <span style={{ background: 'rgba(7,7,15,0.8)', backdropFilter: 'blur(8px)', color: '#f0ede8', fontSize: 12, fontWeight: 800, padding: '4px 10px', borderRadius: 10, fontFamily: 'DM Mono,monospace', border: '1px solid rgba(255,255,255,0.1)' }}>
                ~€{exp.estimatedCost}
              </span>
            </div>

            {/* Title on image */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 16px 12px' }}>
              <h2 style={{ color: '#f0ede8', fontSize: 22, fontWeight: 700, fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', lineHeight: 1.1, marginBottom: 4 }}>
                {exp.emoji} {exp.title}
              </h2>
              <p style={{ color: 'rgba(240,237,232,0.6)', fontSize: 12 }}>{exp.tagline}</p>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '14px 16px' }}>
            {/* Meta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'rgba(240,237,232,0.45)' }}>
                <Clock size={11} color="var(--accent)" />
                {hours > 0 ? `${hours}h` : ''}{mins > 0 ? ` ${mins}min` : ''}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'rgba(240,237,232,0.45)' }}>
                <MapPin size={11} color="var(--accent)" />
                {stops.length} {stops.length === 1 ? 'tappa' : 'tappe'}
              </span>
              {exp.tags?.slice(0,3).map((tag: string) => (
                <span key={tag} style={{ fontSize: 9, color: 'rgba(240,237,232,0.3)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: 100 }}>#{tag}</span>
              ))}
            </div>

            {/* Stops preview */}
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
                    <span style={{ fontSize: 11, color: 'rgba(240,237,232,0.55)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 80 }}>
                      {stop.placeId?.name}
                    </span>
                  </div>
                </div>
              ))}
              {stops.length > 3 && (
                <span style={{ fontSize: 11, color: 'rgba(240,237,232,0.3)', marginLeft: 4 }}>+{stops.length - 3} altri</span>
              )}
              <ChevronRight size={14} style={{ marginLeft: 'auto', color: 'var(--accent)', flexShrink: 0 }} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
