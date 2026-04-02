import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { superAdminApi } from '@/lib/api'
import { Trash2, Tag, Search, Pencil, X, Plus } from 'lucide-react'

const C = {
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' } as React.CSSProperties,
  field: { width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'DM Sans,sans-serif' },
  label: { display: 'block' as const, fontSize: 10, fontWeight: 700 as const, color: 'var(--meta-color)', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.12em' },
}

const today = () => new Date().toISOString().split('T')[0]

export default function SACoupons() {
  const [search, setSearch] = useState('')
  const [filterActive, setFilterActive] = useState('')
  const [showExpired, setShowExpired] = useState(false)
  const [editCoupon, setEditCoupon] = useState<any>(null)
  const qc = useQueryClient()

  const params: Record<string, any> = {}
  if (filterActive !== '') params.active = filterActive
  if (search) params.search = search

  const { data, isLoading } = useQuery({
    queryKey: ['sa-coupons', search, filterActive, showExpired],
    queryFn: () => superAdminApi.listCoupons(Object.keys(params).length ? params : undefined),
  })

  const deleteMutation = useMutation({
    mutationFn: superAdminApi.deleteCoupon,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sa-coupons'] }),
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => superAdminApi.updateCoupon(id, { active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sa-coupons'] }),
  })

  const now = new Date()
  const allCoupons = data?.data ?? []
  const coupons = showExpired ? allCoupons : allCoupons.filter((c: any) => new Date(c.validUntil) >= now)

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 28, fontWeight: 700, color: 'var(--text)' }}>Coupon</h1>
        <p style={{ color: 'var(--text-3)', fontSize: 12, marginTop: 2 }}>{coupons.length} mostrati</p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca per titolo coupon..."
          style={{ ...C.field, paddingLeft: 36 }} />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {[{ value: '', label: 'Tutti' }, { value: 'true', label: '✅ Attivi' }, { value: 'false', label: '⏸ Disattivi' }].map(({ value, label }) => (
          <button key={value} onClick={() => setFilterActive(value)} style={{
            padding: '5px 12px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700,
            background: filterActive === value ? 'rgba(187,0,255,0.15)' : 'rgba(255,255,255,0.04)',
            color: filterActive === value ? '#BB00FF' : 'rgba(240,237,232,0.45)',
          }}>{label}</button>
        ))}
        <button onClick={() => setShowExpired(s => !s)} style={{
          padding: '5px 12px', borderRadius: 100, cursor: 'pointer', fontSize: 11, fontWeight: 700,
          border: `1px solid ${showExpired ? 'rgba(251,191,36,0.4)' : 'transparent'}`,
          background: showExpired ? 'rgba(251,191,36,0.1)' : 'rgba(255,255,255,0.04)',
          color: showExpired ? '#fbbf24' : 'rgba(240,237,232,0.45)',
        }}>⏰ {showExpired ? 'Nascondi scaduti' : 'Mostra scaduti'}</button>
      </div>

      <div style={C.card}>
        {isLoading ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-3)' }}>Caricamento...</div>
        ) : coupons.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-3)' }}>
            <Tag size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p>{search ? 'Nessun risultato' : 'Nessun coupon'}</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Titolo', 'Locale', 'Sconto', 'Validità', 'Scaricati', 'Stato', ''].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coupons.map((c: any) => {
                const expired = new Date(c.validUntil) < now
                const isActive = c.active && !expired
                return (
                  <tr key={c._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', opacity: expired ? 0.5 : 1 }}>
                    <td style={{ padding: '12px 16px', color: 'var(--text)', fontSize: 13, fontWeight: 600 }}>{c.title}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-2)', fontSize: 12 }}>{(c.placeId as any)?.name || '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#BB00FF', fontFamily: 'DM Mono,monospace', background: 'rgba(187,0,255,0.1)', padding: '2px 7px', borderRadius: 6 }}>
                        {c.discountType === 'percentage' ? `-${c.discountValue}%` : c.discountType === 'fixed' ? `-€${c.discountValue}` : 'OMAGGIO'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-3)', fontSize: 11, fontFamily: 'DM Mono,monospace', whiteSpace: 'nowrap' }}>
                      {new Date(c.validFrom).toLocaleDateString('it-IT')} → {new Date(c.validUntil).toLocaleDateString('it-IT')}
                      {expired && <span style={{ marginLeft: 6, color: '#f87171', fontSize: 9, fontWeight: 700 }}>SCADUTO</span>}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-2)', fontSize: 12, textAlign: 'center' }}>{c.usesCount}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => !expired && toggleMutation.mutate({ id: c._id, active: !c.active })} disabled={expired}
                        style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 100, border: 'none', cursor: expired ? 'default' : 'pointer', background: isActive ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)', color: isActive ? '#4ade80' : expired ? '#f87171' : 'rgba(240,237,232,0.3)' }}>
                        {expired ? 'Scaduto' : c.active ? 'Attivo' : 'Disattivo'}
                      </button>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <button onClick={() => setEditCoupon(c)}
                          style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: '#3b82f6' }}
                          onMouseEnter={e => (e.currentTarget as any).style.background = 'rgba(59,130,246,0.1)'}
                          onMouseLeave={e => (e.currentTarget as any).style.background = 'transparent'}>
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => confirm(`Eliminare "${c.title}"?`) && deleteMutation.mutate(c._id)}
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

      {editCoupon && <CouponEditModal coupon={editCoupon} onClose={() => setEditCoupon(null)} />}
    </div>
  )
}

