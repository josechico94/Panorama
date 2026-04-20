import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { List, Map as MapIcon, Navigation, X, Loader } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { placesApi } from '@/lib/api'
import { useThemeStore } from '@/components/ui/ThemeToggle'
import { useAppStore } from '@/store'
import CategoryFilter from '@/components/places/CategoryFilter'
import PlaceCard from '@/components/places/PlaceCard'
import PlaceCardSkeleton from '@/components/ui/PlaceCardSkeleton'
import { getCategoryConfig } from '@/types'
import type { Place } from '@/types'

// ── Haversine distance (km) ──
function distance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

function formatDist(km: number) {
  return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`
}

// ── Map recenter helper ──
function MapRecenter({ lat, lng, zoom = 15 }: { lat: number; lng: number; zoom?: number }) {
  const map = useMap()
  useEffect(() => { map.setView([lat, lng], zoom) }, [lat, lng])
  return null
}

const createIcon = (emoji: string, highlight = false) =>
  L.divIcon({
    html: `<div style="font-size:${highlight ? 26 : 22}px;line-height:1;filter:drop-shadow(0 2px 8px rgba(0,0,0,0.8));cursor:pointer;transition:transform 0.2s">${emoji}</div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })

const userIcon = L.divIcon({
  html: `<div style="width:16px;height:16px;border-radius:50%;background:#BB00FF;border:3px solid #fff;box-shadow:0 0 12px rgba(187,0,255,0.8)"></div>`,
  className: '',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

export default function ExplorePage() {
  const [view, setView] = useState<'list' | 'map'>('list')
  const [activeNeighborhood, setActiveNeighborhood] = useState<string>('')
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null)
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState('')
  const [nearbyMode, setNearbyMode] = useState(false)
  const { activeCategory, city, searchQuery } = useAppStore()
  const { theme } = useThemeStore()

  const params: Record<string, string> = { city, limit: '50' }
  if (activeCategory) params.category = activeCategory
  if (searchQuery) params.search = searchQuery

  const { data, isLoading } = useQuery({
    queryKey: ['explore', city, activeCategory, searchQuery],
    queryFn: () => placesApi.list(params),
  })

  const allPlaces: Place[] = data?.data ?? []

  // ✅ Deduplicazione case-insensitive dei quartieri
  const neighborhoods = Array.from(
    allPlaces
      .map(p => p.location?.neighborhood?.trim())
      .filter(Boolean)
      .reduce((map, n) => {
        const key = n!.toLowerCase()
        if (!map.has(key)) map.set(key, n!)
        return map
      }, new Map<string, string>())
      .values()
  ).sort() as string[]

  // ── Filter by neighborhood ──
  const filteredByNeighborhood = activeNeighborhood
    ? allPlaces.filter(p => p.location?.neighborhood?.toLowerCase() === activeNeighborhood.toLowerCase())
    : allPlaces

  // ── Sort by distance when nearby mode ──
  const places = nearbyMode && userPos
    ? [...filteredByNeighborhood]
        .filter(p => p.location?.coordinates?.lat && p.location?.coordinates?.lng)
        .map(p => ({ ...p, _dist: distance(userPos.lat, userPos.lng, p.location.coordinates.lat, p.location.coordinates.lng) }))
        .sort((a: any, b: any) => a._dist - b._dist)
        .slice(0, 20) as Place[]
    : filteredByNeighborhood

  // ── Geolocation ──
  const handleNearby = () => {
    if (nearbyMode) { setNearbyMode(false); return }
    if (userPos) { setNearbyMode(true); setView('map'); return }
    if (!navigator.geolocation) { setGeoError('Geolocalizzazione non supportata'); return }
    setGeoLoading(true)
    setGeoError('')
    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setNearbyMode(true)
        setView('map')
        setGeoLoading(false)
      },
      () => {
        setGeoError('Impossibile ottenere la posizione')
        setGeoLoading(false)
      },
      { timeout: 8000, maximumAge: 60000 }
    )
  }

  return (
    <div style={{ maxWidth: 672, margin: '0 auto' }}>

      {/* ── Header ── */}
      <div style={{ padding: '24px 16px 16px' }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="accent-line" />
              <span style={{ fontFamily: 'DM Mono', fontSize: 9, color: 'var(--meta-color)', letterSpacing: '0.28em', textTransform: 'uppercase' }}>
                Scopri
              </span>
            </div>
            <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 'clamp(30px,8vw,42px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>
              Esplora
            </h1>
          </div>

          {/* ── Controls (senza lupita — ora è nel TopBar) ── */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>

            {/* Nearby */}
            <button
              onClick={handleNearby}
              title="Vicino a me"
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: 'none',
                transition: 'all 0.2s',
                background: nearbyMode ? 'linear-gradient(135deg,#BB00FF,#9000CC)' : 'var(--surface)',
                color: nearbyMode ? '#fff' : 'var(--text-3)',
                boxShadow: nearbyMode ? '0 2px 12px rgba(187,0,255,0.4)' : 'none',
                outline: nearbyMode ? 'none' : '1px solid var(--border)',
              }}
            >
              {geoLoading
                ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
                : <Navigation size={14} />
              }
            </button>

            {/* View toggle Lista / Mappa */}
            <div style={{ display: 'flex', gap: 3, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 3 }}>
              {([
                { id: 'list', icon: List, label: 'Lista' },
                { id: 'map', icon: MapIcon, label: 'Mappa' },
              ] as const).map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setView(id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '6px 12px',
                    borderRadius: 9,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 11,
                    fontWeight: 600,
                    background: view === id ? 'linear-gradient(135deg,#BB00FF,#9000CC)' : 'transparent',
                    color: view === id ? '#fff' : 'var(--meta-color)',
                    transition: 'all 0.2s',
                  }}
                >
                  <Icon size={12} /> {label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <CategoryFilter />

        {/* ── Neighborhood filter ── */}
        {neighborhoods.length > 0 && (
          <div style={{ marginTop: 10, display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }} className="no-scrollbar">
            <button
              onClick={() => setActiveNeighborhood('')}
              style={{
                flexShrink: 0, padding: '5px 12px', borderRadius: 20,
                border: `1px solid ${activeNeighborhood === '' ? '#BB00FF' : 'var(--border)'}`,
                background: activeNeighborhood === '' ? 'rgba(187,0,255,0.12)' : 'transparent',
                color: activeNeighborhood === '' ? '#BB00FF' : 'var(--text-3)',
                fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              📍 Tutti i quartieri
            </button>
            {neighborhoods.map(n => (
              <button
                key={n}
                onClick={() => setActiveNeighborhood(n === activeNeighborhood ? '' : n)}
                style={{
                  flexShrink: 0, padding: '5px 12px', borderRadius: 20,
                  border: `1px solid ${activeNeighborhood === n ? '#BB00FF' : 'var(--border)'}`,
                  background: activeNeighborhood === n ? 'rgba(187,0,255,0.12)' : 'var(--surface)',
                  color: activeNeighborhood === n ? '#BB00FF' : 'var(--text-3)',
                  fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Geo error ── */}
      <AnimatePresence>
        {geoError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ margin: '0 16px 12px', padding: '10px 14px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <span style={{ color: '#f87171', fontSize: 12 }}>{geoError}</span>
            <button onClick={() => setGeoError('')} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}>
              <X size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Nearby banner ── */}
      <AnimatePresence>
        {nearbyMode && userPos && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ margin: '0 16px 12px', padding: '10px 14px', background: 'rgba(187,0,255,0.08)', border: '1px solid rgba(187,0,255,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#BB00FF', fontSize: 12, fontWeight: 700 }}>
              <Navigation size={13} /> Mostrando {places.length} locali vicino a te
            </span>
            <button onClick={() => setNearbyMode(false)} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}>
              <X size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Neighborhood active banner ── */}
      {activeNeighborhood && (
        <div style={{ margin: '0 16px 10px', padding: '8px 14px', background: 'rgba(187,0,255,0.08)', border: '1px solid rgba(187,0,255,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: '#BB00FF', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            📍 {activeNeighborhood}
          </span>
          <button onClick={() => setActiveNeighborhood('')} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: 11 }}>
            Rimuovi ✕
          </button>
        </div>
      )}

      {/* ── Results count ── */}
      <div style={{ padding: '0 16px 14px' }}>
        <p style={{ fontFamily: 'DM Mono', fontSize: 9, color: 'var(--meta-color)', letterSpacing: '0.22em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,transparent,rgba(187,0,255,0.2))' }} />
          {isLoading ? 'Caricamento...' : `${places.length} luoghi`}
          <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,rgba(187,0,255,0.2),transparent)' }} />
        </p>
      </div>

      {/* ── MAP VIEW ── */}
      {view === 'map' && (
        <div style={{ padding: '0 16px 16px', paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}>
          <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)', height: 'calc(100vh - 280px)', maxHeight: '60vh', boxShadow: 'var(--shadow-md)' }}>
            <MapContainer center={[44.4949, 11.3426]} zoom={14} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url={theme === 'dark'
                  ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                }
                attribution='© OpenStreetMap © CARTO'
              />
              {nearbyMode && userPos && <MapRecenter lat={userPos.lat} lng={userPos.lng} zoom={15} />}

              {userPos && (
                <>
                  <Marker position={[userPos.lat, userPos.lng]} icon={userIcon} />
                  <Circle
                    center={[userPos.lat, userPos.lng]}
                    radius={500}
                    pathOptions={{ color: '#BB00FF', fillColor: '#BB00FF', fillOpacity: 0.06, weight: 1.5, dashArray: '4 4' }}
                  />
                </>
              )}

              {places.map((place: any) => {
                const cat = getCategoryConfig(place.category)
                const dist = userPos ? distance(userPos.lat, userPos.lng, place.location.coordinates.lat, place.location.coordinates.lng) : null
                return (
                  <Marker
                    key={place._id}
                    position={[place.location.coordinates.lat, place.location.coordinates.lng]}
                    icon={createIcon(cat.emoji)}
                  >
                    <Popup>
                      <Link to={`/place/${place.slug}`} style={{ textDecoration: 'none', display: 'block', minWidth: 160 }}>
                        <div style={{ padding: '6px 2px' }}>
                          <p style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 18, fontWeight: 700, color: '#00a745', marginBottom: 3 }}>
                            {place.name}
                          </p>
                          <p style={{ fontSize: 10, color: '#8B5BA0', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color, display: 'inline-block' }} />
                            {place.location.neighborhood || place.location.address}
                            {dist && <span style={{ marginLeft: 4, color: '#BB00FF', fontWeight: 700 }}>· {formatDist(dist)}</span>}
                          </p>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: 10, fontWeight: 700, color: '#BB00FF' }}>
                            Vedi dettagli →
                          </span>
                        </div>
                      </Link>
                    </Popup>
                  </Marker>
                )
              })}
            </MapContainer>
          </div>

          {/* Mini scroll list */}
          {places.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <p style={{ fontFamily: 'DM Mono', fontSize: 9, color: 'var(--meta-color)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>
                {places.length} luoghi in questa area
              </p>
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }} className="no-scrollbar">
                {places.slice(0, 10).map((place: any) => {
                  const cat = getCategoryConfig(place.category)
                  const dist = userPos ? distance(userPos.lat, userPos.lng, place.location.coordinates.lat, place.location.coordinates.lng) : null
                  return (
                    <Link key={place._id} to={`/place/${place.slug}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
                      <div
                        style={{ width: 130, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(187,0,255,0.3)')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                      >
                        <div style={{ height: 64, position: 'relative', overflow: 'hidden' }}>
                          <img src={place.media?.coverImage || ''} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div className="absolute inset-0 card-overlay" />
                          <span style={{ position: 'absolute', bottom: 5, left: 7, fontSize: 14 }}>{cat.emoji}</span>
                          {dist && (
                            <span style={{ position: 'absolute', top: 5, right: 5, fontSize: 8, fontWeight: 800, color: '#fff', background: 'rgba(187,0,255,0.8)', borderRadius: 4, padding: '1px 4px', fontFamily: 'DM Mono' }}>
                              {formatDist(dist)}
                            </span>
                          )}
                        </div>
                        <div style={{ padding: '8px 9px' }}>
                          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {place.name}
                          </p>
                          <p style={{ fontSize: 9, color: 'var(--meta-color)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {place.location?.neighborhood}
                          </p>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── LIST VIEW ── */}
      {view === 'list' && (
        <div style={{ padding: '0 16px 32px' }}>
          {isLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {Array.from({ length: 6 }).map((_, i) => <PlaceCardSkeleton key={i} />)}
            </div>
          ) : places.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 20px' }}>
              <p style={{ fontSize: 40, marginBottom: 12 }}>🗺️</p>
              <p style={{ color: 'var(--text)', fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Nessun posto trovato</p>
              <p style={{ color: 'var(--meta-color)', fontSize: 13 }}>Prova a cambiare categoria o ricerca</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {places.map((place: any, i: number) => (
                <motion.div key={place._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <PlaceCard place={place} index={i} />
                  {nearbyMode && userPos && (place as any)._dist !== undefined && (
                    <div style={{ marginTop: 4, paddingLeft: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Navigation size={10} color="var(--accent)" />
                      <span style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 700, fontFamily: 'DM Mono' }}>
                        {formatDist((place as any)._dist)}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
