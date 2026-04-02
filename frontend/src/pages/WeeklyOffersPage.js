"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WeeklyOffersPage;
var react_query_1 = require("@tanstack/react-query");
var react_router_dom_1 = require("react-router-dom");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var api_1 = require("@/lib/api");
var types_1 = require("@/types");
function formatDate(d) {
    return new Date(d).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
}
function daysLeft(d) {
    return Math.ceil((new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}
function WeeklyOffersPage() {
    var _a;
    var _b = (0, react_query_1.useQuery)({
        queryKey: ['weekly-offers'],
        queryFn: function () { return api_1.couponsApi.active(); },
        refetchInterval: 5 * 60 * 1000, // refresh ogni 5 min
    }), data = _b.data, isLoading = _b.isLoading;
    var coupons = ((_a = data === null || data === void 0 ? void 0 : data.data) !== null && _a !== void 0 ? _a : []).sort(function (a, b) {
        return new Date(a.validUntil).getTime() - new Date(b.validUntil).getTime();
    });
    var expiringSoon = coupons.filter(function (c) { return daysLeft(c.validUntil) <= 3; });
    var rest = coupons.filter(function (c) { return daysLeft(c.validUntil) > 3; });
    return (<div className="max-w-2xl mx-auto">
      {/* Hero */}
      <div className="px-4 pt-6 pb-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="accent-line"/>
          <span className="font-mono-dm text-[var(--text-3)] text-[9px] tracking-[0.28em] uppercase">Questa settimana</span>
        </div>
        <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(32px,8vw,48px)', fontWeight: 700, color: 'var(--text)', lineHeight: 0.95, fontStyle: 'italic' }}>
          Offerte<br />
          <em style={{ color: 'var(--accent)', fontWeight: 300 }}>attive ora</em>
        </h1>
        <p className="text-[var(--text-3)] text-sm mt-3">
          {isLoading ? '...' : "".concat(coupons.length, " offert").concat(coupons.length === 1 ? 'a' : 'e', " disponibil").concat(coupons.length === 1 ? 'e' : 'i', " oggi")}
        </p>
      </div>

      {isLoading ? (<div className="px-4 space-y-3">
          {[1, 2, 3, 4].map(function (i) { return <div key={i} className="skeleton rounded-2xl h-28"/>; })}
        </div>) : coupons.length === 0 ? (<div className="text-center py-20 px-4">
          <p className="text-4xl mb-3">🎫</p>
          <p className="text-[var(--text-2)] font-medium">Nessuna offerta attiva oggi</p>
          <p className="text-[var(--text-3)] text-sm mt-1">Torna presto — i locali aggiornano le offerte ogni settimana</p>
        </div>) : (<div className="px-4 pb-8 space-y-6">
          {/* In scadenza */}
          {expiringSoon.length > 0 && (<div>
              <div className="flex items-center gap-2 mb-3">
                <lucide_react_1.Flame size={14} color="#f87171"/>
                <span style={{ fontSize: 10, color: '#f87171', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  In scadenza
                </span>
              </div>
              <div className="space-y-3">
                {expiringSoon.map(function (c, i) { return <CouponCard key={c._id} coupon={c} index={i} urgent/>; })}
              </div>
            </div>)}

          {/* Tutte le offerte */}
          {rest.length > 0 && (<div>
              {expiringSoon.length > 0 && (<div className="flex items-center gap-2 mb-3">
                  <lucide_react_1.Tag size={13} color="var(--accent)"/>
                  <span style={{ fontSize: 10, color: 'rgba(240,237,232,0.4)', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    Tutte le offerte
                  </span>
                </div>)}
              <div className="space-y-3">
                {rest.map(function (c, i) { return <CouponCard key={c._id} coupon={c} index={i}/>; })}
              </div>
            </div>)}
        </div>)}
    </div>);
}
function CouponCard(_a) {
    var _b;
    var coupon = _a.coupon, index = _a.index, _c = _a.urgent, urgent = _c === void 0 ? false : _c;
    var place = coupon.placeId;
    var cat = place ? (0, types_1.getCategoryConfig)(place.category) : null;
    var days = daysLeft(coupon.validUntil);
    var usagePercent = coupon.maxUses > 0 ? Math.min(100, (coupon.usesCount / coupon.maxUses) * 100) : 0;
    var almostGone = coupon.maxUses > 0 && usagePercent > 70;
    return (<framer_motion_1.motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <react_router_dom_1.Link to={"/coupon/".concat(coupon._id)} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: "1px solid ".concat(urgent ? 'rgba(248,113,113,0.25)' : 'rgba(255,255,255,0.08)'),
            borderRadius: 18, overflow: 'hidden', display: 'flex',
            transition: 'border-color 0.2s',
        }} onMouseEnter={function (e) { return (e.currentTarget.style.borderColor = urgent ? 'rgba(248,113,113,0.5)' : 'rgba(232,98,42,0.35)'); }} onMouseLeave={function (e) { return (e.currentTarget.style.borderColor = urgent ? 'rgba(248,113,113,0.25)' : 'rgba(255,255,255,0.08)'); }}>
          {/* Place image */}
          <div style={{ width: 90, height: 90, flexShrink: 0, overflow: 'hidden' }}>
            <img src={((_b = place === null || place === void 0 ? void 0 : place.media) === null || _b === void 0 ? void 0 : _b.coverImage) || 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=200&q=70'} alt={place === null || place === void 0 ? void 0 : place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
          </div>

          {/* Content */}
          <div style={{ flex: 1, padding: '12px 14px 10px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: 'rgba(240,237,232,0.5)', fontSize: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>
                  {cat === null || cat === void 0 ? void 0 : cat.emoji} {place === null || place === void 0 ? void 0 : place.name}
                </p>
                <p style={{ color: '#f0ede8', fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {coupon.title}
                </p>
              </div>
              <span style={{
            fontSize: 13, fontWeight: 800, color: '#e8622a', fontFamily: 'DM Mono,monospace',
            background: 'rgba(232,98,42,0.12)', border: '1px solid rgba(232,98,42,0.25)',
            borderRadius: 8, padding: '2px 8px', flexShrink: 0,
        }}>
                {coupon.discountType === 'percentage' ? "-".concat(coupon.discountValue, "%")
            : coupon.discountType === 'fixed' ? "-\u20AC".concat(coupon.discountValue) : 'OMAGGIO'}
              </span>
            </div>

            {/* Footer row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
              <span style={{ fontSize: 9, color: urgent ? '#f87171' : 'rgba(240,237,232,0.35)', display: 'flex', alignItems: 'center', gap: 3, fontWeight: urgent ? 700 : 400 }}>
                <lucide_react_1.Clock size={9}/>
                {days === 0 ? 'Scade oggi!' : days === 1 ? 'Scade domani' : "Fino al ".concat(formatDate(coupon.validUntil))}
              </span>

              {coupon.maxUses > 0 && (<span style={{ fontSize: 9, color: almostGone ? '#fbbf24' : 'rgba(240,237,232,0.3)', display: 'flex', alignItems: 'center', gap: 3, fontWeight: almostGone ? 700 : 400 }}>
                  {almostGone ? '⚡' : ''} {coupon.maxUses - coupon.usesCount} rimasti
                </span>)}

              <lucide_react_1.ChevronRight size={12} style={{ marginLeft: 'auto', color: 'var(--accent)', flexShrink: 0 }}/>
            </div>

            {/* Usage bar */}
            {coupon.maxUses > 0 && (<div style={{ height: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 1, marginTop: 6, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: almostGone ? '#fbbf24' : 'var(--accent)', borderRadius: 1, width: "".concat(usagePercent, "%"), transition: 'width 0.5s' }}/>
              </div>)}
          </div>
        </div>
      </react_router_dom_1.Link>
    </framer_motion_1.motion.div>);
}
