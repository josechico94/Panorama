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
    <nav className="fixed-bottom">
      <div style={{
        maxWidth: 560,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: 60,
        padding: '0 4px',
      }}>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              textDecoration: 'none',
              flex: 1,
              padding: '6px 0',
              color: isActive ? '#BB00FF' : 'var(--text-3)',
              transition: 'color 0.2s',
            })}
          >
            {({ isActive }) => (
              <>
                <div style={{
                  width: 38,
                  height: 30,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isActive ? 'rgba(187,0,255,0.12)' : 'transparent',
                  transition: 'background 0.2s',
                }}>
                  <Icon
                    size={isActive ? 21 : 20}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    style={{ transition: 'all 0.2s' }}
                  />
                </div>
                <span style={{
                  fontSize: 9,
                  fontWeight: isActive ? 700 : 500,
                  fontFamily: 'DM Sans',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  lineHeight: 1,
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
