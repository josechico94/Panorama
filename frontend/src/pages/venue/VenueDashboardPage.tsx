import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { venueApi } from '@/lib/api'
import { getCategoryConfig } from '@/types'
import { Plus, Trash2, Tag, Users, TrendingUp, Clock, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Fix timezone: convert YYYY-MM-DD to local ISO (not UTC midnight)
const toLocalISO = (dateStr: string, endOfDay = false) => {
  if (!dateStr) return dateStr
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d, endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0)
  return date.toISOString()
}

export default function VenueDashboardPage() {
  const [tab, setTab] = useState<'coupons' | 'info'>('coupons')
  const [showCouponForm, setShowCouponForm] = useState(false)

  const { data: placeData, isLoading: placeLoading } = useQuery({ queryKey: ['venue-me'], queryFn: venueApi.me })
  const { data: couponsData, isLoading: couponsLoading } = useQuery({ queryKey: ['venue-coupons'], queryFn: venueApi.coupons })

  const place = placeData?.data
  const coupons = couponsData?.data ?? []
  const activeCoupons = coupons.filter((c: any) => c.active && new Date() <= new Date(c.validUntil))
  const cat = place ? getCategoryConfig(place.category) : null

  if (placeLoading) return (
    <div className="p-8 space-y-4">
      <div className="skeleton rounded-2xl h-32" />
      <div className="skeleton rounded-xl h-8 w-1/2" />
    </div>
  )

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Place header */}
      {place && (
        <div className="glass-light rounded-2xl p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
            <img
              src={place.media?.coverImage || 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=200&q=80'}
              alt={place.name} className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-white truncate"
              style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '22px', fontStyle: 'italic' }}>
              {place.name}
            </h1>
            <p className="text-[var(--text-3)] text-xs mt-0.5 flex items-center gap-1.5">
              {cat && <span>{cat.emoji} {cat.label}</span>}
              <span>•</span>
              <span>{place.location?.neighborhood}</span>
            </p>
          </div>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Coupon attivi', value: activeCoupons.length, icon: Tag, color: 'var(--accent)' },
          { label: 'Tot. emessi', value: coupons.reduce((s: number, c: any) => s + (c.usesCount || 0), 0), icon: Users, color: '#a855f7' },
          { label: 'Visualizzazioni', value: place?.meta?.views ?? 0, icon: TrendingUp, color: '#22c55e' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-light rounded-xl p-3 text-center">
            <Icon size={14} style={{ color, margin: '0 auto 4px' }} />
            <p className="text-white font-bold text-lg">{value}</p>
            <p className="text-[var(--text-3)] text-[9px] tracking-wide uppercase">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 glass-light rounded-xl p-1">
        {(['coupons', 'info'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
            style={tab === t ? { background: 'var(--accent)', color: '#fff' } : { color: 'var(--text-3)' }}>
            {t === 'coupons' ? '🎫 Coupon' : '✏️ Informazioni'}
          </button>
        ))}
      </div>

      {/* Coupons tab */}
      {tab === 'coupons' && (
        <div className="space-y-4">
          <button onClick={() => setShowCouponForm(true)} className="btn btn-accent w-full flex items-center gap-2">
            <Plus size={15} /> Crea nuovo coupon
          </button>
          {couponsLoading ? (
            <div className="space-y-2">{[1, 2].map(i => <div key={i} className="skeleton rounded-xl h-20" />)}</div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-10 text-[var(--text-3)]">
              <p className="text-3xl mb-2">🎫</p>
              <p className="text-sm">Nessun coupon ancora. Crea il primo!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {coupons.map((coupon: any) => (
                <CouponRow key={coupon._id} coupon={coupon} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Info tab */}
      {tab === 'info' && place && <VenueInfoForm place={place} />}

      <AnimatePresence>
        {showCouponForm && <CouponFormModal onClose={() => setShowCouponForm(false)} />}
      </AnimatePresence>
    </div>
  )
}

function CouponRow({ coupon }: { coupon: any }) {
  const qc = useQueryClient()
  const deleteMutation = useMutation({
    mutationFn: () => venueApi.deleteCoupon(coupon._id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['venue-coupons'] }),
  })

  const isExpired = new Date() > new Date(coupon.validUntil)
  const remaining = coupon.maxUses !== null ? coupon.maxUses - coupon.usesCount : null

  return (
    <div className="glass-light rounded-xl p-4 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white text-sm truncate">{coupon.title}</span>
          <span style={{
            fontSize: '10px', fontWeight: 800,
            color: isExpired ? 'var(--text-3)' : 'var(--accent)',
            background: isExpired ? 'rgba(255,255,255,0.05)' : 'rgba(232,98,42,0.12)',
            border: `1px solid ${isExpired ? 'transparent' : 'rgba(232,98,42,0.25)'}`,
            borderRadius: '6px', padding: '1px 6px',
            fontFamily: 'DM Mono, monospace',
          }}>
            {coupon.discountType === 'percentage' ? `-${coupon.discountValue}%`
              : coupon.discountType === 'fixed' ? `-€${coupon.discountValue}` : 'OMAGGIO'}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1 text-[var(--text-3)] text-[10px]">
          <span className="flex items-center gap-1">
            <Clock size={9} />
            {isExpired ? 'Scaduto' : `Fino al ${new Date(coupon.validUntil).toLocaleDateString('it-IT')}`}
          </span>
          <span className="flex items-center gap-1">
            <Users size={9} /> {coupon.usesCount} scaricati
            {remaining !== null && ` / ${coupon.maxUses} max`}
          </span>
        </div>
      </div>
      <button
        onClick={() => deleteMutation.mutate()}
        className="p-2 rounded-lg text-[var(--text-3)] hover:text-red-400 hover:bg-red-400/10 transition-all"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}

function CouponFormModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient()
  const [form, setForm] = useState({
    title: '', description: '', discountType: 'percentage', discountValue: '10',
    conditions: '', validFrom: '', validUntil: '', maxUses: '',
  })
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  const mutation = useMutation({
    mutationFn: () => venueApi.createCoupon({
      ...form,
      // ← FIX: convert dates using local timezone to avoid UTC midnight shift
      validFrom:  toLocalISO(form.validFrom, false),
      validUntil: toLocalISO(form.validUntil, true),
      discountValue: Number(form.discountValue),
      maxUses: form.maxUses ? Number(form.maxUses) : null,
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['venue-coupons'] })
      qc.invalidateQueries({ queryKey: ['active-coupons'] })
      onClose()
    },
    onError: (err: any) => setError(err.response?.data?.error || 'Errore'),
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)', borderRadius: '24px 24px 0 0',
          border: '1px solid var(--border2)', padding: '20px',
          width: '100%', maxWidth: 560, maxHeight: '90dvh', overflowY: 'auto',
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-white"
            style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '22px', fontStyle: 'italic' }}>
            Nuovo coupon
          </h2>
          <button onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-3)] hover:text-white hover:bg-white/5 transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-[var(--text-3)] mb-1.5">Titolo *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)}
              className="field" placeholder="Es: Aperitivo in omaggio" required />
          </div>

          <div>
            <label className="block text-xs text-[var(--text-3)] mb-1.5">Descrizione</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              className="field resize-none" rows={2} placeholder="Dettagli sull'offerta..." />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[var(--text-3)] mb-1.5">Tipo sconto</label>
              <select value={form.discountType} onChange={e => set('discountType', e.target.value)} className="field">
                <option value="percentage">Percentuale (%)</option>
                <option value="fixed">Fisso (€)</option>
                <option value="freebie">Omaggio</option>
              </select>
            </div>
            {form.discountType !== 'freebie' && (
              <div>
                <label className="block text-xs text-[var(--text-3)] mb-1.5">
                  Valore {form.discountType === 'percentage' ? '(%)' : '(€)'}
                </label>
                <input type="number" min="1" value={form.discountValue}
                  onChange={e => set('discountValue', e.target.value)} className="field" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[var(--text-3)] mb-1.5">Valido dal *</label>
              <input type="date" min={today} value={form.validFrom}
                onChange={e => set('validFrom', e.target.value)} className="field" required />
            </div>
            <div>
              <label className="block text-xs text-[var(--text-3)] mb-1.5">Valido fino al *</label>
              <input type="date" min={form.validFrom || today} value={form.validUntil}
                onChange={e => set('validUntil', e.target.value)} className="field" required />
            </div>
          </div>

          {/* Preview fechas — ayuda visual */}
          {form.validFrom && form.validUntil && (
            <p className="text-[var(--text-3)] text-[10px] text-center">
              📅 {new Date(toLocalISO(form.validFrom)).toLocaleDateString('it-IT')} →{' '}
              {new Date(toLocalISO(form.validUntil, true)).toLocaleDateString('it-IT')}
            </p>
          )}

          <div>
            <label className="block text-xs text-[var(--text-3)] mb-1.5">Max utilizzi (vuoto = illimitato)</label>
            <input type="number" min="1" value={form.maxUses}
              onChange={e => set('maxUses', e.target.value)} className="field" placeholder="Es: 50" />
          </div>

          <div>
            <label className="block text-xs text-[var(--text-3)] mb-1.5">Condizioni</label>
            <input value={form.conditions} onChange={e => set('conditions', e.target.value)}
              className="field" placeholder="Es: Solo cena, minimo €25" />
          </div>

          {error && (
            <p className="text-red-400 text-xs text-center bg-red-400/10 rounded-xl py-2">{error}</p>
          )}

          <div className="flex gap-3 pb-4">
            <button onClick={onClose} className="btn btn-ghost flex-1">Annulla</button>
            <button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending || !form.title || !form.validFrom || !form.validUntil}
              className="btn btn-accent flex-1 disabled:opacity-50"
            >
              {mutation.isPending ? 'Creazione...' : 'Crea coupon'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function VenueInfoForm({ place }: { place: any }) {
  const qc = useQueryClient()
  const [form, setForm] = useState({
    'contact.phone': place.contact?.phone || '',
    'contact.website': place.contact?.website || '',
    'contact.instagram': place.contact?.instagram || '',
    'contact.email': place.contact?.email || '',
    'location.address': place.location?.address || '',
    'location.neighborhood': place.location?.neighborhood || '',
    shortDescription: place.shortDescription || '',
  })
  const [saved, setSaved] = useState(false)

  const mutation = useMutation({
    mutationFn: () => venueApi.updateMe({
      contact: {
        phone: form['contact.phone'],
        website: form['contact.website'],
        instagram: form['contact.instagram'],
        email: form['contact.email'],
      },
      location: {
        ...place.location,
        address: form['location.address'],
        neighborhood: form['location.neighborhood'],
      },
      shortDescription: form.shortDescription,
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['venue-me'] })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    },
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const fields = [
    { key: 'shortDescription', label: 'Descrizione breve', placeholder: 'Una riga che descrive il locale' },
    { key: 'location.address', label: 'Indirizzo', placeholder: 'Via Roma 1, Bologna' },
    { key: 'location.neighborhood', label: 'Quartiere', placeholder: 'Centro Storico' },
    { key: 'contact.phone', label: 'Telefono', placeholder: '+39 051 000000' },
    { key: 'contact.website', label: 'Sito web', placeholder: 'https://...' },
    { key: 'contact.instagram', label: 'Instagram', placeholder: 'handle (senza @)' },
    { key: 'contact.email', label: 'Email pubblica', placeholder: 'info@locale.com' },
  ]

  return (
    <div className="space-y-4 pb-8">
      {fields.map(({ key, label, placeholder }) => (
        <div key={key}>
          <label className="block text-xs text-[var(--text-3)] mb-1.5 tracking-wide">{label}</label>
          <input
            value={(form as any)[key]}
            onChange={e => set(key, e.target.value)}
            className="field" placeholder={placeholder}
          />
        </div>
      ))}
      <button
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        className="btn btn-accent w-full disabled:opacity-50"
      >
        {saved ? '✅ Salvato!' : mutation.isPending ? 'Salvataggio...' : 'Salva modifiche'}
      </button>
    </div>
  )
}
