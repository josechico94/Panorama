import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Tag, ChevronRight, Flame, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'
import { couponsApi } from '@/lib/api'
import { getCategoryConfig } from '@/types'

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })
}

function daysLeft(d: string) {
  return Math.ceil((new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

// ── Real-time countdown hook ──
function useCountdown(targetDate: string) {
  const calc = () => {
    const diff = new Date(targetDate).getTime() - Date.now()
    if (diff <= 0) return { h: 0, m: 0, s: 0, expired: true }
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000) / 1000)
    return { h, m, s, expired: false }
  }
  const [time, setTime] = useState(calc)
  useEffect(() => {
    const interval = setInterval(() => setTime(calc()), 1000)
    return () => clearInterval(interval)
  }, [targetDate])
  return time
}

export default function WeeklyOffersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['weekly-offers'],
    queryFn: () => couponsApi.active(),
    refetchInterval: 5 * 60 * 1000,
  })

  const coupons = (data?.data ?? []).sort((a: any, b: any) =>
    new Date(a.validUntil).getTime() - new Date(b.validUntil).getTime()
  )

  const expiringSoon = coupons.filter((c: any) => daysLeft(c.validUntil) <= 1)
  const expiring3    = coupons.filter((c: any) => daysLeft(c.validUntil) > 1 && daysLeft(c.validUntil) <= 3)
  const rest         = coupons.filter((c: any) => daysLeft(c.validUntil) > 3)

  return (
    <div style={{ maxWidth: 672, margin: '0 auto' }}>
      {/* ── Hero ── */}
      <div style={{ padding: '24px 16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <span className="accent-line" />
          <span style={{ fontFamily: 'DM Mono', fontSize: 9, color: 'var(--meta-color)', letterSpacing: '0.28em', textTransform: 'uppercase' }}>Questa settimana</span>
        </div>
        <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(32px,8vw,48px)', fontWeight: 700, color: 'var(--text)', lineHeight: 0.95, fontStyle: 'italic', marginBottom: 10 }}>
          Offerte<br />
          <em style={{ color: 'var(--accent)', fontWeight: 300 }}>attive ora</em>
        </h1>
        <p style={{ color: 'var(--text-3)', fontSize: 13 }}>
          {isLoading ? '...' : `${coupons.length} offert${coupons.length === 1 ? 'a' : 'e'} disponibil${coupons.length === 1 ? 'e' : 'i'} oggi`}
        </p>
      </div>

      {isLoading ? (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 96, borderRadius: 18 }} />)}
        </div>
      ) : coupons.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <p style={{ fontSize: 44, marginBottom: 12 }}>🎫</p>
          <p style={{ color: 'var(--text)', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Nessuna offerta attiva oggi</p>
          <p style={{ color: 'var(--text-3)', fontSize: 13 }}>Torna presto — i locali aggiornano le offerte ogni settimana</p>
        </div>
      ) : (
        <div style={{ padding: '0 16px 40px', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* ── Scadono oggi ── */}
          {expiringSoon.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <Flame size={14} color="#f87171" />
                <span style={{ fontSize: 10, color: '#f87171', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  Scadono oggi — affrettati!
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {expiringSoon.map((c: any, i: number) => (
                  <CouponCard key={c._id} coupon={c} index={i} urgency="critical" />
                ))}
              </div>
            </div>
          )}

          {/* ── Scadono a breve ── */}
          {expiring3.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <Zap size={13} color="#fbbf24" />
                <span style={{ fontSize: 10, color: '#fbbf24', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  In scadenza
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {expiring3.map((c: any, i: number) => (
                  <CouponCard key={c._id} coupon={c} index={i} urgency="warning" />
                ))}
              </div>
            </div>
          )}

          {/* ── Tutte le offerte ── */}
          {rest.length > 0 && (
            <div>
              {(expiringSoon.length > 0 || expiring3.length > 0) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <Tag size={13} color="var(--accent)" />
                  <span style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    Tutte le offerte
                  </span>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {rest.map((c: any, i: number) => (
                  <CouponCard key={c._id} coupon={c} index={i} urgency="normal" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function CouponCard({ coupon, index, urgency }: { coupon: any; index: number; urgency: 'critical' | 'warning' | 'normal' }) {
  const place = coupon.placeId
  const cat = place ? getCategoryConfig(place.category) : null
  const days = daysLeft(coupon.validUntil)
  const usagePercent = coupon.maxUses > 0 ? Math.min(100, (coupon.usesCount / coupon.maxUses) * 100) : 0
  const almostGone = coupon.maxUses > 0 && usagePercent > 70

  // Countdown only for coupons expiring today
  const countdown = useCountdown(coupon.validUntil)
  const showCountdown = urgency === 'critical'

  const borderColor = urgency === 'critical' ? 'rgba(248,113,113,0.3)'
    : urgency === 'warning' ? 'rgba(251,191,36,0.25)'
    : 'var(--border)'

  const hoverBorderColor = urgency === 'critical' ? 'rgba(248,113,113,0.55)'
    : urgency === 'warning' ? 'rgba(251,191,36,0.45)'
    : 'rgba(187,0,255,0.3)'

  const discountLabel = coupon.discountType === 'percentage' ? `-${coupon.discountValue}%`
    : coupon.discountType === 'fixed' ? `-€${coupon.discountValue}` : 'OMAGGIO'

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <Link to={`/coupon/${coupon._id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{ background: 'var(--surface)', border: `1px solid ${borderColor}`, borderRadius: 18, overflow: 'hidden', display: 'flex', transition: 'border-color 0.2s, transform 0.2s', cursor: 'pointer' }}
          onMouseEnter={e => { (e.currentTarget as any).style.borderColor = hoverBorderColor; (e.currentTarget as any).style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { (e.currentTarget as any).style.borderColor = borderColor; (e.currentTarget as any).style.transform = 'translateY(0)' }}>

          {/* Place image */}
          <div style={{ width: 90, height: 'auto', minHeight: 90, flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
            <img src={place?.media?.coverImage || 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=200&q=70'} alt={place?.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 90 }} />
            {/* Urgency overlay */}
            {urgency === 'critical' && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(248,113,113,0.15)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 4 }}>
                <span style={{ fontSize: 8, fontWeight: 800, color: '#f87171', letterSpacing: '0.1em' }}>OGGI</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div style={{ flex: 1, padding: '12px 14px', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: 'var(--meta-color)', fontSize: 9, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 3 }}>
                    {cat?.emoji} {place?.name}
                  </p>
                  <p style={{ color: 'var(--text)', fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {coupon.title}
                  </p>
                </div>
                {/* Discount badge */}
                <span style={{ fontSize: 12, fontWeight: 800, color: '#BB00FF', fontFamily: 'DM Mono', background: 'rgba(187,0,255,0.1)', border: '1px solid rgba(187,0,255,0.25)', borderRadius: 8, padding: '3px 8px', flexShrink: 0 }}>
                  {discountLabel}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
              {/* Countdown or date */}
              {showCountdown && !countdown.expired ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 6, padding: '3px 8px' }}>
                  <Clock size={9} color="#f87171" />
                  <span style={{ fontSize: 10, fontWeight: 800, color: '#f87171', fontFamily: 'DM Mono', letterSpacing: '0.05em' }}>
                    {String(countdown.h).padStart(2,'0')}:{String(countdown.m).padStart(2,'0')}:{String(countdown.s).padStart(2,'0')}
                  </span>
                </div>
              ) : (
                <span style={{ fontSize: 9, color: urgency === 'warning' ? '#fbbf24' : 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 3, fontWeight: urgency !== 'normal' ? 700 : 400 }}>
                  <Clock size={9} />
                  {days === 0 ? 'Scade oggi!' : days === 1 ? 'Scade domani' : `Fino al ${formatDate(coupon.validUntil)}`}
                </span>
              )}

              {/* Remaining uses */}
              {coupon.maxUses > 0 && (
                <span style={{ fontSize: 9, color: almostGone ? '#fbbf24' : 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 3, fontWeight: almostGone ? 700 : 400 }}>
                  {almostGone && '⚡'} {coupon.maxUses - coupon.usesCount} rimasti
                </span>
              )}

              <ChevronRight size={12} style={{ marginLeft: 'auto', color: 'var(--accent)', flexShrink: 0 }} />
            </div>

            {/* Usage progress bar */}
            {coupon.maxUses > 0 && (
              <div style={{ height: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 1, marginTop: 8, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: almostGone ? '#fbbf24' : 'var(--accent)', borderRadius: 1, width: `${usagePercent}%`, transition: 'width 0.5s' }} />
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
