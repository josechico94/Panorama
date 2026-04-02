"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BottomNav;
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var NAV = [
    { to: '/', icon: lucide_react_1.Home, label: 'Home' },
    { to: '/esplora', icon: lucide_react_1.Compass, label: 'Esplora' },
    { to: '/esperienze', icon: lucide_react_1.Sparkles, label: 'Esperienze' },
    { to: '/salvati', icon: lucide_react_1.Bookmark, label: 'Salvati' },
    { to: '/profilo', icon: lucide_react_1.User, label: 'Profilo' },
];
function BottomNav() {
    return (<nav className="fixed-bottom">
      <div style={{
            maxWidth: 560,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            height: 60,
            padding: '0 4px',
        }}>
        {NAV.map(function (_a) {
            var to = _a.to, Icon = _a.icon, label = _a.label;
            return (<react_router_dom_1.NavLink key={to} to={to} end={to === '/'} style={function (_a) {
                    var isActive = _a.isActive;
                    return ({
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 3,
                        textDecoration: 'none',
                        flex: 1,
                        padding: '6px 0',
                        color: isActive ? '#BB00FF' : 'var(--text-3)',
                        transition: 'color 0.2s',
                    });
                }}>
            {function (_a) {
                    var isActive = _a.isActive;
                    return (<>
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
                  <Icon size={isActive ? 21 : 20} strokeWidth={isActive ? 2.5 : 1.8} style={{ transition: 'all 0.2s' }}/>
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
              </>);
                }}
          </react_router_dom_1.NavLink>);
        })}
      </div>
    </nav>);
}
