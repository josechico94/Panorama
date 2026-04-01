import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Clock, MapPin, Bookmark, BookmarkCheck, Share2, ExternalLink, Phone, Star, Send, Trash2 } from 'lucide-react'
import { experiencesApi, reviewsApi, placesApi } from '@/lib/api'
import { getCategoryConfig } from '@/types'
import { useAppStore, useUserStore } from '@/store'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=900&q=80'

function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v')
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1).split('?')[0]
    if (u.pathname.includes('/embed/')) return u.pathname.split('/embed/')[1]
  } catch {}
  return null
}

function getVimeoId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('vimeo.com')) return u.pathname.replace('/', '').split('/')[0]
  } catch {}
  return null
}

function VideoPlayer({ url }: { url: string }) {
  const [playing, setPlaying] = useState(false)
  const ytId = getYouTubeId(url)
  const vimeoId = getVimeoId(url)
  const embedUrl = ytId
    ? 'https://www.youtube.com/embed/' + ytId + '?autoplay=1&rel=0'
    : vimeoId
    ? 'https://player.vimeo.com/video/' + vimeoId + '?autoplay=1'
    : null
  const thumb = ytId ? 'https://img.youtube.com/vi/' + ytId + '/hqdefault.jpg' : null

  if (!embedUrl) return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 glass-light rounded-xl p-4">
      <span style={{ fontSize: 18 }}>▶️</span>
      <div><p className="text-[var(--text)] text-sm font-semibold">Guarda il video</p><p className="text-[var(--text-3)] text-xs">Apre in una nuova finestra</p></div>
    </a>
  )

  return (
    <div>
      <p className="divider-label mb-3">Video</p>
      {!playing ? (
        <button onClick={() => setPlaying(true)} style={{ width: '100%', position: 'relative', borderRadius: 16, overflow: 'hidden', aspectRatio: '16/9', border: 'none', cursor: 'pointer', background: '#000', display: 'block' }}>
          {thumb && <img src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(232,98,42,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 24px rgba(232,98,42,0.5)' }}>
              <span style={{ fontSize: 24, marginLeft: 4, color: '#fff' }}>▶</span>
            </div>
          </div>
        </button>
      ) : (
        <div style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '16/9' }}>
          <iframe src={embedUrl} width="100%" height="100%" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ display: 'block', border: 'none' }} />
        </div>
      )}
    </div>
  )
}

function StarsInput({ rating, onRate }: { rating: number; onRate: (r: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1,2,3,4,5].map(i => (
        <button key={i} onClick={() => onRate(i)} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 0 }}>
          <Star size={24} fill={(hover || rating) >= i ? '#f59e0b' : 'transparent'} color={(hover || rating) >= i ? '#f59e0b' : 'rgba(240,237,232,0.2)'} style={{ transition: 'all 0.1s' }} />
        </button>
      ))}
    </div>
  )
}

function StarsDisplay({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map(i => <Star key={i} size={11} fill={i <= rating ? '#f59e0b' : 'transparent'} color={i <= rating ? '#f59e0b' : 'rgba(240,237,232,0.2)'} />)}
    </div>
  )
}

