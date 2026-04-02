import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/lib/api'
import { useVenueStore } from '@/store'

export default function VenueLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useVenueStore()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const { token, owner } = await authApi.venueLogin(email, password)
      setAuth(token, owner)
      qc.clear() // clear all cached data so new venue sees fresh data
      navigate('/locale')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Credenziali non valide')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg,var(--accent),var(--accent2))' }}>
            <span className="font-display font-bold text-white text-xl" style={{ fontFamily:'Cormorant Garamond,serif' }}>🏪</span>
          </div>
          <h1 className="font-display font-bold text-white"
            style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'28px', fontStyle:'italic' }}>
            Portale Locale
          </h1>
          <p className="text-[var(--text-3)] text-sm mt-1">Gestisci il tuo locale su CityApp</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[var(--text-3)] mb-1.5 tracking-wide">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="field" placeholder="locale@esempio.com" required />
          </div>
          <div>
            <label className="block text-xs text-[var(--text-3)] mb-1.5 tracking-wide">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="field" placeholder="••••••••" required />
          </div>
          {error && <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2.5 text-center">{error}</p>}
          <button type="submit" disabled={loading} className="btn btn-accent w-full disabled:opacity-50">
            {loading ? 'Accesso...' : 'Accedi al pannello'}
          </button>
        </form>

        <p className="text-center text-[var(--text-3)] text-xs">
          Non hai accesso? Contatta <span className="text-[var(--accent)]">admin@cityapp.com</span>
        </p>
      </div>
    </div>
  )
}
