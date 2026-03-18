import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { superAdminApi } from '@/lib/api'
import { Trash2, Tag } from 'lucide-react'

const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }

export default function SACoupons() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['sa-coupons'], queryFn: () => superAdminApi.listCoupons() })

  const deleteMutation = useMutation({
    mutationFn: superAdminApi.deleteCoupon,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sa-coupons'] }),
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => superAdminApi.updateCoupon(id, { active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sa-coupons'] }),
  })

  const coupons = data?.data ?? []
  const now = new Date()

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 28, fontWeight: 700, color: '#f0ede8' }}>Coupon</h1>
        <p style={{ color: 'rgba(240,237,232,0.35)', fontSize: 12, marginTop: 2 }}>{data?.total ?? 0} totali</p>
      </div>

      <div style={card}>
        {isLoading ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'rgba(240,237,232,0.3)' }}>Caricamento...</div>
        ) : coupons.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'rgba(240,237,232,0.3)' }}>
            <Tag size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p>Nessun coupon</p>
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
                  <tr key={c._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px 16px', color: '#f0ede8', fontSize: 13, fontWeight: 600 }}>{c.title}</td>
                    <td style={{ padding: '12px 16px', color: 'rgba(240,237,232,0.45)', fontSize: 12 }}>{(c.placeId as any)?.name || '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#e8622a', fontFamily: 'DM Mono,monospace', background: 'rgba(232,98,42,0.1)', padding: '2px 7px', borderRadius: 6 }}>
                        {c.discountType === 'percentage' ? `-${c.discountValue}%` : c.discountType === 'fixed' ? `-€${c.discountValue}` : 'OMAGGIO'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'rgba(240,237,232,0.35)', fontSize: 11, fontFamily: 'DM Mono,monospace' }}>
                      {new Date(c.validFrom).toLocaleDateString('it-IT')} → {new Date(c.validUntil).toLocaleDateString('it-IT')}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'rgba(240,237,232,0.45)', fontSize: 12, textAlign: 'center' }}>{c.usesCount}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={() => toggleMutation.mutate({ id: c._id, active: !c.active })} style={{
                        fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 100, border: 'none', cursor: 'pointer',
                        background: isActive ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)',
                        color: isActive ? '#4ade80' : expired ? '#f87171' : 'rgba(240,237,232,0.3)',
                      }}>
                        {expired ? 'Scaduto' : c.active ? 'Attivo' : 'Disattivo'}
                      </button>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button onClick={() => confirm(`Eliminare "${c.title}"?`) && deleteMutation.mutate(c._id)}
                        style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: 'rgba(240,237,232,0.3)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f87171' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(240,237,232,0.3)' }}>
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
