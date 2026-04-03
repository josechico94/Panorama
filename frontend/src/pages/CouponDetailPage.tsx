import { useEffect, useRef as useQRRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Download, Tag, Clock, AlertCircle, CheckCircle, Lock, MapPin, Zap } from 'lucide-react'
import { couponsApi } from '@/lib/api'
import { useUserStore } from '@/store'
import { getCategoryConfig } from '@/types'

function QRCode({ value, size = 220 }: { value: string; size?: number }) {
  const canvasRef = useQRRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!canvasRef.current || !value) return
    import('qrcode').then(QRLib => {
      QRLib.default.toCanvas(canvasRef.current!, value, {
        width: size, margin: 2, errorCorrectionLevel: 'H',
        color: { dark: '#000000', light: '#ffffff' },
      })
    })
  }, [value, size])
  return (
    <div style={{ background: '#fff', padding: 14, borderRadius: 16, display: 'inline-block', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
      <canvas ref={canvasRef} width={size} height={size} style={{ display: 'block' }} />
    </div>
  )
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
}

const PLACEHOLDER = 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=900&q=80'

export default function CouponDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isLoggedIn } = useUserStore()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['coupon', id],
    queryFn: () => couponsApi.get(id!),
    enabled: !!id,
  })
  const { data: myData } = useQuery({
    queryKey: ['my-coupons'],
    queryFn: couponsApi.myList,
    enabled: isLoggedIn(),
  })
  const claimMutation = useMutation({
    mutationFn: () => couponsApi.claim(id!),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-coupons'] }),
  })

  const coupon = data?.data
  const place  = coupon?.placeId
  const cat    = place ? getCategoryConfig(place.category) : null
  const myCoupons = myData?.data ?? []
  const myCoupon  = myCoupons.find((uc: any) => uc.couponId?._id === id || uc.couponId === id)

  const handleClaim = () => {
    if (!isLoggedIn()) { navigate('/accedi', { state: { from: `/coupon/${id}` } }); return }
    claimMutation.mutate()
  }

  const handleDownload = () => {
    if (!myCoupon) return
    const canvas = document.querySelector('canvas') as HTMLCanvasElement
    if (canvas) {
      const a = document.createElement('a')
      a.href = canvas.toDataURL('image/png')
      a.download = `coupon-faf-${myCoupon.uniqueCode.slice(0,8)}.png`
      a.click()
    }
  }

  if (isLoading) return (
    <div style={{ maxWidth: 672, margin: '0 auto', padding: '0 16px 32px' }}>
      <div className="skeleton" style={{ height: 220, borderRadius: 0, marginBottom: 24 }} />
      <div className="skeleton" style={{ height: 32, width: '60%', marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 80, borderRadius: 16 }} />
    </div>
  )

  if (!coupon || !place || !cat) return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <p style={{ fontSize: 40, marginBottom: 12 }}>🎫</p>
      <p style={{ color: 'var(--text-2)', fontSize: 14, marginBottom: 20 }}>Coupon non trovato</p>
      <Link to="/" className="btn btn-accent">Torna alla home</Link>
    </div>
  )

  const isExpired   = new Date() > new Date(coupon.validUntil)
  const isExhausted = coupon.maxUses !== null && coupon.usesCount >= coupon.maxUses
  const qrValue     = myCoupon ? `https://panoramabo.onrender.com/validate/${myCoupon.uniqueCode}` : ''
  const daysLeft    = Math.ceil((new Date(coupon.validUntil).getTime() - Date.now()) / (1000*60*60*24))
  const discountLabel = coupon.discountType === 'percentage' ? `-${coupon.discountValue}%`
    : coupon.discountType === 'fixed' ? `-€${coupon.discountValue}` : 'OMAGGIO'

  return (
    <div style={{ maxWidth: 672, margin: '0 auto', paddingBottom: 40 }}>

      {/* ── Hero ── */}
      <div style={{ position: 'relative', aspectRatio: '16/7', overflow: 'hidden' }}>
        <img src={place.media?.coverImage || PLACEHOLDER} alt={place.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div className="absolute inset-0 hero-overlay" />
        <button onClick={() => navigate(-1)} style={{
          position: 'absolute', top: 16, left: 16,
          width: 38, height: 38, borderRadius: 12,
          background: 'rgba(7,7,15,0.55)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#fff', flexShrink: 0,
        }}>
          <ArrowLeft size={17} />
        </button>
        {/* Discount badge */}
        <div style={{ position: 'absolute', top: 16, right: 16 }}>
          <span style={{
            background: 'linear-gradient(135deg, #BB00FF, #9000CC)',
            color: '#fff', fontFamily: 'DM Mono,monospace',
            fontSize: 15, fontWeight: 800,
            padding: '6px 14px', borderRadius: 12,
            boxShadow: '0 4px 20px rgba(187,0,255,0.55)',
            display: 'block',
          }}>
            {discountLabel}
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Place link + Title */}
        <div>
          <Link to={`/place/${place.slug}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            color: 'var(--accent)', textDecoration: 'none',
            fontSize: 12, fontWeight: 600, marginBottom: 10,
          }}>
            <MapPin size={11} /> {place.name} — {place.location?.neighborhood}
          </Link>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
            fontSize: 'clamp(24px,6vw,32px)', fontWeight: 700,
            color: 'var(--text)', lineHeight: 1.1, marginBottom: 8,
          }}>
            {coupon.title}
          </h1>
          {coupon.description && (
            <p style={{ color: 'var(--desc-color)', fontSize: 14, lineHeight: 1.65 }}>
              {coupon.description}
            </p>
          )}
        </div>

        {/* ── Meta cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {/* Scadenza */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 7, background: 'rgba(187,0,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={11} color="var(--accent)" />
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Valido fino al
              </span>
            </div>
            <p style={{ color: 'var(--text)', fontSize: 13, fontWeight: 700 }}>{formatDate(coupon.validUntil)}</p>
            {!isExpired && daysLeft <= 7 && (
              <p style={{ color: daysLeft <= 2 ? '#ef4444' : '#BB00FF', fontSize: 10, marginTop: 4, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>
                <Zap size={9} /> {daysLeft === 0 ? 'Scade oggi!' : daysLeft === 1 ? 'Scade domani' : `${daysLeft} giorni rimasti`}
              </p>
            )}
          </div>

          {/* Disponibili */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 7, background: 'rgba(187,0,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Tag size={11} color="var(--accent)" />
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                Disponibili
              </span>
            </div>
            <p style={{ color: 'var(--text)', fontSize: 13, fontWeight: 700 }}>
              {coupon.maxUses === null ? '∞ illimitati' : `${coupon.maxUses - coupon.usesCount} rimasti`}
            </p>
          </div>
        </div>

        {/* ── Condizioni ── */}
        {coupon.conditions && (
          <div style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <AlertCircle size={16} color="#fbbf24" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(251,191,36,0.7)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>Condizioni</p>
              <p style={{ color: 'var(--text-2)', fontSize: 13, lineHeight: 1.6 }}>{coupon.conditions}</p>
            </div>
          </div>
        )}

        {/* ── QR code (se già scaricato) ── */}
        <AnimatePresence>
          {myCoupon && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              style={{ background: 'rgba(187,0,255,0.06)', border: '1px solid rgba(187,0,255,0.2)', borderRadius: 20, padding: 24, textAlign: 'center' }}>
              {myCoupon.status === 'used' ? (
                <div style={{ padding: '16px 0' }}>
                  <CheckCircle size={44} color="#4ade80" style={{ margin: '0 auto 12px' }} />
                  <p style={{ color: 'var(--text)', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Coupon utilizzato</p>
                  <p style={{ color: 'var(--text-3)', fontSize: 13 }}>Grazie per aver visitato {place.name}!</p>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-3)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>
                    Il tuo QR personale
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                    <QRCode value={qrValue} size={200} />
                  </div>
                  <p style={{ color: 'var(--text-3)', fontSize: 11, marginBottom: 4 }}>
                    Codice: <span style={{ color: 'var(--accent)', fontFamily: 'DM Mono', fontWeight: 700 }}>{myCoupon.uniqueCode.toUpperCase()}</span>
                  </p>
                  <p style={{ color: 'var(--text-3)', fontSize: 12, marginBottom: 18 }}>
                    Mostra al locale per ottenere lo sconto
                  </p>
                  <button onClick={handleDownload} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '9px 18px', borderRadius: 12,
                    background: 'rgba(187,0,255,0.1)', border: '1px solid rgba(187,0,255,0.25)',
                    color: 'var(--accent)', cursor: 'pointer', fontSize: 13, fontWeight: 700,
                  }}>
                    <Download size={13} /> Scarica QR
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── CTA ── */}
        {!myCoupon && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {isExpired || isExhausted ? (
              <div style={{ textAlign: 'center', padding: '20px', background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)' }}>
                <p style={{ color: 'var(--text-3)', fontSize: 15 }}>
                  {isExpired ? '⏰ Coupon scaduto' : '😔 Coupon esaurito'}
                </p>
              </div>
            ) : (
              <>
                {!isLoggedIn() && (
                  <div style={{ background: 'rgba(187,0,255,0.06)', border: '1px solid rgba(187,0,255,0.18)', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <Lock size={15} color="var(--accent)" style={{ flexShrink: 0, marginTop: 1 }} />
                    <p style={{ color: 'var(--text-2)', fontSize: 13, lineHeight: 1.55 }}>
                      Crea un account gratuito per ottenere il tuo QR personale e usare questo coupon
                    </p>
                  </div>
                )}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleClaim}
                  disabled={claimMutation.isPending}
                  style={{
                    width: '100%', padding: '15px', borderRadius: 16, border: 'none',
                    background: claimMutation.isPending ? 'rgba(187,0,255,0.3)' : 'linear-gradient(135deg, #BB00FF, #9000CC)',
                    color: '#fff', fontSize: 16, fontWeight: 700,
                    cursor: claimMutation.isPending ? 'not-allowed' : 'pointer',
                    boxShadow: claimMutation.isPending ? 'none' : '0 4px 20px rgba(187,0,255,0.45)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  {claimMutation.isPending ? (
                    <><span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Un momento...</>
                  ) : isLoggedIn() ? (
                    <>🎫 Ottieni il tuo coupon</>
                  ) : (
                    <>🔐 Accedi e ottieni coupon</>
                  )}
                </motion.button>
                {claimMutation.isError && (
                  <p style={{ color: '#f87171', fontSize: 12, textAlign: 'center' }}>
                    {(claimMutation.error as any)?.response?.data?.error || 'Errore, riprova'}
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
