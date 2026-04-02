import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Send, Trash2 } from 'lucide-react'
import { reviewsApi } from '@/lib/api'
import { useUserStore } from '@/store'
import { useNavigate } from 'react-router-dom'

function Stars({ rating, interactive = false, onRate }: { rating: number; interactive?: boolean; onRate?: (r: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1,2,3,4,5].map(i => (
        <button key={i}
          onClick={() => interactive && onRate?.(i)}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
          style={{ background: 'none', border: 'none', cursor: interactive ? 'pointer' : 'default', padding: 0, lineHeight: 0 }}
        >
          <Star
            size={interactive ? 22 : 12}
            fill={(hover || rating) >= i ? '#f59e0b' : 'transparent'}
            color={(hover || rating) >= i ? '#f59e0b' : 'rgba(240,237,232,0.2)'}
            style={{ transition: 'all 0.1s' }}
          />
        </button>
      ))}
    </div>
  )
}

export default function PlaceReviews({ placeId }: { placeId: string }) {
  const { isLoggedIn, user } = useUserStore()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [showForm, setShowForm] = useState(false)

  const { data } = useQuery({
    queryKey: ['reviews', placeId],
    queryFn: () => reviewsApi.forPlace(placeId),
  })

  const createMutation = useMutation({
    mutationFn: () => reviewsApi.create(placeId, { rating, comment }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews', placeId] })
      setRating(0); setComment(''); setShowForm(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: reviewsApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reviews', placeId] }),
  })

  const reviews = data?.data ?? []
  const stats = data?.stats

  return (
    <div>
      {/* Stats */}
      {stats && stats.total > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px',
          background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: 16, marginBottom: 16,
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#f59e0b', lineHeight: 1 }}>{stats.avg}</p>
            <Stars rating={Math.round(stats.avg)} />
            <p style={{ fontSize: 10, color: 'rgba(240,237,232,0.4)', marginTop: 3 }}>{stats.total} recens.</p>
          </div>
          <div style={{ flex: 1 }}>
            {[5,4,3,2,1].map(n => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <span style={{ fontSize: 10, color: 'rgba(240,237,232,0.4)', width: 8 }}>{n}</span>
                <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', background: '#f59e0b', borderRadius: 2,
                    width: `${stats.total > 0 ? (stats.distribution[n] / stats.total) * 100 : 0}%`,
                    transition: 'width 0.5s ease',
                  }} />
                </div>
                <span style={{ fontSize: 10, color: 'rgba(240,237,232,0.35)', width: 16, textAlign: 'right' }}>{stats.distribution[n]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Write review CTA */}
      {!showForm && (
        <button
          onClick={() => isLoggedIn() ? setShowForm(true) : navigate('/accedi', { state: { from: `/place/${placeId}` } })}
          style={{
            width: '100%', padding: '12px', borderRadius: 14, border: '1px dashed rgba(245,158,11,0.3)',
            background: 'rgba(245,158,11,0.05)', color: 'rgba(240,237,232,0.5)',
            cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            marginBottom: 16, transition: 'all 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(245,158,11,0.1)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(245,158,11,0.05)')}
        >
          <Star size={14} color="#f59e0b" /> Scrivi una recensione
        </button>
      )}

      {/* Review form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{
              background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: 16, padding: 16, marginBottom: 16, overflow: 'hidden',
            }}
          >
            <p style={{ color: 'rgba(240,237,232,0.5)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 10 }}>
              La tua recensione
            </p>
            <div style={{ marginBottom: 12 }}>
              <Stars rating={rating} interactive onRate={setRating} />
            </div>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Racconta la tua esperienza... (opzionale)"
              rows={3}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 10,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#f0ede8', fontSize: 13, outline: 'none', resize: 'none',
                fontFamily: 'DM Sans,sans-serif', boxSizing: 'border-box',
                marginBottom: 10,
              }}
              onFocus={e => (e.target.style.borderColor = '#f59e0b')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
            {createMutation.isError && (
              <p style={{ color: '#f87171', fontSize: 11, marginBottom: 8 }}>
                {(createMutation.error as any)?.response?.data?.error || 'Errore'}
              </p>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '9px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(240,237,232,0.4)', cursor: 'pointer', fontSize: 12 }}>
                Annulla
              </button>
              <button
                onClick={() => createMutation.mutate()}
                disabled={rating === 0 || createMutation.isPending}
                style={{ flex: 2, padding: '9px', borderRadius: 10, border: 'none', background: rating > 0 ? '#f59e0b' : 'rgba(255,255,255,0.08)', color: rating > 0 ? '#000' : 'rgba(240,237,232,0.3)', cursor: rating > 0 ? 'pointer' : 'not-allowed', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s' }}
              >
                <Send size={12} /> {createMutation.isPending ? 'Invio...' : 'Pubblica'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {reviews.length === 0 && !showForm && (
          <p style={{ color: 'rgba(240,237,232,0.3)', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>
            Ancora nessuna recensione. Sii il primo!
          </p>
        )}
        {reviews.map((r: any) => {
          const isOwn = user && (r.userId as any)?._id === user.id
          return (
            <div key={r._id} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14, padding: '12px 14px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#f59e0b', fontSize: 10, fontWeight: 700 }}>{(r.userId as any)?.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <span style={{ color: '#f0ede8', fontSize: 12, fontWeight: 600 }}>{(r.userId as any)?.name}</span>
                  <Stars rating={r.rating} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: 'rgba(240,237,232,0.25)', fontSize: 10, fontFamily: 'DM Mono,monospace' }}>
                    {new Date(r.createdAt).toLocaleDateString('it-IT')}
                  </span>
                  {isOwn && (
                    <button onClick={() => deleteMutation.mutate(r._id)}
                      style={{ padding: 4, borderRadius: 6, border: 'none', cursor: 'pointer', background: 'transparent', color: 'rgba(240,237,232,0.2)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,237,232,0.2)')}>
                      <Trash2 size={11} />
                    </button>
                  )}
                </div>
              </div>
              {r.comment && <p style={{ color: 'rgba(240,237,232,0.6)', fontSize: 12, lineHeight: 1.5 }}>{r.comment}</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
