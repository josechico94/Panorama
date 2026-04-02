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
        style={{
          position: 'fixed', bottom: 68, left: 0, right: 0, zIndex: 38,
          background: 'linear-gradient(135deg, #BB00FF, #9000CC)',
          padding: '10px 16px',
          boxShadow: '0 -4px 24px rgba(187,0,255,0.35)',
        }}
      >
        <div style={{
          maxWidth: 672, margin: '0 auto',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
          }}>
            <Tag size={13} color="rgba(255,255,255,0.8)" />
            <span style={{
              fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.75)',
              letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'DM Mono',
            }}>
              OFFERTE
            </span>
            <span style={{
              fontSize: 9, fontWeight: 800, background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%', width: 16, height: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontFamily: 'DM Mono',
            }}>
              {coupons.length}
            </span>
          </div>

          {/* Scrolling coupons */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ display: 'flex', gap: 8, overflow: 'hidden' }}>
              {coupons.slice(0, 3).map((c: any) => (
                <Link
                  key={c._id}
                  to={`/coupon/${c._id}`}
                  style={{ textDecoration: 'none', flexShrink: 0 }}
                >
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: 8, padding: '4px 8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}>
                    {c.placeId?.media?.coverImage && (
                      <img
                        src={c.placeId.media.coverImage}
                        alt=""
                        style={{ width: 20, height: 20, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }}
                      />
                    )}
                    <div style={{ minWidth: 0 }}>
                      <p style={{
                        color: '#fff', fontSize: 11, fontWeight: 700,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        maxWidth: 100,
                      }}>
                        {c.title}
                      </p>
                      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9, fontFamily: 'DM Mono', fontWeight: 600 }}>
                        {c.discountType === 'percentage' ? `-${c.discountValue}%`
                          : c.discountType === 'fixed' ? `-€${c.discountValue}`
                          : 'OMAGGIO'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <Link to="/offerte" style={{
              display: 'flex', alignItems: 'center', gap: 3,
              color: 'rgba(255,255,255,0.85)', textDecoration: 'none',
              fontSize: 10, fontWeight: 600,
            }}>
              Tutte <ChevronRight size={11} />
            </Link>
            <button
              onClick={() => setDismissed(true)}
              style={{
                width: 22, height: 22, borderRadius: 6, border: 'none',
                background: 'rgba(255,255,255,0.15)', color: '#fff',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginLeft: 4,
              }}
            >
              <X size={11} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
