import { Outlet, useNavigate, NavLink } from 'react-router-dom'
import { useVenueStore } from '@/store'
import { LogOut, Store, LayoutDashboard, QrCode, Info } from 'lucide-react'

const NAV = [
  { to: '/locale',         icon: LayoutDashboard, label: 'Dashboard', end: true  },
  { to: '/locale/scanner', icon: QrCode,           label: 'Scanner',  end: false },
  { to: '/locale/info',    icon: Info,             label: 'Info',     end: false },
]

export default function VenueLayout() {
  const { logout, owner } = useVenueStore()
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Top bar */}
      <header style={{
        background: 'var(--topbar-bg)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '0 16px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, #BB00FF, #9000CC)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Store size={15} color="white" />
          </div>
          <div>
            <p style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600, lineHeight: 1 }}>
              {owner?.name || 'Il mio locale'}
            </p>
            <p style={{ color: 'var(--text-3)', fontSize: 10, marginTop: 2 }}>
              Pannello locale
            </p>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate('/locale/login') }}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            color: 'var(--text-3)', fontSize: 12, fontWeight: 500,
            background: 'none', border: 'none', cursor: 'pointer', padding: '6px 10px',
            borderRadius: 8, transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,237,232,0.4)')}
        >
          <LogOut size={13} /> Esci
        </button>
      </header>

      {/* Bottom tab nav */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border)',
        display: 'flex', height: 60,
      }}>
        {NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end} style={{ flex: 1, textDecoration: 'none' }}>
            {({ isActive }) => (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 3, height: '100%',
                color: isActive ? '#BB00FF' : 'rgba(240,237,232,0.35)',
                transition: 'color 0.2s',
              }}>
                <Icon size={19} strokeWidth={isActive ? 2.2 : 1.6} />
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {label}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Main */}
      <main style={{ padding: '16px 16px 80px', maxWidth: 640, margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  )
}
