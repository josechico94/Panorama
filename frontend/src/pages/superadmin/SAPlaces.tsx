import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { superAdminApi } from '@/lib/api'
import { getCategoryConfig, CATEGORIES } from '@/types'
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, X, Search, Upload, Link, Loader, MapPin, Check } from 'lucide-react'
import { geocodeAddress } from '@/lib/geocode'

const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 }
const field = { width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f0ede8', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'DM Sans,sans-serif' }
const EMPTY = { name: '', city: 'bologna', category: 'eat', shortDescription: '', description: '', tags: '', 'location.address': '', 'location.neighborhood': '', 'location.coordinates.lat': '44.4949', 'location.coordinates.lng': '11.3426', 'contact.phone': '', 'contact.website': '', 'contact.instagram': '', priceRange: '2', coverImage: '' }

export default function SAPlaces() {
  const [search, setSearch] = useState('')
  const [editPlace, setEditPlace] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['sa-places', search],
    queryFn: () => superAdminApi.listPlaces(search ? { search } : undefined),
  })

  const deleteMutation = useMutation({
    mutationFn: superAdminApi.deletePlace,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sa-places'] }),
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      superAdminApi.updatePlace(id, { 'meta.active': active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sa-places'] }),
  })

  const places = data?.data ?? []

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 28, fontWeight: 700, color: '#f0ede8' }}>Luoghi</h1>
          <p style={{ color: 'rgba(240,237,232,0.35)', fontSize: 12, marginTop: 2 }}>{data?.total ?? 0} totali</p>
        </div>
        <button onClick={() => { setEditPlace(null); setShowForm(true) }} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 12,
          background: 'linear-gradient(135deg,#e8622a,#f0884a)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
        }}>
          <Plus size={14} /> Nuovo posto
        </button>
      </div>

      <div style={{ position: 'relative', marginBottom: 16 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,237,232,0.3)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca per nome..."
          style={{ ...field, paddingLeft: 36 }} />
      </div>

      <div style={{ ...card, overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'rgba(240,237,232,0.3)' }}>Caricamento...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Immagine', 'Nome', 'Categoria', 'Città', 'Stato', ''].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'rgba(240,237,232,0.3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {places.map((place: any) => {
                const cat = getCategoryConfig(place.category)
                return (
                  <tr key={place._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '8px 16px' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', background: 'rgba(255,255,255,0.05)', flexShrink: 0 }}>
                        {place.media?.coverImage ? (
                          <img src={place.media.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{cat.emoji}</div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {place.meta?.featured && <Star size={11} color="#f59e0b" />}
                        <span style={{ color: '#f0ede8', fontSize: 13, fontWeight: 600 }}>{place.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: cat.color, background: `${cat.color}18`, border: `1px solid ${cat.color}30`, borderRadius: 100, padding: '2px 8px' }}>
                        {cat.emoji} {cat.label}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'rgba(240,237,232,0.4)', fontSize: 12 }}>{place.city}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 100, background: place.meta?.active ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)', color: place.meta?.active ? '#4ade80' : 'rgba(240,237,232,0.3)', border: `1px solid ${place.meta?.active ? 'rgba(34,197,94,0.25)' : 'transparent'}` }}>
                        {place.meta?.active ? 'Attivo' : 'Nascosto'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                        <ActionBtn icon={place.meta?.active ? EyeOff : Eye} onClick={() => toggleMutation.mutate({ id: place._id, active: !place.meta?.active })} />
                        <ActionBtn icon={Pencil} onClick={() => { setEditPlace(place); setShowForm(true) }} color="#3b82f6" />
                        <ActionBtn icon={Trash2} onClick={() => confirm(`Eliminare "${place.name}"?`) && deleteMutation.mutate(place._id)} color="#f87171" />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {showForm && <PlaceFormModal place={editPlace} onClose={() => setShowForm(false)} />}
    </div>
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
    setUploading(true)
    setError('')
    try {
      const { url } = await superAdminApi.upload(file)
      onChange(url)
      setUrlInput(url)
    } catch {
      setError('Upload fallito. Riprova o usa un URL.')
    } finally {
      setUploading(false)
    }
  }

  const handleUrlConfirm = () => {
    if (urlInput.startsWith('http')) onChange(urlInput)
    else setError('URL non valido — deve iniziare con https://')
  }

  return (
    <div>
      <label style={{ display: 'block', fontSize: 10, color: 'rgba(240,237,232,0.4)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        Immagine copertina
      </label>

      {/* Preview */}
      {value && (
        <div style={{ position: 'relative', marginBottom: 10, borderRadius: 12, overflow: 'hidden', height: 140 }}>
          <img src={value} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <button onClick={() => { onChange(''); setUrlInput('') }}
            style={{ position: 'absolute', top: 8, right: 8, width: 26, height: 26, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(0,0,0,0.7)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={13} />
          </button>
        </div>
      )}

      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 8, background: 'rgba(255,255,255,0.04)', padding: 3, borderRadius: 8 }}>
        {(['url', 'file'] as const).map(m => (
          <button key={m} onClick={() => { setUploadMode(m); setError('') }} style={{
            flex: 1, padding: '6px', borderRadius: 6, border: 'none', cursor: 'pointer',
            background: uploadMode === m ? 'rgba(232,98,42,0.2)' : 'transparent',
            color: uploadMode === m ? '#e8622a' : 'rgba(240,237,232,0.4)',
            fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          }}>
            {m === 'url' ? <><Link size={11} /> URL</> : <><Upload size={11} /> Carica file</>}
          </button>
        ))}
      </div>

      {uploadMode === 'url' ? (
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleUrlConfirm()}
            placeholder="https://images.unsplash.com/..."
            style={{ ...field, flex: 1 }}
            onFocus={e => (e.target.style.borderColor = '#e8622a')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
          <button onClick={handleUrlConfirm} style={{
            padding: '0 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: 'rgba(232,98,42,0.2)', color: '#e8622a', fontSize: 12, fontWeight: 700, flexShrink: 0,
          }}>
            OK
          </button>
        </div>
      ) : (
        <div>
          <input ref={fileRef} type="file" accept="image/*,image/gif" onChange={handleFile} style={{ display: 'none' }} />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            style={{
              width: '100%', padding: '12px', borderRadius: 10, border: '2px dashed rgba(232,98,42,0.3)',
              background: 'rgba(232,98,42,0.05)', color: uploading ? '#e8622a' : 'rgba(240,237,232,0.5)',
              cursor: uploading ? 'default' : 'pointer', fontSize: 13,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s',
            }}
            onMouseEnter={e => !uploading && ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(232,98,42,0.6)')}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232,98,42,0.3)'}
          >
            {uploading ? (
              <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Caricamento...</>
            ) : (
              <><Upload size={14} /> Clicca per caricare (JPG, PNG, GIF — max 10MB)</>
            )}
          </button>
        </div>
      )}

      {error && <p style={{ color: '#f87171', fontSize: 11, marginTop: 5 }}>{error}</p>}
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

function AddressField({ value, city, onChange, onGeocode }: {
  value: string
  city: string
  onChange: (v: string) => void
  onGeocode: (lat: number, lng: number) => void
}) {
  const [geocoding, setGeocoding] = useState(false)
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')

  const handleGeocode = async () => {
    if (!value.trim()) return
    setGeocoding(true)
    setStatus('idle')
    const coords = await geocodeAddress(value, city)
    setGeocoding(false)
    if (coords) {
      onGeocode(coords.lat, coords.lng)
      setStatus('ok')
      setTimeout(() => setStatus('idle'), 2000)
    } else {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <div>
      <label style={{ display: 'block', fontSize: 10, color: 'rgba(240,237,232,0.4)', marginBottom: 5, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>
        Indirizzo
      </label>
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          value={value}
          onChange={e => { onChange(e.target.value); setStatus('idle') }}
          placeholder="Via Roma 1, Bologna"
          style={{ ...field, flex: 1 }}
          onFocus={e => (e.target.style.borderColor = '#e8622a')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
          onKeyDown={e => e.key === 'Enter' && handleGeocode()}
        />
        <button
          onClick={handleGeocode}
          disabled={geocoding || !value.trim()}
          title="Trova coordinate dall'indirizzo"
          style={{
            padding: '0 12px', borderRadius: 10, border: 'none', cursor: 'pointer', flexShrink: 0,
            background: status === 'ok' ? 'rgba(34,197,94,0.2)' : status === 'error' ? 'rgba(248,113,113,0.15)' : 'rgba(232,98,42,0.15)',
            color: status === 'ok' ? '#4ade80' : status === 'error' ? '#f87171' : '#e8622a',
            fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4,
            opacity: geocoding || !value.trim() ? 0.5 : 1, transition: 'all 0.2s',
          }}
        >
          {geocoding ? (
            <Loader size={13} style={{ animation: 'spin 1s linear infinite' }} />
          ) : status === 'ok' ? (
            <><Check size={13} /> OK</>
          ) : status === 'error' ? (
            <>✗ Non trovato</>
          ) : (
            <><MapPin size={13} /> Geocodifica</>
          )}
        </button>
      </div>
      {status === 'error' && (
        <p style={{ fontSize: 10, color: '#f87171', marginTop: 4 }}>
          Indirizzo non trovato. Verifica e riprova, o inserisci le coordinate manualmente.
        </p>
      )}
      {status === 'ok' && (
        <p style={{ fontSize: 10, color: '#4ade80', marginTop: 4 }}>
          ✓ Coordinate aggiornate automaticamente
        </p>
      )}
    </div>
  )
}



function PlaceFormModal({ place, onClose }: { place: any; onClose: () => void }) {
  const qc = useQueryClient()
  const isEdit = !!place
  // Use ref to always have latest coords in mutationFn closure
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

  const [error, setError] = useState('')
  const set = (k: string, v: string) => setForm((f: any) => ({ ...f, [k]: v }))

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        name: form.name, city: form.city, category: form.category,
        shortDescription: form.shortDescription, description: form.description,
        tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
        location: {
          address: form['location.address'],
          neighborhood: form['location.neighborhood'],
          coordinates: {
            lat: parseFloat(coordsRef.current?.lat ?? form['location.coordinates.lat']),
            lng: parseFloat(coordsRef.current?.lng ?? form['location.coordinates.lng']),
          }
        },
        contact: {
          phone: form['contact.phone'] || undefined,
          website: form['contact.website'] || undefined,
          instagram: form['contact.instagram'] || undefined
        },
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
      <div style={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 24, width: '100%', maxWidth: 580, maxHeight: '88vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ color: '#f0ede8', fontSize: 18, fontWeight: 700 }}>{isEdit ? 'Modifica' : 'Nuovo'} posto</h2>
          <button onClick={onClose} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', color: 'rgba(240,237,232,0.5)' }}><X size={16} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Image uploader */}
          <ImageUploader
            value={form.coverImage}
            onChange={url => set('coverImage', url)}
          />

          {/* Address with geocoding */}
          <AddressField
            value={form['location.address'] || ''}
            city={form.city || 'bologna'}
            onChange={v => set('location.address', v)}
            onGeocode={(lat, lng) => {
              const latStr = String(lat.toFixed(6))
              const lngStr = String(lng.toFixed(6))
              coordsRef.current = { lat: latStr, lng: lngStr }
              setForm((f: any) => ({
                ...f,
                'location.coordinates.lat': latStr,
                'location.coordinates.lng': lngStr,
              }))
            }}
          />

          {/* Coordinate display */}
          {form['location.coordinates.lat'] !== '44.4949' && (
            <div style={{ padding: '8px 12px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={11} color="#4ade80" />
              <span style={{ fontSize: 11, color: 'rgba(240,237,232,0.5)', fontFamily: 'DM Mono,monospace' }}>
                {parseFloat(form['location.coordinates.lat']).toFixed(4)}, {parseFloat(form['location.coordinates.lng']).toFixed(4)}
              </span>
            </div>
          )}

          {/* Text fields */}
          {[
            { k: 'name', label: 'Nome *', ph: 'Nome del posto' },
            { k: 'shortDescription', label: 'Descrizione breve', ph: 'Max 160 caratteri' },
            { k: 'tags', label: 'Tag (virgola)', ph: 'aperitivo, vista, centro' },
            { k: 'location.neighborhood', label: 'Quartiere', ph: 'Centro Storico' },
            { k: 'contact.phone', label: 'Telefono', ph: '+39 051...' },
            { k: 'contact.website', label: 'Sito web', ph: 'https://...' },
            { k: 'contact.instagram', label: 'Instagram', ph: 'handle senza @' },
          ].map(({ k, label, ph }) => (
            <div key={k}>
              <label style={{ display: 'block', fontSize: 10, color: 'rgba(240,237,232,0.4)', marginBottom: 5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</label>
              <input value={form[k] || ''} onChange={e => set(k, e.target.value)} placeholder={ph} style={field}
                onFocus={e => (e.target.style.borderColor = '#e8622a')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
            </div>
          ))}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, color: 'rgba(240,237,232,0.4)', marginBottom: 5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Categoria</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} style={{ ...field, cursor: 'pointer' }}>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, color: 'rgba(240,237,232,0.4)', marginBottom: 5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Prezzo</label>
              <select value={form.priceRange} onChange={e => set('priceRange', e.target.value)} style={{ ...field, cursor: 'pointer' }}>
                <option value="1">€ Economico</option>
                <option value="2">€€ Medio</option>
                <option value="3">€€€ Alto</option>
                <option value="4">€€€€ Luxury</option>
              </select>
            </div>
          </div>

          {error && <p style={{ color: '#f87171', fontSize: 12, textAlign: 'center', background: 'rgba(248,113,113,0.1)', borderRadius: 8, padding: '8px 12px' }}>{error}</p>}

          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(240,237,232,0.5)', cursor: 'pointer', fontSize: 13 }}>Annulla</button>
            <button onClick={() => mutation.mutate()} disabled={mutation.isPending || !form.name}
              style={{ flex: 1, padding: '11px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#e8622a,#f0884a)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, opacity: mutation.isPending || !form.name ? 0.5 : 1 }}>
              {mutation.isPending ? 'Salvataggio...' : isEdit ? 'Salva' : 'Crea'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
