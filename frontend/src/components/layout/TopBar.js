"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TopBar;
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var store_1 = require("@/store");
var ThemeToggle_1 = require("@/components/ui/ThemeToggle");
function FafIcon(_a) {
    var _b = _a.size, size = _b === void 0 ? 18 : _b;
    return (<svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path d="M18 10 L82 10 C82 10 82 27 65 32 L36 37 L36 47 L69 45 C69 45 69 59 57 64 L36 67 L36 90 L18 90 Z" fill="white"/>
    </svg>);
}
function TopBar() {
    var navigate = (0, react_router_dom_1.useNavigate)();
    var city = (0, store_1.useAppStore)().city;
    var _a = (0, ThemeToggle_1.useThemeStore)(), theme = _a.theme, toggle = _a.toggle;
    return (<header className="topbar" style={{ height: 56 }}>
      {/* Purple accent line */}
      <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, #BB00FF, #9000CC, #BB00FF00)',
        }}/>

      <div style={{
            maxWidth: 672, margin: '0 auto', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 16px',
        }}>
        {/* Brand */}
        <react_router_dom_1.Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #BB00FF 0%, #9000CC 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(187,0,255,0.45)',
            flexShrink: 0,
        }}>
            <FafIcon size={20}/>
          </div>
          <div>
            <span style={{
            fontFamily: 'DM Sans', fontWeight: 800, fontSize: 18,
            color: '#BB00FF', letterSpacing: '-0.03em',
            display: 'block', lineHeight: 1.1,
        }}>
              faf
            </span>
            <span style={{
            fontSize: 8, color: 'var(--text-3)',
            display: 'block', lineHeight: 1,
            fontFamily: 'DM Mono', letterSpacing: '0.2em',
            textTransform: 'uppercase', marginTop: 1,
        }}>
              {city}
            </span>
          </div>
        </react_router_dom_1.Link>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Theme toggle */}
          <button onClick={toggle} title={theme === 'dark' ? 'Passa al tema chiaro' : 'Passa al tema scuro'} style={{
            width: 34, height: 34, borderRadius: 9,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s', color: 'var(--text-3)',
        }} onMouseEnter={function (e) { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }} onMouseLeave={function (e) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-3)'; }}>
            {theme === 'dark' ? <lucide_react_1.Sun size={14}/> : <lucide_react_1.Moon size={14}/>}
          </button>

          {/* Search */}
          <button onClick={function () { return navigate('/esplora'); }} title="Cerca" style={{
            width: 34, height: 34, borderRadius: 9,
            background: 'rgba(187,0,255,0.1)',
            border: '1px solid rgba(187,0,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s',
        }} onMouseEnter={function (e) { return e.currentTarget.style.background = 'rgba(187,0,255,0.18)'; }} onMouseLeave={function (e) { return e.currentTarget.style.background = 'rgba(187,0,255,0.1)'; }}>
            <lucide_react_1.Search size={15} color="#BB00FF"/>
          </button>
        </div>
      </div>
    </header>);
}
