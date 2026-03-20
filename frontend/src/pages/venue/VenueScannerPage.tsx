import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, RefreshCw, AlertTriangle, Camera, Keyboard } from 'lucide-react'
import { couponsApi } from '@/lib/api'

type Status = 'idle' | 'scanning' | 'loading' | 'success' | 'already_used' | 'invalid' | 'error'

// ── Native BarcodeDetector scanner ──
function NativeCameraScanner({ onScan, onError }: { onScan: (code: string) => void; onError: (msg: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number>(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let detector: any = null
    let stopped = false

    const start = async () => {
      try {
        // Get camera stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          setReady(true)
        }

        // Try native BarcodeDetector first
        if ('BarcodeDetector' in window) {
          detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] })
          const scan = async () => {
            if (stopped || !videoRef.current) return
            try {
              const barcodes = await detector.detect(videoRef.current)
              if (barcodes.length > 0) {
                const raw = barcodes[0].rawValue
                const code = raw.includes('/validate/') ? raw.split('/validate/').pop()! : raw
                onScan(code.toLowerCase().trim())
                return
              }
            } catch {}
            rafRef.current = requestAnimationFrame(scan)
          }
          rafRef.current = requestAnimationFrame(scan)
        } else {
          // Fallback: html5-qrcode
          const { Html5Qrcode } = await import('html5-qrcode')
          const scanner = new Html5Qrcode('qr-region')
          const boxSize = Math.min(window.innerWidth * 0.65, 250)
          await scanner.start(
            { facingMode: 'environment' },
            { fps: 15, qrbox: { width: boxSize, height: boxSize } },
            (text: string) => {
              if (stopped) return
              const code = text.includes('/validate/') ? text.split('/validate/').pop()! : text
              onScan(code.toLowerCase().trim())
              scanner.stop().catch(() => {})
            },
            () => {}
          )
          streamRef.current = null // html5-qrcode manages its own stream
        }
      } catch (err: any) {
        onError(err?.message || 'Impossibile accedere alla fotocamera')
      }
    }

    start()

    return () => {
      stopped = true
      cancelAnimationFrame(rafRef.current)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
      }
    }
  }, [])

  // Only show video element when using native BarcodeDetector
  const isNative = 'BarcodeDetector' in window

  return (
    <div style={{ position: 'relative', maxWidth: 320, margin: '0 auto' }}>
      {isNative ? (
        <div style={{ borderRadius: 20, overflow: 'hidden', border: '2px solid rgba(232,98,42,0.5)', background: '#000', aspectRatio: '1', position: 'relative' }}>
          <video ref={videoRef} playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          {ready && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              {/* Corner markers */}
              {[
                { top: '18%', left: '18%', borderTop: '3px solid #e8622a', borderLeft: '3px solid #e8622a' },
                { top: '18%', right: '18%', borderTop: '3px solid #e8622a', borderRight: '3px solid #e8622a' },
                { bottom: '18%', left: '18%', borderBottom: '3px solid #e8622a', borderLeft: '3px solid #e8622a' },
                { bottom: '18%', right: '18%', borderBottom: '3px solid #e8622a', borderRight: '3px solid #e8622a' },
              ].map((s, i) => (
                <div key={i} style={{ position: 'absolute', width: 22, height: 22, borderRadius: 2, ...s }} />
              ))}
              {/* Scan line */}
              <div style={{
                position: 'absolute', left: '18%', right: '18%', height: 2,
                background: 'linear-gradient(90deg, transparent, #e8622a, transparent)',
                animation: 'scanLine 2s ease-in-out infinite',
              }} />
            </div>
          )}
        </div>
      ) : (
        // html5-qrcode fallback — it creates its own video element
        <div id="qr-region" style={{ borderRadius: 20, overflow: 'hidden', border: '2px solid rgba(232,98,42,0.5)', maxWidth: 320 }} />
      )}
      <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(240,237,232,0.4)', marginTop: 10 }}>
        {ready ? 'Punta la fotocamera sul QR del cliente' : 'Avvio fotocamera...'}
      </p>
      <style>{`
        @keyframes scanLine { 0%,100% { top:20% } 50% { top:80% } }
        #qr-region video { object-fit:cover !important; width:100% !important; }
        #qr-region > div { border:none !important; }
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
      </div>

      {/* Mode toggle */}
      {!showResult && status !== 'loading' && (
        <div style={{ display: 'flex', gap: 4, padding: 4, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, marginBottom: 20 }}>
          {([{ id: 'camera', icon: Camera, label: 'Fotocamera' }, { id: 'manual', icon: Keyboard, label: 'Manuale' }] as const).map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => { setMode(id); reset() }} style={{
              flex: 1, padding: '8px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: mode === id ? '#e8622a' : 'transparent',
              color: mode === id ? '#fff' : 'rgba(240,237,232,0.4)',
              fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
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
            <style>{`@keyframes spin { to { transform:rotate(360deg) } }`}</style>
          </motion.div>
        )}

        {/* Camera */}
        {mode === 'camera' && status === 'idle' && (
          <motion.div key={`cam-${scanKey}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
              <NativeCameraScanner
                key={scanKey}
                onScan={validate}
                onError={setCameraError}
              />
            )}
          </motion.div>
        )}

        {/* Manual */}
        {mode === 'manual' && status === 'idle' && (
          <motion.div key="manual" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
              placeholder="Incolla o digita il codice..." rows={3}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 12, boxSizing: 'border-box' as const, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#f0ede8', fontSize: 13, outline: 'none', resize: 'none', fontFamily: 'DM Mono,monospace', marginBottom: 10 }}
              onFocus={e => (e.target.style.borderColor = '#e8622a')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
            <button onClick={() => { const code = manualCode.includes('/validate/') ? manualCode.split('/validate/').pop()! : manualCode.trim(); validate(code) }}
              disabled={!manualCode.trim()}
              style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#e8622a,#f0884a)', color: '#fff', fontSize: 14, fontWeight: 700, opacity: manualCode.trim() ? 1 : 0.4 }}>
              Valida coupon
            </button>
          </motion.div>
        )}

        {/* Results */}
        {showResult && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}>
            {status === 'success' && (
              <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 20, padding: 28, textAlign: 'center' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                  <CheckCircle size={56} color="#4ade80" style={{ margin: '0 auto 12px' }} />
                </motion.div>
                <h2 style={{ color: '#4ade80', fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Coupon valido! ✓</h2>
                <p style={{ color: 'rgba(240,237,232,0.5)', fontSize: 13, marginBottom: 20 }}>Sconto applicato con successo</p>
                {coupon && (
                  <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 14, padding: 16, textAlign: 'left', marginBottom: 20 }}>
                    <p style={{ color: 'rgba(240,237,232,0.4)', fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Coupon applicato</p>
                    <p style={{ color: '#f0ede8', fontSize: 15, fontWeight: 700 }}>{coupon.title}</p>
                    {user && <p style={{ color: 'rgba(240,237,232,0.4)', fontSize: 11, marginTop: 3 }}>Cliente: {user.name}</p>}
                    <span style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', borderRadius: 8, padding: '4px 10px', fontSize: 14, fontWeight: 800, fontFamily: 'DM Mono,monospace', marginTop: 8, display: 'inline-block' }}>
                      {coupon.discountType === 'percentage' ? `-${coupon.discountValue}%` : coupon.discountType === 'fixed' ? `-€${coupon.discountValue}` : 'OMAGGIO'}
                    </span>
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
