import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, AlertCircle } from 'lucide-react'
import { Capacitor } from '@capacitor/core'
import { Browser } from '@capacitor/browser'
import { authApi } from '@/lib/api'
import { useUserStore } from '@/store'

const API_BASE = 'https://panoramabo.onrender.com'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useUserStore()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from || '/'

  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setError('') }

  // ✅ Google login con Capacitor Browser (Custom Tab) invece del browser esterno
  const handleGoogleLogin = async () => {
    const googleUrl = `${API_BASE}/api/v1/auth/user/google`
    if (Capacitor.isNativePlatform()) {
      // Apre Chrome Custom Tab (rimane dentro l'app)
      await Browser.open({ url: googleUrl, windowName: '_self' })
    } else {
      // Web: redirect normale
      window.location.href = googleUrl
    }
  }

  const handleSubmit = async () => {
    if (!form.email) { setError('Inserisci la tua email'); return }
    setError(''); setLoading(true)
    try {
      if (mode === 'forgot') {
        await authApi.forgotPassword(form.email)
        setSuccess('Link di recupero inviato! Controlla la tua email.')
        setLoading(false); return
      }
      if (mode === 'register') {
        if (!form.name.trim()) { setError('Il nome è obbligatorio'); setLoading(false); return }
        if (form.password.length < 6) { setError('Password minimo 6 caratteri'); setLoading(false); return }
        const res = await authApi.userRegister(form.name, form.email, form.password)
        setAuth(res.token, res.user)
      } else {
        if (!form.password) { setError('Inserisci la password'); setLoading(false); return }
        const res = await authApi.userLogin(form.email, form.password)
        setAuth(res.token, res.user)
      }
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(err.response?.data?.error || 'Errore, riprova')
    } finally { setLoading(false) }
  }

  const titles = { login: 'Bentornato', register: 'Crea account', forgot: 'Recupera accesso' }
  const subtitles = { login: 'Accedi per i tuoi coupon e preferiti', register: 'Unisciti alla community faf', forgot: 'Ti mandiamo un link via email' }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>

      {/* ── Ambient glow ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: '140%', height: '60%', background: 'radial-gradient(ellipse, rgba(187,0,255,0.18) 0%, transparent 65%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-20%', width: '60%', height: '40%', background: 'radial-gradient(ellipse, rgba(144,0,204,0.1) 0%, transparent 65%)', borderRadius: '50%' }} />
      </div>

      {/* ── Back button ── */}
      <div style={{ position: 'relative', zIndex: 1, padding: '16px 20px' }}>
        <button onClick={() => navigate(-1)} style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-2)' }}>
          <ArrowLeft size={16} />
        </button>
      </div>

      {/* ── Main content ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px 24px 40px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: 360 }}>

          {/* ── Logo ── */}
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ position: 'relative', display: 'inline-flex', marginBottom: 16 }}>
              <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', background: 'radial-gradient(circle, rgba(187,0,255,0.3), transparent 70%)', animation: 'pulse-ring 3s ease-in-out infinite' }} />
              <img src="/icons/icon-192.png" alt="faf" style={{ width: 64, height: 64, borderRadius: 20, boxShadow: '0 8px 32px rgba(187,0,255,0.5)', display: 'block' }} />
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={mode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 32, fontWeight: 700, color: 'var(--text)', marginBottom: 6, lineHeight: 1 }}>
                  {titles[mode]}
                </h1>
                <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.5 }}>{subtitles[mode]}</p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* ── Mode Tabs ── */}
          {mode !== 'forgot' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 4, marginBottom: 24 }}>
              {(['login', 'register'] as const).map(m => (
                <button key={m} onClick={() => { setMode(m); setError(''); setSuccess('') }} style={{
                  flex: 1, padding: '9px 0', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                  background: mode === m ? 'linear-gradient(135deg, #BB00FF, #9000CC)' : 'transparent',
                  color: mode === m ? '#fff' : 'var(--text-3)',
                  transition: 'all 0.2s',
                  boxShadow: mode === m ? '0 2px 12px rgba(187,0,255,0.35)' : 'none',
                }}>
                  {m === 'login' ? 'Accedi' : 'Registrati'}
                </button>
              ))}
            </motion.div>
          )}

          {/* ── Google button ── */}
          {mode !== 'forgot' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              <button
              onClick={async () => {
    if (Capacitor.isNativePlatform()) {
      await Browser.open({ url: `${API_BASE}/api/v1/auth/user/google?source=app` })
    } else {
      window.location.href = `${API_BASE}/api/v1/auth/user/google`
    }
  }}
  style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    padding: '12px 0', borderRadius: 13, cursor: 'pointer',
    background: 'var(--surface)', border: '1px solid var(--border2)',
    color: 'var(--text)', fontSize: 14, fontWeight: 600, transition: 'all 0.2s',
  }}
  onMouseEnter={e => { (e.currentTarget as any).style.borderColor = 'rgba(187,0,255,0.3)'; (e.currentTarget as any).style.background = 'var(--surface2)' }}
  onMouseLeave={e => { (e.currentTarget as any).style.borderColor = 'var(--border2)'; (e.currentTarget as any).style.background = 'var(--surface)' }}>
  <GoogleIcon /> Continua con Google
