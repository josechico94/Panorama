import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Tag, X, ChevronRight, Zap } from 'lucide-react'
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
          background: 'linear-gradient(135deg, #BB00FF 0%, #7700CC 100%)',
          padding: '8px 12px',
          boxShadow: '0 -4px 28px rgba(187,0,255,0.45)',
        }}
      >
        <div style={{ maxWidth: 672, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 10 }}>

          {/* Label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
            <Zap size={12} color="rgba(255,255,255,0.9)" fill="rgba(255,255,255,0.9)" />
            <span style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'DM Mono' }}>
              OFFERTE
            </span>
            <span style={{ fontSize: 10, fontWeight: 800, background: 'rgba(255,255,255,0.25)', borderRadius: 20, minWidth: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'DM Mono', padding: '0 4px' }}>
              {coupons.length}
            </span>
          </div>

          {/* Coupon pills */}
          <div style={{ flex: 1, display: 'flex', gap: 6, overflow: 'hidden' }}>
            {coupons.slice(0, 3).map((c: any) => {
              const discount = c.discountType === 'percentage'
                ? `-${c.discountValue}%`
                : c.discountType === 'fixed'
                ? `-€${c.discountValue}`
                : 'OMAGGIO'
              return (
                <Link key={c._id} to={`/coupon/${c._id}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: 'rgba(255,255,255,0.18)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    borderRadius: 20, padding: '4px 10px',
                    transition: 'background 0.15s',
                  }}>
                    <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.placeId?.name || c.title}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 10, fontFamily: 'DM Mono', fontWeight: 700, flexShrink: 0 }}>
                      {discount}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Tutte + Close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <Link to="/offerte" style={{ display: 'flex', alignItems: 'center', gap: 2, color: '#fff', textDecoration: 'none', fontSize: 11, fontWeight: 700, opacity: 0.9 }}>
              Tutte <ChevronRight size={12} />
            </Link>
            <button onClick={() => setDismissed(true)} style={{ width: 20, height: 20, borderRadius: 5, border: 'none', background: 'rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={10} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
