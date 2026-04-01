import { Link } from 'react-router-dom'
import { Bookmark, BookmarkCheck, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Place } from '@/types'
import { getCategoryConfig, PRICE_LABELS } from '@/types'
import { useAppStore } from '@/store'
import { getPlaceholder } from '@/lib/placeholders'

interface Props {
  place: Place
  index?: number
  variant?: 'default' | 'hero' | 'horizontal'
}

export default function PlaceCard({ place, index = 0, variant = 'default' }: Props) {
  const { toggleSaved, isSaved } = useAppStore()
  const saved = isSaved(place._id)
  const cat = getCategoryConfig(place.category)

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleSaved(place._id)
  }

  if (variant === 'hero') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25,0.46,0.45,0.94] }}
      >
        <Link to={`/place/${place.slug}`}
          style={{ display: 'block', position: 'relative', borderRadius: 20, overflow: 'hidden', aspectRatio: '3/4', textDecoration: 'none' }}
          className="place-card"
        >
          <img
            src={place.media.coverImage || getPlaceholder(place.category)}
            alt={place.name}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
            loading="lazy"
          />
          <div className="absolute inset-0 card-overlay" />

          {/* Badges */}
          <div style={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
            <span className="cat-pill" style={{ backgroundColor: `${cat.color}22`, color: cat.color, borderColor: `${cat.color}40` }}>
              {cat.emoji} {cat.label}
            </span>
            {place.isOpenNow && (
              <span className="cat-pill" style={{ backgroundColor: 'rgba(34,197,94,0.15)', color: '#4ade80', borderColor: 'rgba(34,197,94,0.3)' }}>
                <span className="open-dot" /> Aperto
              </span>
            )}
          </div>

          {/* Bottom info */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={9} /> {place.location.neighborhood}
                </p>
                <h3 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 20, fontWeight: 700, color: '#fff', lineHeight: 1.15, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {place.name}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'DM Mono', marginTop: 4 }}>
                  {PRICE_LABELS[place.priceRange]}
                </p>
              </div>
              <button onClick={handleSave} style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(7,7,15,0.55)', backdropFilter: 'blur(10px)', border: `1px solid ${saved ? 'rgba(187,0,255,0.5)' : 'rgba(255,255,255,0.15)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                {saved ? <BookmarkCheck size={14} color="#BB00FF" /> : <Bookmark size={14} color="rgba(255,255,255,0.7)" />}
              </button>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  // ── Default card ──
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.25,0.46,0.45,0.94] }}
    >
      <Link to={`/place/${place.slug}`} style={{ textDecoration: 'none', display: 'block' }} className="place-card">
        {/* Image */}
        <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
          <img
            src={place.media.coverImage || getPlaceholder(place.category)}
            alt={place.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', display: 'block' }}
            loading="lazy"
          />
          <div className="absolute inset-0 card-overlay" />

          {/* Category badge */}
          <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span className="cat-pill" style={{ backgroundColor: `${cat.color}20`, color: cat.color, borderColor: `${cat.color}38` }}>
              {cat.emoji} {cat.label}
            </span>
          </div>

          {/* Open now */}
          {place.isOpenNow && (
            <div style={{ position: 'absolute', top: 10, right: 10 }}>
              <span className="cat-pill" style={{ backgroundColor: 'rgba(34,197,94,0.15)', color: '#4ade80', borderColor: 'rgba(34,197,94,0.25)', fontSize: 9 }}>
                <span className="open-dot" style={{ width: 5, height: 5 }} />
              </span>
            </div>
          )}

          {/* Save */}
          <button onClick={handleSave}
            style={{ position: 'absolute', bottom: 10, right: 10, width: 30, height: 30, borderRadius: 9, background: 'rgba(7,7,15,0.6)', backdropFilter: 'blur(8px)', border: `1px solid ${saved ? 'rgba(187,0,255,0.45)' : 'rgba(255,255,255,0.15)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
            {saved ? <BookmarkCheck size={12} color="#BB00FF" /> : <Bookmark size={12} color="rgba(255,255,255,0.65)" />}
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '14px 16px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 18, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
              {place.name}
            </h3>
            <span style={{ fontSize: 11, fontFamily: 'DM Mono', color: 'var(--meta-color)', flexShrink: 0, paddingTop: 2 }}>
              {PRICE_LABELS[place.priceRange]}
            </span>
          </div>

          <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--meta-color)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={9} color="var(--accent)" /> {place.location.neighborhood}
          </p>

          {/* Description — ALWAYS visible, ALWAYS readable */}
          {place.shortDescription && (
            <p style={{ fontSize: 12, color: 'var(--desc-color)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {place.shortDescription}
            </p>
          )}

          {place.tags?.length > 0 && (
            <div style={{ display: 'flex', gap: 5, marginTop: 10, flexWrap: 'wrap' }}>
              {place.tags.slice(0, 3).map((tag: string) => (
                <span key={tag} className="tag-chip">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
