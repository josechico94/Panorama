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

// Placeholder per categoria — definito dentro il componente

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
        transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Link to={`/place/${place.slug}`} className="block group relative rounded-[22px] overflow-hidden place-card"
          style={{ aspectRatio: '3/4' }}>
          {/* Image */}
          <img
            src={place.media.coverImage || getPlaceholder(place.category)}
            alt={place.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 card-overlay" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            <span className="cat-pill" style={{
              backgroundColor: `${cat.color}22`,
              color: cat.color,
              borderColor: `${cat.color}40`,
            }}>
              {cat.emoji} {cat.label}
            </span>
            {place.isOpenNow && (
              <span className="cat-pill" style={{
                backgroundColor: 'rgba(74,222,128,0.12)',
                color: '#4ade80',
                borderColor: 'rgba(74,222,128,0.25)',
              }}>
                <span className="open-dot" /> Aperto
              </span>
            )}
          </div>

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-end justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-[var(--text-3)] text-[10px] font-semibold tracking-widest uppercase mb-1 flex items-center gap-1">
                  <MapPin size={9} /> {place.location.neighborhood}
                </p>
                <h3 className="font-display text-white text-xl font-bold leading-tight line-clamp-2"
                  style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic' }}>
                  {place.name}
                </h3>
                <p className="text-[var(--text-3)] text-[10px] font-mono-dm mt-1">
                  {PRICE_LABELS[place.priceRange]}
                </p>
              </div>
              <button onClick={handleSave}
                className="w-9 h-9 rounded-xl glass flex items-center justify-center shrink-0 transition-all active:scale-90">
                {saved
                  ? <BookmarkCheck size={15} className="text-[var(--accent)]" />
                  : <Bookmark size={15} className="text-[var(--text-2)]" />
                }
              </button>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  // Default card
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link to={`/place/${place.slug}`} className="block group place-card">
        {/* Image */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
          <img
            src={place.media.coverImage || getPlaceholder(place.category)}
            alt={place.name}
            className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 card-overlay" />

          {/* Category + open */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="cat-pill" style={{
              backgroundColor: `${cat.color}20`,
              color: cat.color,
              borderColor: `${cat.color}38`,
            }}>
              {cat.emoji} {cat.label}
            </span>
            {place.isOpenNow && (
              <span className="cat-pill text-[9px]" style={{
                backgroundColor: 'rgba(74,222,128,0.12)',
                color: '#4ade80',
                borderColor: 'rgba(74,222,128,0.2)',
              }}>
                <span className="open-dot" />
              </span>
            )}
          </div>

          {/* Save button */}
          <button onClick={handleSave}
            className="absolute bottom-3 right-3 w-8 h-8 rounded-xl glass flex items-center justify-center transition-all active:scale-90 hover:border-[var(--border2)]">
            {saved
              ? <BookmarkCheck size={13} className="text-[var(--accent)]" />
              : <Bookmark size={13} className="text-[var(--text-3)]" />
            }
          </button>
        </div>

        {/* Content */}
        <div className="p-4 pb-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-display text-[var(--text)] text-[17px] font-semibold leading-snug line-clamp-1 group-hover:text-white transition-colors"
              style={{ fontFamily: 'Cormorant Garamond,serif' }}>
              {place.name}
            </h3>
            <span className="font-mono-dm text-[var(--text-3)] text-[11px] shrink-0 pt-0.5">
              {PRICE_LABELS[place.priceRange]}
            </span>
          </div>
          <p className="text-[var(--text-3)] text-[10px] font-semibold tracking-widest uppercase flex items-center gap-1 mb-2">
            <MapPin size={9} style={{ color: 'var(--accent)' }} />
            {place.location.neighborhood}
          </p>
          {place.shortDescription && (
            <p className="text-[var(--text-2)] text-[12px] leading-relaxed line-clamp-2">
              {place.shortDescription}
            </p>
          )}
          {place.tags.length > 0 && (
            <div className="flex gap-1.5 mt-3 flex-wrap">
              {place.tags.slice(0, 3).map(tag => (
                <span key={tag} className="tag-chip">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
