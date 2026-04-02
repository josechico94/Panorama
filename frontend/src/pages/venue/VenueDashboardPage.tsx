import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { venueApi } from '@/lib/api'
import { Plus, Trash2, Tag, Users, Eye, X, ChevronDown, ChevronUp, Pencil, Clock, CheckCircle, BarChart2 } from 'lucide-react'

const field = {
  width: '100%', padding: '11px 14px', borderRadius: 12, background: 'var(--surface)',
  border: '1px solid var(--border)', color: 'var(--text)', fontSize: 14, outline: 'none',
  fontFamily: 'DM Sans, sans-serif', transition: 'border-color 0.2s', boxSizing: 'border-box' as const,
}

const today = () => new Date().toISOString().split('T')[0]

const EMPTY_FORM = {
  title: '', description: '', discountType: 'percentage', discountValue: '10',
  conditions: '', validFrom: today(), validUntil: '', maxUses: '',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function VenueDashboardPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editCoupon, setEditCoupon] = useState<any>(null)
  const [tab, setTab] = useState<'attivi' | 'storico'>('attivi')

  const { data: venueData } = useQuery({ queryKey: ['venue-me'], queryFn: venueApi.me })
  const { data: couponsData } = useQuery({ queryKey: ['venue-coupons'], queryFn: venueApi.coupons })

  const place = venueData?.data
  const allCoupons: any[] = couponsData?.data ?? []
  const now = new Date()

  const activeCoupons = allCoupons.filter(c => c.active && new Date(c.validUntil) >= now)
  const historyCoupons = allCoupons.filter(c => !c.active || new Date(c.validUntil) < now)

  const totalEmessi = allCoupons.reduce((s: number, c: any) => s + (c.usesCount || 0), 0)

  const deleteMutation = useMutation({
    mutationFn: venueApi.deleteCoupon,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['venue-coupons'] }),
  })

  const openEdit = (coupon: any) => {
    setEditCoupon(coupon)
    setShowForm(true)
  }

  const openNew = () => {
    setEditCoupon(null)
    setShowForm(true)
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 24 }}>
        {[
          { icon: Tag, label: 'Coupon attivi', value: activeCoupons.length, color: '#BB00FF' },
          { icon: Users, label: 'Tot. emessi', value: totalEmessi, color: '#a855f7' },
          { icon: Eye, label: 'Visualizzazioni', value: place?.meta?.views ?? 0, color: '#22c55e' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 12px', textAlign: 'center' }}>
            <Icon size={18} color={color} style={{ margin: '0 auto 8px' }} />
            <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>{value}</p>
            <p style={{ fontSize: 9, color: 'var(--meta-color)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, marginBottom: 16 }}>
        {([
          { id: 'attivi', icon: Tag, label: `Coupon (${activeCoupons.length})` },
          { id: 'storico', icon: BarChart2, label: `Storico (${historyCoupons.length})` },
        ] as const).map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => setTab(id)} style={{
            flex: 1, padding: '9px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: tab === id ? '#BB00FF' : 'transparent',
            color: tab === id ? '#fff' : 'rgba(240,237,232,0.4)',
            fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'all 0.2s',
          }}>
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── COUPON ATTIVI ── */}
        {tab === 'attivi' && (
          <motion.div key="attivi" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button onClick={openNew} style={{
              width: '100%', padding: '13px', borderRadius: 14, border: '2px dashed rgba(232,98,42,0.35)',
              background: 'rgba(232,98,42,0.06)', color: '#BB00FF', cursor: 'pointer',
              fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              marginBottom: 14, transition: 'all 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(232,98,42,0.6)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(232,98,42,0.35)')}>
              <Plus size={16} /> Crea nuovo coupon
            </button>

            {activeCoupons.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-3)' }}>
                <Tag size={28} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
                <p style={{ fontSize: 13 }}>Nessun coupon attivo</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {activeCoupons.map((coupon: any) => (
                  <CouponCard key={coupon._id} coupon={coupon} onEdit={() => openEdit(coupon)}
                    onDelete={() => confirm(`Eliminare "${coupon.title}"?`) && deleteMutation.mutate(coupon._id)} />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── STORICO ── */}
        {tab === 'storico' && (
          <motion.div key="storico" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {historyCoupons.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-3)' }}>
                <Clock size={28} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
                <p style={{ fontSize: 13 }}>Nessun coupon nello storico</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {historyCoupons.map((coupon: any) => (
                  <HistoryCouponCard key={coupon._id} coupon={coupon} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form modal */}
      {showForm && (
        <CouponFormModal
          coupon={editCoupon}
          onClose={() => { setShowForm(false); setEditCoupon(null) }}
        />
      )}
    </div>
  )
}

function CouponCard({ coupon, onEdit, onDelete }: { coupon: any; onEdit: () => void; onDelete: () => void }) {
  const daysLeft = Math.ceil((new Date(coupon.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#BB00FF', fontFamily: 'DM Mono,monospace', background: 'rgba(232,98,42,0.12)', border: '1px solid rgba(187,0,255,0.25)', borderRadius: 7, padding: '2px 8px' }}>
              {coupon.discountType === 'percentage' ? `-${coupon.discountValue}%` : coupon.discountType === 'fixed' ? `-€${coupon.discountValue}` : 'OMAGGIO'}
            </span>
            {daysLeft <= 3 && <span style={{ fontSize: 9, color: '#fbbf24', fontWeight: 700, background: 'rgba(251,191,36,0.1)', borderRadius: 100, padding: '1px 6px' }}>⚠ {daysLeft}g rimasti</span>}
          </div>
          <p style={{ color: 'var(--text)', fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{coupon.title}</p>
          <p style={{ color: 'var(--meta-color)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={9} /> Fino al {formatDate(coupon.validUntil)}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={onEdit} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
              <Pencil size={13} />
            </button>
            <button onClick={onDelete} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(248,113,113,0.08)', color: '#f87171' }}>
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 16 }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>{coupon.usesCount || 0}</p>
          <p style={{ fontSize: 9, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Scaricati</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>{coupon.maxUses || '∞'}</p>
          <p style={{ fontSize: 9, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Max</p>
        </div>
        {coupon.maxUses > 0 && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: '#BB00FF', borderRadius: 2, width: `${Math.min(100, (coupon.usesCount / coupon.maxUses) * 100)}%`, transition: 'width 0.5s' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function HistoryCouponCard({ coupon }: { coupon: any }) {
  const expired = new Date(coupon.validUntil) < new Date()
  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 14, padding: '12px 16px', opacity: 0.75 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <p style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600 }}>{coupon.title}</p>
            <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 100, background: expired ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.05)', color: expired ? '#f87171' : 'rgba(240,237,232,0.35)' }}>
              {expired ? 'Scaduto' : 'Disattivo'}
            </span>
          </div>
          <p style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'DM Mono,monospace' }}>
            {formatDate(coupon.validFrom)} → {formatDate(coupon.validUntil)}
          </p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>{coupon.usesCount || 0}</p>
          <p style={{ fontSize: 9, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Scaricati</p>
        </div>
      </div>
    </div>
  )
}

function CouponFormModal({ coupon, onClose }: { coupon: any | null; onClose: () => void }) {
  const qc = useQueryClient()
  const isEdit = !!coupon
  const [form, setForm] = useState(coupon ? {
    title: coupon.title || '',
    description: coupon.description || '',
    discountType: coupon.discountType || 'percentage',
    discountValue: String(coupon.discountValue || 10),
    conditions: coupon.conditions || '',
    validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().split('T')[0] : today(),
    validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().split('T')[0] : '',
    maxUses: coupon.maxUses ? String(coupon.maxUses) : '',
  } : { ...EMPTY_FORM })

  const [error, setError] = useState('')
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        title: form.title,
        description: form.description,
        discountType: form.discountType,
        discountValue: parseFloat(form.discountValue),
        conditions: form.conditions,
        validFrom: form.validFrom,
        validUntil: form.validUntil,
        maxUses: form.maxUses ? parseInt(form.maxUses) : 0,
      }
      return isEdit ? venueApi.updateCoupon(coupon._id, payload) : venueApi.createCoupon(payload)
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['venue-coupons'] }); onClose() },
    onError: (e: any) => setError(e.response?.data?.error || 'Errore'),
  })

  const isValid = form.title && form.discountValue && form.validUntil

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={onClose}>
      <motion.div
        initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ background: '#0f0f1a', border: '1px solid var(--border)', borderRadius: '24px 24px 0 0', padding: 24, width: '100%', maxWidth: 520, maxHeight: '90dvh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ color: 'var(--text)', fontSize: 18, fontWeight: 700 }}>{isEdit ? 'Modifica coupon' : 'Nuovo coupon'}</h2>
          <button onClick={onClose} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'var(--surface)', color: 'var(--text-2)' }}><X size={16} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Titolo */}
          <div>
            <label style={{ display: 'block', fontSize: 10, color: 'var(--meta-color)', marginBottom: 6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Titolo *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Es: Aperitivo gratis con cena" style={field}
              onFocus={e => (e.target.style.borderColor = '#BB00FF')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>

          {/* Tipo sconto */}
          <div>
            <label style={{ display: 'block', fontSize: 10, color: 'var(--meta-color)', marginBottom: 6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Tipo di sconto</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {[
                { id: 'percentage', label: '% Percentuale' },
                { id: 'fixed', label: '€ Fisso' },
                { id: 'freebie', label: '🎁 Omaggio' },
              ].map(({ id, label }) => (
                <button key={id} onClick={() => set('discountType', id)} style={{
                  padding: '10px 0', borderRadius: 10, border: `1px solid ${form.discountType === id ? '#BB00FF' : 'rgba(255,255,255,0.1)'}`,
                  background: form.discountType === id ? 'rgba(187,0,255,0.15)' : 'transparent',
                  color: form.discountType === id ? '#BB00FF' : 'rgba(240,237,232,0.5)',
                  cursor: 'pointer', fontSize: 11, fontWeight: 700, transition: 'all 0.15s',
                }}>{label}</button>
              ))}
            </div>
          </div>

          {/* Valore */}
          {form.discountType !== 'freebie' && (
            <div>
              <label style={{ display: 'block', fontSize: 10, color: 'var(--meta-color)', marginBottom: 6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Valore {form.discountType === 'percentage' ? '(%)' : '(€)'} *
              </label>
              <input type="number" value={form.discountValue} onChange={e => set('discountValue', e.target.value)}
                placeholder={form.discountType === 'percentage' ? '10' : '5'} min="1" style={field}
                onFocus={e => (e.target.style.borderColor = '#BB00FF')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>
          )}

          {/* Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { k: 'validFrom', label: 'Valido dal *' },
              { k: 'validUntil', label: 'Valido fino al *' },
            ].map(({ k, label }) => (
              <div key={k}>
                <label style={{ display: 'block', fontSize: 10, color: 'var(--meta-color)', marginBottom: 6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{label}</label>
                <input type="date" value={(form as any)[k]} onChange={e => set(k, e.target.value)} min={today()}
                  style={{ ...field, colorScheme: 'dark' }}
                  onFocus={e => (e.target.style.borderColor = '#BB00FF')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              </div>
            ))}
          </div>

          {/* Max uses */}
          <div>
            <label style={{ display: 'block', fontSize: 10, color: 'var(--meta-color)', marginBottom: 6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Utilizzi massimi (0 = illimitati)</label>
            <input type="number" value={form.maxUses} onChange={e => set('maxUses', e.target.value)} placeholder="0" min="0" style={field}
              onFocus={e => (e.target.style.borderColor = '#BB00FF')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>

          {error && <p style={{ color: '#f87171', fontSize: 12, textAlign: 'center', background: 'rgba(248,113,113,0.1)', borderRadius: 8, padding: '8px 12px' }}>{error}</p>}

          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button onClick={onClose} style={{ flex: 1, padding: '13px', borderRadius: 12, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-2)', cursor: 'pointer', fontSize: 13 }}>Annulla</button>
            <button onClick={() => mutation.mutate()} disabled={!isValid || mutation.isPending}
              style={{ flex: 2, padding: '13px', borderRadius: 12, border: 'none', background: isValid ? 'linear-gradient(135deg,#BB00FF,#9000CC)' : 'rgba(255,255,255,0.08)', color: isValid ? '#fff' : 'rgba(240,237,232,0.3)', cursor: isValid ? 'pointer' : 'not-allowed', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {mutation.isPending ? 'Salvataggio...' : isEdit ? <><CheckCircle size={14} /> Salva modifiche</> : <><Plus size={14} /> Crea coupon</>}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
