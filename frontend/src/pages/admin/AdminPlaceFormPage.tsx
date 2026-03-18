import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Upload, X, Star } from 'lucide-react'
import { adminApi } from '@/lib/api'
import { CATEGORIES } from '@/types'

const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'] as const
const DAYS_IT: Record<string, string> = {
  monday:'Lunedì', tuesday:'Martedì', wednesday:'Mercoledì',
  thursday:'Giovedì', friday:'Venerdì', saturday:'Sabato', sunday:'Domenica'
}

const EMPTY_FORM = {
  name: '', city: 'bologna', category: 'eat',
  shortDescription: '', description: '',
  tags: '',
  'location.address': '', 'location.neighborhood': '',
  'location.coordinates.lat': '44.4949', 'location.coordinates.lng': '11.3426',
  'contact.phone': '', 'contact.website': '', 'contact.instagram': '',
  priceRange: '2',
  'meta.featured': false, 'meta.active': true,
  coverImage: '',
  hours: Object.fromEntries(DAYS.map(d => [d, { open: '10:00', close: '22:00', closed: false }])),
}

export default function AdminPlaceFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [form, setForm] = useState<any>(EMPTY_FORM)
  const [uploading, setUploading] = useState(false)
  const [saveError, setSaveError] = useState('')

  const { data: existing } = useQuery({
    queryKey: ['admin-place-edit', id],
    queryFn: () => adminApi.listPlaces({ limit: 1 }).then(async () => {
      // Fetch by id via listing — simplified
      const all = await adminApi.listPlaces({ limit: '200' })
      return all.data?.find((p: any) => p._id === id)
    }),
    enabled: isEdit,
  })

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name,
        city: existing.city,
        category: existing.category,
        shortDescription: existing.shortDescription || '',
        description: existing.description || '',
        tags: (existing.tags || []).join(', '),
        'location.address': existing.location?.address || '',
        'location.neighborhood': existing.location?.neighborhood || '',
        'location.coordinates.lat': String(existing.location?.coordinates?.lat || 44.4949),
        'location.coordinates.lng': String(existing.location?.coordinates?.lng || 11.3426),
        'contact.phone': existing.contact?.phone || '',
        'contact.website': existing.contact?.website || '',
        'contact.instagram': existing.contact?.instagram || '',
        priceRange: String(existing.priceRange || 2),
        'meta.featured': existing.meta?.featured || false,
        'meta.active': existing.meta?.active !== false,
        coverImage: existing.media?.coverImage || '',
        hours: existing.hours || EMPTY_FORM.hours,
      })
    }
  }, [existing])

  const saveMutation = useMutation({
    mutationFn: (payload: any) => isEdit ? adminApi.updatePlace(id!, payload) : adminApi.createPlace(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-places'] })
      navigate('/admin/places')
    },
    onError: (err: any) => setSaveError(err.response?.data?.error || 'Errore nel salvataggio'),
  })

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { url } = await adminApi.upload(file)
      setForm((f: any) => ({ ...f, coverImage: url }))
    } catch {
      alert('Upload fallito. Configura Cloudinary nel .env')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaveError('')
    const tags = form.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
    const payload = {
      name: form.name,
      city: form.city,
      category: form.category,
      shortDescription: form.shortDescription,
      description: form.description,
      tags,
      location: {
        address: form['location.address'],
        neighborhood: form['location.neighborhood'],
        coordinates: {
          lat: parseFloat(form['location.coordinates.lat']),
          lng: parseFloat(form['location.coordinates.lng']),
        },
      },
      contact: {
        phone: form['contact.phone'] || undefined,
        website: form['contact.website'] || undefined,
        instagram: form['contact.instagram'] || undefined,
      },
      priceRange: parseInt(form.priceRange),
      media: { coverImage: form.coverImage, gallery: [] },
      hours: form.hours,
      meta: { featured: form['meta.featured'], active: form['meta.active'] },
    }
    saveMutation.mutate(payload)
  }

  const set = (key: string, val: any) => setForm((f: any) => ({ ...f, [key]: val }))
  const setHour = (day: string, field: string, val: any) =>
    setForm((f: any) => ({ ...f, hours: { ...f.hours, [day]: { ...f.hours[day], [field]: val } } }))

  return (
    <div className="max-w-2xl space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/places')} className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">
            {isEdit ? 'Modifica posto' : 'Nuovo posto'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cover image */}
        <div className="glass rounded-2xl p-5 space-y-3">
          <h2 className="font-medium text-white text-sm">Immagine di copertina</h2>
          {form.coverImage ? (
            <div className="relative rounded-xl overflow-hidden aspect-video">
              <img src={form.coverImage} alt="Cover" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => set('coverImage', '')}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-all"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-white/20 transition-all">
              <Upload size={24} className="text-white/30 mb-2" />
              <span className="text-white/40 text-sm">{uploading ? 'Caricamento...' : 'Carica immagine'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          )}
          <div>
            <label className="block text-xs text-white/40 mb-1">O incolla URL immagine</label>
            <input
              type="url"
              value={form.coverImage}
              onChange={e => set('coverImage', e.target.value)}
              className="input-field text-sm"
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Basic info */}
        <div className="glass rounded-2xl p-5 space-y-4">
          <h2 className="font-medium text-white text-sm">Informazioni base</h2>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Nome *</label>
            <input required value={form.name} onChange={e => set('name', e.target.value)} className="input-field" placeholder="Nome del posto" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Categoria *</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className="input-field">
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Fascia prezzo</label>
              <select value={form.priceRange} onChange={e => set('priceRange', e.target.value)} className="input-field">
                <option value="1">€ Economico</option>
                <option value="2">€€ Medio</option>
                <option value="3">€€€ Alto</option>
                <option value="4">€€€€ Luxury</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Descrizione breve (max 160 caratteri)</label>
            <input value={form.shortDescription} onChange={e => set('shortDescription', e.target.value)} maxLength={160} className="input-field" placeholder="Una riga che descrive il posto..." />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Descrizione completa</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4} className="input-field resize-none" placeholder="Racconta il posto in dettaglio..." />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Tag (separati da virgola)</label>
            <input value={form.tags} onChange={e => set('tags', e.target.value)} className="input-field" placeholder="aperitivo, cocktail, rooftop" />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form['meta.active']} onChange={e => set('meta.active', e.target.checked)} className="w-4 h-4 accent-orange-500" />
              <span className="text-sm text-white/70">Pubblicato</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form['meta.featured']} onChange={e => set('meta.featured', e.target.checked)} className="w-4 h-4 accent-orange-500" />
              <span className="text-sm text-white/70 flex items-center gap-1"><Star size={12} className="text-yellow-400" /> In evidenza</span>
            </label>
          </div>
        </div>

        {/* Location */}
        <div className="glass rounded-2xl p-5 space-y-4">
          <h2 className="font-medium text-white text-sm">Posizione</h2>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Indirizzo</label>
            <input value={form['location.address']} onChange={e => set('location.address', e.target.value)} className="input-field" placeholder="Via Indipendenza 1, Bologna" />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Quartiere</label>
            <input value={form['location.neighborhood']} onChange={e => set('location.neighborhood', e.target.value)} className="input-field" placeholder="Centro Storico, Bolognina, Quadrilatero..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Latitudine</label>
              <input type="number" step="any" value={form['location.coordinates.lat']} onChange={e => set('location.coordinates.lat', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Longitudine</label>
              <input type="number" step="any" value={form['location.coordinates.lng']} onChange={e => set('location.coordinates.lng', e.target.value)} className="input-field" />
            </div>
          </div>
        </div>

        {/* Hours */}
        <div className="glass rounded-2xl p-5 space-y-3">
          <h2 className="font-medium text-white text-sm">Orari</h2>
          {DAYS.map(day => {
            const h = form.hours[day] || { open: '10:00', close: '22:00', closed: false }
            return (
              <div key={day} className="flex items-center gap-3">
                <span className="text-white/50 text-sm w-24 shrink-0">{DAYS_IT[day]}</span>
                <label className="flex items-center gap-1.5 text-xs text-white/40 cursor-pointer shrink-0">
                  <input type="checkbox" checked={h.closed} onChange={e => setHour(day, 'closed', e.target.checked)} className="w-3.5 h-3.5 accent-orange-500" />
                  Chiuso
                </label>
                {!h.closed && (
                  <>
                    <input type="time" value={h.open} onChange={e => setHour(day, 'open', e.target.value)}
                      className="input-field py-1.5 text-sm w-24" />
                    <span className="text-white/30 text-sm">–</span>
                    <input type="time" value={h.close} onChange={e => setHour(day, 'close', e.target.value)}
                      className="input-field py-1.5 text-sm w-24" />
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* Contacts */}
        <div className="glass rounded-2xl p-5 space-y-4">
          <h2 className="font-medium text-white text-sm">Contatti</h2>
          {[
            { key: 'contact.phone', label: 'Telefono', placeholder: '+39 051 000000' },
            { key: 'contact.website', label: 'Sito web', placeholder: 'https://...' },
            { key: 'contact.instagram', label: 'Instagram handle', placeholder: 'nomeutente (senza @)' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs text-white/40 mb-1.5">{label}</label>
              <input value={form[key]} onChange={e => set(key, e.target.value)} className="input-field" placeholder={placeholder} />
            </div>
          ))}
        </div>

        {/* Error */}
        {saveError && (
          <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">{saveError}</p>
        )}

        {/* Actions */}
        <div className="flex gap-3 pb-8">
          <button type="button" onClick={() => navigate('/admin/places')} className="btn-ghost flex-1">
            Annulla
          </button>
          <button type="submit" disabled={saveMutation.isPending} className="btn-primary flex-1 disabled:opacity-50">
            {saveMutation.isPending ? 'Salvataggio...' : isEdit ? 'Salva modifiche' : 'Crea posto'}
          </button>
        </div>
      </form>
    </div>
  )
}
