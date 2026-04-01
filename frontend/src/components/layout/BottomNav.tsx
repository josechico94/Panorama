import { NavLink } from 'react-router-dom'
import { Home, Compass, Sparkles, Bookmark, User } from 'lucide-react'

const NAV = [
  { to: '/',           icon: Home,     label: 'Home'       },
  { to: '/esplora',    icon: Compass,  label: 'Esplora'    },
  { to: '/esperienze', icon: Sparkles, label: 'Esperienze' },
  { to: '/salvati',    icon: Bookmark, label: 'Salvati'    },
  { to: '/profilo',    icon: User,     label: 'Profilo'    },
]

export default function BottomNav() {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
      background: 'rgba(247,243,255,0.95)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(187,0,255,0.12)',
      boxShadow: '0 -4px 24px rgba(187,0,255,0.1)',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      <div style={{
        maxWidth: 520, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        height: 60,
      }}>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 3, textDecoration: 'none', padding: '0 12px',
              color: isActive ? '#BB00FF' : '#8B5BA0',
              transition: 'color 0.2s',
            })}>
            {({ isActive }) => (
              <>
                <div style={{
                  width: 36, height: 36, borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isActive ? 'rgba(187,0,255,0.12)' : 'transparent',
                  transition: 'all 0.2s',
                }}>
                  <Icon size={isActive ? 22 : 20}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    style={{ transition: 'all 0.2s' }} />
                </div>
                <span style={{
                  fontSize: 9, fontWeight: isActive ? 700 : 500,
                  fontFamily: 'DM Sans', letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                }}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
