import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { List, Map as MapIcon, Navigation, X, Search, Loader } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { placesApi } from '@/lib/api'
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
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null)
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState('')
  const [nearbyMode, setNearbyMode] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const { activeCategory, city, searchQuery, setSearchQuery } = useAppStore()
  const navigate = useNavigate()

  const params: Record<string, string> = { city, limit: '50' }
  if (activeCategory) params.category = activeCategory
  if (searchQuery) params.search = searchQuery

  const { data, isLoading } = useQuery({
    queryKey: ['explore', city, activeCategory, searchQuery],
    queryFn: () => placesApi.list(params),
  })

  const allPlaces: Place[] = data?.data ?? []

  // ── Sort by distance when nearby mode ──
  const places = nearbyMode && userPos
    ? [...allPlaces]
        .filter(p => p.location?.coordinates?.lat && p.location?.coordinates?.lng)
        .map(p => ({ ...p, _dist: distance(userPos.lat, userPos.lng, p.location.coordinates.lat, p.location.coordinates.lng) }))
        .sort((a: any, b: any) => a._dist - b._dist)
        .slice(0, 20) as Place[]
    : allPlaces

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

  // ── Search autocomplete ──
  const { data: searchData } = useQuery({
    queryKey: ['search-suggest', searchInput],
    queryFn: () => placesApi.list({ city, search: searchInput, limit: '6' }),
    enabled: searchInput.length >= 2,
  })
  const suggestions: Place[] = searchData?.data ?? []

  const handleSearchSelect = (place: Place) => {
    setSearchOpen(false)
    setSearchInput('')
    navigate(`/place/${place.slug}`)
  }

  const handleSearchSubmit = () => {
    if (!searchInput.trim()) return
    setSearchQuery(searchInput)
    setSearchOpen(false)
    setSearchInput('')
  }

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 100)
  }, [searchOpen])

  return (
    <div style={{ maxWidth: 672, margin: '0 auto' }}>

      {/* ── Header ── */}
      <div style={{ padding: '24px 16px 16px' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="accent-line" />
              <span style={{ fontFamily: 'DM Mono', fontSize: 9, color: 'var(--meta-color)', letterSpacing: '0.28em', textTransform: 'uppercase' }}>Scopri</span>
            </div>
            <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 'clamp(30px,8vw,42px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>
              Esplora
            </h1>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* Search */}
            <button onClick={() => setSearchOpen(true)} style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-3)', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as any).style.borderColor = 'var(--accent)'; (e.currentTarget as any).style.color = 'var(--accent)' }}
              onMouseLeave={e => { (e.currentTarget as any).style.borderColor = 'var(--border)'; (e.currentTarget as any).style.color = 'var(--text-3)' }}>
              <Search size={14} />
            </button>

            {/* Nearby */}
            <button onClick={handleNearby} title="Vicino a me"
              style={{ width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', transition: 'all 0.2s', background: nearbyMode ? 'linear-gradient(135deg,#BB00FF,#9000CC)' : 'var(--surface)', color: nearbyMode ? '#fff' : 'var(--text-3)', boxShadow: nearbyMode ? '0 2px 12px rgba(187,0,255,0.4)' : 'none', outline: nearbyMode ? 'none' : '1px solid var(--border)' }}>
              {geoLoading ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Navigation size={14} />}
            </button>

            {/* View toggle */}
            <div style={{ display: 'flex', gap: 3, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 3 }}>
              {([{ id: 'list', icon: List, label: 'Lista' }, { id: 'map', icon: MapIcon, label: 'Mappa' }] as const).map(({ id, icon: Icon, label }) => (
                <button key={id} onClick={() => setView(id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600, background: view === id ? 'linear-gradient(135deg,#BB00FF,#9000CC)' : 'transparent', color: view === id ? '#fff' : 'var(--meta-color)', transition: 'all 0.2s' }}>
                  <Icon size={12} /> {label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <CategoryFilter />
      </div>

      {/* ── Search overlay ── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(7,7,15,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={e => { if (e.target === e.currentTarget) setSearchOpen(false) }}>
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
              style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '16px' }}>
              <div style={{ maxWidth: 640, margin: '0 auto' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }} />
                    <input ref={searchRef} value={searchInput} onChange={e => setSearchInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSearchSubmit()}
                      placeholder="Cerca locali, categorie, quartieri..."
                      style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: 13, background: 'var(--surface)', border: '1.5px solid rgba(187,0,255,0.3)', color: 'var(--text)', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'DM Sans' }} />
                  </div>
                  <button onClick={() => setSearchOpen(false)} style={{ width: 38, height: 38, borderRadius: 10, border: 'none', background: 'var(--surface)', color: 'var(--text-3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <X size={16} />
                  </button>
                </div>

                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {suggestions.map(place => {
                      const cat = getCategoryConfig(place.category)
                      return (
                        <button key={place._id} onClick={() => handleSearchSelect(place)}
                          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 12, border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s', width: '100%' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(187,0,255,0.08)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: 'var(--bg3)' }}>
                            {place.media?.coverImage
                              ? <img src={place.media.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{cat.emoji}</div>}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ color: 'var(--text)', fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{place.name}</p>
                            <p style={{ color: 'var(--meta-color)', fontSize: 10, marginTop: 2 }}>{cat.emoji} {cat.label} · {place.location?.neighborhood}</p>
                          </div>
                          {place.isOpenNow && <span style={{ fontSize: 9, color: '#4ade80', fontWeight: 700, flexShrink: 0 }}>Aperto</span>}
                        </button>
                      )
                    })}
                  </div>
                )}

                {searchInput.length >= 2 && suggestions.length === 0 && (
                  <p style={{ color: 'var(--text-3)', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>Nessun risultato per "{searchInput}"</p>
                )}

                {searchInput.length < 2 && (
                  <p style={{ color: 'var(--text-3)', fontSize: 12, textAlign: 'center', padding: '16px 0' }}>Scrivi almeno 2 caratteri per cercare</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Geo error ── */}
      <AnimatePresence>
        {geoError && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ margin: '0 16px 12px', padding: '10px 14px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#f87171', fontSize: 12 }}>{geoError}</span>
            <button onClick={() => setGeoError('')} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}><X size={12} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Nearby banner ── */}
      <AnimatePresence>
        {nearbyMode && userPos && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ margin: '0 16px 12px', padding: '10px 14px', background: 'rgba(187,0,255,0.08)', border: '1px solid rgba(187,0,255,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#BB00FF', fontSize: 12, fontWeight: 700 }}>
              <Navigation size={13} /> Mostrando {places.length} locali vicino a te
            </span>
            <button onClick={() => setNearbyMode(false)} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer' }}><X size={12} /></button>
          </motion.div>
        )}
      </AnimatePresence>

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
        <div style={{ padding: '0 16px 32px' }}>
          <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)', height: '62vh', boxShadow: 'var(--shadow-md)' }}>
            <MapContainer center={[44.4949, 11.3426]} zoom={14} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='© OpenStreetMap © CARTO'
              />
              {/* Recenter when nearby mode */}
              {nearbyMode && userPos && <MapRecenter lat={userPos.lat} lng={userPos.lng} zoom={15} />}

              {/* User position */}
              {userPos && (
                <>
                  <Marker position={[userPos.lat, userPos.lng]} icon={userIcon} />
                  <Circle center={[userPos.lat, userPos.lng]} radius={500}
                    pathOptions={{ color: '#BB00FF', fillColor: '#BB00FF', fillOpacity: 0.06, weight: 1.5, dashArray: '4 4' }} />
                </>
              )}

              {/* Place markers */}
              {places.map((place: any) => {
                const cat = getCategoryConfig(place.category)
                const dist = userPos ? distance(userPos.lat, userPos.lng, place.location.coordinates.lat, place.location.coordinates.lng) : null
                return (
                  <Marker key={place._id}
                    position={[place.location.coordinates.lat, place.location.coordinates.lng]}
                    icon={createIcon(cat.emoji)}>
                    <Popup>
                      <Link to={`/place/${place.slug}`} style={{ textDecoration: 'none', display: 'block', minWidth: 160 }}>
                        <div style={{ padding: '6px 2px' }}>
                          <p style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 15, fontWeight: 700, color: '#1A0033', marginBottom: 3 }}>
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
                      <div style={{ width: 130, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(187,0,255,0.3)')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                        <div style={{ height: 64, position: 'relative', overflow: 'hidden' }}>
                          <img src={place.media?.coverImage || ''} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div className="absolute inset-0 card-overlay" />
                          <span style={{ position: 'absolute', bottom: 5, left: 7, fontSize: 14 }}>{cat.emoji}</span>
                          {dist && <span style={{ position: 'absolute', top: 5, right: 5, fontSize: 8, fontWeight: 800, color: '#fff', background: 'rgba(187,0,255,0.8)', borderRadius: 4, padding: '1px 4px', fontFamily: 'DM Mono' }}>{formatDist(dist)}</span>}
                        </div>
                        <div style={{ padding: '8px 9px' }}>
                          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{place.name}</p>
                          <p style={{ fontSize: 9, color: 'var(--meta-color)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{place.location?.neighborhood}</p>
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
