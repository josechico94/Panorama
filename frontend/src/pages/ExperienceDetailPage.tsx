import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, MapPin, Euro, ChevronRight, ExternalLink, Phone } from 'lucide-react'
import { experiencesApi } from '@/lib/api'
import { getCategoryConfig } from '@/types'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=900&q=80'

function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v')
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1)
    if (u.pathname.includes('/embed/')) return u.pathname.split('/embed/')[1]
  } catch {}
  return null
}

function getVimeoId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('vimeo.com')) return u.pathname.replace('/', '')
  } catch {}
  return null
}

function VideoPlayer({ url }: { url: string }) {
  const [playing, setPlaying] = useState(false)
  const ytId = getYouTubeId(url)
  const vimeoId = getVimeoId(url)
  const embedUrl = ytId
    ? `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`
    : vimeoId
    ? `https://player.vimeo.com/video/${vimeoId}?autoplay=1`
    : null

  // Thumbnail
  const thumb = ytId
    ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
    : null

  if (!embedUrl) return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-3 glass-light rounded-xl p-4 hover:border-[var(--accent)] transition-all">
      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(232,98,42,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: 18 }}>▶️</span>
      </div>
      <div>
        <p className="text-[var(--text)] text-sm font-semibold">Guarda il video</p>
        <p className="text-[var(--text-3)] text-xs">Apre in una nuova finestra</p>
      </div>
    </a>
  )

  return (
    <div>
      <p className="divider-label mb-3">Video</p>
      {!playing ? (
        <button onClick={() => setPlaying(true)} style={{
          width: '100%', position: 'relative', borderRadius: 16, overflow: 'hidden',
          aspectRatio: '16/9', border: 'none', cursor: 'pointer', background: '#000', display: 'block',
        }}>
          {thumb && <img src={thumb} alt="Video thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(232,98,42,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 24px rgba(232,98,42,0.5)', transition: 'transform 0.2s' }}>
              <span style={{ fontSize: 24, marginLeft: 4 }}>▶</span>
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: 12, left: 12 }}>
            <span style={{ background: 'rgba(7,7,15,0.8)', color: '#f0ede8', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6 }}>
              {ytId ? '▶ YouTube' : '▶ Vimeo'}
            </span>
          </div>
        </button>
      ) : (
        <div style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '16/9' }}>
          <iframe
            src={embedUrl}
            width="100%" height="100%"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ display: 'block', border: 'none' }}
          />
        </div>
      )}
    </div>
  )
}

