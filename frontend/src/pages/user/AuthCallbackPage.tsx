import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useUserStore } from '@/store'

export default function AuthCallbackPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { setAuth } = useUserStore()

  useEffect(() => {
    // ✅ Leggi params dall'URL normale O dal deep link Capacitor
    const getParam = (key: string): string | null => {
      // Prima prova i search params normali
      const val = params.get(key)
      if (val) return val
      // Poi prova a leggere dall'hash o dal path (deep link)
      const href = window.location.href
      const match = href.match(new RegExp(`[?&]${key}=([^&]+)`))
      return match ? decodeURIComponent(match[1]) : null
    }

    const token = getParam('token')
    const name = getParam('name')
    const email = getParam('email')
    const error = getParam('error')

    if (error) {
      navigate('/accedi?error=' + error, { replace: true })
      return
    }

    if (token && name && email) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const realUserId = payload.id

        setAuth(token, {
          id: realUserId,
          name: decodeURIComponent(name),
          email: decodeURIComponent(email),
        })

        navigate('/', { replace: true })
      } catch (err) {
        console.error('Error procesando el token:', err)
        navigate('/accedi', { replace: true })
      }
    } else {
      navigate('/accedi', { replace: true })
    }
  }, [navigate, params, setAuth])

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', flexDirection: 'column', gap: 16,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        border: '3px solid rgba(187,0,255,0.2)',
        borderTopColor: '#BB00FF',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: 'var(--text-3)', fontSize: 13 }}>Accesso in corso...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
