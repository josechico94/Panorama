"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VenueLayout;
var react_router_dom_1 = require("react-router-dom");
var store_1 = require("@/store");
var lucide_react_1 = require("lucide-react");
var NAV = [
    { to: '/locale', icon: lucide_react_1.LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/locale/scanner', icon: lucide_react_1.QrCode, label: 'Scanner', end: false },
    { to: '/locale/info', icon: lucide_react_1.Info, label: 'Info', end: false },
];
function VenueLayout() {
    var _a = (0, store_1.useVenueStore)(), logout = _a.logout, owner = _a.owner;
    var navigate = (0, react_router_dom_1.useNavigate)();
    return (<div style={{ minHeight: '100dvh', background: '#0f1117', color: '#f0ede8' }}>
      {/* Top bar */}
      <header style={{
            background: 'rgba(15,17,23,0.95)',
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
            background: 'linear-gradient(135deg, #e8622a, #f0884a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            <lucide_react_1.Store size={15} color="white"/>
          </div>
          <div>
            <p style={{ color: '#f0ede8', fontSize: 13, fontWeight: 600, lineHeight: 1 }}>
              {(owner === null || owner === void 0 ? void 0 : owner.name) || 'Il mio locale'}
            </p>
            <p style={{ color: 'rgba(240,237,232,0.35)', fontSize: 10, marginTop: 2 }}>
              Pannello locale
            </p>
          </div>
        </div>
        <button onClick={function () { logout(); navigate('/locale/login'); }} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            color: 'rgba(240,237,232,0.4)', fontSize: 12, fontWeight: 500,
            background: 'none', border: 'none', cursor: 'pointer', padding: '6px 10px',
            borderRadius: 8, transition: 'color 0.2s',
        }} onMouseEnter={function (e) { return (e.currentTarget.style.color = '#f87171'); }} onMouseLeave={function (e) { return (e.currentTarget.style.color = 'rgba(240,237,232,0.4)'); }}>
          <lucide_react_1.LogOut size={13}/> Esci
        </button>
      </header>

      {/* Bottom tab nav */}
      <nav style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
            background: 'rgba(15,17,23,0.97)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', height: 60,
        }}>
        {NAV.map(function (_a) {
            var to = _a.to, Icon = _a.icon, label = _a.label, end = _a.end;
            return (<react_router_dom_1.NavLink key={to} to={to} end={end} style={{ flex: 1, textDecoration: 'none' }}>
            {function (_a) {
                    var isActive = _a.isActive;
                    return (<div style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            justifyContent: 'center', gap: 3, height: '100%',
                            color: isActive ? '#e8622a' : 'rgba(240,237,232,0.35)',
                            transition: 'color 0.2s',
                        }}>
                <Icon size={19} strokeWidth={isActive ? 2.2 : 1.6}/>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {label}
                </span>
              </div>);
                }}
          </react_router_dom_1.NavLink>);
        })}
      </nav>

      {/* Main */}
      <main style={{ padding: '16px 16px 80px', maxWidth: 640, margin: '0 auto' }}>
        <react_router_dom_1.Outlet />
      </main>
    </div>);
}
