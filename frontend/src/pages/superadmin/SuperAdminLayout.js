"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SuperAdminLayout;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var store_1 = require("@/store");
var lucide_react_1 = require("lucide-react");
var NAV = [
    { to: '/superadmin', icon: lucide_react_1.LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/superadmin/places', icon: lucide_react_1.MapPin, label: 'Luoghi' },
    { to: '/superadmin/venues', icon: lucide_react_1.Store, label: 'Locali & Gestori' },
    { to: '/superadmin/experiences', icon: lucide_react_1.Sparkles, label: 'Esperienze' },
    { to: '/superadmin/users', icon: lucide_react_1.Users, label: 'Utenti' },
    { to: '/superadmin/coupons', icon: lucide_react_1.Tag, label: 'Coupon' },
    { to: '/superadmin/reviews', icon: lucide_react_1.Star, label: 'Recensioni' },
];
function SuperAdminLayout() {
    var _a = (0, store_1.useAdminStore)(), logout = _a.logout, admin = _a.admin;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _b = (0, react_1.useState)(false), mobileOpen = _b[0], setMobileOpen = _b[1];
    var handleLogout = function () { logout(); navigate('/admin/login'); };
    var SidebarContent = function () { return (<>
      {/* Logo */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#e8622a,#f0884a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <lucide_react_1.Shield size={16} color="white"/>
        </div>
        <div>
          <p style={{ color: '#f0ede8', fontSize: 13, fontWeight: 700, lineHeight: 1 }}>Super Admin</p>
          <p style={{ color: 'rgba(240,237,232,0.3)', fontSize: 10, marginTop: 2 }}>{(admin === null || admin === void 0 ? void 0 : admin.email) || 'CityApp'}</p>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 8px' }}>
        {NAV.map(function (_a) {
            var to = _a.to, Icon = _a.icon, label = _a.label, end = _a.end;
            return (<react_router_dom_1.NavLink key={to} to={to} end={end} style={{ textDecoration: 'none', display: 'block', marginBottom: 2 }} onClick={function () { return setMobileOpen(false); }}>
            {function (_a) {
                    var isActive = _a.isActive;
                    return (<div style={{
                            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                            borderRadius: 10, fontSize: 13, fontWeight: 500, transition: 'all 0.15s',
                            background: isActive ? 'rgba(232,98,42,0.12)' : 'transparent',
                            color: isActive ? '#e8622a' : 'rgba(240,237,232,0.5)',
                            borderLeft: "2px solid ".concat(isActive ? '#e8622a' : 'transparent'),
                        }}>
                <Icon size={15}/>
                <span style={{ flex: 1 }}>{label}</span>
                {isActive && <lucide_react_1.ChevronRight size={12}/>}
              </div>);
                }}
          </react_router_dom_1.NavLink>);
        })}
      </nav>

      {/* User + logout */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ padding: '8px 12px', marginBottom: 4 }}>
          <p style={{ color: '#f0ede8', fontSize: 12, fontWeight: 600 }}>{(admin === null || admin === void 0 ? void 0 : admin.name) || 'Admin'}</p>
          <p style={{ color: 'rgba(240,237,232,0.3)', fontSize: 10 }}>{admin === null || admin === void 0 ? void 0 : admin.role}</p>
        </div>
        <button onClick={handleLogout} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px',
            borderRadius: 10, border: 'none', cursor: 'pointer',
            background: 'transparent', color: 'rgba(240,237,232,0.4)', fontSize: 13,
            transition: 'all 0.15s',
        }} onMouseEnter={function (e) { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; }} onMouseLeave={function (e) { e.currentTarget.style.color = 'rgba(240,237,232,0.4)'; e.currentTarget.style.background = 'transparent'; }}>
          <lucide_react_1.LogOut size={14}/> Logout
        </button>
      </div>
    </>); };
    return (<div style={{ display: 'flex', minHeight: '100dvh', background: '#0d0d1a', color: '#f0ede8', fontFamily: 'DM Sans,sans-serif' }}>
      {/* Desktop sidebar */}
      <aside style={__assign({ width: 230, background: '#090910', borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', position: 'fixed', inset: '0 auto 0 0', zIndex: 40 }, (typeof window !== 'undefined' && window.innerWidth < 768 ? { display: 'none' } : {}))} className="sa-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (<div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} onClick={function () { return setMobileOpen(false); }}/>
          <aside style={{ width: 260, background: '#090910', borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
            <SidebarContent />
          </aside>
        </div>)}

      {/* Main */}
      <div style={{ flex: 1, marginLeft: 0, display: 'flex', flexDirection: 'column' }} className="sa-main">
        {/* Top bar mobile */}
        <header style={{
            height: 52, background: '#090910', borderBottom: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12,
            position: 'sticky', top: 0, zIndex: 30,
        }}>
          <button onClick={function () { return setMobileOpen(true); }} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', color: '#f0ede8' }}>
            <lucide_react_1.Menu size={18}/>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg,#e8622a,#f0884a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <lucide_react_1.Shield size={13} color="white"/>
            </div>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#f0ede8' }}>Super Admin</span>
          </div>
        </header>

        <main style={{ flex: 1, padding: '24px 16px', maxWidth: 1200, width: '100%', margin: '0 auto' }}>
          <react_router_dom_1.Outlet />
        </main>
      </div>

      <style>{"\n        @media (min-width: 768px) {\n          .sa-sidebar { display: flex !important; }\n          .sa-main { margin-left: 230px !important; }\n          .sa-main header { display: none !important; }\n        }\n      "}</style>
    </div>);
}
