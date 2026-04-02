"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminLayout;
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var store_1 = require("@/store");
var NAV = [
    { to: '/admin', icon: lucide_react_1.LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/places', icon: lucide_react_1.MapPin, label: 'Luoghi', end: false },
];
function AdminLayout() {
    var _a = (0, store_1.useAdminStore)(), logout = _a.logout, admin = _a.admin;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var handleLogout = function () {
        logout();
        navigate('/admin/login');
    };
    return (<div className="min-h-dvh flex bg-[var(--color-bg)]">
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
          {NAV.map(function (_a) {
            var to = _a.to, Icon = _a.icon, label = _a.label, end = _a.end;
            return (<react_router_dom_1.NavLink key={to} to={to} end={end} className={function (_a) {
                    var isActive = _a.isActive;
                    return "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ".concat(isActive
                        ? 'bg-[var(--color-accent)] text-white'
                        : 'text-white/50 hover:text-white hover:bg-white/5');
                }}>
              <Icon size={16}/>
              {label}
            </react_router_dom_1.NavLink>);
        })}
        </nav>

        <div className="p-3 border-t border-white/5">
          <div className="px-3 py-2 mb-2">
            <p className="text-white/70 text-xs font-medium truncate">{(admin === null || admin === void 0 ? void 0 : admin.name) || 'Admin'}</p>
            <p className="text-white/30 text-xs truncate">{admin === null || admin === void 0 ? void 0 : admin.email}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all w-full">
            <lucide_react_1.LogOut size={16}/>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-56 p-8 min-h-dvh">
        <react_router_dom_1.Outlet />
      </main>
    </div>);
}
