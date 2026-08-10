// Tracking de eventos — batching en memoria, envío cada 5s o al salir de la pantalla.
// Regla: si el tracking falla, la app sigue funcionando como si nada.

const isNative = typeof window !== 'undefined' && (window as any).Capacitor?.isNativePlatform?.()
const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost'
const BASE_URL = (isNative || !isLocalhost)
  ? 'https://panoramabo.onrender.com/api/v1'
  : '/api/v1'

export type EventType =
  | 'place_impression' | 'place_view'
  | 'coupon_impression' | 'coupon_view' | 'coupon_download'
  | 'experience_view' | 'search'

type EventPayload = {
  type: EventType
  placeId?: string
  couponId?: string
  experienceId?: string
  source?: string
  query?: string
  ts?: string
}

/** Id anónimo estable por dispositivo — permite contar visitantes únicos sin login. */
function getAnonId(): string {
  try {
    let id = localStorage.getItem('faf_anon_id')
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem('faf_anon_id', id)
    }
    return id
  } catch {
    return ''
  }
}

function getUserToken(): string | null {
  try {
    const raw = localStorage.getItem('cityapp-user')
    return raw ? JSON.parse(raw)?.state?.token || null : null
  } catch {
    return null
  }
}

let queue: EventPayload[] = []
let timer: ReturnType<typeof setTimeout> | null = null

async function flush() {
  if (timer) { clearTimeout(timer); timer = null }
  if (!queue.length) return
  const events = queue.splice(0, 50)

  const body = JSON.stringify({ anonId: getAnonId(), events })
  const token = getUserToken()

  try {
    // sendBeacon sobrevive al cierre de la pestaña, pero no manda Authorization:
    // lo usamos sólo para usuarios anónimos.
    if (!token && navigator.sendBeacon) {
      navigator.sendBeacon(`${BASE_URL}/events`, new Blob([body], { type: 'application/json' }))
      return
    }
    await fetch(`${BASE_URL}/events`, {
      method: 'POST',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body,
    })
  } catch {
    // descartamos el lote: no vale la pena reintentar métricas
  }
}

export function track(type: EventType, payload: Omit<EventPayload, 'type' | 'ts'> = {}) {
  queue.push({ type, ...payload, ts: new Date().toISOString() })
  if (queue.length >= 20) { void flush(); return }
  if (!timer) timer = setTimeout(() => void flush(), 5000)
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') void flush()
  })
}

/**
 * Dispara una impresión por cada elemento visible en pantalla, una sola vez.
 * Uso en la card:
 *   const ref = useImpression('place_impression', { placeId: place._id, source: 'home' })
 *   <div ref={ref}> ... </div>
 */
export function observeImpression(
  el: Element | null,
  type: EventType,
  payload: Omit<EventPayload, 'type' | 'ts'>,
) {
  if (!el || typeof IntersectionObserver === 'undefined') return () => {}
  let fired = false
  const obs = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting && !fired) {
        fired = true
        track(type, payload)
        obs.disconnect()
      }
    }
  }, { threshold: 0.5 })
  obs.observe(el)
  return () => obs.disconnect()
}
