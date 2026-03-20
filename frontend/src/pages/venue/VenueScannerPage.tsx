import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, RefreshCw, AlertTriangle, Camera, Keyboard } from 'lucide-react'
import { couponsApi } from '@/lib/api'

type Status = 'idle' | 'loading' | 'success' | 'already_used' | 'invalid' | 'error'

function QRCameraScanner({ onScan, onError }: { onScan: (code: string) => void; onError: (msg: string) => void }) {
  const regionId = 'qr-reader-region'
  const scannerRef = useRef<any>(null)
  const [active, setActive] = useState(false)
  const scannedRef = useRef(false)

  useEffect(() => {
    scannedRef.current = false
    let html5QrCode: any = null

    const start = async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode')
        html5QrCode = new Html5Qrcode(regionId)
        scannerRef.current = html5QrCode

        const boxSize = Math.min(window.innerWidth * 0.6, 240)

        await html5QrCode.start(
          { facingMode: 'environment' },
          {
            fps: 20,
            qrbox: { width: boxSize, height: boxSize },
            aspectRatio: 1.0,
            disableFlip: false,
          },
          (decodedText: string) => {
            if (scannedRef.current) return
            scannedRef.current = true
            let code = decodedText.trim()
            if (code.includes('/validate/')) code = code.split('/validate/').pop() || code
            onScan(code.toLowerCase())
          },
          () => {}
        )
        setActive(true)
      } catch (err: any) {
        onError(err?.message || 'Impossibile accedere alla fotocamera')
      }
    }

    start()

    return () => {
      if (scannerRef.current) {
        try {
          const state = scannerRef.current.getState?.()
          if (state === 2 || state === 3) {
            scannerRef.current.stop().catch(() => {})
          } else {
            scannerRef.current.clear?.()
          }
        } catch {}
        scannerRef.current = null
      }
    }
  }, [])

  return (
    <div>
      {/* Scanner frame */}
      <div style={{
        position: 'relative', borderRadius: 20, overflow: 'hidden',
        maxWidth: 320, margin: '0 auto',
        border: '2px solid rgba(232,98,42,0.5)',
        boxShadow: '0 0 0 4px rgba(232,98,42,0.08)',
        background: '#000',
        aspectRatio: '1',
      }}>
        <div id={regionId} style={{ width: '100%', height: '100%' }} />

        {/* Overlay corners + scanline */}
        {active && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {[
              { top: '15%', left: '15%', borderTop: '3px solid #e8622a', borderLeft: '3px solid #e8622a', borderRadius: '4px 0 0 0' },
              { top: '15%', right: '15%', borderTop: '3px solid #e8622a', borderRight: '3px solid #e8622a', borderRadius: '0 4px 0 0' },
              { bottom: '15%', left: '15%', borderBottom: '3px solid #e8622a', borderLeft: '3px solid #e8622a', borderRadius: '0 0 0 4px' },
              { bottom: '15%', right: '15%', borderBottom: '3px solid #e8622a', borderRight: '3px solid #e8622a', borderRadius: '0 0 4px 0' },
            ].map((s, i) => (
              <div key={i} style={{ position: 'absolute', width: 24, height: 24, ...s }} />
            ))}
            <div style={{
              position: 'absolute', left: '15%', right: '15%', height: 2,
              background: 'linear-gradient(90deg, transparent, #e8622a, transparent)',
              animation: 'scanLine 1.8s ease-in-out infinite',
            }} />
          </div>
        )}

        {!active && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid rgba(232,98,42,0.3)', borderTopColor: '#e8622a', animation: 'spin 0.8s linear infinite' }} />
          </div>
        )}
      </div>

      <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(240,237,232,0.4)', marginTop: 12 }}>
        {active ? 'Punta la fotocamera sul QR del cliente' : 'Avvio fotocamera...'}
      </p>

      <style>{`
        #${regionId} { width: 100% !important; height: 100% !important; }
        #${regionId} video { object-fit: cover !important; width: 100% !important; height: 100% !important; }
        #${regionId} img { display: none !important; }
        #${regionId} > div:last-child { display: none !important; }
        @keyframes scanLine { 0%, 100% { top: 18%; } 50% { top: 82%; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

export default function VenueScannerPage() {
  const [mode, setMode] = useState<'camera' | 'manual'>('camera')
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<any>(null)
  const [manualCode, setManualCode] = useState('')
  const [cameraError, setCameraError] = useState('')
  const [scanKey, setScanKey] = useState(0)

  const validate = async (code: string) => {
    if (!code.trim() || status === 'loading') return
    setStatus('loading')
    setResult(null)
    try {
      const data = await couponsApi.validate(code.trim().toLowerCase())
      setResult(data)
      if (!data.valid) {
        setStatus(data.reason === 'Già utilizzato' ? 'already_used' : 'invalid')
        return
      }
      await couponsApi.markUsed(code.trim().toLowerCase())
      setStatus('success')
    } catch (err: any) {
      setStatus('error')
      setResult({ valid: false, reason: err.response?.data?.error || 'Codice non trovato' })
    }
  }

  const reset = () => {
    setStatus('idle')
    setResult(null)
    setManualCode('')
    setCameraError('')
    setScanKey(k => k + 1)
  }

  const showResult = ['success', 'already_used', 'invalid', 'error'].includes(status)
  const coupon = result?.userCoupon?.couponId
  const user = result?.userCoupon?.userId

  return (
    <div style={{ maxWidth: 420, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 28, height: 2, background: 'linear-gradient(90deg,#e8622a,transparent)', borderRadius: 1 }} />
          <span style={{ fontSize: 9, color: 'rgba(240,237,232,0.35)', fontFamily: 'DM Mono,monospace', letterSpacing: '0.25em', textTransform: 'uppercase' }}>Validazione</span>
        </div>
        <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 30, fontWeight: 700, color: '#f0ede8', lineHeight: 1 }}>Scanner QR</h1>
        <p style={{ color: 'rgba(240,237,232,0.4)', fontSize: 12, marginTop: 6 }}>Scansiona il coupon del cliente per validarlo</p>
      </div>

      {/* Mode toggle */}
      {!showResult && status !== 'loading' && (
        <div style={{ display: 'flex', gap: 4, padding: 4, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, marginBottom: 20 }}>
          {([
            { id: 'camera', icon: Camera, label: 'Fotocamera' },
            { id: 'manual', icon: Keyboard, label: 'Manuale' },
          ] as const).map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => { setMode(id); reset() }} style={{
              flex: 1, padding: '9px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: mode === id ? '#e8622a' : 'transparent',
              color: mode === id ? '#fff' : 'rgba(240,237,232,0.4)',
              fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s',
            }}>
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Loading */}
        {status === 'loading' && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid rgba(232,98,42,0.2)', borderTopColor: '#e8622a', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: 'rgba(240,237,232,0.5)', fontSize: 13 }}>Verifica coupon...</p>
          </motion.div>
        )}

        {/* Camera */}
        {mode === 'camera' && status === 'idle' && (
          <motion.div key={`camera-${scanKey}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {cameraError ? (
              <div style={{ padding: 20, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 16, textAlign: 'center' }}>
                <XCircle size={28} color="#f87171" style={{ margin: '0 auto 10px' }} />
                <p style={{ color: '#f87171', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Fotocamera non disponibile</p>
                <p style={{ color: 'rgba(240,237,232,0.4)', fontSize: 12, marginBottom: 14 }}>{cameraError}</p>
                <button onClick={() => setMode('manual')} style={{ padding: '8px 20px', borderRadius: 10, border: '1px solid rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.1)', color: '#f87171', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                  Usa codice manuale
                </button>
              </div>
            ) : (
              <QRCameraScanner key={scanKey} onScan={validate} onError={setCameraError} />
            )}
          </motion.div>
        )}

        {/* Manual */}
        {mode === 'manual' && status === 'idle' && (
          <motion.div key="manual" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 10, color: 'rgba(240,237,232,0.4)', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
                Codice QR del cliente
              </label>
              <textarea value={manualCode} onChange={e => setManualCode(e.target.value)}
                onPaste={e => {
                  const text = e.clipboardData.getData('text').trim()
                  if (text.length > 10) {
                    setTimeout(() => {
                      const code = text.includes('/validate/') ? text.split('/validate/').pop()! : text
                      validate(code)
                    }, 100)
                  }
                }}
                placeholder="Incolla o digita il codice qui..." rows={3}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#f0ede8', fontSize: 13, outline: 'none', resize: 'none', fontFamily: 'DM Mono,monospace', boxSizing: 'border-box' as const, marginBottom: 10 }}
                onFocus={e => (e.target.style.borderColor = '#e8622a')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>
            <button onClick={() => {
              const code = manualCode.includes('/validate/') ? manualCode.split('/validate/').pop()! : manualCode.trim()
              validate(code)
            }} disabled={!manualCode.trim()} style={{
              width: '100%', padding: '13px', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg,#e8622a,#f0884a)', color: '#fff', fontSize: 14, fontWeight: 700,
              opacity: manualCode.trim() ? 1 : 0.4,
            }}>
              Valida coupon
            </button>
          </motion.div>
        )}

        {/* Results */}
        {showResult && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            {status === 'success' && (
              <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 20, padding: 28, textAlign: 'center' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}>
                  <CheckCircle size={56} color="#4ade80" style={{ margin: '0 auto 12px' }} />
                </motion.div>
                <h2 style={{ color: '#4ade80', fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Coupon valido! ✓</h2>
                <p style={{ color: 'rgba(240,237,232,0.5)', fontSize: 13, marginBottom: 20 }}>Sconto applicato con successo</p>
                {coupon && (
                  <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 14, padding: 16, textAlign: 'left', marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <div>
                        <p style={{ color: 'rgba(240,237,232,0.4)', fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Coupon applicato</p>
                        <p style={{ color: '#f0ede8', fontSize: 15, fontWeight: 700 }}>{coupon.title}</p>
                        {user && <p style={{ color: 'rgba(240,237,232,0.4)', fontSize: 11, marginTop: 3 }}>Cliente: {user.name}</p>}
                      </div>
                      <span style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', borderRadius: 8, padding: '4px 10px', fontSize: 14, fontWeight: 800, fontFamily: 'DM Mono,monospace', flexShrink: 0 }}>
                        {coupon.discountType === 'percentage' ? `-${coupon.discountValue}%` : coupon.discountType === 'fixed' ? `-€${coupon.discountValue}` : 'OMAGGIO'}
                      </span>
                    </div>
                  </div>
                )}
                <button onClick={reset} style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.1)', color: '#4ade80', cursor: 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <RefreshCw size={14} /> Scansiona un altro
                </button>
              </div>
            )}

            {status === 'already_used' && (
              <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: 20, padding: 28, textAlign: 'center' }}>
                <AlertTriangle size={48} color="#fbbf24" style={{ margin: '0 auto 12px' }} />
                <h2 style={{ color: '#fbbf24', fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Coupon già utilizzato</h2>
                <p style={{ color: 'rgba(240,237,232,0.5)', fontSize: 13, marginBottom: 20 }}>Questo coupon è stato già usato</p>
                <button onClick={reset} style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid rgba(251,191,36,0.3)', background: 'rgba(251,191,36,0.1)', color: '#fbbf24', cursor: 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <RefreshCw size={14} /> Riprova
                </button>
              </div>
            )}

            {(status === 'invalid' || status === 'error') && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 20, padding: 28, textAlign: 'center' }}>
                <XCircle size={48} color="#f87171" style={{ margin: '0 auto 12px' }} />
                <h2 style={{ color: '#f87171', fontSize: 20, fontWeight: 800, marginBottom: 6 }}>
                  {status === 'invalid' ? 'Coupon non valido' : 'Codice non trovato'}
                </h2>
                <p style={{ color: 'rgba(240,237,232,0.5)', fontSize: 13, marginBottom: 20 }}>
                  {result?.reason || 'Verifica che il codice sia corretto'}
                </p>
                <button onClick={reset} style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#f87171', cursor: 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <RefreshCw size={14} /> Riprova
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
