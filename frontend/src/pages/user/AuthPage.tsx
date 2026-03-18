import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, ArrowLeft, User, Mail, Lock, Sparkles } from 'lucide-react'
import { authApi } from '@/lib/api'
import { useUserStore } from '@/store'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useUserStore()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from || '/profilo'

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      let res: any
      if (mode === 'login') {
        res = await authApi.userLogin(form.email, form.password)
      } else {
        if (!form.name.trim()) { setError('Il nome è obbligatorio'); setLoading(false); return }
        if (form.password.length < 6) { setError('Password minimo 6 caratteri'); setLoading(false); return }
        res = await authApi.userRegister(form.name, form.email, form.password)
      }
      setAuth(res.token, res.user)
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(err.response?.data?.error || 'Errore, riprova')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(232,98,42,0.12) 0%, transparent 60%)',
      }} />

      {/* Back button */}
      <div className="relative z-10 p-4 pt-6">
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl glass-light flex items-center justify-center text-[var(--text-2)] hover:text-white transition-all">
          <ArrowLeft size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-5 pb-10 relative z-10 max-w-sm mx-auto w-full">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))', boxShadow: '0 8px 32px rgba(232,98,42,0.35)' }}>
            <Sparkles size={26} className="text-white" />
          </div>
          <h1 className="font-display font-bold"
            style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '32px', fontStyle: 'italic', color: 'var(--text)' }}>
            {mode === 'login' ? 'Bentornato' : 'Crea account'}
          </h1>
          <p className="text-[var(--text-3)] text-sm mt-1">
            {mode === 'login'
              ? 'Accedi per i tuoi coupon e preferiti'
              : 'Registrati gratis per accedere ai coupon'}
          </p>
        </motion.div>

        {/* Mode toggle pills */}
        <div className="flex gap-1 glass-light rounded-2xl p-1 mb-6">
          {(['login', 'register'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError('') }}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={mode === m
                ? { background: 'var(--accent)', color: '#fff', boxShadow: '0 4px 16px rgba(232,98,42,0.4)' }
                : { color: 'var(--text-3)' }
              }>
              {m === 'login' ? 'Accedi' : 'Registrati'}
            </button>
          ))}
        </div>

        {/* Form */}
        <motion.form
          key={mode}
          initial={{ opacity: 0, x: mode === 'login' ? -16 : 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          onSubmit={handleSubmit}
          className="space-y-3"
        >
          <AnimatePresence>
            {mode === 'register' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-3)]" />
                  <input
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    className="field pl-10"
                    placeholder="Il tuo nome"
                    autoComplete="name"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-3)]" />
            <input
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              className="field pl-10"
              placeholder="Email"
              autoComplete="email"
              required
            />
          </div>

          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-3)]" />
            <input
              type={showPass ? 'text' : 'password'}
              value={form.password}
              onChange={e => set('password', e.target.value)}
              className="field pl-10 pr-10"
              placeholder={mode === 'register' ? 'Password (min. 6 caratteri)' : 'Password'}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
            />
            <button type="button" onClick={() => setShowPass(s => !s)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-3)] hover:text-[var(--text)] transition-colors">
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-400 text-xs text-center bg-red-400/10 border border-red-400/20 rounded-xl py-2.5 px-3"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-accent w-full text-sm disabled:opacity-50 mt-2"
            style={{ height: 48 }}
          >
            {loading
              ? 'Caricamento...'
              : mode === 'login' ? 'Accedi' : 'Crea il mio account'
            }
          </button>
        </motion.form>

        {/* Divider */}
        <div className="divider-label my-5">oppure</div>

        {/* Guest note */}
        <p className="text-center text-[var(--text-3)] text-xs leading-relaxed">
          Puoi esplorare Bologna senza account.<br />
          <button onClick={() => navigate('/')}
            className="text-[var(--accent)] hover:underline">
            Continua come ospite
          </button>
        </p>
      </div>
    </div>
  )
}
