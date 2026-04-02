import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, MapPin, LogOut } from 'lucide-react'
import { useAdminStore } from '@/store'

const NAV = [
  { to: '/admin',        icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/places', icon: MapPin,           label: 'Luoghi',   end: false },
]

export default function AdminLayout() {
  const { logout, admin } = useAdminStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-dvh flex bg-[var(--color-bg)]">
      {/* Sidebar */}
      <aside className="w-56 border-r border-white/5 flex flex-col fixed inset-y-0 left-0 z-40">
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
              <span className="font-display font-bold text-white">C</span>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">CityApp</p>
              <p className="text-white/30 text-xs">Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-white/5">
          <div className="px-3 py-2 mb-2">
            <p className="text-white/70 text-xs font-medium truncate">{admin?.name || 'Admin'}</p>
            <p className="text-white/30 text-xs truncate">{admin?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all w-full"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-56 p-8 min-h-dvh">
        <Outlet />
      </main>
    </div>
  )
}
