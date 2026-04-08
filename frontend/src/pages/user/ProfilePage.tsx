import { useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, CheckCircle, Bookmark, QrCode, Clock, TrendingUp, ChevronRight, Sun, Moon, Settings } from 'lucide-react'
import { useState } from 'react'
import { useUserStore, useAppStore } from '@/store'
import { useThemeStore } from '@/components/ui/ThemeToggle'
import { couponsApi } from '@/lib/api'
import { getCategoryConfig } from '@/types'

type Tab = 'coupon' | 'usati' | 'salvati'

function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div style={{
      width: 56, height: 56, borderRadius: '50%',
      background: 'linear-gradient(135deg, #BB00FF, #9000CC)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 20, fontWeight: 800, color: '#fff',
      boxShadow: '0 4px 20px rgba(187,0,255,0.4)',
      flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}

export default function ProfilePage() {
  const { user, logout, isLoggedIn } = useUserStore()
  const { savedPlaces } = useAppStore()
  const { theme, toggle } = useThemeStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('coupon')

  const { data } = useQuery({
    queryKey: ['my-coupons', user?.id],
    queryFn: () => couponsApi.myList(),
    enabled: !!user,
  })

  const allCoupons = data?.data ?? []
  const activeCoupons = allCoupons.filter((c: any) => c.status === 'active')
  const usedCoupons = allCoupons.filter((c: any) => c.status === 'used')

  // ✅ Calcolo risparmio totale dai coupon usati
  const totalSaved = usedCoupons.reduce((acc: number, uc: any) => {
    const coupon = uc.couponId
    if (!coupon) return acc
    if (coupon.discountType === 'percentage') {
      // stima su spesa media €25
      return acc + Math.round(25 * coupon.discountValue / 100)
    }
    if (coupon.discountType === 'fixed') {
      return acc + coupon.discountValue
    }
    return acc + 5 // omaggio → stima €5
  }, 0)

  if (!isLoggedIn()) {
    return (
      <div style={{
        minHeight: '80dvh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '32px 24px',
      }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', maxWidth: 340 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 22,
            background: 'linear-gradient(135deg, #BB00FF22, #BB00FF11)',
            border: '1px solid rgba(187,0,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', fontSize: 32,
          }}>🗺️</div>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
            fontSize: 30, fontWeight: 700, color: 'var(--text)', marginBottom: 8,
          }}>
            Il tuo profilo faf
          </h2>
          <p style={{ color: 'var(--text-3)', fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
            Accedi per vedere i tuoi coupon, i posti salvati e gestire il tuo account.
          </p>
          <Link to="/accedi" style={{
            display: 'block', textDecoration: 'none',
            padding: '14px 28px', borderRadius: 14,
            background: 'linear-gradient(135deg, #BB00FF, #9000CC)',
            color: '#fff', fontWeight: 700, fontSize: 15,
            boxShadow: '0 4px 20px rgba(187,0,255,0.4)',
            textAlign: 'center',
          }}>
            Accedi o Registrati
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 672, margin: '0 auto', paddingBottom: 24 }}>
      {/* ── Hero Profile Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          margin: '24px 16px 20px',
          background: 'linear-gradient(135deg, rgba(187,0,255,0.12) 0%, rgba(144,0,204,0.06) 100%)',
          border: '1px solid rgba(187,0,255,0.2)',
          borderRadius: 22,
          padding: '20px',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <Avatar name={user!.name} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{
              color: 'var(--text)', fontSize: 16, fontWeight: 700,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {user!.name}
            </h2>
            <p style={{
              color: 'var(--text-3)', fontSize: 12, marginTop: 2,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {user!.email}
            </p>
          </div>
          <button
            onClick={() => { logout(); navigate('/') }}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '7px 12px', borderRadius: 9, border: 'none',
              background: 'rgba(248,113,113,0.1)',
              color: '#f87171', cursor: 'pointer', fontSize: 12, fontWeight: 600,
              flexShrink: 0,
            }}
          >
            <LogOut size={13} /> Esci
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 10 }}>
          {[
            { label: 'Coupon attivi', value: activeCoupons.length, color: '#BB00FF' },
            { label: 'Utilizzati', value: usedCoupons.length, color: '#4ade80' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14, padding: '10px 8px', textAlign: 'center',
            }}>
              <p style={{ fontSize: 24, fontWeight: 800, color, fontFamily: 'DM Mono', lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 4, fontWeight: 500 }}>{label}</p>
            </div>
          ))}
        </div>

        {/* ✅ Risparmio totale — card prominente */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(74,222,128,0.1), rgba(34,197,94,0.06))',
          border: '1px solid rgba(74,222,128,0.25)',
          borderRadius: 14, padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12, flexShrink: 0,
            background: 'rgba(74,222,128,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TrendingUp size={20} color="#4ade80" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 10, color: 'rgba(74,222,128,0.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>
              Risparmio totale con faf
            </p>
            <p style={{ fontSize: 28, fontWeight: 800, color: '#4ade80', fontFamily: 'DM Mono', lineHeight: 1 }}>
              €{totalSaved}
            </p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 2 }}>su</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)' }}>{usedCoupons.length} coupon</p>
          </div>
        </div>
      </motion.div>

      {/* ── Tabs ── */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{
          display: 'flex', gap: 4, padding: 4,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 14,
        }}>
          {([
            { id: 'coupon',  label: 'Coupon',  icon: QrCode,       count: activeCoupons.length },
            { id: 'usati',   label: 'Usati',   icon: CheckCircle,  count: usedCoupons.length },
            { id: 'salvati', label: 'Salvati', icon: Bookmark,     count: savedPlaces.length },
          ] as { id: Tab; label: string; icon: any; count: number }[]).map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 5, padding: '8px 4px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: activeTab === id
                  ? 'linear-gradient(135deg, #BB00FF, #9000CC)'
                  : 'transparent',
                color: activeTab === id ? '#fff' : 'var(--text-3)',
                fontSize: 11, fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              <Icon size={12} />
              {label}
              {count > 0 && (
                <span style={{
                  fontSize: 9, fontWeight: 800, minWidth: 16, height: 16,
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: activeTab === id ? 'rgba(255,255,255,0.25)' : 'rgba(187,0,255,0.15)',
                  color: activeTab === id ? '#fff' : '#BB00FF',
                  fontFamily: 'DM Mono',
                }}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          style={{ padding: '0 16px' }}
        >
          {activeTab === 'coupon' && (
            activeCoupons.length === 0 ? (
              <EmptyState
                emoji="🎫"
                title="Nessun coupon attivo"
                desc="Sfoglia le offerte e scarica il tuo primo coupon"
                action={{ label: 'Vedi offerte', to: '/offerte' }}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {activeCoupons.map((uc: any, i: number) => (
                  <CouponCard key={uc._id} userCoupon={uc} index={i} />
                ))}
              </div>
            )
          )}

          {activeTab === 'usati' && (
            usedCoupons.length === 0 ? (
              <EmptyState emoji="✅" title="Nessun coupon usato" desc="I coupon che usi appariranno qui" />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {usedCoupons.map((uc: any, i: number) => (
                  <CouponCard key={uc._id} userCoupon={uc} index={i} used />
                ))}
              </div>
            )
          )}

          {activeTab === 'salvati' && (
            savedPlaces.length === 0 ? (
              <EmptyState
                emoji="🔖"
                title="Nessun posto salvato"
                desc="Tocca il segnalibro su un posto per salvarlo qui"
                action={{ label: 'Esplora', to: '/esplora' }}
              />
            ) : (
              <div style={{ paddingBottom: 16 }}>
                <p style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'DM Mono', letterSpacing: '0.15em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 }}>
                  {savedPlaces.length} post{savedPlaces.length === 1 ? 'o' : 'i'} salvat{savedPlaces.length === 1 ? 'o' : 'i'}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {savedPlaces.map((id, i) => (
                    <SavedPlaceRow key={id} placeId={id} index={i} />
                  ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <Link to="/salvati" style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                    Vedi tutti in Salvati →
                  </Link>
                </div>
              </div>
            )
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Impostazioni ── */}
      <div style={{ padding: '20px 16px 8px' }}>
        <p style={{ fontFamily: 'DM Mono', fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>
          Impostazioni
        </p>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>

          {/* Theme toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(187,0,255,0.1)', border: '1px solid rgba(187,0,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {theme === 'dark' ? <Moon size={16} color="#BB00FF" /> : <Sun size={16} color="#BB00FF" />}
              </div>
              <div>
                <p style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600 }}>
                  {theme === 'dark' ? 'Modalità scura' : 'Modalità chiara'}
                </p>
                <p style={{ color: 'var(--text-3)', fontSize: 11, marginTop: 1 }}>Cambia il tema dell'app</p>
              </div>
            </div>
            <button onClick={toggle} style={{ width: 48, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer', background: theme === 'dark' ? '#BB00FF' : 'var(--border)', position: 'relative', transition: 'background 0.3s', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 4, left: theme === 'dark' ? 24 : 4, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
            </button>
          </div>

          {/* Version */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Settings size={16} color="var(--text-3)" />
              </div>
              <div>
                <p style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600 }}>FafApp</p>
                <p style={{ color: 'var(--text-3)', fontSize: 11, marginTop: 1 }}>Versione 1.0.0 · Bologna</p>
              </div>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'DM Mono', color: '#BB00FF', background: 'rgba(187,0,255,0.1)', border: '1px solid rgba(187,0,255,0.2)', padding: '3px 8px', borderRadius: 8 }}>PWA</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CouponCard({ userCoupon, index, used = false }: { userCoupon: any; index: number; used?: boolean }) {
  const coupon = userCoupon.couponId
  const place = userCoupon.placeId
  const cat = place ? getCategoryConfig(place.category) : null

  const discount = coupon?.discountType === 'percentage'
    ? `-${coupon.discountValue}%`
    : coupon?.discountType === 'fixed'
    ? `-€${coupon.discountValue}`
    : 'OMAGGIO'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <Link
        to={used ? '#' : `/coupon/${coupon?._id}`}
        style={{ textDecoration: 'none', display: 'block' }}
        onClick={e => used && e.preventDefault()}
      >
        <div style={{
          background: used ? 'var(--surface)' : 'rgba(187,0,255,0.04)',
          border: `1px solid ${used ? 'var(--border)' : 'rgba(187,0,255,0.18)'}`,
          borderRadius: 18, overflow: 'hidden',
          display: 'flex',
          opacity: used ? 0.65 : 1,
          transition: 'all 0.2s',
        }}>
          {/* Place image */}
          <div style={{ width: 80, height: 80, flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
            <img
              src={place?.media?.coverImage || 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=200&q=70'}
              alt={place?.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {used && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CheckCircle size={22} color="#4ade80" />
              </div>
            )}
          </div>

          {/* Content */}
          <div style={{ flex: 1, padding: '10px 12px', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {cat && (
              <span style={{ fontSize: 9, color: cat.color, fontWeight: 700, display: 'block', marginBottom: 3 }}>
                {cat.emoji} {place?.name}
              </span>
            )}
            <p style={{
              color: 'var(--text)', fontSize: 13, fontWeight: 700,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {coupon?.title}
            </p>
            <p style={{ color: 'var(--text-3)', fontSize: 10, marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={9} />
              {used && userCoupon.usedAt
                ? 'Usato il ' + new Date(userCoupon.usedAt).toLocaleDateString('it-IT')
                : 'Scade il ' + new Date(coupon?.validUntil).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}
            </p>
          </div>

          {/* Discount badge */}
          <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <span style={{
              fontSize: 12, fontWeight: 800, fontFamily: 'DM Mono',
              color: used ? 'var(--text-3)' : '#BB00FF',
              background: used ? 'rgba(255,255,255,0.05)' : 'rgba(187,0,255,0.12)',
              border: `1px solid ${used ? 'var(--border)' : 'rgba(187,0,255,0.25)'}`,
              borderRadius: 8, padding: '4px 8px',
            }}>
              {discount}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function SavedPlaceRow({ placeId, index }: { placeId: string; index: number }) {
  const { data } = useQuery({
    queryKey: ['place-mini', placeId],
    queryFn: () => fetch(`https://panoramabo.onrender.com/api/v1/places/${placeId}`).then(r => r.json()),
    staleTime: 10 * 60 * 1000,
  })
  const place = data?.data
  if (!place) return (
    <div style={{ height: 56, borderRadius: 12, background: 'var(--surface)', animation: 'pulse 1.5s infinite' }} />
  )
  return (
    <Link to={`/place/${place.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 14, overflow: 'hidden',
          transition: 'border-color 0.2s',
        }}
        onMouseEnter={(e: any) => e.currentTarget.style.borderColor = 'rgba(187,0,255,0.3)'}
        onMouseLeave={(e: any) => e.currentTarget.style.borderColor = 'var(--border)'}
      >
        <div style={{ width: 56, height: 56, flexShrink: 0, overflow: 'hidden' }}>
          <img src={place.media?.coverImage || ''} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: 'var(--text)', fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {place.name}
          </p>
          <p style={{ color: 'var(--text-3)', fontSize: 10, marginTop: 2 }}>
            {place.location?.neighborhood}
          </p>
        </div>
        <div style={{ padding: '0 14px', flexShrink: 0 }}>
          <ChevronRight size={14} color="var(--text-3)" />
        </div>
      </motion.div>
    </Link>
  )
}

function EmptyState({ emoji, title, desc, action }: { emoji: string; title: string; desc: string; action?: { label: string; to: string } }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <span style={{ fontSize: 44, display: 'block', marginBottom: 14 }}>{emoji}</span>
      <p style={{ color: 'var(--text)', fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{title}</p>
      <p style={{ color: 'var(--text-3)', fontSize: 13, lineHeight: 1.5, marginBottom: action ? 20 : 0 }}>{desc}</p>
      {action && (
        <Link to={action.to} style={{
          display: 'inline-flex', padding: '10px 22px', borderRadius: 12,
          background: 'rgba(187,0,255,0.1)', color: '#BB00FF',
          border: '1px solid rgba(187,0,255,0.22)',
          textDecoration: 'none', fontSize: 13, fontWeight: 700,
        }}>
          {action.label}
        </Link>
      )}
    </div>
  )
}