export default function ExperienceDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { toggleSavedExperience, isSavedExperience } = useAppStore()
  const { isLoggedIn, user } = useUserStore()
  const qc = useQueryClient()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [showReviewForm, setShowReviewForm] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['experience', slug],
    queryFn: () => experiencesApi.get(slug!),
    enabled: !!slug,
  })

  const exp = data?.data
  const stops = exp?.stops ?? []
  const saved = exp ? isSavedExperience(exp._id) : false
  const hours = exp ? Math.floor(exp.duration / 60) : 0
  const mins = exp ? exp.duration % 60 : 0

  // Reviews
  const { data: reviewsData } = useQuery({
    queryKey: ['exp-reviews', exp?._id],
    queryFn: () => reviewsApi.forExperience(exp!._id),
    enabled: !!exp?._id,
  })

  // Nearby places — use coordinates of first stop
  const firstStop = stops[0]?.placeId
  const { data: nearbyData } = useQuery({
    queryKey: ['nearby-exp', exp?._id],
    queryFn: () => {
      const lat = firstStop?.location?.coordinates?.lat
      const lng = firstStop?.location?.coordinates?.lng
      if (!lat || !lng) return { data: [] }
      const excludeIds = stops.map((s: any) => s.placeId?._id).filter(Boolean).join(',')
      return placesApi.nearby(lat, lng, { radius: 800, limit: 6, exclude: excludeIds })
    },
    enabled: !!firstStop?.location?.coordinates,
  })

  const createReview = useMutation({
    mutationFn: () => reviewsApi.createForExp(exp!._id, { rating, comment }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['exp-reviews'] }); setRating(0); setComment(''); setShowReviewForm(false) },
  })

  const deleteReview = useMutation({
    mutationFn: (id: string) => reviewsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['exp-reviews'] }),
  })

  const handleShare = async () => {
    if (navigator.share && exp) await navigator.share({ title: exp.title, text: exp.tagline, url: window.location.href })
    else { navigator.clipboard.writeText(window.location.href); alert('Link copiato!') }
  }

  if (isLoading) return (
    <div className="max-w-2xl mx-auto px-4 pt-8 space-y-4">
      <div className="skeleton rounded-2xl h-56" />
      <div className="skeleton rounded-xl h-8 w-2/3" />
    </div>
  )

  if (!exp) return (
    <div className="text-center py-20">
      <p className="text-4xl mb-3">✨</p>
      <p className="text-[var(--text-2)] text-sm">Esperienza non trovata</p>
      <Link to="/esperienze" className="btn btn-accent mt-5 inline-flex">Torna alle esperienze</Link>
    </div>
  )

  const reviews = reviewsData?.data ?? []
  const stats = reviewsData?.stats
  const nearby = nearbyData?.data ?? []

  return (
    <div className="max-w-2xl mx-auto pb-10">
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/8' }}>
        <img src={exp.coverImage || PLACEHOLDER} alt={exp.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(7,7,15,0.3) 0%, rgba(7,7,15,0.85) 100%)' }} />

        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 w-9 h-9 rounded-xl glass flex items-center justify-center">
          <ArrowLeft size={16} className="text-white" />
        </button>

        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={handleShare} className="w-9 h-9 rounded-xl glass flex items-center justify-center">
            <Share2 size={14} className="text-white" />
          </button>
          <button onClick={() => toggleSavedExperience(exp._id)} className="w-9 h-9 rounded-xl glass flex items-center justify-center">
            {saved ? <BookmarkCheck size={14} style={{ color: 'var(--accent)' }} /> : <Bookmark size={14} className="text-white" />}
          </button>
        </div>

        <div className="absolute top-4" style={{ right: '50%', transform: 'translateX(50%)' }}>
          <span style={{ background: 'rgba(7,7,15,0.8)', backdropFilter: 'blur(8px)', color: '#f0ede8', fontSize: 14, fontWeight: 800, padding: '5px 12px', borderRadius: 12, fontFamily: 'DM Mono,monospace', border: '1px solid rgba(255,255,255,0.15)' }}>
            ~€{exp.estimatedCost}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5">
          {stats && stats.total > 0 && (
            <div className="flex items-center gap-2 mb-2">
              <StarsDisplay rating={Math.round(stats.avg)} />
              <span style={{ color: 'rgba(240,237,232,0.6)', fontSize: 11 }}>{stats.avg} ({stats.total})</span>
            </div>
          )}
          <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 'clamp(24px,6vw,34px)', fontWeight: 700, color: '#f0ede8', lineHeight: 1.1, marginBottom: 4 }}>
            {exp.emoji} {exp.title}
          </h1>
          <p style={{ color: 'rgba(240,237,232,0.65)', fontSize: 13 }}>{exp.tagline}</p>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-6">
        {/* Meta */}
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2 glass-light rounded-xl px-3 py-2">
            <Clock size={13} style={{ color: 'var(--accent)' }} />
            <span className="text-[var(--text-2)] text-xs font-semibold">{hours > 0 ? hours + 'h ' : ''}{mins > 0 ? mins + 'min' : ''}</span>
          </div>
          <div className="flex items-center gap-2 glass-light rounded-xl px-3 py-2">
            <MapPin size={13} style={{ color: 'var(--accent)' }} />
            <span className="text-[var(--text-2)] text-xs font-semibold">{stops.length} {stops.length === 1 ? 'tappa' : 'tappe'}</span>
          </div>
          {exp.tags?.map((tag: string) => <span key={tag} className="tag-chip">#{tag}</span>)}
        </div>

        {exp.description && <p className="text-[var(--text-2)] text-sm leading-relaxed">{exp.description}</p>}

        {/* Video */}
        {exp.videoUrl && <VideoPlayer url={exp.videoUrl} />}

        {/* Itinerary */}
        <div>
          <p className="divider-label mb-4">Itinerario</p>
          {stops.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 16 }}>
              <p style={{ color: 'rgba(240,237,232,0.3)', fontSize: 13 }}>Nessuna tappa ancora</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stops.sort((a: any, b: any) => a.order - b.order).map((stop: any, i: number) => {
                const place = stop.placeId
                if (!place) return null
                const cat = getCategoryConfig(place.category)
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', gap: 12, padding: '14px 16px' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>{i + 1}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                            <Link to={'/place/' + place.slug} style={{ textDecoration: 'none' }}>
                              <h3 style={{ color: '#f0ede8', fontSize: 15, fontWeight: 700, fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic' }}>{place.name}</h3>
                            </Link>
                            <span style={{ fontSize: 9, fontWeight: 700, color: cat.color, background: cat.color + '18', border: '1px solid ' + cat.color + '30', borderRadius: 100, padding: '1px 6px' }}>{cat.emoji} {cat.label}</span>
                          </div>
                          <p style={{ color: 'rgba(240,237,232,0.4)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <MapPin size={9} color="var(--accent)" /> {place.location?.neighborhood || place.location?.address}
                          </p>
                          {stop.duration > 0 && <p style={{ color: 'rgba(240,237,232,0.3)', fontSize: 10, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={9} /> ~{stop.duration} min</p>}
                        </div>
                        <div style={{ width: 56, height: 56, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
                          <img src={place.media?.coverImage || PLACEHOLDER} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      </div>
                      {stop.note && (
                        <div style={{ padding: '0 16px 12px 60px' }}>
                          <p style={{ fontSize: 12, color: 'rgba(240,237,232,0.55)', lineHeight: 1.5, background: 'rgba(232,98,42,0.06)', border: '1px solid rgba(232,98,42,0.15)', borderRadius: 10, padding: '8px 12px', fontStyle: 'italic' }}>
                            💡 {stop.note}
                          </p>
                        </div>
                      )}
                      <div style={{ padding: '0 16px 12px 60px', display: 'flex', gap: 12 }}>
                        <Link to={'/place/' + place.slug} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>
                          Vedi dettagli <ExternalLink size={10} />
                        </Link>
                        {place.contact?.phone && (
                          <a href={'tel:' + place.contact.phone} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'rgba(240,237,232,0.4)' }}>
                            <Phone size={10} /> Chiama
                          </a>
                        )}
                      </div>
                    </div>
                    {i < stops.length - 1 && (
                      <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
                        <div style={{ width: 2, height: 20, background: 'linear-gradient(to bottom, var(--accent), transparent)' }} />
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>

        {/* Start CTA */}
        {stops[0]?.placeId?.location?.coordinates && (
          <a href={'https://maps.google.com/?q=' + stops[0].placeId.location.coordinates.lat + ',' + stops[0].placeId.location.coordinates.lng}
            target="_blank" rel="noopener noreferrer" className="btn btn-accent w-full flex items-center justify-center gap-2">
            <MapPin size={15} /> Inizia da qui
          </a>
        )}

        {/* Nearby places */}
        {nearby.length > 0 && (
          <div>
            <p className="divider-label mb-3">Nella zona</p>
            <p style={{ color: 'rgba(240,237,232,0.4)', fontSize: 12, marginBottom: 12 }}>Altri posti interessanti vicino all'itinerario</p>
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {nearby.map((place: any) => {
                const cat = getCategoryConfig(place.category)
                return (
                  <Link key={place._id} to={'/place/' + place.slug} style={{ textDecoration: 'none', flexShrink: 0, width: 140 }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
                      <div style={{ height: 80, position: 'relative' }}>
                        <img src={place.media?.coverImage || PLACEHOLDER} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,7,15,0.7) 0%, transparent 60%)' }} />
                        <span style={{ position: 'absolute', bottom: 5, left: 6, fontSize: 9, fontWeight: 700, color: cat.color, background: cat.color + '25', padding: '1px 5px', borderRadius: 4 }}>{cat.emoji}</span>
                        {place.distance && <span style={{ position: 'absolute', top: 5, right: 5, fontSize: 8, color: 'rgba(240,237,232,0.7)', background: 'rgba(0,0,0,0.5)', padding: '1px 5px', borderRadius: 4 }}>{place.distance}m</span>}
                      </div>
                      <div style={{ padding: '7px 8px' }}>
                        <p style={{ color: '#f0ede8', fontSize: 11, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{place.name}</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div>
          <p className="divider-label mb-4">Recensioni</p>

          {/* Stats */}
          {stats && stats.total > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 16, marginBottom: 16 }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 32, fontWeight: 800, color: '#f59e0b', lineHeight: 1 }}>{stats.avg}</p>
                <StarsDisplay rating={Math.round(stats.avg)} />
                <p style={{ fontSize: 10, color: 'rgba(240,237,232,0.4)', marginTop: 3 }}>{stats.total} recens.</p>
              </div>
              <div style={{ flex: 1 }}>
                {[5,4,3,2,1].map(n => (
                  <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <span style={{ fontSize: 10, color: 'rgba(240,237,232,0.4)', width: 8 }}>{n}</span>
                    <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: '#f59e0b', borderRadius: 2, width: (stats.total > 0 ? (stats.distribution[n] / stats.total) * 100 : 0) + '%' }} />
                    </div>
                    <span style={{ fontSize: 10, color: 'rgba(240,237,232,0.35)', width: 16, textAlign: 'right' }}>{stats.distribution[n]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Write review CTA */}
          {!showReviewForm && (
            <button onClick={() => isLoggedIn() ? setShowReviewForm(true) : navigate('/accedi')}
              style={{ width: '100%', padding: '12px', borderRadius: 14, border: '1px dashed rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.05)', color: 'rgba(240,237,232,0.5)', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16, transition: 'all 0.2s' }}>
              <Star size={14} color="#f59e0b" /> Scrivi una recensione
            </button>
          )}

          {/* Review form */}
          <AnimatePresence>
            {showReviewForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 16, padding: 16, marginBottom: 16, overflow: 'hidden' }}>
                <p style={{ color: 'rgba(240,237,232,0.5)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 10 }}>La tua recensione</p>
                <div style={{ marginBottom: 12 }}><StarsInput rating={rating} onRate={setRating} /></div>
                <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Racconta la tua esperienza... (opzionale)" rows={3}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f0ede8', fontSize: 13, outline: 'none', resize: 'none', fontFamily: 'DM Sans,sans-serif', boxSizing: 'border-box', marginBottom: 10 }}
                  onFocus={e => (e.target.style.borderColor = '#f59e0b')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setShowReviewForm(false)} style={{ flex: 1, padding: '9px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(240,237,232,0.4)', cursor: 'pointer', fontSize: 12 }}>Annulla</button>
                  <button onClick={() => createReview.mutate()} disabled={rating === 0 || createReview.isPending}
                    style={{ flex: 2, padding: '9px', borderRadius: 10, border: 'none', background: rating > 0 ? '#f59e0b' : 'rgba(255,255,255,0.08)', color: rating > 0 ? '#000' : 'rgba(240,237,232,0.3)', cursor: rating > 0 ? 'pointer' : 'not-allowed', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Send size={12} /> {createReview.isPending ? 'Invio...' : 'Pubblica'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reviews list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {reviews.length === 0 && !showReviewForm && (
              <p style={{ color: 'rgba(240,237,232,0.3)', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>Ancora nessuna recensione. Sii il primo!</p>
            )}
            {reviews.map((r: any) => {
              const isOwn = user && (r.userId as any)?._id === user.id
              return (
                <div key={r._id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#f59e0b', fontSize: 10, fontWeight: 700 }}>{(r.userId as any)?.name?.charAt(0).toUpperCase()}</span>
                      </div>
                      <span style={{ color: '#f0ede8', fontSize: 12, fontWeight: 600 }}>{(r.userId as any)?.name}</span>
                      <StarsDisplay rating={r.rating} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: 'rgba(240,237,232,0.25)', fontSize: 10, fontFamily: 'DM Mono,monospace' }}>{new Date(r.createdAt).toLocaleDateString('it-IT')}</span>
                      {isOwn && (
                        <button onClick={() => deleteReview.mutate(r._id)} style={{ padding: 4, borderRadius: 6, border: 'none', cursor: 'pointer', background: 'transparent', color: 'rgba(240,237,232,0.2)' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#f87171')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,237,232,0.2)')}>
                          <Trash2 size={11} />
                        </button>
                      )}
                    </div>
                  </div>
                  {r.comment && <p style={{ color: 'rgba(240,237,232,0.6)', fontSize: 12, lineHeight: 1.5 }}>{r.comment}</p>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
