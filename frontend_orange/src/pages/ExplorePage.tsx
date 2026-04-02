import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { List, Map as MapIcon, SlidersHorizontal } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { placesApi } from '@/lib/api'
import { useAppStore } from '@/store'
import CategoryFilter from '@/components/places/CategoryFilter'
import PlaceCard from '@/components/places/PlaceCard'
import PlaceCardSkeleton from '@/components/ui/PlaceCardSkeleton'
import { getCategoryConfig } from '@/types'
import type { Place } from '@/types'

const createIcon = (emoji: string) =>
  L.divIcon({
    html: `<div style="font-size:20px;line-height:1;filter:drop-shadow(0 2px 8px rgba(0,0,0,0.7))">${emoji}</div>`,
    className: '',
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  })

export default function ExplorePage() {
  const [view, setView] = useState<'list' | 'map'>('list')
  const { activeCategory, city, searchQuery } = useAppStore()

  const params: Record<string, string> = { city, limit: '50' }
  if (activeCategory) params.category = activeCategory
  if (searchQuery) params.search = searchQuery

  const { data, isLoading } = useQuery({
    queryKey: ['explore', city, activeCategory, searchQuery],
    queryFn: () => placesApi.list(params),
  })

  const places: Place[] = data?.data ?? []

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-end justify-between mb-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="accent-line" />
              <span className="font-mono-dm text-[var(--text-3)] text-[9px] tracking-[0.28em] uppercase">Scopri</span>
            </div>
            <h1 className="font-display font-bold"
              style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(30px,8vw,42px)', fontStyle:'italic' }}>
              Esplora
            </h1>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 glass-light rounded-xl p-1">
            <button
              onClick={() => setView('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                view === 'list'
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--text-3)] hover:text-[var(--text)]'
              }`}
            >
              <List size={12} /> Lista
            </button>
            <button
              onClick={() => setView('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                view === 'map'
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--text-3)] hover:text-[var(--text)]'
              }`}
            >
              <MapIcon size={12} /> Mappa
            </button>
          </div>
        </motion.div>

        <CategoryFilter />
      </div>

      {/* Results count */}
      <div className="px-4 mb-4">
        <div className="divider-label">
          {isLoading ? 'Caricamento...' : `${places.length} luoghi`}
        </div>
      </div>

      {/* Map view */}
      {view === 'map' && (
        <div className="px-4 pb-8">
          <div className="rounded-2xl overflow-hidden border border-[var(--border)]" style={{ height: '62vh' }}>
            <MapContainer
              center={[44.4949, 11.3426]}
              zoom={14}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap"
              />
              {places.map(place => {
                const cat = getCategoryConfig(place.category)
                return (
                  <Marker
                    key={place._id}
                    position={[place.location.coordinates.lat, place.location.coordinates.lng]}
                    icon={createIcon(cat.emoji)}
                  >
                    <Popup>
                      <Link to={`/place/${place.slug}`} className="block p-2">
                        <p className="font-semibold text-sm">{place.name}</p>
                        <p className="text-xs opacity-60 mt-0.5">{place.location.neighborhood}</p>
                      </Link>
                    </Popup>
                  </Marker>
                )
              })}
            </MapContainer>
          </div>
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <div className="px-4 pb-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <PlaceCardSkeleton key={i} />)}
            </div>
          ) : places.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🗺️</p>
              <p className="text-[var(--text-2)] text-sm font-medium">Nessun posto trovato</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {places.map((place, i) => (
                <PlaceCard key={place._id} place={place} index={i} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
