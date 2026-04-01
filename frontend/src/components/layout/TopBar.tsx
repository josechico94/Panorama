import { Link, useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useAppStore } from '@/store'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

function FafIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 100 100" fill="none">
      <path d="M20 10 L80 10 C80 10 80 26 64 31 L35 36 L35 46 L68 44 C68 44 68 58 56 63 L35 66 L35 90 L20 90 Z" fill="white" />
    </svg>
  )
}

export default function TopBar() {
  const navigate = useNavigate()
  const { city } = useAppStore()

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40, height: 56,
      background: 'rgba(var(--bg-rgb, 7,7,15), 0.92)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
    }}>
      {/* Accent line top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #BB00FF, #9000CC, transparent)' }} />

      <div style={{ maxWidth: 640, margin: '0 auto', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, #BB00FF, #9000CC)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(187,0,255,0.4)',
            flexShrink: 0,
          }}>
            <FafIcon />
          </div>
          <div>
            <span style={{ fontFamily: 'DM Sans', fontWeight: 800, fontSize: 17, color: '#BB00FF', letterSpacing: '-0.02em', display: 'block', lineHeight: 1 }}>
              faf
            </span>
            <span style={{ fontSize: 8, color: 'var(--text-3)', display: 'block', lineHeight: 1, fontFamily: 'DM Mono', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 1 }}>
              {city}
            </span>
          </div>
        </Link>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ThemeToggle />
          <button onClick={() => navigate('/esplora')} style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(187,0,255,0.1)',
            border: '1px solid rgba(187,0,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(187,0,255,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(187,0,255,0.1)')}>
            <Search size={15} color="#BB00FF" />
          </button>
        </div>
      </div>
    </header>
  )
}
