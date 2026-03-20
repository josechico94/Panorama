import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { superAdminApi } from '@/lib/api'
import { Trash2, Tag, Search } from 'lucide-react'

const C = {
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' } as React.CSSProperties,
  field: { width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f0ede8', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'DM Sans,sans-serif' },
}

export default function SACoupons() {
  const [search, setSearch] = useState('')
  const [filterActive, setFilterActive] = useState('')
  const [showExpired, setShowExpired] = useState(false)
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
        <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 28, fontWeight: 700, color: '#f0ede8' }}>Coupon</h1>
        <p style={{ color: 'rgba(240,237,232,0.35)', fontSize: 12, marginTop: 2 }}>{coupons.length} mostrati</p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,237,232,0.3)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca per titolo coupon..."
          style={{ ...C.field, paddingLeft: 36 }} />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { value: '', label: 'Tutti' },
          { value: 'true', label: '✅ Attivi' },
          { value: 'false', label: '⏸ Disattivi' },
        ].map(({ value, label }) => (
          <button key={value} onClick={() => setFilterActive(value)} style={{
            padding: '5px 12px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700,
            background: filterActive === value ? 'rgba(232,98,42,0.15)' : 'rgba(255,255,255,0.04)',
            color: filterActive === value ? '#e8622a' : 'rgba(240,237,232,0.45)',
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
          <div style={{ padding: 32, textAlign: 'center', color: 'rgba(240,237,232,0.3)' }}>Caricamento...</div>
        ) : coupons.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'rgba(240,237,232,0.3)' }}>
            <Tag size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p>{search ? 'Nessun risultato' : 'Nessun coupon'}</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Titolo', 'Locale', 'Sconto', 'Validità', 'Scaricati', 'Stato', ''].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'rgba(240,237,232,0.3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coupons.map((c: any) => {
                const expired = new Date(c.validUntil) < now
                const isActive = c.active && !expired
                return (
                  <tr key={c._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', opacity: expired ? 0.5 : 1 }}>
                    <td style={{ padding: '12px 16px', color: '#f0ede8', fontSize: 13, fontWeight: 600 }}>{c.title}</td>
                    <td style={{ padding: '12px 16px', color: 'rgba(240,237,232,0.45)', fontSize: 12 }}>{(c.placeId as any)?.name || '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#e8622a', fontFamily: 'DM Mono,monospace', background: 'rgba(232,98,42,0.1)', padding: '2px 7px', borderRadius: 6 }}>
                        {c.discountType === 'percentage' ? `-${c.discountValue}%` : c.discountType === 'fixed' ? `-€${c.discountValue}` : 'OMAGGIO'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'rgba(240,237,232,0.35)', fontSize: 11, fontFamily: 'DM Mono,monospace', whiteSpace: 'nowrap' }}>
                      {new Date(c.validFrom).toLocaleDateString('it-IT')} → {new Date(c.validUntil).toLocaleDateString('it-IT')}
                      {expired && <span style={{ marginLeft: 6, color: '#f87171', fontSize: 9, fontWeight: 700 }}>SCADUTO</span>}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'rgba(240,237,232,0.45)', fontSize: 12, textAlign: 'center' }}>{c.usesCount}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => !expired && toggleMutation.mutate({ id: c._id, active: !c.active })}
                        disabled={expired}
                        style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 100, border: 'none', cursor: expired ? 'default' : 'pointer', background: isActive ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)', color: isActive ? '#4ade80' : expired ? '#f87171' : 'rgba(240,237,232,0.3)' }}>
                        {expired ? 'Scaduto' : c.active ? 'Attivo' : 'Disattivo'}
                      </button>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button onClick={() => confirm(`Eliminare "${c.title}"?`) && deleteMutation.mutate(c._id)}
                        style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: 'rgba(240,237,232,0.3)' }}
                        onMouseEnter={e => (e.currentTarget as any).style.color = '#f87171'}
                        onMouseLeave={e => (e.currentTarget as any).style.color = 'rgba(240,237,232,0.3)'}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