export default function ExperienceDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['experience', slug],
    queryFn: () => experiencesApi.get(slug!),
    enabled: !!slug,
  })

  const exp = data?.data
  const stops = exp?.stops ?? []
  const hours = exp ? Math.floor(exp.duration / 60) : 0
  const mins = exp ? exp.duration % 60 : 0

  if (isLoading) return (
    <div className="max-w-2xl mx-auto px-4 pt-8 space-y-4">
      <div className="skeleton rounded-2xl h-56" />
      <div className="skeleton rounded-xl h-8 w-2/3" />
      <div className="skeleton rounded-2xl h-32" />
    </div>
  )

  if (!exp) return (
    <div className="text-center py-20">
      <p className="text-4xl mb-3">✨</p>
      <p className="text-[var(--text-2)] text-sm">Esperienza non trovata</p>
      <Link to="/esperienze" className="btn btn-accent mt-5 inline-flex">Torna alle esperienze</Link>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto pb-10">
      {/* Hero 10 */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/8' }}>
        <img src={exp.coverImage || PLACEHOLDER} alt={exp.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(7,7,15,0.3) 0%, rgba(7,7,15,0.8) 100%)' }} />

        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 w-9 h-9 rounded-xl glass flex items-center justify-center">
          <ArrowLeft size={16} className="text-white" />
        </button>

        <div className="absolute top-4 right-4">
          <span style={{ background: 'rgba(7,7,15,0.8)', backdropFilter: 'blur(8px)', color: '#f0ede8', fontSize: 14, fontWeight: 800, padding: '5px 12px', borderRadius: 12, fontFamily: 'DM Mono,monospace', border: '1px solid rgba(255,255,255,0.15)' }}>
            ~€{exp.estimatedCost}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 'clamp(26px,7vw,36px)', fontWeight: 700, color: '#f0ede8', lineHeight: 1.1, marginBottom: 6 }}>
            {exp.emoji} {exp.title}
          </h1>
          <p style={{ color: 'rgba(240,237,232,0.65)', fontSize: 13 }}>{exp.tagline}</p>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-6">
        {/* Meta */}
        <div className="flex gap-4 flex-wrap">
          {[
            { icon: Clock, label: `${hours > 0 ? `${hours}h ` : ''}${mins > 0 ? `${mins}min` : ''}`, color: 'var(--accent)' },
            { icon: MapPin, label: `${stops.length} ${stops.length === 1 ? 'tappa' : 'tappe'}`, color: 'var(--accent)' },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-2 glass-light rounded-xl px-3 py-2">
              <Icon size={13} style={{ color }} />
              <span className="text-[var(--text-2)] text-xs font-semibold">{label}</span>
            </div>
          ))}
          {exp.tags?.map((tag: string) => (
            <span key={tag} className="tag-chip">#{tag}</span>
          ))}
        </div>

        {/* Description */}
        {exp.description && (
          <p className="text-[var(--text-2)] text-sm leading-relaxed">{exp.description}</p>
        )}

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
                    {/* Stop header */}
                    <div style={{ display: 'flex', gap: 12, padding: '14px 16px' }}>
                      {/* Step number */}
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>{i + 1}</span>
                      </div>

                      {/* Place info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                          <Link to={`/place/${place.slug}`} style={{ textDecoration: 'none' }}>
                            <h3 style={{ color: '#f0ede8', fontSize: 15, fontWeight: 700, fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic' }}>
                              {place.name}
                            </h3>
                          </Link>
                          <span style={{ fontSize: 9, fontWeight: 700, color: cat.color, background: `${cat.color}18`, border: `1px solid ${cat.color}30`, borderRadius: 100, padding: '1px 6px' }}>
                            {cat.emoji} {cat.label}
                          </span>
                        </div>
                        <p style={{ color: 'rgba(240,237,232,0.4)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={9} color="var(--accent)" /> {place.location?.neighborhood || place.location?.address}
                        </p>
                        {stop.duration > 0 && (
                          <p style={{ color: 'rgba(240,237,232,0.3)', fontSize: 10, display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                            <Clock size={9} /> ~{stop.duration} min
                          </p>
                        )}
                      </div>

                      {/* Place image */}
                      <div style={{ width: 56, height: 56, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
                        <img src={place.media?.coverImage || 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=200&q=70'} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </div>

                    {/* Note */}
                    {stop.note && (
                      <div style={{ padding: '0 16px 12px 60px' }}>
                        <p style={{ fontSize: 12, color: 'rgba(240,237,232,0.55)', lineHeight: 1.5, background: 'rgba(232,98,42,0.06)', border: '1px solid rgba(232,98,42,0.15)', borderRadius: 10, padding: '8px 12px', fontStyle: 'italic' }}>
                          💡 {stop.note}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{ padding: '0 16px 12px 60px', display: 'flex', gap: 8 }}>
                      <Link to={`/place/${place.slug}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>
                        Vedi dettagli <ExternalLink size={10} />
                      </Link>
                      {place.contact?.phone && (
                        <a href={`tel:${place.contact.phone}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'rgba(240,237,232,0.4)', marginLeft: 12 }}>
                          <Phone size={10} /> Chiama
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Connector arrow */}
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

        {/* Maps CTA */}
        {stops[0]?.placeId?.location?.coordinates && (
          <a href={`https://maps.google.com/?q=${stops[0].placeId.location.coordinates.lat},${stops[0].placeId.location.coordinates.lng}`}
            target="_blank" rel="noopener noreferrer"
            className="btn btn-accent w-full flex items-center justify-center gap-2">
            <MapPin size={15} /> Inizia da qui
          </a>
        )}
      </div>
    </div>
  )
}
