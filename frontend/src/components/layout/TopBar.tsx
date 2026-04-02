import { Link, useNavigate } from 'react-router-dom'
import { Search, Sun, Moon } from 'lucide-react'
import { useAppStore } from '@/store'
import { useThemeStore } from '@/components/ui/ThemeToggle'

function FafIcon({ size = 18 }: { size?: number }) {
  return (
    <img
      src="/icons/icon-192.png"
      alt="faf"
      width={size}
      height={size}
      style={{ borderRadius: 6, display: 'block' }}
    />
  )
}

export default function TopBar() {
  const navigate = useNavigate()
  const { city } = useAppStore()
  const { theme, toggle } = useThemeStore()

  return (
    <header className="topbar" style={{ height: 56 }}>
      {/* Purple accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, #BB00FF, #9000CC, #BB00FF00)',
      }} />

      <div style={{
        maxWidth: 672, margin: '0 auto', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px',
      }}>
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
          <div style={{ flexShrink: 0 }}>
            <FafIcon size={34} />
          </div>
          <div>
            <span style={{
              fontFamily: 'DM Sans', fontWeight: 800, fontSize: 18,
              color: '#BB00FF', letterSpacing: '-0.03em',
              display: 'block', lineHeight: 1.1,
            }}>
              FAF
            </span>
            <span style={{
              fontSize: 8, color: 'var(--text-3)',
              display: 'block', lineHeight: 1,
              fontFamily: 'DM Mono', letterSpacing: '0.2em',
              textTransform: 'uppercase', marginTop: 1,
            }}>
              {city}
            </span>
          </div>
        </Link>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Theme toggle */}
          <button
            onClick={toggle}
            title={theme === 'dark' ? 'Passa al tema chiaro' : 'Passa al tema scuro'}
            style={{
              width: 34, height: 34, borderRadius: 9,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s', color: 'var(--text-3)',
            }}
            onMouseEnter={e => { (e.currentTarget as any).style.borderColor = 'var(--accent)'; (e.currentTarget as any).style.color = 'var(--accent)' }}
            onMouseLeave={e => { (e.currentTarget as any).style.borderColor = 'var(--border)'; (e.currentTarget as any).style.color = 'var(--text-3)' }}>
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* Search */}
          <button
            onClick={() => navigate('/esplora')}
            title="Cerca"
            style={{
              width: 34, height: 34, borderRadius: 9,
              background: 'rgba(187,0,255,0.1)',
              border: '1px solid rgba(187,0,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget as any).style.background = 'rgba(187,0,255,0.18)'}
            onMouseLeave={e => (e.currentTarget as any).style.background = 'rgba(187,0,255,0.1)'}>
            <Search size={15} color="#BB00FF" />
          </button>
        </div>
      </div>
    </header>
  )
}
