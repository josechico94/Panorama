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
      paddingBottom: 'env(safe-area-inset-bottom)',
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 10,
      pointerEvents: 'none',
    }}>
      <nav style={{
        pointerEvents: 'all',
        maxWidth: 440,
        margin: '0 auto',
        marginBottom: 12,
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        // ✅ Bordo viola FafApp invece di var(--border)
        border: '1.5px solid rgba(187,0,255,0.45)',
        borderRadius: 30,
        boxShadow: '0 8px 40px rgba(0,0,0,0.2), 0 0 0 1px rgba(187,0,255,0.08), 0 4px 20px rgba(187,0,255,0.12)',
        display: 'flex',
        alignItems: 'center',
        // ✅ Più padding orizzontale per respirare
        padding: '0 6px',
        height: 66,
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
                // ✅ Più gap tra icona e label
                gap: 4,
                // ✅ Padding verticale generoso per non far sembrare appiccicato
                padding: '8px 6px',
                minHeight: 50,
                justifyContent: 'center',
                position: 'relative',
                // ✅ Larghezza fissa per centrare meglio la pill
                width: '100%',
              }}>

                {/* ✅ Active pill: solo sotto l'icona, non full-width — più elegante */}
                {isActive && (
                  <motion.div
                    layoutId="nav-active-pill"
                    style={{
                      position: 'absolute',
                      // Pill centrata attorno all'icona
                      top: 6,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 44,
                      height: 32,
                      borderRadius: 12,
                      // ✅ Gradiente viola invece di semplice rgba
                      background: 'linear-gradient(135deg, rgba(187,0,255,0.18), rgba(144,0,204,0.12))',
                      border: '1px solid rgba(187,0,255,0.3)',
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}

                {/* Icona */}
                <div style={{
                  width: 44,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  zIndex: 1,
                }}>
                  <Icon
                    size={isActive ? 22 : 20}
                    strokeWidth={isActive ? 2.5 : 1.7}
                    color={isActive ? '#BB00FF' : 'var(--text-3)'}
                    style={{ transition: 'all 0.25s' }}
                  />
                </div>

                {/* Label */}
                <span style={{
                  fontSize: 9,
                  fontWeight: isActive ? 700 : 400,
                  fontFamily: 'DM Sans',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  lineHeight: 1,
                  color: isActive ? '#BB00FF' : 'var(--text-3)',
                  transition: 'all 0.25s',
                  position: 'relative',
                  zIndex: 1,
                  // ✅ Leggero fade per inattivi — non competono con l'attivo
                  opacity: isActive ? 1 : 0.6,
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