function CouponEditModal({ coupon, onClose }: { coupon: any; onClose: () => void }) {
  const qc = useQueryClient()
  const [form, setForm] = useState({
    title: coupon.title || '',
    discountType: coupon.discountType || 'percentage',
    discountValue: String(coupon.discountValue || 10),
    validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().split('T')[0] : today(),
    validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().split('T')[0] : '',
    maxUses: coupon.maxUses ? String(coupon.maxUses) : '0',
    active: coupon.active !== false,
    conditions: coupon.conditions || '',
  })
  const [error, setError] = useState('')
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const mutation = useMutation({
    mutationFn: () => superAdminApi.updateCoupon(coupon._id, {
      title: form.title,
      discountType: form.discountType,
      discountValue: parseFloat(form.discountValue),
      validFrom: form.validFrom,
      validUntil: form.validUntil,
      maxUses: parseInt(form.maxUses) || 0,
      active: form.active,
      conditions: form.conditions,
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sa-coupons'] }); onClose() },
    onError: (e: any) => setError(e.response?.data?.error || 'Errore'),
  })

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={onClose}>
      <div style={{ background: '#0f0f1a', border: '1px solid var(--border)', borderRadius: 20, padding: 24, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <h2 style={{ color: 'var(--text)', fontSize: 18, fontWeight: 700 }}>Modifica coupon</h2>
          <button onClick={onClose} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'var(--surface)', color: 'var(--text-2)' }}><X size={15} /></button>
        </div>
        <p style={{ color: 'var(--text-3)', fontSize: 12, marginBottom: 20 }}>
          Locale: <span style={{ color: '#BB00FF' }}>{(coupon.placeId as any)?.name || '—'}</span>
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={C.label}>Titolo *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} style={C.field}
              onFocus={e => (e.target.style.borderColor = '#BB00FF')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>

          <div>
            <label style={C.label}>Tipo sconto</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {[{ id: 'percentage', label: '% Percentuale' }, { id: 'fixed', label: '€ Fisso' }, { id: 'freebie', label: '🎁 Omaggio' }].map(({ id, label }) => (
                <button key={id} onClick={() => set('discountType', id)} style={{
                  padding: '9px 0', borderRadius: 10, border: `1px solid ${form.discountType === id ? '#BB00FF' : 'rgba(255,255,255,0.1)'}`,
                  background: form.discountType === id ? 'rgba(187,0,255,0.15)' : 'transparent',
                  color: form.discountType === id ? '#BB00FF' : 'rgba(240,237,232,0.5)',
                  cursor: 'pointer', fontSize: 11, fontWeight: 700,
                }}>{label}</button>
              ))}
            </div>
          </div>

          {form.discountType !== 'freebie' && (
            <div>
              <label style={C.label}>Valore {form.discountType === 'percentage' ? '(%)' : '(€)'}</label>
              <input type="number" value={form.discountValue} onChange={e => set('discountValue', e.target.value)} min="1" style={C.field}
                onFocus={e => (e.target.style.borderColor = '#BB00FF')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[{ k: 'validFrom', label: 'Valido dal' }, { k: 'validUntil', label: 'Valido fino al' }].map(({ k, label }) => (
              <div key={k}>
                <label style={C.label}>{label}</label>
                <input type="date" value={(form as any)[k]} onChange={e => set(k, e.target.value)}
                  style={{ ...C.field, colorScheme: 'dark' }}
                  onFocus={e => (e.target.style.borderColor = '#BB00FF')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              </div>
            ))}
          </div>

          <div>
            <label style={C.label}>Utilizzi massimi (0 = illimitati)</label>
            <input type="number" value={form.maxUses} onChange={e => set('maxUses', e.target.value)} min="0" style={C.field}
              onFocus={e => (e.target.style.borderColor = '#BB00FF')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>

          <div>
            <label style={C.label}>Condizioni</label>
            <input value={form.conditions} onChange={e => set('conditions', e.target.value)} placeholder="Es: valido solo la sera" style={C.field}
              onFocus={e => (e.target.style.borderColor = '#BB00FF')} onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-2)' }}>
            <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} style={{ accentColor: '#BB00FF', width: 15, height: 15 }} />
            ✅ Coupon attivo
          </label>

          {error && <p style={{ color: '#f87171', fontSize: 12, textAlign: 'center', background: 'rgba(248,113,113,0.1)', borderRadius: 8, padding: '8px 12px' }}>{error}</p>}

          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-2)', cursor: 'pointer', fontSize: 13 }}>Annulla</button>
            <button onClick={() => mutation.mutate()} disabled={!form.title || mutation.isPending}
              style={{ flex: 2, padding: '11px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#BB00FF,#9000CC)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, opacity: mutation.isPending ? 0.7 : 1 }}>
              {mutation.isPending ? 'Salvataggio...' : 'Salva modifiche'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
