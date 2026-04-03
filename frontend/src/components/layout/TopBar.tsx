import { Link, useNavigate } from 'react-router-dom'
import { Search, Sun, Moon } from 'lucide-react'
import { useAppStore } from '@/store'
import { useThemeStore } from '@/components/ui/ThemeToggle'
import NotificationBell from '@/components/ui/NotificationBell'

function FafIcon({ size = 18 }: { size?: number }) {
  return (
    <img src="/icons/icon-192.png" alt="faf" width={size} height={size}
      style={{ borderRadius: 6, display: 'block', flexShrink: 0 }} />
  )
}

export default function TopBar() {
  const navigate = useNavigate()
  const { city } = useAppStore()
  const { theme, toggle } = useThemeStore()

  return (
    <header
      className="topbar"
      style={{
        // ✅ position fixed così rimane sempre in cima
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'var(--bg)',
        // ✅ Altezza = 56px contenuto + safe area inset top (Dynamic Island/notch)
        paddingTop: 'env(safe-area-inset-top)',
        height: 'calc(56px + env(safe-area-inset-top))',
        boxSizing: 'border-box',
      }}
    >
      {/* Accent line — sotto la safe area */}
      <div style={{
        position: 'absolute',
        top: 'env(safe-area-inset-top)',
        left: 0,
        right: 0,
        height: 2,
        background: 'linear-gradient(90deg, #BB00FF, #9000CC, #BB00FF00)'
      }} />

      <div style={{
        width: '100%',
        maxWidth: 672,
        margin: '0 auto',
        height: 56, // solo la parte visibile, senza safe area
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        boxSizing: 'border-box',
      }}>
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
          <FafIcon size={30} />
          <div>
            <span style={{ fontFamily: 'DM Sans', fontWeight: 800, fontSize: 17, color: '#BB00FF', letterSpacing: '-0.03em', display: 'block', lineHeight: 1.1 }}>
              faf
            </span>
            <span style={{ fontSize: 7, color: 'var(--text-3)', display: 'block', lineHeight: 1, fontFamily: 'DM Mono', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 1 }}>
              {city}
            </span>
          </div>
        </Link>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <NotificationBell />
          <button onClick={toggle}
            style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-3)', flexShrink: 0 }}>
            {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
          </button>
          <button onClick={() => navigate('/esplora')}
            style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(187,0,255,0.1)', border: '1px solid rgba(187,0,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <Search size={14} color="#BB00FF" />
          </button>
        </div>
      </div>
    </header>
  )
}