import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, AlertCircle, Store } from 'lucide-react'
import { authApi } from '@/lib/api'
import { useVenueStore } from '@/store'

export default function VenueLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useVenueStore()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const handleSubmit = async () => {
    if (!email || !password) { setError('Inserisci email e password'); return }
    setError(''); setLoading(true)
    try {
      const { token, owner } = await authApi.venueLogin(email, password)
      setAuth(token, owner)
      qc.clear()
      navigate('/locale')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Credenziali non valide')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', overflow: 'hidden' }}>

      {/* Ambient glow */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: '120%', height: '55%', background: 'radial-gradient(ellipse, rgba(187,0,255,0.15) 0%, transparent 65%)', borderRadius: '50%' }} />
      </div>

      <div style={{ width: '100%', maxWidth: 360, position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ position: 'relative', display: 'inline-flex', marginBottom: 20 }}>
            <div style={{ position: 'absolute', inset: -10, borderRadius: '50%', background: 'radial-gradient(circle, rgba(187,0,255,0.25), transparent 70%)' }} />
            <div style={{ width: 72, height: 72, borderRadius: 22, background: 'linear-gradient(135deg, #BB00FF, #7700CC)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(187,0,255,0.45)', position: 'relative' }}>
              <Store size={32} color="white" />
            </div>
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 32, fontWeight: 700, color: 'var(--text)', marginBottom: 6, lineHeight: 1 }}>
            Portale Locale
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Gestisci il tuo locale su FafApp</p>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Email */}
          <InputField
            icon={<Mail size={15} />}
            placeholder="Email locale"
            type="email"
            value={email}
            onChange={v => { setEmail(v); setError('') }}
          />

          {/* Password */}
          <InputField
            icon={<Lock size={15} />}
            placeholder="Password"
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={v => { setPassword(v); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            suffix={
              <button type="button" onClick={() => setShowPass(s => !s)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', alignItems: 'center', padding: 0 }}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
          />

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 12 }}>
                <AlertCircle size={13} color="#f87171" />
                <span style={{ fontSize: 12, color: '#f87171' }}>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button whileTap={{ scale: 0.97 }} onClick={handleSubmit} disabled={loading}
            style={{ width: '100%', padding: '14px 0', borderRadius: 14, border: 'none', background: loading ? 'rgba(187,0,255,0.3)' : 'linear-gradient(135deg, #BB00FF, #9000CC)', color: '#fff', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 4px 20px rgba(187,0,255,0.4)', marginTop: 4 }}>
            {loading
              ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  Accesso...
                </span>
              : 'Accedi al pannello'
            }
          </motion.button>
        </motion.div>

        {/* Footer */}
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'var(--text-3)' }}>
          Non hai accesso? Contatta{' '}
          <a href="mailto:admin@faf-app.com" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
            admin@faf-app.com
          </a>
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function InputField({ icon, placeholder, type = 'text', value, onChange, suffix, onKeyDown }: {
  icon: React.ReactNode; placeholder: string; type?: string;
  value: string; onChange: (v: string) => void;
  suffix?: React.ReactNode; onKeyDown?: (e: React.KeyboardEvent) => void;
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <div style={{ position: 'absolute', left: 14, color: focused ? 'var(--accent)' : 'var(--text-3)', display: 'flex', transition: 'color 0.2s', pointerEvents: 'none', zIndex: 1 }}>
        {icon}
      </div>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        onKeyDown={onKeyDown} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ width: '100%', padding: '13px 42px', borderRadius: 13, background: focused ? 'rgba(187,0,255,0.06)' : 'var(--surface)', border: '1.5px solid ' + (focused ? 'rgba(187,0,255,0.5)' : 'var(--border)'), color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'DM Sans, sans-serif', boxShadow: focused ? '0 0 0 3px rgba(187,0,255,0.1)' : 'none', transition: 'all 0.2s', boxSizing: 'border-box' as const }} />
      {suffix && <div style={{ position: 'absolute', right: 14, zIndex: 1 }}>{suffix}</div>}
    </div>
  )
}
