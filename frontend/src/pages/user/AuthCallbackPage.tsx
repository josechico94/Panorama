import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useUserStore } from '@/store'

export default function AuthCallbackPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { setAuth } = useUserStore()

  useEffect(() => {
    const token = params.get('token')
    const name = params.get('name')
    const email = params.get('email')
    const error = params.get('error')

    if (error) {
      navigate('/accedi?error=' + error, { replace: true })
      return
    }

    if (token && name && email) {
      try {
        // 1. EL TRUCO: Decodificamos el JWT para sacar el ID real
        const payload = JSON.parse(atob(token.split('.')[1]))
        const realUserId = payload.id

        // 2. Guardamos el usuario COMPLETO
        setAuth(token, {
          id: realUserId, // <--- ¡Problema resuelto!
          name: decodeURIComponent(name),
          email: decodeURIComponent(email),
        })
        
        // 3. Entramos a la app
        navigate('/', { replace: true })
      } catch (err) {
        console.error('Error procesando el token:', err)
        navigate('/accedi', { replace: true })
      }
    } else {
      navigate('/accedi', { replace: true })
    }
  }, [navigate, params, setAuth]) // Buenas prácticas de React

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