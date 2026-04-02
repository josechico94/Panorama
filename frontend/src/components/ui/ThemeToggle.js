"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useThemeStore = void 0;
exports.ThemeProvider = ThemeProvider;
var react_1 = require("react");
var zustand_1 = require("zustand");
var middleware_1 = require("zustand/middleware");
exports.useThemeStore = (0, zustand_1.create)()((0, middleware_1.persist)(function (set, get) { return ({
    theme: 'dark',
    toggle: function () {
        var next = get().theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        set({ theme: next });
    },
    setTheme: function (t) {
        document.documentElement.setAttribute('data-theme', t);
        set({ theme: t });
    },
}); }, { name: 'faf-theme' }));
// ── Apply theme on mount ──
function ThemeProvider(_a) {
    var children = _a.children;
    var theme = (0, exports.useThemeStore)().theme;
    (0, react_1.useEffect)(function () {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);
    return <>{children}</>;
}
