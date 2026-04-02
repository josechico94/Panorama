import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, RefreshCw, AlertTriangle, Camera, Keyboard, Zap } from 'lucide-react'
import { couponsApi } from '@/lib/api'

type Status = 'idle' | 'loading' | 'success' | 'already_used' | 'invalid' | 'error'

// ── Scanner engine: tries BarcodeDetector first, falls back to ZXing WASM ──
function useQRScanner(onResult: (code: string) => void, active: boolean) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number>(0)
  const lastResultRef = useRef<string>('')
  const [cameraReady, setCameraReady] = useState(false)
  const [error, setError] = useState('')
  const [engine, setEngine] = useState<'native' | 'wasm' | null>(null)

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    setCameraReady(false)
  }, [])

  useEffect(() => {
    if (!active) { stopCamera(); return }

    let stopped = false

    const startCamera = async () => {
      try {
        // Request camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          }
        })
        if (stopped) { stream.getTracks().forEach(t => t.stop()); return }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          setCameraReady(true)
        }

        // Try native BarcodeDetector (Chrome Android, Chrome desktop)
        if ('BarcodeDetector' in window) {
          setEngine('native')
          const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] })
          const tick = async () => {
            if (stopped || !videoRef.current) return
            if (videoRef.current.readyState >= 2) {
              try {
                const results = await detector.detect(videoRef.current)
                if (results.length > 0) {
                  const raw = results[0].rawValue as string
                  if (raw !== lastResultRef.current) {
                    lastResultRef.current = raw
                    const code = extractCode(raw)
                    onResult(code)
                    return
                  }
                }
              } catch {}
            }
            rafRef.current = requestAnimationFrame(tick)
          }
          rafRef.current = requestAnimationFrame(tick)
        } else {
          // Fallback: jsQR (lightweight, pure JS, very reliable)
          setEngine('wasm')
          const jsQR = (await import('jsqr')).default
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d', { willReadFrequently: true })!

          const tick = () => {
            if (stopped || !videoRef.current) return
            const video = videoRef.current
            if (video.readyState >= 2 && video.videoWidth > 0) {
              canvas.width = video.videoWidth
              canvas.height = video.videoHeight
              ctx.drawImage(video, 0, 0)
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
              const result = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert',
              })
              if (result && result.data !== lastResultRef.current) {
                lastResultRef.current = result.data
                const code = extractCode(result.data)
                onResult(code)
                return
              }
            }
            rafRef.current = requestAnimationFrame(tick)
          }
          rafRef.current = requestAnimationFrame(tick)
        }
      } catch (err: any) {
        if (!stopped) setError(err?.message || 'Impossibile accedere alla fotocamera')
      }
    }

    startCamera()
    return () => {
      stopped = true
      stopCamera()
    }
  }, [active])

  return { videoRef, cameraReady, error, engine }
}

function extractCode(raw: string): string {
  const s = raw.trim()
  if (s.includes('/validate/')) return s.split('/validate/').pop()!.toLowerCase().trim()
  return s.toLowerCase().trim()
}

