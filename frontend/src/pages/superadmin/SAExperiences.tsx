import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { experiencesApi, superAdminApi } from '@/lib/api'
import { Plus, Pencil, Trash2, X, Search, GripVertical, Upload, Link, Loader } from 'lucide-react'
import { CATEGORIES } from '@/types'
import { useRef } from 'react'

const C = {
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' } as React.CSSProperties,
  field: { width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'DM Sans,sans-serif', transition: 'border-color 0.2s' },
  label: { display: 'block' as const, fontSize: 10, fontWeight: 700 as const, color: 'var(--meta-color)', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.12em' },
}

// ✅ Select con sfondo scuro — niente più dropdown bianco
const selectStyle = { ...C.field, cursor: 'pointer', colorScheme: 'dark' as const, backgroundColor: '#1a1a2e', color: '#f0ede8' }

// ✅ Categorie sincronizzate con SACategories (localStorage)
const EXP_CATEGORIES_DEFAULT = [
  { id: 'romantica', label: 'Romantica',        emoji: '🕯️' },
  { id: 'colazione', label: 'Colazione',         emoji: '☕' },
  { id: 'pasta',     label: 'Pasta & Tradizione',emoji: '🍝' },
  { id: 'aperitivo', label: 'Aperitivo + Cena',  emoji: '🍹' },
  { id: 'budget',    label: 'Budget',             emoji: '💶' },
  { id: 'serata',    label: 'Serata',             emoji: '🌙' },
  { id: 'cultura',   label: 'Cultura',            emoji: '🏛️' },
  { id: 'sport',     label: 'Sport & Natura',     emoji: '⚽' },
  { id: 'famiglia',  label: 'Famiglia',           emoji: '👨‍👩‍👧' },
]

function useExpCategories() {
  try {
    const stored = localStorage.getItem('faf-custom-categories')
    if (stored) {
      const cats = JSON.parse(stored)
      // Merge: usa categorie custom come base, aggiungi quelle exp-specific se mancano
      return cats
    }
    return EXP_CATEGORIES_DEFAULT
  } catch { return EXP_CATEGORIES_DEFAULT }
}



export default function SAExperiences() {
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editExp, setEditExp] = useState<any>(null)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['sa-experiences', search],
    queryFn: () => experiencesApi.list({}),
  })

  const deleteMutation = useMutation({
    mutationFn: experiencesApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sa-experiences'] }),
  })

  const experiences = (data?.data ?? []).filter((e: any) =>
    !search || e.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 28, fontWeight: 700, color: 'var(--text)' }}>Esperienze</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 12, marginTop: 2 }}>{experiences.length} itinerari</p>
        </div>
        <button onClick={() => { setEditExp(null); setShowForm(true) }} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 12,
          background: 'linear-gradient(135deg,#BB00FF,#9000CC)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
        }}>
          <Plus size={14} /> Nuova esperienza
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca per titolo..."
          style={{ ...C.field, paddingLeft: 36 }} />
      </div>

      {/* List */}
      <div style={C.card}>
        {isLoading ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-3)' }}>Caricamento...</div>
        ) : experiences.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-3)' }}>
            <span style={{ fontSize: 32, display: 'block', marginBottom: 12 }}>✨</span>
            <p>Nessuna esperienza. Crea la prima!</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['', 'Titolo', 'Categoria', 'Costo', 'Tappe', 'Stato', ''].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {experiences.map((exp: any) => {
                const cat = EXP_CATEGORIES_DEFAULT.find(c => c.id === exp.category)
                return (
                  <tr key={exp._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '8px 16px' }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, overflow: 'hidden', background: 'var(--surface)' }}>
                        {exp.coverImage
                          ? <img src={exp.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{exp.emoji}</div>
                        }
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ color: 'var(--text)', fontSize: 13, fontWeight: 700 }}>{exp.title}</p>
                      <p style={{ color: 'var(--text-3)', fontSize: 11 }}>{exp.tagline}</p>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 11, color: 'var(--text-2)' }}>{cat?.emoji} {cat?.label || exp.category}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#BB00FF', fontSize: 13, fontWeight: 700, fontFamily: 'DM Mono,monospace' }}>
                      ~€{exp.estimatedCost}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-2)', fontSize: 12, textAlign: 'center' }}>
                      {exp.stops?.length || 0}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 100, background: exp.active ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)', color: exp.active ? '#4ade80' : 'rgba(240,237,232,0.3)' }}>
                        {exp.active ? 'Attiva' : 'Nascosta'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <button onClick={() => { setEditExp(exp); setShowForm(true) }}
                          style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: '#3b82f6' }}
                          onMouseEnter={e => (e.currentTarget as any).style.background = 'rgba(59,130,246,0.1)'}
                          onMouseLeave={e => (e.currentTarget as any).style.background = 'transparent'}>
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => confirm(`Eliminare "${exp.title}"?`) && deleteMutation.mutate(exp._id)}
                          style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--text-3)' }}
                          onMouseEnter={e => { (e.currentTarget as any).style.color = '#f87171'; (e.currentTarget as any).style.background = 'rgba(248,113,113,0.1)' }}
                          onMouseLeave={e => { (e.currentTarget as any).style.color = 'rgba(240,237,232,0.3)'; (e.currentTarget as any).style.background = 'transparent' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <ExperienceFormModal
          exp={editExp}
          onClose={() => { setShowForm(false); setEditExp(null) }}
        />
      )}
    </div>
  )
}

