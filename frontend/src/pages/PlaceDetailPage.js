"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PlaceDetailPage;
var react_router_dom_1 = require("react-router-dom");
var react_query_1 = require("@tanstack/react-query");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var api_1 = require("@/lib/api");
var store_1 = require("@/store");
var types_1 = require("@/types");
var PlaceReviews_1 = require("@/components/places/PlaceReviews");
var DAYS_IT = {
    monday: 'Lun', tuesday: 'Mar', wednesday: 'Mer',
    thursday: 'Gio', friday: 'Ven', saturday: 'Sab', sunday: 'Dom',
};
var DAYS_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
var TODAY = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
var PLACEHOLDER = 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1200&q=80';
function fmtDate(d) {
    return new Date(d).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
}
function discountLabel(c) {
    if (c.discountType === 'percentage')
        return "-".concat(c.discountValue, "%");
    if (c.discountType === 'fixed')
        return "-\u20AC".concat(c.discountValue);
    return 'OMAGGIO';
}
function PlaceDetailPage() {
    var _this = this;
    var _a, _b, _c, _d;
    var slug = (0, react_router_dom_1.useParams)().slug;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _e = (0, store_1.useAppStore)(), toggleSaved = _e.toggleSaved, isSaved = _e.isSaved;
    var _f = (0, react_query_1.useQuery)({
        queryKey: ['place', slug],
        queryFn: function () { return api_1.placesApi.get(slug); },
        enabled: !!slug,
    }), data = _f.data, isLoading = _f.isLoading;
    var place = data === null || data === void 0 ? void 0 : data.data;
    var saved = place ? isSaved(place._id) : false;
    var cat = place ? (0, types_1.getCategoryConfig)(place.category) : null;
    var couponsData = (0, react_query_1.useQuery)({
        queryKey: ['place-coupons', place === null || place === void 0 ? void 0 : place._id],
        queryFn: function () { return api_1.couponsApi.forPlace(place._id); },
        enabled: !!(place === null || place === void 0 ? void 0 : place._id),
    }).data;
    var activeCoupons = (_a = couponsData === null || couponsData === void 0 ? void 0 : couponsData.data) !== null && _a !== void 0 ? _a : [];
    var handleShare = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(navigator.share && place)) return [3 /*break*/, 2];
                    return [4 /*yield*/, navigator.share({ title: place.name, url: window.location.href })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, navigator.clipboard.writeText(window.location.href)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    if (isLoading)
        return (<div style={{ maxWidth: 672, margin: '0 auto' }}>
      <div className="skeleton" style={{ height: '56vw', maxHeight: 360, borderRadius: 0 }}/>
      <div style={{ padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="skeleton" style={{ height: 36, width: '60%' }}/>
        <div className="skeleton" style={{ height: 14, width: '40%' }}/>
        <div className="skeleton" style={{ height: 80, borderRadius: 16 }}/>
        <div className="skeleton" style={{ height: 120, borderRadius: 16 }}/>
      </div>
    </div>);
    if (!place || !cat)
        return (<div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <p style={{ fontSize: 40, marginBottom: 12 }}>😕</p>
      <p style={{ color: 'var(--text-2)', fontSize: 14, marginBottom: 20 }}>Posto non trovato</p>
      <react_router_dom_1.Link to="/" className="btn btn-accent">Torna alla home</react_router_dom_1.Link>
    </div>);
    return (<div style={{ maxWidth: 672, margin: '0 auto' }}>

      {/* ── Hero Photo ── */}
      <div style={{ position: 'relative', aspectRatio: '16/9', maxHeight: 380, overflow: 'hidden' }}>
        <img src={place.media.coverImage || PLACEHOLDER} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
        <div className="absolute inset-0 hero-overlay"/>

        {/* Top actions */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <framer_motion_1.motion.button whileTap={{ scale: 0.9 }} onClick={function () { return navigate(-1); }} style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(7,7,15,0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <lucide_react_1.ArrowLeft size={17}/>
          </framer_motion_1.motion.button>
          <div style={{ display: 'flex', gap: 8 }}>
            <framer_motion_1.motion.button whileTap={{ scale: 0.9 }} onClick={handleShare} style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(7,7,15,0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <lucide_react_1.Share2 size={16}/>
            </framer_motion_1.motion.button>
            <framer_motion_1.motion.button whileTap={{ scale: 0.9 }} onClick={function () { return toggleSaved(place._id); }} style={{ width: 38, height: 38, borderRadius: 12, background: saved ? 'rgba(187,0,255,0.5)' : 'rgba(7,7,15,0.55)', backdropFilter: 'blur(12px)', border: "1px solid ".concat(saved ? 'rgba(187,0,255,0.6)' : 'rgba(255,255,255,0.15)'), cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
              {saved ? <lucide_react_1.BookmarkCheck size={16} color="#fff"/> : <lucide_react_1.Bookmark size={16} color="#fff"/>}
            </framer_motion_1.motion.button>
          </div>
        </div>

        {/* Bottom pills on image */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span className="cat-pill" style={{ backgroundColor: "".concat(cat.color, "22"), color: cat.color, borderColor: "".concat(cat.color, "45") }}>
            {cat.emoji} {cat.label}
          </span>
          {place.isOpenNow && (<span className="cat-pill" style={{ backgroundColor: 'rgba(34,197,94,0.15)', color: '#4ade80', borderColor: 'rgba(34,197,94,0.3)' }}>
              <span className="open-dot"/> Aperto ora
            </span>)}
          {activeCoupons.length > 0 && (<span className="cat-pill" style={{ backgroundColor: 'rgba(187,0,255,0.2)', color: '#D966FF', borderColor: 'rgba(187,0,255,0.35)' }}>
              <lucide_react_1.Tag size={9}/> {activeCoupons.length} {activeCoupons.length === 1 ? 'offerta' : 'offerte'}
            </span>)}
        </div>
      </div>

      {/* ── Main Content ── */}
      <framer_motion_1.motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ padding: '20px 20px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── Name & Address ── */}
        <div>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
            fontSize: 'clamp(28px, 7vw, 38px)', fontWeight: 700,
            color: 'var(--text)', lineHeight: 1.05, marginBottom: 8,
        }}>
            {place.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--meta-color)' }}>
              <lucide_react_1.MapPin size={12} color="var(--accent)"/> {place.location.address}
            </span>
            {place.location.neighborhood && (<span style={{ fontSize: 11, color: 'var(--meta-color)', fontFamily: 'DM Mono', letterSpacing: '0.08em' }}>
                · {place.location.neighborhood}
              </span>)}
            <span style={{ fontSize: 12, color: 'var(--meta-color)', fontFamily: 'DM Mono' }}>
              {types_1.PRICE_LABELS[place.priceRange]}
            </span>
          </div>
        </div>

        {/* ── Description ── */}
        {place.description && (<p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--desc-color)' }}>
            {place.description}
          </p>)}

        {/* ── Tags ── */}
        {((_b = place.tags) === null || _b === void 0 ? void 0 : _b.length) > 0 && (<div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {place.tags.map(function (tag) { return (<span key={tag} className="tag-chip">#{tag}</span>); })}
          </div>)}

        {/* ── Active Coupons ── */}
        {activeCoupons.length > 0 && (<div>
            <div className="divider-label" style={{ marginBottom: 12 }}>
              <lucide_react_1.Tag size={9}/> Offerte attive
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {activeCoupons.map(function (coupon) { return (<react_router_dom_1.Link key={coupon._id} to={"/coupon/".concat(coupon._id)} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                    background: 'rgba(187,0,255,0.06)',
                    border: '1px solid rgba(187,0,255,0.18)',
                    borderRadius: 14, padding: '12px 14px',
                    transition: 'border-color 0.2s, background 0.2s',
                }} onMouseEnter={function (e) { e.currentTarget.style.borderColor = 'rgba(187,0,255,0.35)'; e.currentTarget.style.background = 'rgba(187,0,255,0.1)'; }} onMouseLeave={function (e) { e.currentTarget.style.borderColor = 'rgba(187,0,255,0.18)'; e.currentTarget.style.background = 'rgba(187,0,255,0.06)'; }}>
                    <div>
                      <p style={{ color: 'var(--text)', fontSize: 13, fontWeight: 700 }}>{coupon.title}</p>
                      <p style={{ color: 'var(--meta-color)', fontSize: 10, marginTop: 3 }}>
                        Valido fino al {fmtDate(coupon.validUntil)}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <span style={{
                    fontSize: 13, fontWeight: 800, color: '#BB00FF',
                    background: 'rgba(187,0,255,0.12)',
                    border: '1px solid rgba(187,0,255,0.25)',
                    borderRadius: 8, padding: '3px 10px',
                    fontFamily: 'DM Mono',
                }}>
                        {discountLabel(coupon)}
                      </span>
                      <lucide_react_1.ChevronRight size={14} color="var(--accent)"/>
                    </div>
                  </div>
                </react_router_dom_1.Link>); })}
            </div>
          </div>)}

        {/* ── Hours ── */}
        {place.hours && (<div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(187,0,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <lucide_react_1.Clock size={13} color="var(--accent)"/>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Orari</span>
              {place.isOpenNow && (<span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#4ade80', fontWeight: 700 }}>
                  <span className="open-dot" style={{ width: 5, height: 5 }}/> Aperto ora
                </span>)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
              {DAYS_ORDER.map(function (day) {
                var s = place.hours[day];
                var isToday = day === TODAY;
                var closed = !s || s.closed;
                return (<div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: isToday ? 'var(--accent)' : 'var(--meta-color)' }}>
                      {DAYS_IT[day]}
                    </span>
                    <div style={{
                        width: '100%', borderRadius: 8, padding: '5px 0',
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        background: isToday ? 'rgba(187,0,255,0.12)' : 'rgba(255,255,255,0.03)',
                        border: isToday ? '1px solid rgba(187,0,255,0.3)' : '1px solid transparent',
                    }}>
                      {closed ? (<span style={{ fontSize: 9, color: 'var(--meta-color)', fontFamily: 'DM Mono' }}>—</span>) : (<>
                          <span style={{ fontSize: 8, fontFamily: 'DM Mono', color: isToday ? 'var(--accent)' : 'var(--text-2)', fontWeight: 600 }}>{s.open}</span>
                          <span style={{ fontSize: 7, fontFamily: 'DM Mono', color: 'var(--meta-color)' }}>{s.close}</span>
                        </>)}
                    </div>
                  </div>);
            })}
            </div>
          </div>)}

        {/* ── Contacts ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {place.contact.phone && (<a href={"tel:".concat(place.contact.phone)} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, background: 'var(--surface)', border: '1px solid var(--border)', transition: 'border-color 0.2s' }} onMouseEnter={function (e) { return (e.currentTarget.style.borderColor = 'rgba(187,0,255,0.25)'); }} onMouseLeave={function (e) { return (e.currentTarget.style.borderColor = 'var(--border)'); }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "".concat(cat.color, "15"), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <lucide_react_1.Phone size={15} color={cat.color}/>
              </div>
              <span style={{ fontSize: 14, color: 'var(--text)', flex: 1 }}>{place.contact.phone}</span>
              <lucide_react_1.ExternalLink size={12} color="var(--meta-color)"/>
            </a>)}
          {place.contact.website && (<a href={place.contact.website} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, background: 'var(--surface)', border: '1px solid var(--border)', transition: 'border-color 0.2s' }} onMouseEnter={function (e) { return (e.currentTarget.style.borderColor = 'rgba(187,0,255,0.25)'); }} onMouseLeave={function (e) { return (e.currentTarget.style.borderColor = 'var(--border)'); }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "".concat(cat.color, "15"), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <lucide_react_1.Globe size={15} color={cat.color}/>
              </div>
              <span style={{ fontSize: 14, color: 'var(--text)', flex: 1 }}>Sito web</span>
              <lucide_react_1.ExternalLink size={12} color="var(--meta-color)"/>
            </a>)}
          {place.contact.instagram && (<a href={"https://instagram.com/".concat(place.contact.instagram)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, background: 'var(--surface)', border: '1px solid var(--border)', transition: 'border-color 0.2s' }} onMouseEnter={function (e) { return (e.currentTarget.style.borderColor = 'rgba(187,0,255,0.25)'); }} onMouseLeave={function (e) { return (e.currentTarget.style.borderColor = 'var(--border)'); }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "".concat(cat.color, "15"), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <lucide_react_1.Instagram size={15} color={cat.color}/>
              </div>
              <span style={{ fontSize: 14, color: 'var(--text)', flex: 1 }}>@{place.contact.instagram}</span>
              <lucide_react_1.ExternalLink size={12} color="var(--meta-color)"/>
            </a>)}
        </div>

        {/* ── Map CTA ── */}
        <a href={"https://maps.google.com/?q=".concat((_c = place.location.coordinates) === null || _c === void 0 ? void 0 : _c.lat, ",").concat((_d = place.location.coordinates) === null || _d === void 0 ? void 0 : _d.lng)} target="_blank" rel="noopener noreferrer" className="btn btn-accent" style={{ width: '100%', justifyContent: 'center' }}>
          <lucide_react_1.MapPin size={15}/> Ottieni indicazioni
        </a>

        {/* ── Reviews ── */}
        <div>
          <div className="divider-label" style={{ marginBottom: 16 }}>Recensioni</div>
          <PlaceReviews_1.default placeId={place._id}/>
        </div>
      </framer_motion_1.motion.div>
    </div>);
}
