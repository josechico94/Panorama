import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { superAdminApi } from '@/lib/api'
import { getCategoryConfig, CATEGORIES as DEFAULT_CATS } from '@/types'

// ✅ Carica categorie custom da localStorage (sincronizzato con SACategories)
function useCategories() {
  try {
    const stored = localStorage.getItem('faf-custom-categories')
    return stored ? JSON.parse(stored) : DEFAULT_CATS
  } catch { return DEFAULT_CATS }
}
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, X, Search, Upload, Link, Loader, MapPin, Check, Store, ChevronRight, LayoutGrid, List } from 'lucide-react'
import { geocodeAddress } from '@/lib/geocode'
import { motion, AnimatePresence } from 'framer-motion'

const field = { width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'DM Sans,sans-serif' }
const selectStyle = { ...field as any, cursor: 'pointer', colorScheme: 'dark', backgroundColor: '#1a1a2e', color: '#f0ede8' }
const EMPTY = { name: '', city: 'bologna', category: 'eat', shortDescription: '', description: '', tags: '', 'location.address': '', 'location.neighborhood': '', 'location.coordinates.lat': '44.4949', 'location.coordinates.lng': '11.3426', 'contact.phone': '', 'contact.website': '', 'contact.instagram': '', priceRange: '2', coverImage: '' }

