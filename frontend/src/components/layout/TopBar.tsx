import { Link, useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useAppStore } from '@/store'

export function FafLogo({ size = 28, white = false }: { size?: number; white?: boolean }) {
  const color = white ? '#FFFFFF' : '#BB00FF'
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path d="M20 10 C20 10 80 10 80 10 C80 10 80 25 65 30 C65 30 45 33 35 35 L35 45 C35 45 70 43 70 43 C70 43 70 57 57 62 C57 62 35 65 35 65 L35 90 L20 90 Z" fill={color} />
    </svg>
  )
}

export default function TopBar() {
  const navigate = useNavigate()
  const { city } = useAppStore()

  return (
    <header className="topbar fixed top-0 left-0 right-0 z-40" style={{ height: 56 }}>
      <div className="max-w-2xl mx-auto h-full flex items-center justify-between px-4">
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, #BB00FF, #9000CC)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(187,0,255,0.35)',
          }}>
            <FafLogo size={20} white />
          </div>
          <div>
            <span style={{ fontFamily: 'DM Sans', fontWeight: 800, fontSize: 17, color: '#BB00FF', letterSpacing: '-0.02em' }}>
              faf
            </span>
            <span style={{ fontSize: 9, color: 'var(--text-3)', display: 'block', lineHeight: 1, marginTop: -2, fontFamily: 'DM Mono', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              {city}
            </span>
          </div>
        </Link>

        {/* Search */}
        <button onClick={() => navigate('/esplora')} style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'rgba(187,0,255,0.08)',
          border: '1px solid rgba(187,0,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.2s',
        }}
          onMouseEnter={e => { (e.currentTarget as any).style.background = 'rgba(187,0,255,0.15)' }}
          onMouseLeave={e => { (e.currentTarget as any).style.background = 'rgba(187,0,255,0.08)' }}>
          <Search size={16} color="#BB00FF" />
        </button>
      </div>
    </header>
  )
}
