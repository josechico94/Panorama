import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Phone, Globe, Instagram, Bookmark, BookmarkCheck, Share2, Clock, ExternalLink, Tag } from 'lucide-react'
import { placesApi, couponsApi } from '@/lib/api'
import { useAppStore, useUserStore } from '@/store'
import { getCategoryConfig, PRICE_LABELS } from '@/types'
import PlaceReviews from '@/components/places/PlaceReviews'

const DAYS_IT: Record<string, string> = {
  monday:'Lun', tuesday:'Mar', wednesday:'Mer',
  thursday:'Gio', friday:'Ven', saturday:'Sab', sunday:'Dom',
}
const DAYS_ORDER = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']
const TODAY = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
const PLACEHOLDER = 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1200&q=80'

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })
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
    else navigator.clipboard.writeText(window.location.href)
  }

  if (isLoading) return (
    <div className="max-w-2xl mx-auto">
      <div className="skeleton" style={{ height: '55vw', maxHeight: 340 }} />
      <div className="px-5 pt-6 space-y-4">
        <div className="skeleton rounded-xl h-6 w-2/3" />
        <div className="skeleton rounded-xl h-4 w-1/2" />
        <div className="skeleton rounded-2xl h-28" />
      </div>
    </div>
  )

  if (!place || !cat) return (
    <div className="text-center py-20">
      <p className="text-4xl mb-3">😕</p>
      <p className="text-[var(--text-2)] text-sm">Posto non trovato</p>
      <Link to="/" className="btn btn-accent mt-5 inline-flex">Torna alla home</Link>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto">
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '4/3', maxHeight: 340 }}>
        <img src={place.media.coverImage || PLACEHOLDER} alt={place.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay" />

        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
          <motion.button whileTap={{ scale: 0.92 }} onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl glass flex items-center justify-center text-[var(--text-2)] hover:text-white transition-all">
            <ArrowLeft size={16} />
          </motion.button>
          <div className="flex items-center gap-2">
            <motion.button whileTap={{ scale: 0.92 }} onClick={handleShare}
              className="w-9 h-9 rounded-xl glass flex items-center justify-center text-[var(--text-2)] hover:text-white transition-all">
              <Share2 size={15} />
            </motion.button>
            <motion.button whileTap={{ scale: 0.92 }} onClick={() => toggleSaved(place._id)}
              className="w-9 h-9 rounded-xl glass flex items-center justify-center transition-all">
              {saved ? <BookmarkCheck size={15} className="text-[var(--accent)]" /> : <Bookmark size={15} className="text-[var(--text-2)]" />}
            </motion.button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="cat-pill" style={{ backgroundColor: `${cat.color}20`, color: cat.color, borderColor: `${cat.color}40` }}>
              {cat.emoji} {cat.label}
            </span>
            {place.isOpenNow && (
              <span className="cat-pill" style={{ backgroundColor: 'rgba(74,222,128,0.12)', color: '#4ade80', borderColor: 'rgba(74,222,128,0.25)' }}>
                <span className="open-dot" /> Aperto ora
              </span>
            )}
            {activeCoupons.length > 0 && (
              <span className="cat-pill" style={{ backgroundColor: 'rgba(232,98,42,0.2)', color: '#e8622a', borderColor: 'rgba(232,98,42,0.4)' }}>
                <Tag size={9} /> {activeCoupons.length} offert{activeCoupons.length === 1 ? 'a' : 'e'}
              </span>
            )}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="px-5 pb-10 space-y-6 pt-5"
      >
        {/* Title */}
        <div>
          <h1 className="font-display font-bold leading-tight mb-1"
            style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(28px,7vw,38px)', fontStyle:'italic' }}>
            {place.name}
          </h1>
          <div className="flex items-center gap-3 text-[var(--text-3)] text-xs">
            <span className="flex items-center gap-1">
              <MapPin size={10} style={{ color:'var(--accent)' }} /> {place.location.address}
            </span>
            <span className="font-mono-dm">{PRICE_LABELS[place.priceRange]}</span>
          </div>
        </div>

        {/* Description */}
        {place.description && (
          <p className="text-[var(--text-2)] text-[13px] leading-relaxed">{place.description}</p>
        )}

        {/* Tags */}
        {place.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {place.tags.map((tag: string) => <span key={tag} className="tag-chip">#{tag}</span>)}
          </div>
        )}

        {/* Active coupons */}
        {activeCoupons.length > 0 && (
          <div>
            <p className="text-[var(--text-3)] text-[9px] font-semibold tracking-widest uppercase mb-3 flex items-center gap-1.5">
              <Tag size={9} style={{ color: 'var(--accent)' }} /> Offerte attive
            </p>
            <div className="space-y-2">
              {activeCoupons.map((coupon: any) => (
                <Link key={coupon._id} to={`/coupon/${coupon._id}`}>
                  <div style={{
                    background: 'rgba(232,98,42,0.08)', border: '1px solid rgba(232,98,42,0.22)',
                    borderRadius: 14, padding: '12px 14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(232,98,42,0.4)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(232,98,42,0.22)')}
                  >
                    <div>
                      <p style={{ color: '#f0ede8', fontSize: 13, fontWeight: 600 }}>{coupon.title}</p>
                      <p style={{ color: 'rgba(240,237,232,0.4)', fontSize: 10, marginTop: 2 }}>
                        Valido fino al {formatDate(coupon.validUntil)}
                      </p>
                    </div>
                    <span style={{
                      fontSize: 13, fontWeight: 800, color: '#e8622a',
                      background: 'rgba(232,98,42,0.15)', border: '1px solid rgba(232,98,42,0.3)',
                      borderRadius: 8, padding: '3px 10px', fontFamily: 'DM Mono,monospace',
                    }}>
                      {coupon.discountType === 'percentage' ? `-${coupon.discountValue}%`
                        : coupon.discountType === 'fixed' ? `-€${coupon.discountValue}` : 'OMAGGIO'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Hours */}
        {place.hours && (
          <div className="glass-light rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={13} style={{ color:'var(--accent)' }} />
              <span className="text-[var(--text)] text-xs font-semibold tracking-widest uppercase">Orari</span>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {DAYS_ORDER.map(day => {
                const schedule = place.hours[day]
                const isToday = day === TODAY
                const isClosed = !schedule || schedule.closed
                return (
                  <div key={day} className="flex flex-col items-center gap-1">
                    <span className="text-[9px] font-semibold tracking-wide"
                      style={{ color: isToday ? 'var(--accent)' : 'var(--text-3)' }}>
                      {DAYS_IT[day]}
                    </span>
                    <div className={`w-full rounded-lg py-1.5 flex flex-col items-center ${
                      isToday ? 'border border-[var(--accent)] bg-[rgba(232,98,42,0.08)]' : 'bg-[rgba(255,255,255,0.03)]'
                    }`}>
                      {isClosed ? (
                        <span className="text-[8px] text-[var(--text-3)] font-mono-dm">—</span>
                      ) : (
                        <>
                          <span className="text-[8px] font-mono-dm" style={{ color: isToday ? 'var(--accent)' : 'var(--text-2)' }}>
                            {schedule.open}
                          </span>
                          <span className="text-[7px] text-[var(--text-3)] font-mono-dm">{schedule.close}</span>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Contacts */}
        <div className="space-y-2">
          {place.contact.phone && (
            <a href={`tel:${place.contact.phone}`} className="flex items-center gap-3 p-3.5 rounded-xl glass-light hover:border-[var(--border2)] transition-all group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${cat.color}18` }}>
                <Phone size={14} style={{ color: cat.color }} />
              </div>
              <span className="text-[var(--text-2)] text-sm group-hover:text-[var(--text)] transition-colors">{place.contact.phone}</span>
              <ExternalLink size={11} className="ml-auto text-[var(--text-3)]" />
            </a>
          )}
          {place.contact.website && (
            <a href={place.contact.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3.5 rounded-xl glass-light hover:border-[var(--border2)] transition-all group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${cat.color}18` }}>
                <Globe size={14} style={{ color: cat.color }} />
              </div>
              <span className="text-[var(--text-2)] text-sm group-hover:text-[var(--text)] transition-colors">Sito web</span>
              <ExternalLink size={11} className="ml-auto text-[var(--text-3)]" />
            </a>
          )}
          {place.contact.instagram && (
            <a href={`https://instagram.com/${place.contact.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3.5 rounded-xl glass-light hover:border-[var(--border2)] transition-all group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${cat.color}18` }}>
                <Instagram size={14} style={{ color: cat.color }} />
              </div>
              <span className="text-[var(--text-2)] text-sm">@{place.contact.instagram}</span>
              <ExternalLink size={11} className="ml-auto text-[var(--text-3)]" />
            </a>
          )}
        </div>

        {/* Directions */}
        <a href={`https://maps.google.com/?q=${place.location.coordinates.lat},${place.location.coordinates.lng}`}
          target="_blank" rel="noopener noreferrer" className="btn btn-accent w-full flex items-center justify-center gap-2">
          <MapPin size={15} /> Ottieni indicazioni
        </a>

        {/* Reviews */}
        <div>
          <div className="divider-label mb-4">Recensioni</div>
          <PlaceReviews placeId={place._id} />
        </div>
      </motion.div>
    </div>
  )
}