export default function SAPlaces() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('')
  const [activeStatus, setActiveStatus] = useState('')
  const [editPlace, setEditPlace] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card')
  const qc = useQueryClient()
  const categories = useCategories()

  const params: Record<string, any> = { limit: '100' }
  if (search) params.search = search
  if (activeCategory && activeCategory !== 'tutti') params.category = activeCategory
  if (activeStatus === 'true') params.active = 'true'
  else if (activeStatus === 'false') params.active = 'false'

  const { data, isLoading } = useQuery({
    queryKey: ['sa-places', search, activeCategory, activeStatus],
    queryFn: () => superAdminApi.listPlaces(params),
  })

  // Fetch venue owners to show gestore on cards
  const { data: ownersData } = useQuery({
    queryKey: ['sa-venue-owners-all'],
    queryFn: () => superAdminApi.listVenueOwners(),
  })
  const owners = ownersData?.data ?? []

  const deleteMutation = useMutation({
    mutationFn: superAdminApi.deletePlace,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sa-places'] }); setSelectedPlace(null) },
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      superAdminApi.updatePlace(id, { 'meta.active': active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sa-places'] }),
  })

  const places = data?.data ?? []

  const getOwner = (placeId: string) =>
    owners.find((o: any) => o.placeId?._id === placeId || o.placeId === placeId)

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 28, fontWeight: 700, color: 'var(--text)' }}>Luoghi</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 12, marginTop: 2 }}>{data?.total ?? 0} totali</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {/* View toggle */}
          <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 3, gap: 2 }}>
            {([{ id: 'card', icon: LayoutGrid }, { id: 'table', icon: List }] as const).map(({ id, icon: Icon }) => (
              <button key={id} onClick={() => setViewMode(id)} style={{
                width: 30, height: 30, borderRadius: 7, border: 'none', cursor: 'pointer',
                background: viewMode === id ? 'rgba(187,0,255,0.2)' : 'transparent',
                color: viewMode === id ? '#BB00FF' : 'var(--text-3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={14} />
              </button>
            ))}
          </div>
          <button onClick={() => { setEditPlace(null); setShowForm(true) }} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 12,
            background: 'linear-gradient(135deg,#BB00FF,#9000CC)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
          }}>
            <Plus size={14} /> Nuovo posto
          </button>
        </div>
      </div>

      {/* ── Search ── */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca per nome..."
          style={{ ...field, paddingLeft: 36 }} />
      </div>

      {/* ── Filters ── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={() => setActiveCategory('')} style={{
          padding: '5px 14px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700,
          background: activeCategory === '' ? '#f0ede8' : 'rgba(255,255,255,0.05)',
          color: activeCategory === '' ? '#07070f' : 'rgba(240,237,232,0.5)',
        }}>Tutti</button>
        {categories.map((cat: any) => (
          <button key={cat.id} onClick={() => setActiveCategory(activeCategory === cat.id ? '' : cat.id)} style={{
            padding: '5px 12px', borderRadius: 100, cursor: 'pointer', fontSize: 11, fontWeight: 700,
            border: `1px solid ${activeCategory === cat.id ? cat.color : 'transparent'}`,
            background: activeCategory === cat.id ? `${cat.color}20` : 'rgba(255,255,255,0.04)',
            color: activeCategory === cat.id ? cat.color : 'rgba(240,237,232,0.45)',
          }}>{cat.emoji} {cat.label}</button>
        ))}
        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)' }} />
        {[{ value: '', label: 'Tutti gli stati' }, { value: 'true', label: '✅ Attivi' }, { value: 'false', label: '👁 Nascosti' }].map(({ value, label }) => (
          <button key={value} onClick={() => setActiveStatus(value)} style={{
            padding: '5px 12px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700,
            background: activeStatus === value ? 'rgba(187,0,255,0.15)' : 'rgba(255,255,255,0.04)',
            color: activeStatus === value ? '#BB00FF' : 'rgba(240,237,232,0.45)',
          }}>{label}</button>
        ))}
        {(activeCategory || activeStatus) && (
          <button onClick={() => { setActiveCategory(''); setActiveStatus('') }} style={{
            padding: '5px 12px', borderRadius: 100, cursor: 'pointer', fontSize: 11, fontWeight: 700,
            border: '1px solid rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.08)', color: '#f87171',
          }}>✕ Rimuovi filtri</button>
        )}
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-3)' }}>Caricamento...</div>
      ) : viewMode === 'card' ? (
        // ── CARD VIEW ──
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {places.map((place: any) => {
            const cat = getCategoryConfig(place.category)
            const owner = getOwner(place._id)
            return (
              <motion.div
                key={place._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 18, overflow: 'hidden', cursor: 'pointer',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                }}
                onClick={() => setSelectedPlace(place)}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(187,0,255,0.3)'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(187,0,255,0.1)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.1)'
                }}
              >
                {/* Cover image */}
                <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: '#111' }}>
                  {place.media?.coverImage ? (
                    <img src={place.media.coverImage} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, background: `${cat.color}15` }}>
                      {cat.emoji}
                    </div>
                  )}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />

                  {/* Status badge */}
                  <div style={{ position: 'absolute', top: 10, right: 10 }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 100,
                      background: place.meta?.active ? 'rgba(34,197,94,0.9)' : 'rgba(0,0,0,0.7)',
                      color: place.meta?.active ? '#fff' : 'rgba(255,255,255,0.5)',
                      backdropFilter: 'blur(8px)',
                    }}>
                      {place.meta?.active ? '● Attivo' : '○ Nascosto'}
                    </span>
                  </div>

                  {/* Featured */}
                  {place.meta?.featured && (
                    <div style={{ position: 'absolute', top: 10, left: 10 }}>
                      <Star size={14} color="#f59e0b" fill="#f59e0b" />
                    </div>
                  )}

                  {/* Category pill */}
                  <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 100,
                      background: `${cat.color}CC`, color: '#fff',
                      backdropFilter: 'blur(8px)',
                    }}>
                      {cat.emoji} {cat.label}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: '14px 16px' }}>
                  <h3 style={{ color: 'var(--text)', fontSize: 14, fontWeight: 700, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {place.name}
                  </h3>
                  <p style={{ color: 'var(--text-3)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
                    <MapPin size={10} color="var(--accent)" />
                    {place.location?.neighborhood || place.location?.address || place.city}
                  </p>

                  {/* Gestore */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 10px', borderRadius: 10,
                    background: owner ? 'rgba(187,0,255,0.06)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${owner ? 'rgba(187,0,255,0.15)' : 'rgba(255,255,255,0.06)'}`,
                    marginBottom: 12,
                  }}>
                    <div style={{ width: 24, height: 24, borderRadius: 7, background: owner ? 'rgba(187,0,255,0.15)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Store size={11} color={owner ? '#BB00FF' : 'var(--text-3)'} />
                    </div>
                    <span style={{ fontSize: 11, color: owner ? '#BB00FF' : 'var(--text-3)', fontWeight: owner ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {owner ? owner.name : 'Nessun gestore assegnato'}
                    </span>
                  </div>

                  {/* Quick actions */}
                  <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => toggleMutation.mutate({ id: place._id, active: !place.meta?.active })}
                      style={{ flex: 1, padding: '7px', borderRadius: 9, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-3)', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                    >
                      {place.meta?.active ? <><EyeOff size={11} /> Nascondi</> : <><Eye size={11} /> Attiva</>}
                    </button>
                    <button
                      onClick={() => { setEditPlace(place); setShowForm(true) }}
                      style={{ flex: 1, padding: '7px', borderRadius: 9, border: '1px solid rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.08)', color: '#3b82f6', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                    >
                      <Pencil size={11} /> Modifica
                    </button>
                    <button
                      onClick={() => confirm(`Eliminare "${place.name}"?`) && deleteMutation.mutate(place._id)}
                      style={{ width: 32, padding: '7px', borderRadius: 9, border: '1px solid rgba(248,113,113,0.2)', background: 'rgba(248,113,113,0.06)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        // ── TABLE VIEW ──
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['', 'Nome', 'Categoria', 'Gestore', 'Stato', ''].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {places.map((place: any) => {
                const cat = getCategoryConfig(place.category)
                const owner = getOwner(place._id)
                return (
                  <tr key={place._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}
                    onClick={() => setSelectedPlace(place)}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '8px 16px' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', background: 'var(--surface)' }}>
                        {place.media?.coverImage
                          ? <img src={place.media.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{cat.emoji}</div>
                        }
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {place.meta?.featured && <Star size={11} color="#f59e0b" fill="#f59e0b" />}
                        <span style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600 }}>{place.name}</span>
                      </div>
                      <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{place.location?.neighborhood}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: cat.color, background: `${cat.color}18`, border: `1px solid ${cat.color}30`, borderRadius: 100, padding: '2px 8px' }}>
                        {cat.emoji} {cat.label}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 11, color: owner ? '#BB00FF' : 'var(--text-3)' }}>
                        {owner ? owner.name : '—'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 100, background: place.meta?.active ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)', color: place.meta?.active ? '#4ade80' : 'rgba(240,237,232,0.3)' }}>
                        {place.meta?.active ? 'Attivo' : 'Nascosto'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }} onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                        <button onClick={() => toggleMutation.mutate({ id: place._id, active: !place.meta?.active })} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--text-3)' }}>
                          {place.meta?.active ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button onClick={() => { setEditPlace(place); setShowForm(true) }} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: '#3b82f6' }}>
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => confirm(`Eliminare "${place.name}"?`) && deleteMutation.mutate(place._id)} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: '#f87171' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Place Detail Drawer ── */}
      <AnimatePresence>
        {selectedPlace && (
          <PlaceDrawer
            place={selectedPlace}
            owner={getOwner(selectedPlace._id)}
            onClose={() => setSelectedPlace(null)}
            onEdit={() => { setEditPlace(selectedPlace); setShowForm(true); setSelectedPlace(null) }}
            onToggle={() => toggleMutation.mutate({ id: selectedPlace._id, active: !selectedPlace.meta?.active })}
            onDelete={() => { if (confirm(`Eliminare "${selectedPlace.name}"?`)) deleteMutation.mutate(selectedPlace._id) }}
          />
        )}
      </AnimatePresence>

      {showForm && <PlaceFormModal place={editPlace} onClose={() => setShowForm(false)} />}
    </div>
  )
}

// ── Place Detail Drawer ──
function PlaceDrawer({ place, owner, onClose, onEdit, onToggle, onDelete }: any) {
  const cat = getCategoryConfig(place.category)
  const DAYS_IT: Record<string, string> = { monday:'Lun', tuesday:'Mar', wednesday:'Mer', thursday:'Gio', friday:'Ven', saturday:'Sab', sunday:'Dom' }
  const DAYS_ORDER = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 51, width: '100%', maxWidth: 480, background: '#0f0f1a', borderLeft: '1px solid var(--border)', overflowY: 'auto' }}
      >
        {/* Cover */}
        <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: '#111' }}>
          {place.media?.coverImage
            ? <img src={place.media.coverImage} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, background: `${cat.color}15` }}>{cat.emoji}</div>
          }
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)' }} />
          <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, width: 36, height: 36, borderRadius: 10, border: 'none', cursor: 'pointer', background: 'rgba(0,0,0,0.6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            <X size={16} />
          </button>
          <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: cat.color, background: `${cat.color}22`, border: `1px solid ${cat.color}40`, borderRadius: 100, padding: '3px 10px' }}>
              {cat.emoji} {cat.label}
            </span>
            <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 26, fontWeight: 700, color: '#fff', marginTop: 8, lineHeight: 1.1 }}>
              {place.name}
            </h2>
          </div>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onEdit} style={{ flex: 1, padding: '10px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#BB00FF,#9000CC)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Pencil size={13} /> Modifica
            </button>
            <button onClick={onToggle} style={{ flex: 1, padding: '10px', borderRadius: 12, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-2)', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {place.meta?.active ? <><EyeOff size={13} /> Nascondi</> : <><Eye size={13} /> Attiva</>}
            </button>
            <button onClick={onDelete} style={{ width: 42, padding: '10px', borderRadius: 12, border: '1px solid rgba(248,113,113,0.2)', background: 'rgba(248,113,113,0.06)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trash2 size={13} />
            </button>
          </div>

          {/* Status + featured */}
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 100, background: place.meta?.active ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)', color: place.meta?.active ? '#4ade80' : 'rgba(240,237,232,0.3)', border: `1px solid ${place.meta?.active ? 'rgba(34,197,94,0.25)' : 'transparent'}` }}>
              {place.meta?.active ? '● Attivo' : '○ Nascosto'}
            </span>
            {place.meta?.featured && (
              <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 100, background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Star size={10} fill="#f59e0b" /> In evidenza
              </span>
            )}
          </div>

          {/* Info rows */}
          {[
            { label: 'Indirizzo', value: place.location?.address },
            { label: 'Quartiere', value: place.location?.neighborhood },
            { label: 'Città', value: place.city },
            { label: 'Prezzo', value: ['', '€', '€€', '€€€', '€€€€'][place.priceRange] || '—' },
          ].filter(r => r.value).map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
              <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
              <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{value}</span>
            </div>
          ))}

          {/* Gestore */}
          <div style={{ padding: '14px 16px', background: owner ? 'rgba(187,0,255,0.06)' : 'var(--surface)', border: `1px solid ${owner ? 'rgba(187,0,255,0.2)' : 'var(--border)'}`, borderRadius: 14 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Gestore</p>
            {owner ? (
              <div>
                <p style={{ color: '#BB00FF', fontSize: 14, fontWeight: 700 }}>{owner.name}</p>
                <p style={{ color: 'var(--text-3)', fontSize: 12, marginTop: 3, fontFamily: 'DM Mono,monospace' }}>{owner.email}</p>
              </div>
            ) : (
              <p style={{ color: 'var(--text-3)', fontSize: 13 }}>Nessun gestore assegnato</p>
            )}
          </div>

          {/* Descrizione */}
          {place.shortDescription && (
            <div style={{ padding: '14px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Descrizione</p>
              <p style={{ color: 'var(--text-2)', fontSize: 13, lineHeight: 1.6 }}>{place.shortDescription}</p>
            </div>
          )}

          {/* Orari */}
          {place.hours && (
            <div style={{ padding: '14px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Orari</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {DAYS_ORDER.map(day => {
                  const s = place.hours[day]
                  const closed = !s || s.closed
                  return (
                    <div key={day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 600, width: 36 }}>{DAYS_IT[day]}</span>
                      <span style={{ fontSize: 12, fontFamily: 'DM Mono,monospace', color: closed ? 'var(--text-3)' : 'var(--text)' }}>
                        {closed ? 'Chiuso' : `${s.open} — ${s.close}`}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Contatti */}
          {(place.contact?.phone || place.contact?.website || place.contact?.instagram) && (
            <div style={{ padding: '14px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Contatti</p>
              {place.contact?.phone && <p style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 4 }}>📞 {place.contact.phone}</p>}
              {place.contact?.website && <p style={{ fontSize: 12, color: '#BB00FF', marginBottom: 4 }}>🌐 {place.contact.website}</p>}
              {place.contact?.instagram && <p style={{ fontSize: 12, color: '#BB00FF' }}>📸 @{place.contact.instagram}</p>}
            </div>
          )}

          {/* Tags */}
          {place.tags?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {place.tags.map((tag: string) => (
                <span key={tag} style={{ fontSize: 10, color: 'var(--text-3)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 100, padding: '3px 10px' }}>#{tag}</span>
              ))}
            </div>
          )}

          <div style={{ height: 20 }} />
        </div>
      </motion.div>
    </>
  )
}

function ActionBtn({ icon: Icon, onClick, color = 'rgba(240,237,232,0.35)' }: any) {
  return (
    <button onClick={onClick} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color, transition: 'all 0.15s' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
      <Icon size={14} />
    </button>
  )
}

function ImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url')
  const [urlInput, setUrlInput] = useState(value || '')
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { setError('File troppo grande (max 10MB)'); return }
    setUploading(true); setError('')
    try {
      const { url } = await superAdminApi.upload(file)
      onChange(url); setUrlInput(url)
    } catch { setError('Upload fallito. Riprova o usa un URL.') }
    finally { setUploading(false) }
  }

  const handleUrlConfirm = () => {
    if (urlInput.startsWith('http')) onChange(urlInput)
    else setError('URL non valido — deve iniziare con https://')
  }

  return (
    <div>
      <label style={{ display: 'block', fontSize: 10, color: 'var(--meta-color)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Immagine copertina</label>
      {value && (
        <div style={{ position: 'relative', marginBottom: 10, borderRadius: 12, overflow: 'hidden', height: 140 }}>
          <img src={value} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <button onClick={() => { onChange(''); setUrlInput('') }} style={{ position: 'absolute', top: 8, right: 8, width: 26, height: 26, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(0,0,0,0.7)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={13} />
          </button>
        </div>
      )}
      <div style={{ display: 'flex', gap: 4, marginBottom: 8, background: 'var(--surface)', padding: 3, borderRadius: 8 }}>
        {(['url', 'file'] as const).map(m => (
          <button key={m} onClick={() => { setUploadMode(m); setError('') }} style={{ flex: 1, padding: '6px', borderRadius: 6, border: 'none', cursor: 'pointer', background: uploadMode === m ? 'rgba(187,0,255,0.2)' : 'transparent', color: uploadMode === m ? '#BB00FF' : 'rgba(240,237,232,0.4)', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            {m === 'url' ? <><Link size={11} /> URL</> : <><Upload size={11} /> Carica file</>}
          </button>
        ))}
      </div>
      {uploadMode === 'url' ? (
        <div style={{ display: 'flex', gap: 6 }}>
          <input value={urlInput} onChange={e => setUrlInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleUrlConfirm()} placeholder="https://images.unsplash.com/..." style={{ ...field, flex: 1 }} onFocus={e => (e.target.style.borderColor = '#BB00FF')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          <button onClick={handleUrlConfirm} style={{ padding: '0 14px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'rgba(187,0,255,0.2)', color: '#BB00FF', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>OK</button>
        </div>
      ) : (
        <div>
          <input ref={fileRef} type="file" accept="image/*,image/gif" onChange={handleFile} style={{ display: 'none' }} />
          <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ width: '100%', padding: '12px', borderRadius: 10, border: '2px dashed rgba(187,0,255,0.3)', background: 'rgba(187,0,255,0.05)', color: uploading ? '#BB00FF' : 'rgba(240,237,232,0.5)', cursor: uploading ? 'default' : 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            onMouseEnter={e => !uploading && ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(187,0,255,0.6)')}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(187,0,255,0.3)'}>
            {uploading ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Caricamento...</> : <><Upload size={14} /> Clicca per caricare (JPG, PNG, GIF — max 10MB)</>}
          </button>
        </div>
      )}
      {error && <p style={{ color: '#f87171', fontSize: 11, marginTop: 5 }}>{error}</p>}
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

function AddressField({ value, city, onChange, onGeocode }: { value: string; city: string; onChange: (v: string) => void; onGeocode: (lat: number, lng: number) => void }) {
  const [geocoding, setGeocoding] = useState(false)
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')

  const handleGeocode = async () => {
    if (!value.trim()) return
    setGeocoding(true); setStatus('idle')
    const coords = await geocodeAddress(value, city)
    setGeocoding(false)
    if (coords) { onGeocode(coords.lat, coords.lng); setStatus('ok'); setTimeout(() => setStatus('idle'), 2000) }
    else { setStatus('error'); setTimeout(() => setStatus('idle'), 3000) }
  }

  return (
    <div>
      <label style={{ display: 'block', fontSize: 10, color: 'var(--meta-color)', marginBottom: 5, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>Indirizzo</label>
      <div style={{ display: 'flex', gap: 6 }}>
        <input value={value} onChange={e => { onChange(e.target.value); setStatus('idle') }} placeholder="Via Roma 1, Bologna" style={{ ...field, flex: 1 }}
          onFocus={e => (e.target.style.borderColor = '#BB00FF')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} onKeyDown={e => e.key === 'Enter' && handleGeocode()} />
        <button onClick={handleGeocode} disabled={geocoding || !value.trim()} style={{ padding: '0 12px', borderRadius: 10, border: 'none', cursor: 'pointer', flexShrink: 0, background: status === 'ok' ? 'rgba(34,197,94,0.2)' : status === 'error' ? 'rgba(248,113,113,0.15)' : 'rgba(187,0,255,0.15)', color: status === 'ok' ? '#4ade80' : status === 'error' ? '#f87171' : '#BB00FF', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, opacity: geocoding || !value.trim() ? 0.5 : 1 }}>
          {geocoding ? <Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> : status === 'ok' ? <><Check size={13} /> OK</> : status === 'error' ? <>✗ Non trovato</> : <><MapPin size={13} /> Geocodifica</>}
        </button>
      </div>
      {status === 'error' && <p style={{ fontSize: 10, color: '#f87171', marginTop: 4 }}>Indirizzo non trovato. Verifica e riprova.</p>}
      {status === 'ok' && <p style={{ fontSize: 10, color: '#4ade80', marginTop: 4 }}>✓ Coordinate aggiornate automaticamente</p>}
    </div>
  )
}

function PlaceFormModal({ place, onClose }: { place: any; onClose: () => void }) {
  const qc = useQueryClient()
  const isEdit = !!place
  const coordsRef = useRef<{ lat: string; lng: string } | null>(null)
  const [form, setForm] = useState<any>(place ? {
    name: place.name, city: place.city, category: place.category,
    shortDescription: place.shortDescription || '', description: place.description || '',
    tags: (place.tags || []).join(', '),
    'location.address': place.location?.address || '',
    'location.neighborhood': place.location?.neighborhood || '',
    'location.coordinates.lat': String(place.location?.coordinates?.lat || 44.4949),
    'location.coordinates.lng': String(place.location?.coordinates?.lng || 11.3426),
    'contact.phone': place.contact?.phone || '',
    'contact.website': place.contact?.website || '',
    'contact.instagram': place.contact?.instagram || '',
    priceRange: String(place.priceRange || 2),
    coverImage: place.media?.coverImage || '',
  } : { ...EMPTY })

  const categories = useCategories()
  const [error, setError] = useState('')
  const set = (k: string, v: string) => setForm((f: any) => ({ ...f, [k]: v }))

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        name: form.name, city: form.city, category: form.category,
        shortDescription: form.shortDescription, description: form.description,
        tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
        location: { address: form['location.address'], neighborhood: form['location.neighborhood'], coordinates: { lat: parseFloat(coordsRef.current?.lat ?? form['location.coordinates.lat']), lng: parseFloat(coordsRef.current?.lng ?? form['location.coordinates.lng']) } },
        contact: { phone: form['contact.phone'] || undefined, website: form['contact.website'] || undefined, instagram: form['contact.instagram'] || undefined },
        priceRange: parseInt(form.priceRange),
        media: { coverImage: form.coverImage || '', gallery: place?.media?.gallery || [] },
      }
      return isEdit ? superAdminApi.updatePlace(place._id, payload) : superAdminApi.createPlace(payload)
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sa-places'] }); onClose() },
    onError: (e: any) => setError(e.response?.data?.error || 'Errore'),
  })

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={onClose}>
      <div style={{ background: '#0f0f1a', border: '1px solid var(--border)', borderRadius: 20, padding: 24, width: '100%', maxWidth: 580, maxHeight: '88vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ color: 'var(--text)', fontSize: 18, fontWeight: 700 }}>{isEdit ? 'Modifica' : 'Nuovo'} posto</h2>
          <button onClick={onClose} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'var(--surface)', color: 'var(--text-2)' }}><X size={16} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <ImageUploader value={form.coverImage} onChange={url => set('coverImage', url)} />
          <AddressField value={form['location.address'] || ''} city={form.city || 'bologna'} onChange={v => set('location.address', v)}
            onGeocode={(lat, lng) => { const latStr = String(lat.toFixed(6)); const lngStr = String(lng.toFixed(6)); coordsRef.current = { lat: latStr, lng: lngStr }; setForm((f: any) => ({ ...f, 'location.coordinates.lat': latStr, 'location.coordinates.lng': lngStr })) }} />
          {form['location.coordinates.lat'] !== '44.4949' && (
            <div style={{ padding: '8px 12px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={11} color="#4ade80" />
              <span style={{ fontSize: 11, color: 'var(--text-2)', fontFamily: 'DM Mono,monospace' }}>{parseFloat(form['location.coordinates.lat']).toFixed(4)}, {parseFloat(form['location.coordinates.lng']).toFixed(4)}</span>
            </div>
          )}
          {[
            { k: 'name', label: 'Nome *', ph: 'Nome del posto' },
            { k: 'shortDescription', label: 'Descrizione breve', ph: 'Max 160 caratteri' },
            { k: 'tags', label: 'Tag (virgola)', ph: 'aperitivo, vista, centro' },
            { k: 'location.neighborhood', label: 'Quartiere', ph: 'Centro Storico' },
            { k: 'contact.phone', label: 'Telefono *', ph: '+39 051...' },
            { k: 'contact.website', label: 'Sito web', ph: 'https://...' },
            { k: 'contact.instagram', label: 'Instagram', ph: 'handle senza @' },
          ].map(({ k, label, ph }) => (
            <div key={k}>
              <label style={{ display: 'block', fontSize: 10, color: 'var(--meta-color)', marginBottom: 5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</label>
              <input value={form[k] || ''} onChange={e => set(k, e.target.value)} placeholder={ph} style={field}
                onFocus={e => (e.target.style.borderColor = '#BB00FF')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, color: 'var(--meta-color)', marginBottom: 5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Categoria</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} style={selectStyle}>
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, color: 'var(--meta-color)', marginBottom: 5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Prezzo</label>
              <select value={form.priceRange} onChange={e => set('priceRange', e.target.value)} style={selectStyle}>
                <option value="1">€ Economico</option>
                <option value="2">€€ Medio</option>
                <option value="3">€€€ Alto</option>
                <option value="4">€€€€ Luxury</option>
              </select>
            </div>
          </div>
          {error && <p style={{ color: '#f87171', fontSize: 12, textAlign: 'center', background: 'rgba(248,113,113,0.1)', borderRadius: 8, padding: '8px 12px' }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-2)', cursor: 'pointer', fontSize: 13 }}>Annulla</button>
            {(!form.name || !form['location.address'] || !form['contact.phone']) && (
              <p style={{ fontSize: 11, color: '#fbbf24', background: 'rgba(251,191,36,0.08)', borderRadius: 8, padding: '7px 12px', textAlign: 'center' }}>⚠ Nome, indirizzo e telefono sono obbligatori</p>
            )}
            <button onClick={() => mutation.mutate()} disabled={mutation.isPending || !form.name || !form['location.address'] || !form['contact.phone']}
              style={{ flex: 1, padding: '11px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#BB00FF,#9000CC)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, opacity: mutation.isPending || !form.name || !form['location.address'] || !form['contact.phone'] ? 0.5 : 1 }}>
              {mutation.isPending ? 'Salvataggio...' : isEdit ? 'Salva' : 'Crea'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
