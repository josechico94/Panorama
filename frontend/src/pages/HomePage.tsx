import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Tag, Sparkles, Clock, Moon, Coffee, Sunset } from 'lucide-react'
import { Link } from 'react-router-dom'
import { placesApi, couponsApi, experiencesApi } from '@/lib/api'
import { useAppStore } from '@/store'
import CategoryFilter from '@/components/places/CategoryFilter'
import PlaceCard from '@/components/places/PlaceCard'
import PlaceCardSkeleton from '@/components/ui/PlaceCardSkeleton'
import type { Place } from '@/types'

export default function HomePage() {
  const { activeCategory, city, searchQuery } = useAppStore()
  const isFiltering = !!activeCategory || !!searchQuery

  const { data, isLoading } = useQuery({
    queryKey: ['places', city, activeCategory, searchQuery],
    queryFn: () => {
      const params: Record<string, string> = { city, limit: '20' }
      if (activeCategory) params.category = activeCategory
      if (searchQuery) params.search = searchQuery
      return placesApi.list(params)
    },
  })

  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ['places-featured', city],
    queryFn: () => placesApi.featured(),
    enabled: !activeCategory && !searchQuery,
  })

  const { data: offersData } = useQuery({
    queryKey: ['home-offers'],
    queryFn: () => couponsApi.active(),
  })

  const { data: expData } = useQuery({
    queryKey: ['home-experiences'],
    queryFn: () => experiencesApi.list({ featured: 'true' }),
  })

  const places: Place[] = data?.data ?? []
  const featured: Place[] = featuredData?.data ?? []

  return (
    <div className="max-w-2xl mx-auto">
      {/* ── Hero Header ── */}
      <div className="px-4 pt-6 pb-5">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="accent-line" />
            <span className="font-mono-dm text-[9px] tracking-[0.28em] uppercase" style={{ color: 'var(--text-3)' }}>
              Bologna — Italia
            </span>
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(36px,10vw,52px)', fontWeight: 700, color: 'var(--text)', lineHeight: 0.95, marginBottom: 8 }}>
            Cosa fare a<br />
            <em style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 300 }}>Bolo?</em>
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: 13, fontStyle: 'italic', fontFamily: 'Cormorant Garamond,serif' }}>
            Nella città fatta di archi, faf è la tua porta d'ingresso.
          </p>
        </motion.div>
      </div>

      {/* ── Category Filter ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }} className="px-4 mb-6">
        <CategoryFilter />
      </motion.div>

      {/* ── Featured ── */}
      {!isFiltering && (
        <section className="px-4 mb-8">
          <div className="divider-label mb-4">In evidenza</div>
          {featuredLoading ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><div className="skeleton rounded-[22px]" style={{ aspectRatio: '16/9' }} /></div>
              <PlaceCardSkeleton variant="hero" /><PlaceCardSkeleton variant="hero" />
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {featured[0] && (
                <motion.div className="col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Link to={'/place/' + featured[0].slug} className="block group relative rounded-[22px] overflow-hidden place-card" style={{ aspectRatio: '16/9' }}>
                    <img src={featured[0].media.coverImage || 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=900&q=80'} alt={featured[0].name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 hero-overlay" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 4 }}>{featured[0].location.neighborhood}</p>
                      <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 28, fontStyle: 'italic', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>{featured[0].name}</h2>
                    </div>
                    {featured[0].isOpenNow && (
                      <div className="absolute top-4 right-4">
                        <span className="cat-pill" style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', borderColor: 'rgba(34,197,94,0.3)' }}>
                          <span className="open-dot" /> Aperto
                        </span>
                      </div>
                    )}
                  </Link>
                </motion.div>
              )}
              {featured.slice(1, 3).map((place, i) => <PlaceCard key={place._id} place={place} index={i + 1} variant="hero" />)}
            </div>
          ) : null}
        </section>
      )}

      {/* ── Open Now ── */}
      {!isFiltering && <OpenNowStrip city={city} />}

      {/* ── Cosa fare stasera ── */}
      {!isFiltering && <CosaFareStasera city={city} />}

      {/* ── Offerte attive ── */}
      {!isFiltering && offersData?.data?.length > 0 && (
        <section className="mb-8 px-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Tag size={13} style={{ color: 'var(--accent)' }} />
              <span className="font-mono-dm text-[9px] tracking-[0.25em] uppercase" style={{ color: 'var(--text-3)' }}>Offerte attive</span>
            </div>
            <Link to="/offerte" style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              Vedi tutte <ArrowRight size={11} />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {offersData.data.slice(0, 6).map((c: any) => {
              const days = Math.ceil((new Date(c.validUntil).getTime() - Date.now()) / (1000*60*60*24))
              return (
                <Link key={c._id} to={'/coupon/' + c._id} style={{ textDecoration: 'none', flexShrink: 0 }}>
                  <div style={{ width: 158, background: 'var(--bg2)', border: '1px solid rgba(187,0,255,0.2)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
                    <div style={{ height: 90, overflow: 'hidden', position: 'relative' }}>
                      <img src={c.placeId?.media?.coverImage || 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=300&q=70'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,7,15,0.7) 0%, transparent 60%)' }} />
                      <span style={{ position: 'absolute', top: 7, right: 7, background: 'linear-gradient(135deg,#BB00FF,#9000CC)', color: '#fff', fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 7, fontFamily: 'DM Mono', boxShadow: '0 2px 8px rgba(187,0,255,0.5)' }}>
                        {c.discountType === 'percentage' ? '-' + c.discountValue + '%' : c.discountType === 'fixed' ? '-€' + c.discountValue : 'OMAGGIO'}
                      </span>
                    </div>
                    <div style={{ padding: '9px 11px' }}>
                      <p style={{ color: 'var(--text-3)', fontSize: 9, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>{c.placeId?.name}</p>
                      <p style={{ color: '#BB00FF', fontSize: 12, fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 3 }}>{c.title}</p>
                      <p style={{ color: days <= 2 ? '#ef4444' : 'var(--text-3)', fontSize: 9, marginTop: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                        {days === 0 ? '⚡ Scade oggi!' : days === 1 ? '⚡ Scade domani' : ('📅 ' + days + 'g rimasti')}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Esperienze in evidenza ── */}
      {!isFiltering && expData?.data?.length > 0 && (
        <section className="mb-8 px-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={13} style={{ color: 'var(--accent)' }} />
              <span className="font-mono-dm text-[9px] tracking-[0.25em] uppercase" style={{ color: 'var(--text-3)' }}>Esperienze</span>
            </div>
            <Link to="/esperienze" style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              Scopri <ArrowRight size={11} />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {expData.data.slice(0, 4).map((exp: any) => (
              <Link key={exp._id} to={'/esperienze/' + exp.slug} style={{ textDecoration: 'none', flexShrink: 0, width: 200 }}>
                <div style={{ background: '#0D0D1A', border: '1px solid rgba(187,0,255,0.18)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.4)', position: 'relative' }}>
                  <div style={{ height: 110, position: 'relative', background: '#07070F' }}>
                    {exp.coverImage ? <img src={exp.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>{exp.emoji}</div>}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,7,15,0.92) 0%, rgba(7,7,15,0.3) 60%, transparent 100%)' }} />
                    <span style={{ position: 'absolute', top: 8, right: 8, background: 'linear-gradient(135deg,#BB00FF,#9000CC)', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 7px', borderRadius: 6, fontFamily: 'DM Mono', boxShadow: '0 2px 8px rgba(187,0,255,0.4)' }}>~€{exp.estimatedCost}</span>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 10px' }}>
                      <p style={{ color: '#fff', fontSize: 12, fontWeight: 700, fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>{exp.emoji} {exp.title}</p>
                      <p style={{ color: 'rgba(240,237,232,0.6)', fontSize: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>{exp.tagline}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Results ── */}
      <section className="px-4 pb-8">
        {isFiltering ? (
          <>
            <div className="divider-label mb-4">{places.length} risultati</div>
            {isLoading ? (
              <div className="grid grid-cols-2 gap-3">{Array.from({ length: 4 }).map((_, i) => <PlaceCardSkeleton key={i} />)}</div>
            ) : places.length === 0 ? (
              <div className="text-center py-14">
                <p className="text-4xl mb-3">🔍</p>
                <p style={{ color: 'var(--text-2)', fontWeight: 500, fontSize: 14 }}>Nessun posto trovato</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">{places.map((place, i) => <PlaceCard key={place._id} place={place} index={i} />)}</div>
            )}
          </>
        ) : (
          <Link to="/esplora" style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 20px', borderRadius: 18,
              background: 'linear-gradient(135deg, rgba(187,0,255,0.1), rgba(144,0,204,0.05))',
              border: '1px solid rgba(187,0,255,0.2)',
            }}>
              <div>
                <p style={{ color: 'var(--text)', fontWeight: 700, fontSize: 15, marginBottom: 3 }}>
                  Scopri tutti i posti
                </p>
                <p style={{ color: 'var(--text-3)', fontSize: 12 }}>
                  Mappa, filtri per categoria e quartiere
                </p>
              </div>
              <div style={{
                width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                background: 'linear-gradient(135deg,#BB00FF,#9000CC)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ArrowRight size={16} color="#fff" />
              </div>
            </div>
          </Link>
        )}
      </section>
    </div>
  )
}

function CosaFareStasera({ city }: { city: string }) {
  const hour = new Date().getHours()

  // Determina il momento della giornata
  const moment = hour < 11 ? 'mattina' : hour < 14 ? 'pranzo' : hour < 18 ? 'pomeriggio' : hour < 22 ? 'sera' : 'notte'

  const config = {
    mattina:    { emoji: '☕', label: 'Colazione & Brunch',  category: 'colazione', color: '#F4A261', bg: 'rgba(244,162,97,0.1)',  border: 'rgba(244,162,97,0.25)',  msg: 'Inizia bene la giornata' },
    pranzo:     { emoji: '🍝', label: 'Pranzo a Bologna',    category: 'ristorante', color: '#E9C46A', bg: 'rgba(233,196,106,0.1)', border: 'rgba(233,196,106,0.25)', msg: 'Dove mangiare oggi' },
    pomeriggio: { emoji: '🏛️', label: 'Cultura & Shopping',  category: 'cultura',   color: '#48CAE4', bg: 'rgba(72,202,228,0.1)',  border: 'rgba(72,202,228,0.25)',  msg: 'Cosa fare nel pomeriggio' },
    sera:       { emoji: '🍹', label: 'Aperitivo & Cena',    category: 'bar',       color: '#BB00FF', bg: 'rgba(187,0,255,0.1)',   border: 'rgba(187,0,255,0.25)',   msg: 'La serata bolognese' },
    notte:      { emoji: '🌙', label: 'Vita Notturna',       category: 'nightlife', color: '#5E60CE', bg: 'rgba(94,96,206,0.1)',   border: 'rgba(94,96,206,0.25)',   msg: 'Bologna di notte' },
  }[moment]

  const { data, isLoading } = useQuery({
    queryKey: ['stasera', city, moment],
    queryFn: () => placesApi.list({ city, limit: '6', open_now: 'true' }),
    staleTime: 5 * 60 * 1000,
  })

  const places: Place[] = data?.data ?? []
  if (!isLoading && places.length === 0) return null

  return (
    <section className="mb-8">
      <div className="px-4 mb-3">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, flexShrink: 0,
              background: config.bg, border: `1px solid ${config.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            }}>
              {config.emoji}
            </div>
            <div>
              <p style={{ fontFamily: 'DM Mono', fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                {config.msg}
              </p>
              <p style={{ color: 'var(--text)', fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}>
                {config.label}
              </p>
            </div>
          </div>
          <div style={{
            fontSize: 10, fontWeight: 700, fontFamily: 'DM Mono',
            color: config.color, background: config.bg,
            border: `1px solid ${config.border}`,
            padding: '3px 8px', borderRadius: 8,
          }}>
            {new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar px-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton rounded-2xl shrink-0" style={{ width: 140, height: 180 }} />
          ))
        ) : (
          places.map((place: any, i: number) => (
            <motion.div
              key={place._id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="shrink-0"
              style={{ width: 140 }}
            >
              <Link to={'/place/' + place.slug} className="block group relative rounded-2xl overflow-hidden place-card" style={{ height: 180 }}>
                <img
                  src={place.media?.coverImage || 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&q=80'}
                  alt={place.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 card-overlay" />
                {/* Aperto ora badge */}
                <div style={{ position: 'absolute', top: 8, left: 8 }}>
                  <span style={{
                    fontSize: 8, fontWeight: 700, color: '#4ade80',
                    background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)',
                    padding: '2px 6px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 3,
                  }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                    Aperto
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p style={{ fontFamily: 'Cormorant Garamond,serif', color: '#fff', fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>
                    {place.name}
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, marginTop: 2 }}>
                    {place.location?.neighborhood}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </section>
  )
}

function OpenNowStrip({ city }: { city: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['open-now', city],
    queryFn: () => placesApi.list({ city, open_now: 'true', limit: '8' }),
  })
  const places: Place[] = data?.data ?? []
  if (!isLoading && places.length === 0) return null
  return (
    <section className="mb-8">
      <div className="px-4 mb-3 flex items-center gap-2">
        <span className="open-dot" />
        <span className="font-mono-dm text-[9px] tracking-[0.25em] uppercase" style={{ color: 'var(--text-3)' }}>Aperto adesso</span>
        <Zap size={10} style={{ color: 'var(--gold)' }} />
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-4">
        {isLoading ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton rounded-2xl shrink-0" style={{ width: 140, height: 180 }} />) :
          places.map((place, i) => (
            <motion.div key={place._id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="shrink-0" style={{ width: 140 }}>
              <Link to={'/place/' + place.slug} className="block group relative rounded-2xl overflow-hidden place-card" style={{ height: 180 }}>
                <img src={place.media.coverImage || 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&q=80'} alt={place.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 card-overlay" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p style={{ fontFamily: 'Cormorant Garamond,serif', color: '#fff', fontSize: 13, fontWeight: 600 }}>{place.name}</p>
                </div>
              </Link>
            </motion.div>
          ))
        }
      </div>
    </section>
  )
}
