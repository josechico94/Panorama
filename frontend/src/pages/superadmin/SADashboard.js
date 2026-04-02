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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SADashboard;
var react_query_1 = require("@tanstack/react-query");
var api_1 = require("@/lib/api");
var lucide_react_1 = require("lucide-react");
// ── Mini bar chart (pure CSS/SVG, no deps) ──
function BarChart(_a) {
    var data = _a.data, _b = _a.color, color = _b === void 0 ? '#e8622a' : _b;
    var max = Math.max.apply(Math, __spreadArray(__spreadArray([], data, false), [1], false));
    var labels = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];
    return (<div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 48 }}>
      {data.map(function (v, i) { return (<div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <div style={{
                width: '100%', borderRadius: '3px 3px 0 0',
                height: "".concat((v / max) * 40, "px"), minHeight: 3,
                background: i === data.length - 1 ? color : "".concat(color, "55"),
                transition: 'height 0.5s ease',
            }}/>
          <span style={{ fontSize: 8, color: 'rgba(240,237,232,0.3)' }}>{labels[i]}</span>
        </div>); })}
    </div>);
}
// ── Donut chart SVG ──
function DonutChart(_a) {
    var segments = _a.segments;
    var total = segments.reduce(function (s, seg) { return s + seg.value; }, 0);
    if (total === 0)
        return <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 10, color: 'rgba(240,237,232,0.3)' }}>—</span></div>;
    var cumulative = 0;
    var r = 28, cx = 40, cy = 40, stroke = 10;
    var circumference = 2 * Math.PI * r;
    return (<svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke}/>
      {segments.map(function (seg, i) {
            var pct = seg.value / total;
            var offset = circumference - pct * circumference;
            var rotation = (cumulative / total) * 360 - 90;
            cumulative += seg.value;
            return (<circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth={stroke} strokeDasharray={"".concat(pct * circumference, " ").concat(circumference)} strokeDashoffset={offset} transform={"rotate(".concat(rotation, " ").concat(cx, " ").concat(cy, ")")} strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.5s ease' }}/>);
        })}
      <text x={cx} y={cy + 4} textAnchor="middle" fill="#f0ede8" fontSize="12" fontWeight="700">{total}</text>
    </svg>);
}
var C = {
    card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 },
    label: { fontSize: 10, fontWeight: 700, color: 'rgba(240,237,232,0.35)', textTransform: 'uppercase', letterSpacing: '0.12em' },
};
function SADashboard() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
    var _z = (0, react_query_1.useQuery)({ queryKey: ['sa-stats'], queryFn: api_1.superAdminApi.stats, refetchInterval: 30000 }), data = _z.data, isLoading = _z.isLoading, refetch = _z.refetch;
    var s = data === null || data === void 0 ? void 0 : data.data;
    var handlePrint = function () { return window.print(); };
    if (isLoading)
        return (<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12 }}>
      {__spreadArray([], Array(6), true).map(function (_, i) { return <div key={i} style={__assign(__assign({}, C.card), { height: 96, animation: 'pulse 1.5s infinite' })}/>; })}
    </div>);
    var statCards = [
        { label: 'Luoghi totali', value: (_a = s === null || s === void 0 ? void 0 : s.places) !== null && _a !== void 0 ? _a : 0, icon: lucide_react_1.MapPin, color: '#e8622a', sub: 'in piattaforma' },
        { label: 'Utenti registrati', value: (_b = s === null || s === void 0 ? void 0 : s.users) !== null && _b !== void 0 ? _b : 0, icon: lucide_react_1.Users, color: '#a855f7', sub: 'account attivi' },
        { label: 'Coupon attivi', value: (_c = s === null || s === void 0 ? void 0 : s.activeCoupons) !== null && _c !== void 0 ? _c : 0, icon: lucide_react_1.Tag, color: '#22c55e', sub: "di ".concat((_d = s === null || s === void 0 ? void 0 : s.coupons) !== null && _d !== void 0 ? _d : 0, " totali") },
        { label: 'Scaricati', value: (_e = s === null || s === void 0 ? void 0 : s.userCoupons) !== null && _e !== void 0 ? _e : 0, icon: lucide_react_1.TrendingUp, color: '#f59e0b', sub: 'claim totali' },
        { label: 'Recensioni', value: (_f = s === null || s === void 0 ? void 0 : s.reviews) !== null && _f !== void 0 ? _f : 0, icon: lucide_react_1.Star, color: '#3b82f6', sub: 'pubblicate' },
        { label: 'Gestori locali', value: (_g = s === null || s === void 0 ? void 0 : s.venueOwners) !== null && _g !== void 0 ? _g : 0, icon: lucide_react_1.Store, color: '#ec4899', sub: 'account attivi' },
    ];
    // Mock weekly data (replace with real data from backend when available)
    var weeklyUsers = [2, 5, 3, 8, 4, 6, ((_h = s === null || s === void 0 ? void 0 : s.users) !== null && _h !== void 0 ? _h : 0) % 10];
    var weeklyDownloads = [1, 3, 2, 5, 4, 7, ((_j = s === null || s === void 0 ? void 0 : s.userCoupons) !== null && _j !== void 0 ? _j : 0) % 10];
    var categoryColors = {
        eat: '#f97316', drink: '#a855f7', shop: '#ec4899',
        walk: '#22c55e', culture: '#3b82f6', sport: '#84cc16', night: '#6366f1',
    };
    return (<div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 30, fontWeight: 700, color: '#f0ede8', lineHeight: 1 }}>Dashboard</h1>
          <p style={{ color: 'rgba(240,237,232,0.35)', fontSize: 12, marginTop: 4 }}>
            Aggiornato: {new Date().toLocaleString('it-IT')}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={function () { return refetch(); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(240,237,232,0.6)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
            <lucide_react_1.RefreshCw size={13}/> Aggiorna
          </button>
          <button onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#e8622a,#f0884a)', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
            <lucide_react_1.Download size={13}/> Stampa
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 24 }}>
        {statCards.map(function (_a) {
            var label = _a.label, value = _a.value, Icon = _a.icon, color = _a.color, sub = _a.sub;
            return (<div key={label} style={C.card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={C.label}>{label}</span>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: "".concat(color, "18"), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={13} color={color}/>
              </div>
            </div>
            <p style={{ fontSize: 34, fontWeight: 800, color: '#f0ede8', lineHeight: 1, marginBottom: 4 }}>{value}</p>
            <p style={{ fontSize: 10, color: 'rgba(240,237,232,0.3)' }}>{sub}</p>
          </div>);
        })}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16, marginBottom: 20 }}>

        {/* Weekly users */}
        <div style={C.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <p style={C.label}>Nuovi utenti</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: '#f0ede8', marginTop: 2 }}>{(_k = s === null || s === void 0 ? void 0 : s.users) !== null && _k !== void 0 ? _k : 0}</p>
            </div>
            <lucide_react_1.Activity size={16} color="#a855f7"/>
          </div>
          <BarChart data={weeklyUsers} color="#a855f7"/>
        </div>

        {/* Weekly downloads */}
        <div style={C.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <p style={C.label}>Download coupon</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: '#f0ede8', marginTop: 2 }}>{(_l = s === null || s === void 0 ? void 0 : s.userCoupons) !== null && _l !== void 0 ? _l : 0}</p>
            </div>
            <lucide_react_1.Tag size={16} color="#22c55e"/>
          </div>
          <BarChart data={weeklyDownloads} color="#22c55e"/>
        </div>

        {/* Categories donut */}
        <div style={C.card}>
          <p style={__assign(__assign({}, C.label), { marginBottom: 14 })}>Distribuzione categorie</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <DonutChart segments={((_m = s === null || s === void 0 ? void 0 : s.byCategory) !== null && _m !== void 0 ? _m : []).map(function (c) { return ({
            value: c.count,
            color: categoryColors[c._id] || '#666',
            label: c._id,
        }); })}/>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {((_o = s === null || s === void 0 ? void 0 : s.byCategory) !== null && _o !== void 0 ? _o : []).slice(0, 5).map(function (c) { return (<div key={c._id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: categoryColors[c._id] || '#666', flexShrink: 0 }}/>
                  <span style={{ fontSize: 10, color: 'rgba(240,237,232,0.55)', flex: 1 }}>{c._id}</span>
                  <span style={{ fontSize: 10, color: 'rgba(240,237,232,0.35)', fontFamily: 'DM Mono,monospace' }}>{c.count}</span>
                </div>); })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom tables */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>

        {/* Recent users */}
        <div style={C.card}>
          <p style={__assign(__assign({}, C.label), { marginBottom: 14 })}>Ultimi utenti registrati</p>
          {((_p = s === null || s === void 0 ? void 0 : s.recentUsers) !== null && _p !== void 0 ? _p : []).length === 0 ? (<p style={{ color: 'rgba(240,237,232,0.3)', fontSize: 12, textAlign: 'center', padding: '16px 0' }}>Nessun utente</p>) : (<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {((_q = s === null || s === void 0 ? void 0 : s.recentUsers) !== null && _q !== void 0 ? _q : []).map(function (u) {
                var _a;
                return (<div key={u._id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(168,85,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: '#a855f7', fontSize: 11, fontWeight: 700 }}>{(_a = u.name) === null || _a === void 0 ? void 0 : _a.charAt(0).toUpperCase()}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: '#f0ede8', fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</p>
                    <p style={{ color: 'rgba(240,237,232,0.35)', fontSize: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</p>
                  </div>
                  <span style={{ fontSize: 9, color: 'rgba(240,237,232,0.25)', fontFamily: 'DM Mono,monospace', flexShrink: 0 }}>
                    {new Date(u.createdAt).toLocaleDateString('it-IT')}
                  </span>
                </div>);
            })}
            </div>)}
        </div>

        {/* Top places */}
        <div style={C.card}>
          <p style={__assign(__assign({}, C.label), { marginBottom: 14 })}>Luoghi più visti</p>
          {((_r = s === null || s === void 0 ? void 0 : s.topPlaces) !== null && _r !== void 0 ? _r : []).length === 0 ? (<p style={{ color: 'rgba(240,237,232,0.3)', fontSize: 12, textAlign: 'center', padding: '16px 0' }}>Nessun dato</p>) : (<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {((_s = s === null || s === void 0 ? void 0 : s.topPlaces) !== null && _s !== void 0 ? _s : []).map(function (p, i) {
                var _a, _b, _c, _d, _e;
                return (<div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: i === 0 ? '#f59e0b' : 'rgba(240,237,232,0.2)', width: 18, textAlign: 'center', flexShrink: 0 }}>{i + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: '#f0ede8', fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                    <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2, marginTop: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: '#e8622a', borderRadius: 2, width: "".concat(Math.min(100, (((_b = (_a = p.meta) === null || _a === void 0 ? void 0 : _a.views) !== null && _b !== void 0 ? _b : 0) / Math.max.apply(Math, __spreadArray(__spreadArray([], ((_c = s === null || s === void 0 ? void 0 : s.topPlaces) !== null && _c !== void 0 ? _c : []).map(function (x) { var _a, _b; return (_b = (_a = x.meta) === null || _a === void 0 ? void 0 : _a.views) !== null && _b !== void 0 ? _b : 1; }), false), [1], false))) * 100), "%"), transition: 'width 0.5s' }}/>
                    </div>
                  </div>
                  <span style={{ fontSize: 10, color: 'rgba(240,237,232,0.35)', display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                    <lucide_react_1.Eye size={10}/> {(_e = (_d = p.meta) === null || _d === void 0 ? void 0 : _d.views) !== null && _e !== void 0 ? _e : 0}
                  </span>
                </div>);
            })}
            </div>)}
        </div>

        {/* Coupon conversion */}
        <div style={C.card}>
          <p style={__assign(__assign({}, C.label), { marginBottom: 14 })}>Performance coupon</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
            { label: 'Coupon creati', value: (_t = s === null || s === void 0 ? void 0 : s.coupons) !== null && _t !== void 0 ? _t : 0, color: '#e8622a', max: Math.max((_u = s === null || s === void 0 ? void 0 : s.coupons) !== null && _u !== void 0 ? _u : 1, 1) },
            { label: 'Scaricati', value: (_v = s === null || s === void 0 ? void 0 : s.userCoupons) !== null && _v !== void 0 ? _v : 0, color: '#22c55e', max: Math.max((_w = s === null || s === void 0 ? void 0 : s.coupons) !== null && _w !== void 0 ? _w : 1, 1) },
            { label: 'Attivi ora', value: (_x = s === null || s === void 0 ? void 0 : s.activeCoupons) !== null && _x !== void 0 ? _x : 0, color: '#3b82f6', max: Math.max((_y = s === null || s === void 0 ? void 0 : s.coupons) !== null && _y !== void 0 ? _y : 1, 1) },
        ].map(function (_a) {
            var label = _a.label, value = _a.value, color = _a.color, max = _a.max;
            return (<div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: 'rgba(240,237,232,0.5)' }}>{label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: color, fontFamily: 'DM Mono,monospace' }}>{value}</span>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: color, borderRadius: 3, width: "".concat(Math.min(100, (value / max) * 100), "%"), transition: 'width 0.6s ease' }}/>
                </div>
              </div>);
        })}
            {(s === null || s === void 0 ? void 0 : s.coupons) > 0 && (<div style={{ marginTop: 8, padding: '10px 12px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, textAlign: 'center' }}>
                <p style={{ color: '#4ade80', fontSize: 18, fontWeight: 800 }}>
                  {(s === null || s === void 0 ? void 0 : s.userCoupons) > 0 ? Math.round((s.userCoupons / (s.coupons * 10)) * 100) : 0}%
                </p>
                <p style={{ color: 'rgba(240,237,232,0.4)', fontSize: 10, marginTop: 2 }}>conversion rate</p>
              </div>)}
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{"\n        @media print {\n          body { background: white !important; color: black !important; }\n          .sa-sidebar { display: none !important; }\n          .sa-main header { display: none !important; }\n          button { display: none !important; }\n        }\n      "}</style>
    </div>);
}