</button>
            </motion.div>
          )}

          {/* ── Divider ── */}
          {mode !== 'forgot' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, var(--border2))' }} />
              <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, letterSpacing: '0.1em' }}>OPPURE</span>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, var(--border2), transparent)' }} />
            </div>
          )}

          {/* ── Form ── */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <AnimatePresence>
              {mode === 'register' && (
                <motion.div key="name-field" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <InputField icon={<User size={15} />} placeholder="Il tuo nome" value={form.name} onChange={v => set('name', v)} />
                </motion.div>
              )}
            </AnimatePresence>
            <InputField icon={<Mail size={15} />} placeholder="Email" type="email" value={form.email} onChange={v => set('email', v)} />
            {mode !== 'forgot' && (
              <InputField
                icon={<Lock size={15} />}
                placeholder="Password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={v => set('password', v)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                suffix={
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', alignItems: 'center', padding: 0 }}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
              />
            )}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 12 }}>
                  <AlertCircle size={13} color="#f87171" />
                  <span style={{ fontSize: 12, color: '#f87171' }}>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {success && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  style={{ padding: '10px 14px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 12, fontSize: 12, color: '#4ade80' }}>
                  {success}
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: '100%', padding: '14px 0', borderRadius: 14, border: 'none',
                background: loading ? 'rgba(187,0,255,0.3)' : 'linear-gradient(135deg, #BB00FF 0%, #9000CC 100%)',
                color: '#fff', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(187,0,255,0.45)',
                transition: 'all 0.2s', marginTop: 4,
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  {mode === 'forgot' ? 'Invio...' : mode === 'login' ? 'Accesso...' : 'Registrazione...'}
                </span>
              ) : mode === 'forgot' ? 'Invia link' : mode === 'login' ? 'Accedi' : 'Crea account'}
            </motion.button>
          </motion.div>

          {/* ── Footer links ── */}
          <div style={{ textAlign: 'center', marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {mode === 'login' && (
              <button onClick={() => { setMode('forgot'); setError(''); setSuccess('') }} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: 12, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}>
                Password dimenticata?
              </button>
            )}
            {mode === 'forgot' && (
              <button onClick={() => { setMode('login'); setError(''); setSuccess('') }} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: 12 }}>
                ← Torna al login
              </button>
            )}
            <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
            <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
              Puoi esplorare Bologna senza account.{' '}
              <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 12, fontWeight: 600, textDecoration: 'underline' }}>
                Continua come ospite
              </button>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-ring { 0%,100% { opacity:0.4; transform:scale(1); } 50% { opacity:0.8; transform:scale(1.08); } }
      `}</style>
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
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '13px 42px', borderRadius: 13,
          background: focused ? 'rgba(187,0,255,0.06)' : 'var(--surface)',
          border: `1.5px solid ${focused ? 'rgba(187,0,255,0.5)' : 'var(--border)'}`,
          color: 'var(--text)', fontSize: 14, outline: 'none',
          fontFamily: 'DM Sans, sans-serif',
          boxShadow: focused ? '0 0 0 3px rgba(187,0,255,0.1)' : 'none',
          transition: 'all 0.2s', boxSizing: 'border-box',
        }}
      />
      {suffix && <div style={{ position: 'absolute', right: 14, zIndex: 1 }}>{suffix}</div>}
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
    </svg>
  )
}
