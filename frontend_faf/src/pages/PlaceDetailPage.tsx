import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  ArrowLeft, MapPin, Phone, Globe, Instagram, Bookmark, BookmarkCheck,
  Share2, Clock, ExternalLink, Tag, ChevronRight, Star
} from 'lucide-react'
import { placesApi, couponsApi } from '@/lib/api'
import { useAppStore } from '@/store'
import { getCategoryConfig, PRICE_LABELS } from '@/types'
import PlaceReviews from '@/components/places/PlaceReviews'

const DAYS_IT: Record<string, string> = {
  monday:'Lun', tuesday:'Mar', wednesday:'Mer',
  thursday:'Gio', friday:'Ven', saturday:'Sab', sunday:'Dom',
}
const DAYS_ORDER = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']
const TODAY = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
const PLACEHOLDER = 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1200&q=80'

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('it-IT', { day:'numeric', month:'short' })
}

function discountLabel(c: any) {
  if (c.discountType === 'percentage') return `-${c.discountValue}%`
  if (c.discountType === 'fixed') return `-€${c.discountValue}`
  return 'OMAGGIO'
}

export default function PlaceDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { toggleSaved, isSaved } = useAppStore()

  const { data, isLoading } = useQuery({
    queryKey: ['place', slug],
    queryFn: () => placesApi.get(slug!),
    enabled: !!slug,
  })

  const place = data?.data
  const saved = place ? isSaved(place._id) : false
  const cat = place ? getCategoryConfig(place.category) : null

  const { data: couponsData } = useQuery({
    queryKey: ['place-coupons', place?._id],
    queryFn: () => couponsApi.forPlace(place!._id),
    enabled: !!place?._id,
  })
  const activeCoupons = couponsData?.data ?? []

  const handleShare = async () => {
    if (navigator.share && place) await navigator.share({ title: place.name, url: window.location.href })
    else { await navigator.clipboard.writeText(window.location.href) }
  }

  if (isLoading) return (
    <div style={{ maxWidth: 672, margin: '0 auto' }}>
      <div className="skeleton" style={{ height: '56vw', maxHeight: 360, borderRadius: 0 }} />
      <div style={{ padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="skeleton" style={{ height: 36, width: '60%' }} />
        <div className="skeleton" style={{ height: 14, width: '40%' }} />
        <div className="skeleton" style={{ height: 80, borderRadius: 16 }} />
        <div className="skeleton" style={{ height: 120, borderRadius: 16 }} />
      </div>
    </div>
  )

  if (!place || !cat) return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <p style={{ fontSize: 40, marginBottom: 12 }}>😕</p>
      <p style={{ color: 'var(--text-2)', fontSize: 14, marginBottom: 20 }}>Posto non trovato</p>
      <Link to="/" className="btn btn-accent">Torna alla home</Link>
    </div>
  )

  return (
    <div style={{ maxWidth: 672, margin: '0 auto' }}>

      {/* ── Hero Photo ── */}
      <div style={{ position: 'relative', aspectRatio: '16/9', maxHeight: 380, overflow: 'hidden' }}>
        <img
          src={place.media.coverImage || PLACEHOLDER}
          alt={place.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div className="absolute inset-0 hero-overlay" />

        {/* Top actions */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)}
            style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(7,7,15,0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <ArrowLeft size={17} />
          </motion.button>
          <div style={{ display: 'flex', gap: 8 }}>
            <motion.button whileTap={{ scale: 0.9 }} onClick={handleShare}
              style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(7,7,15,0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Share2 size={16} />
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggleSaved(place._id)}
              style={{ width: 38, height: 38, borderRadius: 12, background: saved ? 'rgba(187,0,255,0.5)' : 'rgba(7,7,15,0.55)', backdropFilter: 'blur(12px)', border: `1px solid ${saved ? 'rgba(187,0,255,0.6)' : 'rgba(255,255,255,0.15)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
              {saved ? <BookmarkCheck size={16} color="#fff" /> : <Bookmark size={16} color="#fff" />}
            </motion.button>
          </div>
        </div>

        {/* Bottom pills on image */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span className="cat-pill" style={{ backgroundColor: `${cat.color}22`, color: cat.color, borderColor: `${cat.color}45` }}>
            {cat.emoji} {cat.label}
          </span>
          {place.isOpenNow && (
            <span className="cat-pill" style={{ backgroundColor: 'rgba(34,197,94,0.15)', color: '#4ade80', borderColor: 'rgba(34,197,94,0.3)' }}>
              <span className="open-dot" /> Aperto ora
            </span>
          )}
          {activeCoupons.length > 0 && (
            <span className="cat-pill" style={{ backgroundColor: 'rgba(187,0,255,0.2)', color: '#D966FF', borderColor: 'rgba(187,0,255,0.35)' }}>
              <Tag size={9} /> {activeCoupons.length} {activeCoupons.length === 1 ? 'offerta' : 'offerte'}
            </span>
          )}
        </div>
      </div>

      {/* ── Main Content ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{ padding: '20px 20px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── Name & Address ── */}
        <div>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
            fontSize: 'clamp(28px, 7vw, 38px)', fontWeight: 700,
            color: 'var(--text)', lineHeight: 1.05, marginBottom: 8,
          }}>
            {place.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--meta-color)' }}>
              <MapPin size={12} color="var(--accent)" /> {place.location.address}
            </span>
            {place.location.neighborhood && (
              <span style={{ fontSize: 11, color: 'var(--meta-color)', fontFamily: 'DM Mono', letterSpacing: '0.08em' }}>
                · {place.location.neighborhood}
              </span>
            )}
            <span style={{ fontSize: 12, color: 'var(--meta-color)', fontFamily: 'DM Mono' }}>
              {PRICE_LABELS[place.priceRange]}
            </span>
          </div>
        </div>

        {/* ── Description ── */}
        {place.description && (
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--desc-color)' }}>
            {place.description}
          </p>
        )}

        {/* ── Tags ── */}
        {place.tags?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {place.tags.map((tag: string) => (
              <span key={tag} className="tag-chip">#{tag}</span>
            ))}
          </div>
        )}

        {/* ── Active Coupons ── */}
        {activeCoupons.length > 0 && (
          <div>
            <div className="divider-label" style={{ marginBottom: 12 }}>
              <Tag size={9} /> Offerte attive
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {activeCoupons.map((coupon: any) => (
                <Link key={coupon._id} to={`/coupon/${coupon._id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                    background: 'rgba(187,0,255,0.06)',
                    border: '1px solid rgba(187,0,255,0.18)',
                    borderRadius: 14, padding: '12px 14px',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                    onMouseEnter={e => { (e.currentTarget as any).style.borderColor = 'rgba(187,0,255,0.35)'; (e.currentTarget as any).style.background = 'rgba(187,0,255,0.1)' }}
                    onMouseLeave={e => { (e.currentTarget as any).style.borderColor = 'rgba(187,0,255,0.18)'; (e.currentTarget as any).style.background = 'rgba(187,0,255,0.06)' }}
                  >
                    <div>
                      <p style={{ color: 'var(--text)', fontSize: 13, fontWeight: 700 }}>{coupon.title}</p>
                      <p style={{ color: 'var(--meta-color)', fontSize: 10, marginTop: 3 }}>
                        Valido fino al {fmtDate(coupon.validUntil)}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <span style={{
                        fontSize: 13, fontWeight: 800, color: '#BB00FF',
                        background: 'rgba(187,0,255,0.12)',
                        border: '1px solid rgba(187,0,255,0.25)',
                        borderRadius: 8, padding: '3px 10px',
                        fontFamily: 'DM Mono',
                      }}>
                        {discountLabel(coupon)}
                      </span>
                      <ChevronRight size={14} color="var(--accent)" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Hours ── */}
        {place.hours && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(187,0,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={13} color="var(--accent)" />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Orari</span>
              {place.isOpenNow && (
                <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#4ade80', fontWeight: 700 }}>
                  <span className="open-dot" style={{ width: 5, height: 5 }} /> Aperto ora
                </span>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
              {DAYS_ORDER.map(day => {
                const s = place.hours[day]
                const isToday = day === TODAY
                const closed = !s || s.closed
                return (
                  <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: isToday ? 'var(--accent)' : 'var(--meta-color)' }}>
                      {DAYS_IT[day]}
                    </span>
                    <div style={{
                      width: '100%', borderRadius: 8, padding: '5px 0',
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      background: isToday ? 'rgba(187,0,255,0.12)' : 'rgba(255,255,255,0.03)',
                      border: isToday ? '1px solid rgba(187,0,255,0.3)' : '1px solid transparent',
                    }}>
                      {closed ? (
                        <span style={{ fontSize: 9, color: 'var(--meta-color)', fontFamily: 'DM Mono' }}>—</span>
                      ) : (
                        <>
                          <span style={{ fontSize: 8, fontFamily: 'DM Mono', color: isToday ? 'var(--accent)' : 'var(--text-2)', fontWeight: 600 }}>{s.open}</span>
                          <span style={{ fontSize: 7, fontFamily: 'DM Mono', color: 'var(--meta-color)' }}>{s.close}</span>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Contacts ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {place.contact.phone && (
            <a href={`tel:${place.contact.phone}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, background: 'var(--surface)', border: '1px solid var(--border)', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(187,0,255,0.25)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${cat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Phone size={15} color={cat.color} />
              </div>
              <span style={{ fontSize: 14, color: 'var(--text)', flex: 1 }}>{place.contact.phone}</span>
              <ExternalLink size={12} color="var(--meta-color)" />
            </a>
          )}
          {place.contact.website && (
            <a href={place.contact.website} target="_blank" rel="noopener noreferrer"
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, background: 'var(--surface)', border: '1px solid var(--border)', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(187,0,255,0.25)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${cat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Globe size={15} color={cat.color} />
              </div>
              <span style={{ fontSize: 14, color: 'var(--text)', flex: 1 }}>Sito web</span>
              <ExternalLink size={12} color="var(--meta-color)" />
            </a>
          )}
          {place.contact.instagram && (
            <a href={`https://instagram.com/${place.contact.instagram}`} target="_blank" rel="noopener noreferrer"
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, background: 'var(--surface)', border: '1px solid var(--border)', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(187,0,255,0.25)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${cat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Instagram size={15} color={cat.color} />
              </div>
              <span style={{ fontSize: 14, color: 'var(--text)', flex: 1 }}>@{place.contact.instagram}</span>
              <ExternalLink size={12} color="var(--meta-color)" />
            </a>
          )}
        </div>

        {/* ── Map CTA ── */}
        <a
          href={`https://maps.google.com/?q=${place.location.coordinates?.lat},${place.location.coordinates?.lng}`}
          target="_blank" rel="noopener noreferrer"
          className="btn btn-accent"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <MapPin size={15} /> Ottieni indicazioni
        </a>

        {/* ── Reviews ── */}
        <div>
          <div className="divider-label" style={{ marginBottom: 16 }}>Recensioni</div>
          <PlaceReviews placeId={place._id} />
        </div>
      </motion.div>
    </div>
  )
}
