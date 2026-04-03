import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Zap, X, ChevronRight } from 'lucide-react'
import { couponsApi } from '@/lib/api'

export default function CouponSlider() {
  const [dismissed, setDismissed] = useState(false)

  const { data } = useQuery({
    queryKey: ['active-coupons-slider'],
    queryFn: () => couponsApi.active(),
    refetchInterval: 5 * 60 * 1000,
  })

  const coupons = data?.data ?? []
  if (!coupons.length || dismissed) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        style={{
          position: 'fixed', bottom: 60, left: 0, right: 0, zIndex: 38,
          background: 'var(--bg2)',
          borderTop: '1px solid rgba(187,0,255,0.25)',
          boxShadow: '0 -4px 24px rgba(187,0,255,0.15)',
        }}
      >
        {/* Header row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 14px 6px',
          borderBottom: '1px solid rgba(187,0,255,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Zap size={11} color="#BB00FF" fill="#BB00FF" />
            <span style={{ fontSize: 9, fontWeight: 800, color: '#BB00FF', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'DM Mono' }}>
              OFFERTE ATTIVE
            </span>
            <span style={{ fontSize: 9, fontWeight: 800, background: 'rgba(187,0,255,0.15)', border: '1px solid rgba(187,0,255,0.35)', borderRadius: 20, minWidth: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#BB00FF', fontFamily: 'DM Mono', padding: '0 4px' }}>
              {coupons.length}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link to="/offerte" style={{ display: 'flex', alignItems: 'center', gap: 2, color: 'var(--text-3)', textDecoration: 'none', fontSize: 10, fontWeight: 600 }}>
              Vedi tutte <ChevronRight size={11} />
            </Link>
            <button onClick={() => setDismissed(true)} style={{ width: 18, height: 18, borderRadius: 5, border: 'none', background: 'rgba(255,255,255,0.06)', color: 'var(--text-3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={9} />
            </button>
          </div>
        </div>

        {/* Coupon cards row */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '8px 14px', scrollbarWidth: 'none' }}>
          {coupons.map((c: any) => {
            const discount = c.discountType === 'percentage' ? `-${c.discountValue}%`
              : c.discountType === 'fixed' ? `-€${c.discountValue}` : 'OMAGGIO'
            return (
              <Link key={c._id} to={`/coupon/${c._id}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
                <motion.div
                  whileTap={{ scale: 0.96 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 12, overflow: 'hidden',
                    minWidth: 160, maxWidth: 200,
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(187,0,255,0.35)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                >
                  {/* Place image */}
                  <div style={{ width: 48, height: 52, flexShrink: 0, overflow: 'hidden' }}>
                    <img
                      src={c.placeId?.media?.coverImage || 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=100&q=70'}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0, padding: '6px 0' }}>
                    <p style={{ color: 'var(--text)', fontSize: 11, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.placeId?.name || 'Locale'}
                    </p>
                    <p style={{ color: 'var(--meta-color)', fontSize: 9, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>
                      {c.title}
                    </p>
                    <span style={{ display: 'inline-block', marginTop: 3, fontSize: 10, fontWeight: 800, color: '#BB00FF', background: 'rgba(187,0,255,0.12)', border: '1px solid rgba(187,0,255,0.25)', borderRadius: 5, padding: '1px 5px', fontFamily: 'DM Mono' }}>
                      {discount}
                    </span>
                  </div>
                  <div style={{ width: 8 }} />
                </motion.div>
              </Link>
            )
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
