import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { placesApi } from '@/lib/api'
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

  const places: Place[] = data?.data ?? []
  const featured: Place[] = featuredData?.data ?? []

  return (
    <div className="max-w-2xl mx-auto">
      <div className="px-4 pt-6 pb-5">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="accent-line" />
            <span className="font-mono-dm text-[var(--text-3)] text-[9px] tracking-[0.28em] uppercase">Bologna — Italia</span>
          </div>
          <h1 className="font-display leading-none mb-1" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(38px, 10vw, 54px)', fontWeight: 700, color: 'var(--text)', lineHeight: 0.95 }}>
            Cosa vuoi<br />
            <em style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 300 }}>fare oggi?</em>
          </h1>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18, duration: 0.4 }} className="px-4 mb-6">
        <CategoryFilter />
      </motion.div>

      {/* Featured — solo quando non c'è filtro */}
      {!isFiltering && (
        <section className="px-4 mb-8">
          <div className="divider-label mb-4">In evidenza</div>
          {featuredLoading ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><div className="skeleton rounded-[22px]" style={{ aspectRatio: '16/9' }} /></div>
              <PlaceCardSkeleton variant="hero" />
              <PlaceCardSkeleton variant="hero" />
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {featured[0] && (
                <motion.div className="col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
                  <Link to={`/place/${featured[0].slug}`} className="block group relative rounded-[22px] overflow-hidden place-card" style={{ aspectRatio: '16/9' }}>
                    <img src={featured[0].media.coverImage || 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=900&q=80'} alt={featured[0].name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 hero-overlay" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="text-[var(--text-3)] text-[9px] font-semibold tracking-[0.2em] uppercase mb-1.5">{featured[0].location.neighborhood}</p>
                      <h2 className="font-display text-white font-bold leading-none" style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '28px', fontStyle: 'italic' }}>{featured[0].name}</h2>
                      <p className="text-[var(--text-2)] text-xs mt-2 line-clamp-1">{featured[0].shortDescription}</p>
                    </div>
                    {featured[0].isOpenNow && (
                      <div className="absolute top-4 right-4">
                        <span className="cat-pill text-[9px]" style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', borderColor: 'rgba(74,222,128,0.3)' }}>
                          <span className="open-dot" /> Aperto
                        </span>
                      </div>
                    )}
                  </Link>
                </motion.div>
              )}
              {featured.slice(1, 3).map((place, i) => (
                <PlaceCard key={place._id} place={place} index={i + 1} variant="hero" />
              ))}
            </div>
          ) : null}
          {featured.length > 3 && (
            <Link to="/esplora" className="flex items-center gap-1.5 mt-4 text-[var(--accent)] text-xs font-semibold tracking-wide hover:gap-2.5 transition-all">
              Vedi tutti <ArrowRight size={13} />
            </Link>
          )}
        </section>
      )}

      {/* Open now strip */}
      {!isFiltering && <OpenNowStrip city={city} />}

      {/* Results */}
      <section className="px-4 pb-8">
        <div className="divider-label mb-4">
          {isFiltering ? `${places.length} risultati` : 'Tutti i posti'}
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <PlaceCardSkeleton key={i} />)}
          </div>
        ) : places.length === 0 ? (
          <div className="text-center py-14">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-[var(--text-2)] font-medium text-sm">Nessun posto trovato</p>
            <p className="text-[var(--text-3)] text-xs mt-1">Prova a cambiare categoria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {places.map((place, i) => (
              <PlaceCard key={place._id} place={place} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
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
      <div className="px-4 mb-3">
        <div className="flex items-center gap-2">
          <span className="open-dot" />
          <span className="font-mono-dm text-[var(--text-3)] text-[9px] tracking-[0.25em] uppercase">Aperto adesso</span>
          <Zap size={10} className="text-[var(--gold)] ml-0.5" />
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton rounded-2xl shrink-0" style={{ width: 140, height: 180 }} />)
          : places.map((place, i) => (
              <motion.div key={place._id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06, duration: 0.4 }} className="shrink-0" style={{ width: 140 }}>
                <Link to={`/place/${place.slug}`} className="block group relative rounded-2xl overflow-hidden place-card" style={{ height: 180 }}>
                  <img src={place.media.coverImage || 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&q=80'} alt={place.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 card-overlay" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="font-display text-white text-[13px] font-semibold leading-tight line-clamp-2" style={{ fontFamily: 'Cormorant Garamond,serif' }}>{place.name}</p>
                  </div>
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-base">{['🍽️','🍹','🛍️','🚶','🏛️','⚡','🌙'].find((_, idx) => ['eat','drink','shop','walk','culture','sport','night'][idx] === place.category)}</span>
                  </div>
                </Link>
              </motion.div>
            ))
        }
      </div>
    </section>
  )
}
