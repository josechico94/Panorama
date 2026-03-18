import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAdminStore } from '@/store'
import {
  LayoutDashboard, MapPin, Users, Tag, Star,
  Store, LogOut, Shield, Menu, X, ChevronRight
} from 'lucide-react'

const NAV = [
  { to: '/superadmin',         icon: LayoutDashboard, label: 'Dashboard',  end: true },
  { to: '/superadmin/places',  icon: MapPin,           label: 'Luoghi' },
  { to: '/superadmin/venues',  icon: Store,            label: 'Locali & Gestori' },
  { to: '/superadmin/users',   icon: Users,            label: 'Utenti' },
  { to: '/superadmin/coupons', icon: Tag,              label: 'Coupon' },
  { to: '/superadmin/reviews', icon: Star,             label: 'Recensioni' },
]

export default function SuperAdminLayout() {
  const { logout, admin } = useAdminStore()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/admin/login') }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#e8622a,#f0884a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Shield size={16} color="white" />
        </div>
        <div>
          <p style={{ color: '#f0ede8', fontSize: 13, fontWeight: 700, lineHeight: 1 }}>Super Admin</p>
          <p style={{ color: 'rgba(240,237,232,0.3)', fontSize: 10, marginTop: 2 }}>{admin?.email || 'CityApp'}</p>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 8px' }}>
        {NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end} style={{ textDecoration: 'none', display: 'block', marginBottom: 2 }}
            onClick={() => setMobileOpen(false)}>
            {({ isActive }) => (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                borderRadius: 10, fontSize: 13, fontWeight: 500, transition: 'all 0.15s',
                background: isActive ? 'rgba(232,98,42,0.12)' : 'transparent',
                color: isActive ? '#e8622a' : 'rgba(240,237,232,0.5)',
                borderLeft: `2px solid ${isActive ? '#e8622a' : 'transparent'}`,
              }}>
                <Icon size={15} />
                <span style={{ flex: 1 }}>{label}</span>
                {isActive && <ChevronRight size={12} />}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ padding: '8px 12px', marginBottom: 4 }}>
          <p style={{ color: '#f0ede8', fontSize: 12, fontWeight: 600 }}>{admin?.name || 'Admin'}</p>
          <p style={{ color: 'rgba(240,237,232,0.3)', fontSize: 10 }}>{admin?.role}</p>
        </div>
        <button onClick={handleLogout} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px',
          borderRadius: 10, border: 'none', cursor: 'pointer',
          background: 'transparent', color: 'rgba(240,237,232,0.4)', fontSize: 13,
          transition: 'all 0.15s',
        }}
          onMouseEnter={e => { (e.currentTarget as any).style.color = '#f87171'; (e.currentTarget as any).style.background = 'rgba(248,113,113,0.08)' }}
          onMouseLeave={e => { (e.currentTarget as any).style.color = 'rgba(240,237,232,0.4)'; (e.currentTarget as any).style.background = 'transparent' }}
        >
          <LogOut size={14} /> Logout
        </button>
      </div>
    </>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', background: '#0d0d1a', color: '#f0ede8', fontFamily: 'DM Sans,sans-serif' }}>
      {/* Desktop sidebar */}
      <aside style={{
        width: 230, background: '#090910', borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', inset: '0 auto 0 0', zIndex: 40,
        // Hide on mobile
        ...(typeof window !== 'undefined' && window.innerWidth < 768 ? { display: 'none' } : {}),
      }} className="sa-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} onClick={() => setMobileOpen(false)} />
          <aside style={{ width: 260, background: '#090910', borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, marginLeft: 0, display: 'flex', flexDirection: 'column' }} className="sa-main">
        {/* Top bar mobile */}
        <header style={{
          height: 52, background: '#090910', borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12,
          position: 'sticky', top: 0, zIndex: 30,
        }}>
          <button onClick={() => setMobileOpen(true)} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', color: '#f0ede8' }}>
            <Menu size={18} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg,#e8622a,#f0884a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={13} color="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#f0ede8' }}>Super Admin</span>
          </div>
        </header>

        <main style={{ flex: 1, padding: '24px 16px', maxWidth: 1200, width: '100%', margin: '0 auto' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .sa-sidebar { display: flex !important; }
          .sa-main { margin-left: 230px !important; }
          .sa-main header { display: none !important; }
        }
      `}</style>
    </div>
  )
}
