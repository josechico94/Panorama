import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Tag, ChevronRight, Flame } from 'lucide-react'
import { couponsApi } from '@/lib/api'
import { getCategoryConfig } from '@/types'

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })
}

function daysLeft(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

export default function WeeklyOffersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['weekly-offers'],
    queryFn: () => couponsApi.active(),
    refetchInterval: 5 * 60 * 1000, // refresh ogni 5 min
  })

  const coupons = (data?.data ?? []).sort((a: any, b: any) =>
    new Date(a.validUntil).getTime() - new Date(b.validUntil).getTime()
  )

  const expiringSoon = coupons.filter((c: any) => daysLeft(c.validUntil) <= 3)
  const rest = coupons.filter((c: any) => daysLeft(c.validUntil) > 3)

  return (
    <div className="max-w-2xl mx-auto">
      {/* Hero */}
      <div className="px-4 pt-6 pb-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="accent-line" />
          <span className="font-mono-dm text-[var(--text-3)] text-[9px] tracking-[0.28em] uppercase">Questa settimana</span>
        </div>
        <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(32px,8vw,48px)', fontWeight: 700, color: 'var(--text)', lineHeight: 0.95, fontStyle: 'italic' }}>
          Offerte<br />
          <em style={{ color: 'var(--accent)', fontWeight: 300 }}>attive ora</em>
        </h1>
        <p className="text-[var(--text-3)] text-sm mt-3">
          {isLoading ? '...' : `${coupons.length} offert${coupons.length === 1 ? 'a' : 'e'} disponibil${coupons.length === 1 ? 'e' : 'i'} oggi`}
        </p>
      </div>

      {isLoading ? (
        <div className="px-4 space-y-3">
          {[1,2,3,4].map(i => <div key={i} className="skeleton rounded-2xl h-28" />)}
        </div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-20 px-4">
          <p className="text-4xl mb-3">🎫</p>
          <p className="text-[var(--text-2)] font-medium">Nessuna offerta attiva oggi</p>
          <p className="text-[var(--text-3)] text-sm mt-1">Torna presto — i locali aggiornano le offerte ogni settimana</p>
        </div>
      ) : (
        <div className="px-4 pb-8 space-y-6">
          {/* In scadenza */}
          {expiringSoon.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Flame size={14} color="#f87171" />
                <span style={{ fontSize: 10, color: '#f87171', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  In scadenza
                </span>
              </div>
              <div className="space-y-3">
                {expiringSoon.map((c: any, i: number) => <CouponCard key={c._id} coupon={c} index={i} urgent />)}
              </div>
            </div>
          )}

          {/* Tutte le offerte */}
          {rest.length > 0 && (
            <div>
              {expiringSoon.length > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={13} color="var(--accent)" />
                  <span style={{ fontSize: 10, color: 'rgba(240,237,232,0.4)', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    Tutte le offerte
                  </span>
                </div>
              )}
              <div className="space-y-3">
                {rest.map((c: any, i: number) => <CouponCard key={c._id} coupon={c} index={i} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function CouponCard({ coupon, index, urgent = false }: { coupon: any; index: number; urgent?: boolean }) {
  const place = coupon.placeId
  const cat = place ? getCategoryConfig(place.category) : null
  const days = daysLeft(coupon.validUntil)
  const usagePercent = coupon.maxUses > 0 ? Math.min(100, (coupon.usesCount / coupon.maxUses) * 100) : 0
  const almostGone = coupon.maxUses > 0 && usagePercent > 70

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <Link to={`/coupon/${coupon._id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: `1px solid ${urgent ? 'rgba(248,113,113,0.25)' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: 18, overflow: 'hidden', display: 'flex',
          transition: 'border-color 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = urgent ? 'rgba(248,113,113,0.5)' : 'rgba(232,98,42,0.35)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = urgent ? 'rgba(248,113,113,0.25)' : 'rgba(255,255,255,0.08)')}
        >
          {/* Place image */}
          <div style={{ width: 90, height: 90, flexShrink: 0, overflow: 'hidden' }}>
            <img
              src={place?.media?.coverImage || 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=200&q=70'}
              alt={place?.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Content */}
          <div style={{ flex: 1, padding: '12px 14px 10px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: 'rgba(240,237,232,0.5)', fontSize: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>
                  {cat?.emoji} {place?.name}
                </p>
                <p style={{ color: '#f0ede8', fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {coupon.title}
                </p>
              </div>
              <span style={{
                fontSize: 13, fontWeight: 800, color: '#e8622a', fontFamily: 'DM Mono,monospace',
                background: 'rgba(232,98,42,0.12)', border: '1px solid rgba(232,98,42,0.25)',
                borderRadius: 8, padding: '2px 8px', flexShrink: 0,
              }}>
                {coupon.discountType === 'percentage' ? `-${coupon.discountValue}%`
                  : coupon.discountType === 'fixed' ? `-€${coupon.discountValue}` : 'OMAGGIO'}
              </span>
            </div>

            {/* Footer row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
              <span style={{ fontSize: 9, color: urgent ? '#f87171' : 'rgba(240,237,232,0.35)', display: 'flex', alignItems: 'center', gap: 3, fontWeight: urgent ? 700 : 400 }}>
                <Clock size={9} />
                {days === 0 ? 'Scade oggi!' : days === 1 ? 'Scade domani' : `Fino al ${formatDate(coupon.validUntil)}`}
              </span>

              {coupon.maxUses > 0 && (
                <span style={{ fontSize: 9, color: almostGone ? '#fbbf24' : 'rgba(240,237,232,0.3)', display: 'flex', alignItems: 'center', gap: 3, fontWeight: almostGone ? 700 : 400 }}>
                  {almostGone ? '⚡' : ''} {coupon.maxUses - coupon.usesCount} rimasti
                </span>
              )}

              <ChevronRight size={12} style={{ marginLeft: 'auto', color: 'var(--accent)', flexShrink: 0 }} />
            </div>

            {/* Usage bar */}
            {coupon.maxUses > 0 && (
              <div style={{ height: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 1, marginTop: 6, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: almostGone ? '#fbbf24' : 'var(--accent)', borderRadius: 1, width: `${usagePercent}%`, transition: 'width 0.5s' }} />
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