function ExperienceFormModal({ exp, onClose }: { exp: any; onClose: () => void }) {
  const qc = useQueryClient()
  const isEdit = !!exp
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [imgMode, setImgMode] = useState<'url' | 'file'>('url')

  const [form, setForm] = useState<any>(exp ? {
    title: exp.title || '',
    emoji: exp.emoji || '✨',
    tagline: exp.tagline || '',
    description: exp.description || '',
    category: exp.category || 'romantica',
    estimatedCost: String(exp.estimatedCost || 0),
    duration: String(exp.duration || 120),
    coverImage: exp.coverImage || '',
    videoUrl: exp.videoUrl || '',
    featured: exp.featured || false,
    active: exp.active !== false,
    tags: (exp.tags || []).join(', '),
    stops: exp.stops?.map((s: any) => ({
      placeId: s.placeId?._id || s.placeId,
      placeName: s.placeId?.name || '',
      order: s.order,
      note: s.note || '',
      duration: String(s.duration || 60),
    })) || [],
  } : {
    title: '', emoji: '✨', tagline: '', description: '',
    category: 'romantica', estimatedCost: '0', duration: '120',
    coverImage: '', videoUrl: '', featured: false, active: true,
    tags: '', stops: [],
  })

  const expCategories = useExpCategories()
  const [error, setError] = useState('')
  const [stopSearch, setStopSearch] = useState('')
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }))

  // Search places for stops
  const { data: placesData } = useQuery({
    queryKey: ['sa-places-for-exp', stopSearch],
    queryFn: () => superAdminApi.listPlaces(stopSearch ? { search: stopSearch, limit: 8 } : { limit: 8 }),
    enabled: stopSearch.length > 1,
  })

  const addStop = (place: any) => {
    const exists = form.stops.find((s: any) => s.placeId === place._id)
    if (exists) return
    set('stops', [...form.stops, {
      placeId: place._id,
      placeName: place.name,
      order: form.stops.length + 1,
      note: '',
      duration: '60',
    }])
    setStopSearch('')
  }

  const removeStop = (idx: number) => {
    set('stops', form.stops.filter((_: any, i: number) => i !== idx).map((s: any, i: number) => ({ ...s, order: i + 1 })))
  }

  const updateStop = (idx: number, k: string, v: string) => {
    const stops = [...form.stops]
    stops[idx] = { ...stops[idx], [k]: v }
    set('stops', stops)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { url } = await superAdminApi.upload(file)
      set('coverImage', url)
    } catch { setError('Upload fallito') }
    setUploading(false)
  }

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        title: form.title,
        emoji: form.emoji,
        tagline: form.tagline,
        description: form.description,
        category: form.category,
        estimatedCost: parseInt(form.estimatedCost) || 0,
        duration: parseInt(form.duration) || 120,
        coverImage: form.coverImage,
        videoUrl: form.videoUrl,
        featured: form.featured,
        active: form.active,
        tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
        city: 'bologna',
        stops: form.stops.map((s: any, i: number) => ({
          placeId: s.placeId,
          order: i + 1,
          note: s.note,
          duration: parseInt(s.duration) || 60,
        })),
      }
      return isEdit ? experiencesApi.update(exp._id, payload) : experiencesApi.create(payload)
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sa-experiences'] }); qc.invalidateQueries({ queryKey: ['home-experiences'] }); onClose() },
    onError: (e: any) => setError(e.response?.data?.error || 'Errore'),
  })

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={onClose}>
      <div style={{ background: '#0f0f1a', border: '1px solid var(--border)', borderRadius: 20, padding: 24, width: '100%', maxWidth: 640, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ color: 'var(--text)', fontSize: 18, fontWeight: 700 }}>{isEdit ? 'Modifica' : 'Nuova'} esperienza</h2>
          <button onClick={onClose} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'var(--surface)', color: 'var(--text-2)' }}><X size={15} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Cover image */}
          <div>
            <label style={C.label}>Immagine copertina</label>
            {form.coverImage && (
              <div style={{ position: 'relative', height: 120, borderRadius: 12, overflow: 'hidden', marginBottom: 8 }}>
                <img src={form.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button onClick={() => set('coverImage', '')} style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: 6, border: 'none', cursor: 'pointer', background: 'rgba(0,0,0,0.7)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={12} /></button>
              </div>
            )}
            <div style={{ display: 'flex', gap: 4, marginBottom: 6, background: 'var(--surface)', padding: 3, borderRadius: 8 }}>
              {(['url', 'file'] as const).map(m => (
                <button key={m} onClick={() => setImgMode(m)} style={{ flex: 1, padding: '5px', borderRadius: 6, border: 'none', cursor: 'pointer', background: imgMode === m ? 'rgba(187,0,255,0.2)' : 'transparent', color: imgMode === m ? '#BB00FF' : 'rgba(240,237,232,0.4)', fontSize: 11, fontWeight: 600 }}>
                  {m === 'url' ? '🔗 URL' : '📁 Upload file'}
                </button>
              ))}
            </div>
            {imgMode === 'url' ? (
              <input value={form.coverImage} onChange={e => set('coverImage', e.target.value)} placeholder="https://..." style={C.field}
                onFocus={e => (e.target.style.borderColor = '#BB00FF')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            ) : (
              <>
                <input ref={fileRef} type="file" accept="image/*,video/mp4" onChange={handleImageUpload} style={{ display: 'none' }} />
                <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ width: '100%', padding: '10px', borderRadius: 10, border: '2px dashed rgba(187,0,255,0.3)', background: 'rgba(232,98,42,0.05)', color: 'var(--text-2)', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  {uploading ? <><Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> Caricamento...</> : <><Upload size={13} /> Carica immagine o GIF (max 10MB)</>}
                </button>
              </>
            )}
          </div>

          {/* Video URL */}
          <div>
            <label style={C.label}>Video URL (YouTube / Vimeo — opzionale)</label>
            <input value={form.videoUrl} onChange={e => set('videoUrl', e.target.value)} placeholder="https://youtube.com/watch?v=..." style={C.field}
              onFocus={e => (e.target.style.borderColor = '#BB00FF')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>

          {/* Title + Emoji */}
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 10 }}>
            <div>
              <label style={C.label}>Emoji</label>
              <input value={form.emoji} onChange={e => set('emoji', e.target.value)} placeholder="✨" style={{ ...C.field, textAlign: 'center', fontSize: 22 }}
                onFocus={e => (e.target.style.borderColor = '#BB00FF')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>
            <div>
              <label style={C.label}>Titolo *</label>
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Es: Cena Romantica a Bologna" style={C.field}
                onFocus={e => (e.target.style.borderColor = '#BB00FF')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>
          </div>

          <div>
            <label style={C.label}>Tagline</label>
            <input value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="Una serata perfetta per due" style={C.field}
              onFocus={e => (e.target.style.borderColor = '#BB00FF')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>

          <div>
            <label style={C.label}>Descrizione</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Racconta l'esperienza..." rows={3}
              style={{ ...C.field, resize: 'none' }}
              onFocus={e => (e.target.style.borderColor = '#BB00FF')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>

          {/* Category + Cost + Duration */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <div>
              <label style={C.label}>Categoria *</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} style={selectStyle}>
                {expCategories.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.emoji} {cat.label}</option>)}
              </select>
            </div>
            <div>
              <label style={C.label}>Costo stimato (€)</label>
              <input type="number" value={form.estimatedCost} onChange={e => set('estimatedCost', e.target.value)} placeholder="50" min="0" style={C.field}
                onFocus={e => (e.target.style.borderColor = '#BB00FF')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>
            <div>
              <label style={C.label}>Durata (minuti)</label>
              <input type="number" value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="120" min="0" style={C.field}
                onFocus={e => (e.target.style.borderColor = '#BB00FF')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>
          </div>

          <div>
            <label style={C.label}>Tag (virgola)</label>
            <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="romantica, cena, aperitivo" style={C.field}
              onFocus={e => (e.target.style.borderColor = '#BB00FF')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>

          {/* Flags */}
          <div style={{ display: 'flex', gap: 16 }}>
            {[
              { k: 'featured', label: '⭐ In evidenza' },
              { k: 'active', label: '✅ Attiva' },
            ].map(({ k, label }) => (
              <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-2)' }}>
                <input type="checkbox" checked={form[k]} onChange={e => set(k, e.target.checked)} style={{ accentColor: '#BB00FF', width: 15, height: 15 }} />
                {label}
              </label>
            ))}
          </div>

          {/* ── Stops (Tappe) ── */}
          <div>
            <label style={{ ...C.label, marginBottom: 10 }}>Tappe dell'itinerario</label>

            {/* Search places */}
            <div style={{ position: 'relative', marginBottom: 10 }}>
              <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
              <input value={stopSearch} onChange={e => setStopSearch(e.target.value)} placeholder="Cerca e aggiungi un locale..."
                style={{ ...C.field, paddingLeft: 32 }}
                onFocus={e => (e.target.style.borderColor = '#BB00FF')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              {stopSearch.length > 1 && placesData?.data?.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, background: '#1a1a2e', border: '1px solid var(--border)', borderRadius: 10, marginTop: 4, overflow: 'hidden' }}>
                  {placesData.data.map((place: any) => (
                    <button key={place._id} onClick={() => addStop(place)} style={{ width: '100%', padding: '8px 12px', border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--text)', fontSize: 13, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(187,0,255,0.1)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: 'var(--surface)' }}>
                        {place.media?.coverImage && <img src={place.media.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </div>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 600 }}>{place.name}</p>
                        <p style={{ fontSize: 10, color: 'var(--meta-color)' }}>{place.location?.neighborhood}</p>
                      </div>
                      <Plus size={12} style={{ marginLeft: 'auto', color: '#BB00FF' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Stops list */}
            {form.stops.length === 0 ? (
              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, textAlign: 'center', color: 'var(--text-3)', fontSize: 12 }}>
                Cerca e aggiungi i locali dell'itinerario
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {form.stops.map((stop: any, i: number) => (
                  <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#BB00FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>{i + 1}</span>
                      </div>
                      <span style={{ color: 'var(--text)', fontSize: 13, fontWeight: 700, flex: 1 }}>{stop.placeName}</span>
                      <input type="number" value={stop.duration} onChange={e => updateStop(i, 'duration', e.target.value)}
                        placeholder="min" min="0" style={{ ...C.field, width: 70, padding: '5px 8px', fontSize: 11 }} />
                      <span style={{ fontSize: 10, color: 'var(--text-3)' }}>min</span>
                      <button onClick={() => removeStop(i)} style={{ padding: 4, borderRadius: 6, border: 'none', cursor: 'pointer', background: 'transparent', color: '#f87171' }}>
                        <X size={13} />
                      </button>
                    </div>
                    <input value={stop.note} onChange={e => updateStop(i, 'note', e.target.value)}
                      placeholder="💡 Suggerimento per questa tappa... (opzionale)" style={{ ...C.field, fontSize: 11 }}
                      onFocus={e => (e.target.style.borderColor = '#BB00FF')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p style={{ color: '#f87171', fontSize: 12, textAlign: 'center', background: 'rgba(248,113,113,0.1)', borderRadius: 8, padding: '8px 12px' }}>{error}</p>}

          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-2)', cursor: 'pointer', fontSize: 13 }}>Annulla</button>
            <button onClick={() => mutation.mutate()} disabled={!form.title || mutation.isPending}
              style={{ flex: 2, padding: '11px', borderRadius: 12, border: 'none', background: form.title ? 'linear-gradient(135deg,#BB00FF,#9000CC)' : 'rgba(255,255,255,0.08)', color: form.title ? '#fff' : 'rgba(240,237,232,0.3)', cursor: form.title ? 'pointer' : 'not-allowed', fontSize: 13, fontWeight: 700 }}>
              {mutation.isPending ? 'Salvataggio...' : isEdit ? 'Salva' : 'Crea esperienza'}
            </button>
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )
}