export default function VenueScannerPage() {
  const [mode, setMode] = useState<'camera' | 'manual'>('camera')
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<any>(null)
  const [manualCode, setManualCode] = useState('')
  const [scanKey, setScanKey] = useState(0)
  const processingRef = useRef(false)

  const scannerActive = mode === 'camera' && status === 'idle'

  const handleScan = useCallback(async (code: string) => {
    if (processingRef.current || !code) return
    processingRef.current = true
    setStatus('loading')
    setResult(null)
    try {
      const data = await couponsApi.validate(code)
      setResult(data)
      if (!data.valid) {
        setStatus(data.reason === 'Già utilizzato' ? 'already_used' : 'invalid')
        return
      }
      await couponsApi.markUsed(code)
      setStatus('success')
    } catch (err: any) {
      setStatus('error')
      setResult({ valid: false, reason: err.response?.data?.error || 'Codice non trovato' })
    } finally {
      processingRef.current = false
    }
  }, [])

  const { videoRef, cameraReady, error: cameraError, engine } = useQRScanner(handleScan, scannerActive)

  const reset = () => {
    setStatus('idle')
    setResult(null)
    setManualCode('')
    processingRef.current = false
    setScanKey(k => k + 1)
  }

  const showResult = ['success', 'already_used', 'invalid', 'error'].includes(status)
  const coupon = result?.userCoupon?.couponId
  const user = result?.userCoupon?.userId

  return (
    <div style={{ maxWidth: 420, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 28, height: 2, background: 'linear-gradient(90deg,#BB00FF,transparent)', borderRadius: 1 }} />
          <span style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: 'DM Mono,monospace', letterSpacing: '0.25em', textTransform: 'uppercase' }}>Validazione coupon</span>
        </div>
        <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 30, fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>Scanner QR</h1>
      </div>

      {/* Mode toggle */}
      {!showResult && status !== 'loading' && (
        <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, marginBottom: 16 }}>
          {([{ id: 'camera', icon: Camera, label: 'Fotocamera' }, { id: 'manual', icon: Keyboard, label: 'Manuale' }] as const).map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => { setMode(id); reset() }} style={{
              flex: 1, padding: '9px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: mode === id ? '#BB00FF' : 'transparent',
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
            <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid rgba(187,0,255,0.2)', borderTopColor: '#BB00FF', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: 'rgba(240,237,232,0.5)', fontSize: 13 }}>Verifica coupon...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </motion.div>
        )}

        {/* Camera */}
        {mode === 'camera' && status === 'idle' && (
          <motion.div key={'cam-' + scanKey} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {cameraError ? (
              <div style={{ padding: 20, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 16, textAlign: 'center' }}>
                <XCircle size={28} color="#f87171" style={{ margin: '0 auto 10px' }} />
                <p style={{ color: '#f87171', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Fotocamera non disponibile</p>
                <p style={{ color: 'var(--meta-color)', fontSize: 12, marginBottom: 14 }}>{cameraError}</p>
                <button onClick={() => setMode('manual')} style={{ padding: '8px 20px', borderRadius: 10, border: '1px solid rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.1)', color: '#f87171', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                  Usa codice manuale
                </button>
              </div>
            ) : (
              <div>
                {/* Video viewport */}
                <div style={{
                  position: 'relative', borderRadius: 20, overflow: 'hidden',
                  maxWidth: 340, margin: '0 auto',
                  border: '2px solid rgba(187,0,255,0.5)',
                  background: '#000', aspectRatio: '1',
                }}>
                  <video ref={videoRef} playsInline muted autoPlay
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />

                  {/* Scan frame overlay */}
                  {cameraReady && (
                    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                      {/* Dark corners */}
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.3) 100%)' }} />
                      {/* Corner markers */}
                      {[
                        { top: '18%', left: '18%', borderTop: '3px solid #BB00FF', borderLeft: '3px solid #BB00FF' },
                        { top: '18%', right: '18%', borderTop: '3px solid #BB00FF', borderRight: '3px solid #BB00FF' },
                        { bottom: '18%', left: '18%', borderBottom: '3px solid #BB00FF', borderLeft: '3px solid #BB00FF' },
                        { bottom: '18%', right: '18%', borderBottom: '3px solid #BB00FF', borderRight: '3px solid #BB00FF' },
                      ].map((s, i) => (
                        <div key={i} style={{ position: 'absolute', width: 26, height: 26, borderRadius: 3, ...s }} />
                      ))}
                      {/* Animated scan line */}
                      <div style={{
                        position: 'absolute', left: '18%', right: '18%', height: 2,
                        background: 'linear-gradient(90deg, transparent, #BB00FF, transparent)',
                        animation: 'scanLine 1.6s ease-in-out infinite',
                        boxShadow: '0 0 8px #BB00FF',
                      }} />
                    </div>
                  )}

                  {/* Loading spinner before camera ready */}
                  {!cameraReady && !cameraError && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid rgba(187,0,255,0.3)', borderTopColor: '#BB00FF', animation: 'spin 0.8s linear infinite' }} />
                      <span style={{ color: 'rgba(240,237,232,0.5)', fontSize: 12 }}>Avvio fotocamera...</span>
                    </div>
                  )}
                </div>

                {/* Engine indicator + instructions */}
                <div style={{ textAlign: 'center', marginTop: 12 }}>
                  {cameraReady && engine && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 100, padding: '3px 10px', marginBottom: 8 }}>
                      <Zap size={10} color="#4ade80" />
                      <span style={{ fontSize: 10, color: '#4ade80', fontWeight: 600 }}>
                        {engine === 'native' ? 'Scanner nativo attivo' : 'Scanner attivo'}
                      </span>
                    </div>
                  )}
                  <p style={{ color: 'var(--meta-color)', fontSize: 12 }}>
                    Punta la fotocamera sul QR bianco del cliente
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Manual */}
        {mode === 'manual' && status === 'idle' && (
          <motion.div key="manual" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <label style={{ display: 'block', fontSize: 10, color: 'var(--meta-color)', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
              Codice QR del cliente
            </label>
            <textarea value={manualCode} onChange={e => setManualCode(e.target.value)}
              onPaste={e => {
                const text = e.clipboardData.getData('text').trim()
                if (text.length > 10) setTimeout(() => handleScan(extractCode(text)), 100)
              }}
              placeholder="Incolla o digita il codice qui..." rows={3}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 13, outline: 'none', resize: 'none', fontFamily: 'DM Mono,monospace', boxSizing: 'border-box' as const, marginBottom: 10 }}
              onFocus={e => (e.target.style.borderColor = '#BB00FF')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
            <button onClick={() => handleScan(extractCode(manualCode))} disabled={!manualCode.trim()}
              style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#BB00FF,#9000CC)', color: '#fff', fontSize: 14, fontWeight: 700, opacity: manualCode.trim() ? 1 : 0.4 }}>
              Valida coupon
            </button>
          </motion.div>
        )}

        {/* Results */}
        {showResult && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            {status === 'success' && (
              <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 20, padding: 28, textAlign: 'center' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                  <CheckCircle size={56} color="#4ade80" style={{ margin: '0 auto 12px' }} />
                </motion.div>
                <h2 style={{ color: '#4ade80', fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Coupon valido! ✓</h2>
                <p style={{ color: 'rgba(240,237,232,0.5)', fontSize: 13, marginBottom: 20 }}>Sconto applicato con successo</p>
                {coupon && (
                  <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 14, padding: 16, textAlign: 'left', marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <div>
                        <p style={{ color: 'var(--meta-color)', fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Coupon applicato</p>
                        <p style={{ color: 'var(--text)', fontSize: 15, fontWeight: 700 }}>{coupon.title}</p>
                        {user && <p style={{ color: 'var(--meta-color)', fontSize: 11, marginTop: 3 }}>Cliente: {user.name}</p>}
                      </div>
                      <span style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', borderRadius: 8, padding: '4px 10px', fontSize: 14, fontWeight: 800, fontFamily: 'DM Mono,monospace', flexShrink: 0 }}>
                        {coupon.discountType === 'percentage' ? '-' + coupon.discountValue + '%' : coupon.discountType === 'fixed' ? '-€' + coupon.discountValue : 'OMAGGIO'}
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

      <style>{`
        @keyframes scanLine { 0%, 100% { top: 20%; } 50% { top: 80%; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
