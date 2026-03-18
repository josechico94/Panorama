import { NavLink } from 'react-router-dom'
import { Home, Compass, Bookmark, User } from 'lucide-react'
import { useUserStore } from '@/store'

const NAV = [
  { to: '/',        icon: Home,    label: 'Home'    },
  { to: '/esplora', icon: Compass, label: 'Esplora' },
  { to: '/salvati', icon: Bookmark,label: 'Salvati' },
  { to: '/profilo', icon: User,    label: 'Profilo' },
]

export default function BottomNav() {
  const { isLoggedIn } = useUserStore()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-[var(--border)]">
      <div className="max-w-2xl mx-auto flex items-center h-16">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end className="flex-1">
            {({ isActive }) => (
              <div className={`flex flex-col items-center gap-1 py-2 transition-all duration-200 ${
                isActive ? 'text-[var(--accent)]' : 'text-[var(--text-3)]'
              }`}>
                <div className="relative">
                  {isActive && (
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--accent)]"
                      style={{ boxShadow: '0 0 6px var(--accent)' }} />
                  )}
                  <div className="relative">
                    <Icon size={19} strokeWidth={isActive ? 2.2 : 1.6} />
                    {/* Green dot if logged in on profile tab */}
                    {label === 'Profilo' && isLoggedIn() && !isActive && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-400 border border-[var(--bg)]" />
                    )}
                  </div>
                </div>
                <span className="text-[9px] font-semibold tracking-widest uppercase" style={{ letterSpacing: '0.1em' }}>
                  {label}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
