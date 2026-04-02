import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Tag, X, ChevronRight } from 'lucide-react'
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
          position: 'fixed', bottom: 68, left: 0, right: 0, zIndex: 38,
          background: '#07070F',
          borderTop: '1px solid rgba(187,0,255,0.3)',
          padding: '10px 14px',
          boxShadow: '0 -4px 24px rgba(187,0,255,0.2)',
        }}
      >
        <div style={{ maxWidth: 672, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 10 }}>

          {/* Label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <Tag size={12} color="#BB00FF" />
            <span style={{ fontSize: 9, fontWeight: 800, color: '#BB00FF', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'DM Mono' }}>
              OFFERTE ATTIVE
            </span>
            <span style={{ fontSize: 10, fontWeight: 800, background: 'rgba(187,0,255,0.2)', border: '1px solid rgba(187,0,255,0.4)', borderRadius: 20, minWidth: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#BB00FF', fontFamily: 'DM Mono', padding: '0 5px' }}>
              {coupons.length}
            </span>
          </div>

          {/* Coupon cards */}
          <div style={{ flex: 1, display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {coupons.slice(0, 4).map((c: any) => {
              const discount = c.discountType === 'percentage' ? `-${c.discountValue}%`
                : c.discountType === 'fixed' ? `-€${c.discountValue}` : 'OMAGGIO'
              const days = Math.ceil((new Date(c.validUntil).getTime() - Date.now()) / (1000*60*60*24))
              return (
                <Link key={c._id} to={`/coupon/${c._id}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'rgba(187,0,255,0.07)',
                    border: '1px solid rgba(187,0,255,0.2)',
                    borderRadius: 10, padding: '6px 10px',
                    transition: 'border-color 0.2s',
                  }}>
                    {c.placeId?.media?.coverImage && (
                      <img src={c.placeId.media.coverImage} alt="" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
                    )}
                    <div style={{ minWidth: 0 }}>
                      <p style={{ color: 'var(--text)', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 80 }}>
                        {c.placeId?.name || c.title}
                      </p>
                      <p style={{ color: 'var(--meta-color)', fontSize: 9, marginTop: 1 }}>
                        {c.title}
                      </p>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#BB00FF', background: 'rgba(187,0,255,0.15)', border: '1px solid rgba(187,0,255,0.3)', borderRadius: 6, padding: '2px 6px', fontFamily: 'DM Mono', flexShrink: 0 }}>
                      {discount}
                    </span>
                    <span style={{ fontSize: 9, color: days <= 1 ? '#f87171' : 'var(--meta-color)', flexShrink: 0 }}>
                      {days === 0 ? 'oggi' : days + 'g'}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Vedi tutte + close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <Link to="/offerte" style={{ display: 'flex', alignItems: 'center', gap: 2, color: 'var(--text-3)', textDecoration: 'none', fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap' }}>
              Vedi tutte <ChevronRight size={11} />
            </Link>
            <button onClick={() => setDismissed(true)} style={{ width: 20, height: 20, borderRadius: 5, border: 'none', background: 'rgba(255,255,255,0.06)', color: 'var(--text-3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={10} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
