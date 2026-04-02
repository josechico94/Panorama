import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Zap, ChevronRight } from 'lucide-react'
import { couponsApi } from '@/lib/api'
import { getCategoryConfig } from '@/types'
import { useEffect, useRef, useState } from 'react'
import { getPlaceholder } from '@/lib/placeholders'



function formatDiscount(type: string, value: number) {
  if (type === 'percentage') return `-${value}%`
  if (type === 'fixed') return `-€${value}`
  return 'OMAGGIO'
}

export default function CouponSlider() {
  const { data } = useQuery({
    queryKey: ['active-coupons'],
    queryFn: couponsApi.active,
    staleTime: 0,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  })

  const coupons = data?.data ?? []
  const [visible, setVisible] = useState(true)
  const lastY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setVisible(y < lastY.current || y < 80)
      lastY.current = y
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (coupons.length === 0) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 64,
            zIndex: 45,
          }}
        >
          <div style={{
            background: 'rgba(7,7,15,0.85)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderTop: '1px solid rgba(232,98,42,0.25)',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
          }}>
            {/* Header */}
            <div style={{
              maxWidth: 672, margin: '0 auto',
              padding: '8px 16px 4px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Zap size={10} color="#e8622a" />
                <span style={{
                  fontFamily: 'DM Mono, monospace', fontSize: 8,
                  letterSpacing: '0.25em', textTransform: 'uppercase',
                  color: '#e8622a', fontWeight: 600,
                }}>
                  Offerte attive
                </span>
                <span style={{
                  fontSize: 9, fontWeight: 800,
                  background: 'rgba(232,98,42,0.15)',
                  color: '#e8622a',
                  border: '1px solid rgba(232,98,42,0.3)',
                  borderRadius: 100, padding: '1px 6px',
                }}>
                  {coupons.length}
                </span>
              </div>
              <Link to="/" style={{
                fontSize: 9, color: 'rgba(240,237,232,0.35)',
                display: 'flex', alignItems: 'center', gap: 2,
                fontWeight: 600, letterSpacing: '0.05em',
                textDecoration: 'none',
              }}>
                Vedi tutte <ChevronRight size={10} />
              </Link>
            </div>

            {/* Cards scroll */}
            <div style={{
              display: 'flex', gap: 10,
              overflowX: 'auto', padding: '4px 16px 12px',
              scrollbarWidth: 'none',
              maxWidth: 672, margin: '0 auto',
            }}>
              {coupons.map((coupon: any, i: number) => {
                const place = coupon.placeId
                const cat = place ? getCategoryConfig(place.category) : null
                const discount = formatDiscount(coupon.discountType, coupon.discountValue)
                const daysLeft = Math.ceil(
                  (new Date(coupon.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                )
                const img = place?.media?.coverImage || getPlaceholder(place?.category)

                return (
                  <motion.div
                    key={coupon._id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{ flexShrink: 0, width: 200 }}
                  >
                    <Link to={`/coupon/${coupon._id}`} style={{ textDecoration: 'none', display: 'block' }}>
                      <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.09)',
                        borderRadius: 14, overflow: 'hidden',
                        display: 'flex',
                        transition: 'border-color 0.2s',
                      }}>
                        {/* Image */}
                        <div style={{ width: 58, flexShrink: 0, position: 'relative' }}>
                          <img src={img} alt={place?.name || ''}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 68 }} />
                          <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(to right, transparent 50%, rgba(7,7,15,0.5))',
                          }} />
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, padding: '8px 10px', minWidth: 0 }}>
                          {/* Name + discount */}
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 4, marginBottom: 2 }}>
                            <p style={{
                              fontSize: 11, fontWeight: 700, color: '#f0ede8',
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                              flex: 1,
                            }}>
                              {place?.name || 'Locale'}
                            </p>
                            <span style={{
                              fontSize: 10, fontWeight: 800,
                              color: '#e8622a',
                              background: 'rgba(232,98,42,0.12)',
                              border: '1px solid rgba(232,98,42,0.25)',
                              borderRadius: 6, padding: '1px 5px',
                              flexShrink: 0,
                              fontFamily: 'DM Mono, monospace',
                            }}>
                              {discount}
                            </span>
                          </div>

                          {/* Coupon title */}
                          <p style={{
                            fontSize: 10, color: 'rgba(240,237,232,0.5)',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            marginBottom: 5,
                          }}>
                            {coupon.title}
                          </p>

                          {/* Category + days */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            {cat && (
                              <span style={{
                                fontSize: 8, fontWeight: 700,
                                letterSpacing: '0.08em', textTransform: 'uppercase',
                                color: cat.color, background: `${cat.color}15`,
                                border: `1px solid ${cat.color}30`,
                                borderRadius: 100, padding: '1px 5px',
                              }}>
                                {cat.emoji} {cat.label}
                              </span>
                            )}
                            <span style={{
                              fontSize: 8, color: daysLeft <= 3 ? '#e8622a' : 'rgba(240,237,232,0.28)',
                              fontFamily: 'DM Mono, monospace', marginLeft: 'auto',
                            }}>
                              {daysLeft <= 0 ? 'Scade oggi' : `${daysLeft}g`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
