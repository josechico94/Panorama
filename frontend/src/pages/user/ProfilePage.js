"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProfilePage;
var react_router_dom_1 = require("react-router-dom");
var react_query_1 = require("@tanstack/react-query");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var react_1 = require("react");
var store_1 = require("@/store");
var api_1 = require("@/lib/api");
var types_1 = require("@/types");
function Avatar(_a) {
    var name = _a.name;
    var initials = name.split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
    return (<div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, #BB00FF, #9000CC)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 800, color: '#fff',
            boxShadow: '0 4px 20px rgba(187,0,255,0.4)',
            flexShrink: 0,
        }}>
      {initials}
    </div>);
}
function ProfilePage() {
    var _a;
    var _b = (0, store_1.useUserStore)(), user = _b.user, logout = _b.logout, isLoggedIn = _b.isLoggedIn;
    var savedPlaces = (0, store_1.useAppStore)().savedPlaces;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _c = (0, react_1.useState)('coupon'), activeTab = _c[0], setActiveTab = _c[1];
    var data = (0, react_query_1.useQuery)({
        queryKey: ['my-coupons', user === null || user === void 0 ? void 0 : user.id],
        queryFn: function () { return api_1.couponsApi.myList(); },
        enabled: !!user,
    }).data;
    var allCoupons = (_a = data === null || data === void 0 ? void 0 : data.data) !== null && _a !== void 0 ? _a : [];
    var activeCoupons = allCoupons.filter(function (c) { return c.status === 'active'; });
    var usedCoupons = allCoupons.filter(function (c) { return c.status === 'used'; });
    if (!isLoggedIn()) {
        return (<div style={{
                minHeight: '80dvh', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', padding: '32px 24px',
            }}>
        <framer_motion_1.motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', maxWidth: 340 }}>
          <div style={{
                width: 72, height: 72, borderRadius: 22,
                background: 'linear-gradient(135deg, #BB00FF22, #BB00FF11)',
                border: '1px solid rgba(187,0,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px', fontSize: 32,
            }}>🗺️</div>
          <h2 style={{
                fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
                fontSize: 30, fontWeight: 700, color: 'var(--text)', marginBottom: 8,
            }}>
            Il tuo profilo faf
          </h2>
          <p style={{ color: 'var(--text-3)', fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
            Accedi per vedere i tuoi coupon, i posti salvati e gestire il tuo account.
          </p>
          <react_router_dom_1.Link to="/accedi" style={{
                display: 'block', textDecoration: 'none',
                padding: '14px 28px', borderRadius: 14,
                background: 'linear-gradient(135deg, #BB00FF, #9000CC)',
                color: '#fff', fontWeight: 700, fontSize: 15,
                boxShadow: '0 4px 20px rgba(187,0,255,0.4)',
                textAlign: 'center',
            }}>
            Accedi o Registrati
          </react_router_dom_1.Link>
        </framer_motion_1.motion.div>
      </div>);
    }
    return (<div style={{ maxWidth: 672, margin: '0 auto', paddingBottom: 24 }}>
      {/* ── Hero Profile Card ── */}
      <framer_motion_1.motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{
            margin: '24px 16px 20px',
            background: 'linear-gradient(135deg, rgba(187,0,255,0.12) 0%, rgba(144,0,204,0.06) 100%)',
            border: '1px solid rgba(187,0,255,0.2)',
            borderRadius: 22,
            padding: '20px',
            backdropFilter: 'blur(12px)',
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <Avatar name={user.name}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{
            color: 'var(--text)', fontSize: 16, fontWeight: 700,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
              {user.name}
            </h2>
            <p style={{
            color: 'var(--text-3)', fontSize: 12, marginTop: 2,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
              {user.email}
            </p>
          </div>
          <button onClick={function () { logout(); navigate('/'); }} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '7px 12px', borderRadius: 9, border: 'none',
            background: 'rgba(248,113,113,0.1)',
            color: '#f87171', cursor: 'pointer', fontSize: 12, fontWeight: 600,
            flexShrink: 0,
        }}>
            <lucide_react_1.LogOut size={13}/> Esci
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { label: 'Coupon attivi', value: activeCoupons.length, color: '#BB00FF' },
            { label: 'Utilizzati', value: usedCoupons.length, color: '#4ade80' },
            { label: 'Salvati', value: savedPlaces.length, color: '#f59e0b' },
        ].map(function (_a) {
            var label = _a.label, value = _a.value, color = _a.color;
            return (<div key={label} style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 14, padding: '10px 8px', textAlign: 'center',
                }}>
              <p style={{ fontSize: 24, fontWeight: 800, color: color, fontFamily: 'DM Mono', lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 4, fontWeight: 500 }}>{label}</p>
            </div>);
        })}
        </div>
      </framer_motion_1.motion.div>

      {/* ── Tabs ── */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{
            display: 'flex', gap: 4, padding: 4,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 14,
        }}>
          {[
            { id: 'coupon', label: 'Coupon', icon: lucide_react_1.QrCode, count: activeCoupons.length },
            { id: 'usati', label: 'Usati', icon: lucide_react_1.CheckCircle, count: usedCoupons.length },
            { id: 'salvati', label: 'Salvati', icon: lucide_react_1.Bookmark, count: savedPlaces.length },
        ].map(function (_a) {
            var id = _a.id, label = _a.label, Icon = _a.icon, count = _a.count;
            return (<button key={id} onClick={function () { return setActiveTab(id); }} style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: 5, padding: '8px 4px', borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: activeTab === id
                        ? 'linear-gradient(135deg, #BB00FF, #9000CC)'
                        : 'transparent',
                    color: activeTab === id ? '#fff' : 'var(--text-3)',
                    fontSize: 11, fontWeight: 600,
                    transition: 'all 0.2s',
                }}>
              <Icon size={12}/>
              {label}
              {count > 0 && (<span style={{
                        fontSize: 9, fontWeight: 800, minWidth: 16, height: 16,
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: activeTab === id ? 'rgba(255,255,255,0.25)' : 'rgba(187,0,255,0.15)',
                        color: activeTab === id ? '#fff' : '#BB00FF',
                        fontFamily: 'DM Mono',
                    }}>
                  {count}
                </span>)}
            </button>);
        })}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <framer_motion_1.AnimatePresence mode="wait">
        <framer_motion_1.motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} style={{ padding: '0 16px' }}>
          {activeTab === 'coupon' && (activeCoupons.length === 0 ? (<EmptyState emoji="🎫" title="Nessun coupon attivo" desc="Sfoglia le offerte e scarica il tuo primo coupon" action={{ label: 'Vedi offerte', to: '/offerte' }}/>) : (<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {activeCoupons.map(function (uc, i) { return (<CouponCard key={uc._id} userCoupon={uc} index={i}/>); })}
              </div>))}

          {activeTab === 'usati' && (usedCoupons.length === 0 ? (<EmptyState emoji="✅" title="Nessun coupon usato" desc="I coupon che usi appariranno qui"/>) : (<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {usedCoupons.map(function (uc, i) { return (<CouponCard key={uc._id} userCoupon={uc} index={i} used/>); })}
              </div>))}

          {activeTab === 'salvati' && (savedPlaces.length === 0 ? (<EmptyState emoji="🔖" title="Nessun posto salvato" desc="Tocca il segnalibro su un posto per salvarlo qui" action={{ label: 'Esplora', to: '/esplora' }}/>) : (<p style={{ color: 'var(--text-3)', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>
                {savedPlaces.length} post{savedPlaces.length === 1 ? 'o' : 'i'} salvat{savedPlaces.length === 1 ? 'o' : 'i'} — visibili in <react_router_dom_1.Link to="/salvati" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Salvati</react_router_dom_1.Link>
              </p>))}
        </framer_motion_1.motion.div>
      </framer_motion_1.AnimatePresence>
    </div>);
}
function CouponCard(_a) {
    var _b;
    var userCoupon = _a.userCoupon, index = _a.index, _c = _a.used, used = _c === void 0 ? false : _c;
    var coupon = userCoupon.couponId;
    var place = userCoupon.placeId;
    var cat = place ? (0, types_1.getCategoryConfig)(place.category) : null;
    var discount = (coupon === null || coupon === void 0 ? void 0 : coupon.discountType) === 'percentage'
        ? "-".concat(coupon.discountValue, "%")
        : (coupon === null || coupon === void 0 ? void 0 : coupon.discountType) === 'fixed'
            ? "-\u20AC".concat(coupon.discountValue)
            : 'OMAGGIO';
    return (<framer_motion_1.motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
      <react_router_dom_1.Link to={used ? '#' : "/coupon/".concat(userCoupon._id)} style={{ textDecoration: 'none', display: 'block' }} onClick={function (e) { return used && e.preventDefault(); }}>
        <div style={{
            background: used ? 'var(--surface)' : 'rgba(187,0,255,0.04)',
            border: "1px solid ".concat(used ? 'var(--border)' : 'rgba(187,0,255,0.18)'),
            borderRadius: 18, overflow: 'hidden',
            display: 'flex',
            opacity: used ? 0.65 : 1,
            transition: 'all 0.2s',
        }}>
          {/* Place image */}
          <div style={{ width: 80, height: 80, flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
            <img src={((_b = place === null || place === void 0 ? void 0 : place.media) === null || _b === void 0 ? void 0 : _b.coverImage) || 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=200&q=70'} alt={place === null || place === void 0 ? void 0 : place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            {used && (<div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <lucide_react_1.CheckCircle size={22} color="#4ade80"/>
              </div>)}
          </div>

          {/* Content */}
          <div style={{ flex: 1, padding: '10px 12px', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {cat && (<span style={{ fontSize: 9, color: cat.color, fontWeight: 700, display: 'block', marginBottom: 3 }}>
                {cat.emoji} {place === null || place === void 0 ? void 0 : place.name}
              </span>)}
            <p style={{
            color: 'var(--text)', fontSize: 13, fontWeight: 700,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
              {coupon === null || coupon === void 0 ? void 0 : coupon.title}
            </p>
            <p style={{ color: 'var(--text-3)', fontSize: 10, marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
              <lucide_react_1.Clock size={9}/>
              {used && userCoupon.usedAt
            ? 'Usato il ' + new Date(userCoupon.usedAt).toLocaleDateString('it-IT')
            : 'Scade il ' + new Date(coupon === null || coupon === void 0 ? void 0 : coupon.validUntil).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}
            </p>
          </div>

          {/* Discount badge */}
          <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <span style={{
            fontSize: 12, fontWeight: 800, fontFamily: 'DM Mono',
            color: used ? 'var(--text-3)' : '#BB00FF',
            background: used ? 'rgba(255,255,255,0.05)' : 'rgba(187,0,255,0.12)',
            border: "1px solid ".concat(used ? 'var(--border)' : 'rgba(187,0,255,0.25)'),
            borderRadius: 8, padding: '4px 8px',
        }}>
              {discount}
            </span>
          </div>
        </div>
      </react_router_dom_1.Link>
    </framer_motion_1.motion.div>);
}
function EmptyState(_a) {
    var emoji = _a.emoji, title = _a.title, desc = _a.desc, action = _a.action;
    return (<div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <span style={{ fontSize: 44, display: 'block', marginBottom: 14 }}>{emoji}</span>
      <p style={{ color: 'var(--text)', fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{title}</p>
      <p style={{ color: 'var(--text-3)', fontSize: 13, lineHeight: 1.5, marginBottom: action ? 20 : 0 }}>{desc}</p>
      {action && (<react_router_dom_1.Link to={action.to} style={{
                display: 'inline-flex', padding: '10px 22px', borderRadius: 12,
                background: 'rgba(187,0,255,0.1)', color: '#BB00FF',
                border: '1px solid rgba(187,0,255,0.22)',
                textDecoration: 'none', fontSize: 13, fontWeight: 700,
            }}>
          {action.label}
        </react_router_dom_1.Link>)}
    </div>);
}
