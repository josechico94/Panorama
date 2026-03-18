import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { superAdminApi } from '@/lib/api'
import { Trash2, Star } from 'lucide-react'

const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={11} fill={i <= rating ? '#f59e0b' : 'transparent'} color={i <= rating ? '#f59e0b' : 'rgba(240,237,232,0.2)'} />
      ))}
    </div>
  )
}

export default function SAReviews() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['sa-reviews'], queryFn: () => superAdminApi.listReviews() })

  const deleteMutation = useMutation({
    mutationFn: superAdminApi.deleteReview,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sa-reviews'] }),
  })

  const reviews = data?.data ?? []

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 28, fontWeight: 700, color: '#f0ede8' }}>Recensioni</h1>
        <p style={{ color: 'rgba(240,237,232,0.35)', fontSize: 12, marginTop: 2 }}>{data?.total ?? 0} totali</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {isLoading ? (
          <div style={{ ...card, padding: 32, textAlign: 'center', color: 'rgba(240,237,232,0.3)' }}>Caricamento...</div>
        ) : reviews.length === 0 ? (
          <div style={{ ...card, padding: 48, textAlign: 'center', color: 'rgba(240,237,232,0.3)' }}>
            <Star size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p>Nessuna recensione</p>
          </div>
        ) : (
          reviews.map((r: any) => (
            <div key={r._id} style={{ ...card, padding: 16, display: 'flex', gap: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#f59e0b', fontSize: 13, fontWeight: 700 }}>{(r.userId as any)?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ color: '#f0ede8', fontSize: 13, fontWeight: 600 }}>{(r.userId as any)?.name}</span>
                  <Stars rating={r.rating} />
                  <span style={{ color: 'rgba(240,237,232,0.3)', fontSize: 11, marginLeft: 'auto' }}>
                    {(r.placeId as any)?.name}
                  </span>
                </div>
                {r.comment && <p style={{ color: 'rgba(240,237,232,0.55)', fontSize: 12, lineHeight: 1.5 }}>{r.comment}</p>}
                <p style={{ color: 'rgba(240,237,232,0.25)', fontSize: 10, fontFamily: 'DM Mono,monospace', marginTop: 4 }}>
                  {new Date(r.createdAt).toLocaleDateString('it-IT')}
                </p>
              </div>
              <button onClick={() => confirm('Eliminare questa recensione?') && deleteMutation.mutate(r._id)}
                style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: 'rgba(240,237,232,0.3)', alignSelf: 'flex-start' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f87171' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(240,237,232,0.3)' }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
