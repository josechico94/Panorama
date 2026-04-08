import { NavLink, useLocation } from 'react-router-dom'
import { Home, Compass, Sparkles, Bookmark, User } from 'lucide-react'
import { motion } from 'framer-motion'

const NAV = [
  { to: '/',           icon: Home,     label: 'Home'       },
  { to: '/esplora',    icon: Compass,  label: 'Esplora'    },
  { to: '/esperienze', icon: Sparkles, label: 'Esperienze' },
  { to: '/salvati',    icon: Bookmark, label: 'Salvati'    },
  { to: '/profilo',    icon: User,     label: 'Profilo'    },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 40,
      // Safe area iPhone
      paddingBottom: 'env(safe-area-inset-bottom)',
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 10,
      // No background — floating effect
      pointerEvents: 'none',
    }}>
      <nav style={{
        pointerEvents: 'all',
        maxWidth: 420,
        margin: '0 auto',
        marginBottom: 12,
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid var(--border)',
        borderRadius: 28,
        boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(187,0,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: 62,
        padding: '0 8px',
      }}>
        {NAV.map(({ to, icon: Icon, label }) => {
          const isActive = to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(to)

          return (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={{ textDecoration: 'none', flex: 1, display: 'flex', justifyContent: 'center' }}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                padding: '6px 0',
                minHeight: 44,
                justifyContent: 'center',
                position: 'relative',
              }}>
                {/* Active pill background */}
                {isActive && (
                  <motion.div
                    layoutId="nav-active-pill"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 16,
                      background: 'rgba(187,0,255,0.12)',
                      border: '1px solid rgba(187,0,255,0.2)',
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                <div style={{
                  width: 36,
                  height: 26,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  zIndex: 1,
                }}>
                  <Icon
                    size={isActive ? 21 : 20}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    color={isActive ? '#BB00FF' : 'var(--text-3)'}
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
                  color: isActive ? '#BB00FF' : 'var(--text-3)',
                  transition: 'color 0.2s',
                  position: 'relative',
                  zIndex: 1,
                }}>
                  {label}
                </span>
              </div>
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}
