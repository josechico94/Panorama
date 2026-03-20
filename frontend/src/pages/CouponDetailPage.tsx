import { useEffect, useRef as useQRRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Download, Tag, Clock, AlertCircle, CheckCircle, Lock, MapPin } from 'lucide-react'
import { couponsApi } from '@/lib/api'
import { useUserStore } from '@/store'
import { getCategoryConfig } from '@/types'

function QRCode({ value, size = 220 }: { value: string; size?: number }) {
  const canvasRef = useQRRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !value) return
    import('qrcode').then(QRLib => {
      QRLib.default.toCanvas(canvasRef.current!, value, {
        width: size,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: { dark: '#000000', light: '#ffffff' },
      })
    })
  }, [value, size])

  return (
    <div style={{ background: '#ffffff', padding: 12, borderRadius: 12, display: 'inline-block' }}>
      <canvas id="qr-canvas" ref={canvasRef} width={size} height={size} style={{ display: 'block' }} />
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
    if (!isLoggedIn()) {
      navigate('/accedi', { state: { from: `/coupon/${id}` } })
      return
    }
    claimMutation.mutate()
  }

  const handleDownload = () => {
    if (!myCoupon) return
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(
      `${window.location.origin}/validate/${myCoupon.uniqueCode}`
    )}&bgcolor=07070f&color=f0ede8&margin=4`
    const a = document.createElement('a')
    a.href = qrUrl
    a.download = `coupon-${myCoupon.uniqueCode.slice(0,8)}.png`
    a.click()
  }

  if (isLoading) return (
    <div className="max-w-2xl mx-auto px-4 pt-8 space-y-4">
      <div className="skeleton rounded-2xl h-48" />
      <div className="skeleton rounded-xl h-8 w-2/3" />
      <div className="skeleton rounded-xl h-16" />
    </div>
  )

  if (!coupon || !place || !cat) return (
    <div className="text-center py-20">
      <p className="text-4xl mb-3">🎫</p>
      <p className="text-[var(--text-2)] text-sm">Coupon non trovato</p>
      <Link to="/" className="btn btn-accent mt-5 inline-flex">Torna alla home</Link>
    </div>
  )

  const isExpired   = new Date() > new Date(coupon.validUntil)
  const isExhausted = coupon.maxUses !== null && coupon.usesCount >= coupon.maxUses
  const qrValue     = myCoupon ? `https://panoramabo.onrender.com/validate/${myCoupon.uniqueCode}` : ''
  const daysLeft    = Math.ceil((new Date(coupon.validUntil).getTime() - Date.now()) / (1000*60*60*24))

  return (
    <div className="max-w-2xl mx-auto pb-10">
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/7' }}>
        <img src={place.media?.coverImage || PLACEHOLDER} alt={place.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 hero-overlay" />
        <button onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-xl glass flex items-center justify-center text-[var(--text-2)] hover:text-white transition-all">
          <ArrowLeft size={16} />
        </button>
        <div className="absolute top-4 right-4">
          <span style={{
            background: 'rgba(232,98,42,0.92)', backdropFilter: 'blur(8px)',
            color: '#fff', fontFamily: 'DM Mono,monospace', fontSize: '13px', fontWeight: 800,
            padding: '4px 12px', borderRadius: '10px', boxShadow: '0 4px 20px rgba(232,98,42,0.5)',
          }}>
            {coupon.discountType === 'percentage' ? `-${coupon.discountValue}%`
              : coupon.discountType === 'fixed' ? `-€${coupon.discountValue}` : 'OMAGGIO'}
          </span>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-5">
        {/* Title */}
        <div>
          <Link to={`/place/${place.slug}`}
            className="flex items-center gap-1.5 text-[var(--text-3)] text-xs mb-2 hover:text-[var(--accent)] transition-colors">
            <MapPin size={10} style={{ color: 'var(--accent)' }} />
            {place.name} — {place.location?.neighborhood}
          </Link>
          <h1 className="font-display font-bold leading-tight"
            style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(22px,6vw,30px)', fontStyle:'italic' }}>
            {coupon.title}
          </h1>
          {coupon.description && (
            <p className="text-[var(--text-2)] text-sm mt-2 leading-relaxed">{coupon.description}</p>
          )}
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="glass-light rounded-xl p-3">
            <p className="text-[var(--text-3)] text-[9px] font-semibold tracking-widest uppercase mb-1 flex items-center gap-1">
              <Clock size={9} /> Valido fino al
            </p>
            <p className="text-[var(--text)] text-sm font-semibold">{formatDate(coupon.validUntil)}</p>
            {!isExpired && daysLeft <= 7 && (
              <p className="text-[var(--accent)] text-[9px] mt-0.5 font-mono-dm">
                {daysLeft === 1 ? 'Scade oggi!' : `Mancano ${daysLeft} giorni`}
              </p>
            )}
          </div>
          <div className="glass-light rounded-xl p-3">
            <p className="text-[var(--text-3)] text-[9px] font-semibold tracking-widest uppercase mb-1 flex items-center gap-1">
              <Tag size={9} /> Disponibili
            </p>
            <p className="text-[var(--text)] text-sm font-semibold">
              {coupon.maxUses === null ? '∞ illimitati' : `${coupon.maxUses - coupon.usesCount} rimasti`}
            </p>
          </div>
        </div>

        {/* Conditions */}
        {coupon.conditions && (
          <div className="glass-light rounded-xl p-3.5 flex items-start gap-2.5">
            <AlertCircle size={14} className="text-yellow-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[var(--text-3)] text-[9px] font-semibold tracking-widest uppercase mb-1">Condizioni</p>
              <p className="text-[var(--text-2)] text-xs leading-relaxed">{coupon.conditions}</p>
            </div>
          </div>
        )}

        {/* QR if claimed */}
        <AnimatePresence>
          {myCoupon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: 'linear-gradient(135deg, rgba(232,98,42,0.08), rgba(240,136,74,0.04))',
                border: '1px solid rgba(232,98,42,0.22)',
                borderRadius: '20px', padding: '20px', textAlign: 'center',
              }}
            >
              {myCoupon.status === 'used' ? (
                <div className="space-y-2 py-4">
                  <CheckCircle size={36} className="mx-auto text-green-400" />
                  <p className="text-white font-semibold">Coupon già utilizzato</p>
                  <p className="text-[var(--text-3)] text-xs">Grazie per aver visitato {place.name}!</p>
                </div>
              ) : (
                <>
                  <p className="text-[var(--text-3)] text-[9px] tracking-widest uppercase font-semibold mb-3">
                    Il tuo QR personale
                  </p>
                  <div className="flex justify-center mb-3">
                    <QRCode value={qrValue} size={200} />
                  </div>
                  <p className="font-mono-dm text-[var(--text-3)] text-[10px] mb-1">
                    Codice: <span className="text-[var(--accent)]">{myCoupon.uniqueCode.toUpperCase()}</span>
                  </p>
                  <p className="text-[var(--text-3)] text-[10px] mb-4">
                    Mostra al locale per ottenere lo sconto
                  </p>
                  <button onClick={handleDownload} className="btn btn-ghost text-xs flex items-center gap-2 mx-auto">
                    <Download size={13} /> Scarica QR
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        {!myCoupon && (
          <div className="space-y-3">
            {isExpired || isExhausted ? (
              <div className="text-center py-4">
                <p className="text-[var(--text-3)] text-sm">
                  {isExpired ? '⏰ Coupon scaduto' : '😔 Coupon esaurito'}
                </p>
              </div>
            ) : (
              <>
                {!isLoggedIn() && (
                  <div className="glass-light rounded-xl p-3.5 flex items-center gap-2.5">
                    <Lock size={13} className="text-[var(--accent)] shrink-0" />
                    <p className="text-[var(--text-2)] text-xs leading-relaxed">
                      Crea un account gratuito per ottenere il tuo QR personale e usare questo coupon
                    </p>
                  </div>
                )}
                <button
                  onClick={handleClaim}
                  disabled={claimMutation.isPending}
                  className="btn btn-accent w-full disabled:opacity-50"
                >
                  {claimMutation.isPending
                    ? 'Un momento...'
                    : isLoggedIn()
                      ? '🎫 Ottieni il tuo coupon'
                      : '🔐 Accedi e ottieni coupon'
                  }
                </button>
                {claimMutation.isError && (
                  <p className="text-red-400 text-xs text-center">
                    {(claimMutation.error as any)?.response?.data?.error || 'Errore, riprova'}
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
