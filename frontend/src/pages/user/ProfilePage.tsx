import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import {
  LogOut, Tag, CheckCircle, Clock, MapPin, ChevronRight,
  User, Bookmark, Route, Ticket, QrCode
} from 'lucide-react'
import { couponsApi, placesApi } from '@/lib/api'
import { useUserStore, useAppStore } from '@/store'
import { getCategoryConfig } from '@/types'
import type { Place } from '@/types'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&q=80'

function formatDiscount(type: string, value: number) {
  if (type === 'percentage') return `-${value}%`
  if (type === 'fixed') return `-€${value}`
  return 'OMAGGIO'
}

type Tab = 'coupons' | 'used' | 'saved'

export default function ProfilePage() {
  const { user, logout, isLoggedIn } = useUserStore()
  const { savedPlaces } = useAppStore()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('coupons')

  const { data: couponsData, isLoading: couponsLoading } = useQuery({
    queryKey: ['my-coupons'],
    queryFn: couponsApi.myList,
    enabled: isLoggedIn(),
  })

  const { data: placesData } = useQuery({
    queryKey: ['all-places-profile'],
    queryFn: () => placesApi.list({ city: 'bologna', limit: '100' }),
    enabled: savedPlaces.length > 0,
  })

  if (!isLoggedIn()) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-5">
        <div className="w-20 h-20 rounded-3xl glass-light flex items-center justify-center mx-auto"
          style={{ border: '1px solid var(--border2)' }}>
          <User size={32} className="text-[var(--text-3)]" />
        </div>
        <div>
          <h2 className="font-display font-bold text-white text-2xl"
            style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic' }}>
            Il tuo profilo
          </h2>
          <p className="text-[var(--text-3)] text-sm mt-2 leading-relaxed">
            Accedi per vedere i tuoi coupon,<br />i posti salvati e la cronologia
          </p>
        </div>
        <div className="flex flex-col gap-2 max-w-xs mx-auto">
          <button onClick={() => navigate('/accedi')} className="btn btn-accent w-full">
            Accedi o registrati
          </button>
          <button onClick={() => navigate('/')} className="btn btn-ghost w-full text-sm">
            Continua come ospite
          </button>
        </div>
      </div>
    )
  }

  const allCoupons = couponsData?.data ?? []
  const activeCoupons = allCoupons.filter((uc: any) => uc.status === 'active')
  const usedCoupons = allCoupons.filter((uc: any) => uc.status === 'used')
  const allPlaces: Place[] = placesData?.data ?? []
  const savedPlacesList = allPlaces.filter(p => savedPlaces.includes(p._id))

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const TABS = [
    { id: 'coupons' as Tab, label: 'Coupon', icon: Ticket, count: activeCoupons.length },
    { id: 'used' as Tab,    label: 'Usati',  icon: CheckCircle, count: usedCoupons.length },
    { id: 'saved' as Tab,   label: 'Salvati', icon: Bookmark, count: savedPlacesList.length },
  ]

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="px-4 pt-6 pb-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-lg"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-display font-bold text-white leading-none"
                style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '22px', fontStyle: 'italic' }}>
                {user?.name}
              </h1>
              <p className="text-[var(--text-3)] text-xs mt-0.5">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[var(--text-3)] hover:text-red-400 hover:bg-red-400/10 transition-all text-xs font-medium"
          >
            <LogOut size={13} /> Esci
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-2 mt-5"
        >
          {[
            { label: 'Coupon attivi', value: activeCoupons.length, color: 'var(--accent)' },
            { label: 'Utilizzati',    value: usedCoupons.length,   color: '#22c55e' },
            { label: 'Salvati',       value: savedPlacesList.length, color: '#a855f7' },
          ].map(({ label, value, color }) => (
            <div key={label} className="glass-light rounded-xl p-3 text-center">
              <p className="font-bold text-xl" style={{ color }}>{value}</p>
              <p className="text-[var(--text-3)] text-[9px] font-semibold tracking-wide uppercase mt-0.5">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-1 glass-light rounded-xl p-1">
          {TABS.map(({ id, label, icon: Icon, count }) => (
            <button key={id} onClick={() => setTab(id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all"
              style={tab === id
                ? { background: 'var(--accent)', color: '#fff' }
                : { color: 'var(--text-3)' }
              }>
              <Icon size={12} />
              {label}
              {count > 0 && (
                <span style={{
                  fontSize: '9px', fontWeight: 800,
                  background: tab === id ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                  borderRadius: '100px', padding: '0 4px', minWidth: 14, textAlign: 'center',
                }}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-4 pb-8">
        <AnimatePresence mode="wait">
          {/* Active coupons */}
          {tab === 'coupons' && (
            <motion.div key="coupons"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {couponsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="skeleton rounded-2xl h-24" />
                ))
              ) : activeCoupons.length === 0 ? (
                <EmptyState
                  icon="🎫"
                  title="Nessun coupon attivo"
                  sub="Sfoglia le offerte e scarica il tuo primo coupon"
                  action={{ label: 'Vedi offerte', to: '/' }}
                />
              ) : (
                activeCoupons.map((uc: any, i: number) => (
                  <CouponCard key={uc._id} userCoupon={uc} index={i} />
                ))
              )}
            </motion.div>
          )}

          {/* Used coupons */}
          {tab === 'used' && (
            <motion.div key="used"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {usedCoupons.length === 0 ? (
                <EmptyState
                  icon="✅"
                  title="Nessun coupon utilizzato"
                  sub="I coupon che usi appariranno qui"
                />
              ) : (
                usedCoupons.map((uc: any, i: number) => (
                  <CouponCard key={uc._id} userCoupon={uc} index={i} used />
                ))
              )}
            </motion.div>
          )}

          {/* Saved places */}
          {tab === 'saved' && (
            <motion.div key="saved"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {savedPlacesList.length === 0 ? (
                <EmptyState
                  icon="🔖"
                  title="Nessun posto salvato"
                  sub="Tocca 🔖 su qualsiasi posto per salvarlo"
                  action={{ label: 'Esplora Bologna', to: '/esplora' }}
                />
              ) : (
                savedPlacesList.map((place, i) => (
                  <SavedPlaceRow key={place._id} place={place} index={i} />
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Coupon card ──
function CouponCard({ userCoupon, index, used = false }: { userCoupon: any; index: number; used?: boolean }) {
  const coupon = userCoupon.couponId
  const place  = userCoupon.placeId
  const cat    = place ? getCategoryConfig(place.category) : null

  if (!coupon || !place) return null

  const daysLeft = Math.ceil((new Date(coupon.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  const isExpiringSoon = !used && daysLeft <= 3

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <Link to={`/coupon/${coupon._id}`}>
        <div style={{
          background: used ? 'rgba(255,255,255,0.02)' : 'var(--surface)',
          border: `1px solid ${used ? 'rgba(255,255,255,0.05)' : isExpiringSoon ? 'rgba(232,98,42,0.3)' : 'var(--border)'}`,
          borderRadius: '18px',
          overflow: 'hidden',
          display: 'flex',
          opacity: used ? 0.6 : 1,
          transition: 'border-color 0.2s',
        }}>
          {/* Place image */}
          <div style={{ width: 80, position: 'relative', flexShrink: 0 }}>
            <img
              src={place.media?.coverImage || PLACEHOLDER}
              alt={place.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {used && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(7,7,15,0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CheckCircle size={20} className="text-green-400" />
              </div>
            )}
          </div>

          {/* Content */}
          <div style={{ flex: 1, padding: '12px 14px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ minWidth: 0 }}>
                <p style={{
                  fontSize: '12px', fontWeight: 700, color: 'var(--text)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {place.name}
                </p>
                <p style={{
                  fontSize: '11px', color: 'var(--text-2)', marginTop: 2,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {coupon.title}
                </p>
              </div>
              {/* Discount */}
              <span style={{
                fontSize: '11px', fontWeight: 800,
                color: used ? 'var(--text-3)' : 'var(--accent)',
                background: used ? 'transparent' : 'rgba(232,98,42,0.12)',
                border: `1px solid ${used ? 'transparent' : 'rgba(232,98,42,0.25)'}`,
                borderRadius: '8px', padding: '2px 7px', flexShrink: 0,
                fontFamily: 'DM Mono, monospace',
              }}>
                {formatDiscount(coupon.discountType, coupon.discountValue)}
              </span>
            </div>

            {/* Footer row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              {cat && (
                <span style={{
                  fontSize: '8px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: cat.color, background: `${cat.color}15`,
                  border: `1px solid ${cat.color}30`, borderRadius: '100px', padding: '2px 6px',
                }}>
                  {cat.emoji} {cat.label}
                </span>
              )}
              <span style={{
                fontSize: '9px', color: used ? '#4ade80' : isExpiringSoon ? 'var(--accent)' : 'var(--text-3)',
                fontFamily: 'DM Mono, monospace', marginLeft: 'auto',
                display: 'flex', alignItems: 'center', gap: 3,
              }}>
                {used
                  ? <>✓ Usato {new Date(userCoupon.usedAt).toLocaleDateString('it-IT')}</>
                  : isExpiringSoon
                    ? <><Clock size={9} /> Scade tra {daysLeft}g</>
                    : <><Clock size={9} /> {daysLeft}g rimasti</>
                }
              </span>
              {!used && <QrCode size={11} style={{ color: 'var(--text-3)', flexShrink: 0 }} />}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ── Saved place row ──
function SavedPlaceRow({ place, index }: { place: Place; index: number }) {
  const cat = getCategoryConfig(place.category)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={`/place/${place.slug}`}>
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '16px', overflow: 'hidden',
          display: 'flex', alignItems: 'center', gap: 0,
          transition: 'border-color 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(232,98,42,0.2)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          <div style={{ width: 64, height: 64, flexShrink: 0 }}>
            <img
              src={place.media?.coverImage || PLACEHOLDER}
              alt={place.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ flex: 1, padding: '10px 14px', minWidth: 0 }}>
            <p style={{
              fontSize: '13px', fontWeight: 600, color: 'var(--text)',
              fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {place.name}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
              <span style={{
                fontSize: '8px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: cat.color, background: `${cat.color}15`,
                border: `1px solid ${cat.color}28`, borderRadius: '100px', padding: '1px 5px',
              }}>
                {cat.emoji} {cat.label}
              </span>
              <span style={{ fontSize: '10px', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 3 }}>
                <MapPin size={9} style={{ color: 'var(--accent)' }} />
                {place.location?.neighborhood}
              </span>
            </div>
          </div>
          <ChevronRight size={14} style={{ color: 'var(--text-3)', marginRight: 14, flexShrink: 0 }} />
        </div>
      </Link>
    </motion.div>
  )
}

// ── Empty state ──
function EmptyState({ icon, title, sub, action }: {
  icon: string; title: string; sub: string
  action?: { label: string; to: string }
}) {
  return (
    <div className="text-center py-14 space-y-3">
      <p className="text-4xl">{icon}</p>
      <div>
        <p className="text-[var(--text-2)] font-medium text-sm">{title}</p>
        <p className="text-[var(--text-3)] text-xs mt-1 leading-relaxed">{sub}</p>
      </div>
      {action && (
        <Link to={action.to} className="btn btn-ghost inline-flex text-xs mt-2">
          {action.label}
        </Link>
      )}
    </div>
  )
}
