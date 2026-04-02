"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CouponDetailPage;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var react_query_1 = require("@tanstack/react-query");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var api_1 = require("@/lib/api");
var store_1 = require("@/store");
var types_1 = require("@/types");
function QRCode(_a) {
    var value = _a.value, _b = _a.size, size = _b === void 0 ? 220 : _b;
    var canvasRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        if (!canvasRef.current || !value)
            return;
        Promise.resolve().then(function () { return require('qrcode'); }).then(function (QRLib) {
            QRLib.default.toCanvas(canvasRef.current, value, {
                width: size,
                margin: 2,
                errorCorrectionLevel: 'H',
                color: { dark: '#000000', light: '#ffffff' },
            });
        });
    }, [value, size]);
    return (<div style={{ background: '#ffffff', padding: 12, borderRadius: 12, display: 'inline-block' }}>
      <canvas id="qr-canvas" ref={canvasRef} width={size} height={size} style={{ display: 'block' }}/>
    </div>);
}
function formatDate(d) {
    return new Date(d).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
}
var PLACEHOLDER = 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=900&q=80';
function CouponDetailPage() {
    var _a, _b, _c, _d, _e, _f;
    var id = (0, react_router_dom_1.useParams)().id;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var isLoggedIn = (0, store_1.useUserStore)().isLoggedIn;
    var qc = (0, react_query_1.useQueryClient)();
    var _g = (0, react_query_1.useQuery)({
        queryKey: ['coupon', id],
        queryFn: function () { return api_1.couponsApi.get(id); },
        enabled: !!id,
    }), data = _g.data, isLoading = _g.isLoading;
    var myData = (0, react_query_1.useQuery)({
        queryKey: ['my-coupons'],
        queryFn: api_1.couponsApi.myList,
        enabled: isLoggedIn(),
    }).data;
    var claimMutation = (0, react_query_1.useMutation)({
        mutationFn: function () { return api_1.couponsApi.claim(id); },
        onSuccess: function () { return qc.invalidateQueries({ queryKey: ['my-coupons'] }); },
    });
    var coupon = data === null || data === void 0 ? void 0 : data.data;
    var place = coupon === null || coupon === void 0 ? void 0 : coupon.placeId;
    var cat = place ? (0, types_1.getCategoryConfig)(place.category) : null;
    var myCoupons = (_a = myData === null || myData === void 0 ? void 0 : myData.data) !== null && _a !== void 0 ? _a : [];
    var myCoupon = myCoupons.find(function (uc) { var _a; return ((_a = uc.couponId) === null || _a === void 0 ? void 0 : _a._id) === id || uc.couponId === id; });
    var handleClaim = function () {
        if (!isLoggedIn()) {
            navigate('/accedi', { state: { from: "/coupon/".concat(id) } });
            return;
        }
        claimMutation.mutate();
    };
    var handleDownload = function () {
        if (!myCoupon)
            return;
        var qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=".concat(encodeURIComponent("".concat(window.location.origin, "/validate/").concat(myCoupon.uniqueCode)), "&bgcolor=07070f&color=f0ede8&margin=4");
        var a = document.createElement('a');
        a.href = qrUrl;
        a.download = "coupon-".concat(myCoupon.uniqueCode.slice(0, 8), ".png");
        a.click();
    };
    if (isLoading)
        return (<div className="max-w-2xl mx-auto px-4 pt-8 space-y-4">
      <div className="skeleton rounded-2xl h-48"/>
      <div className="skeleton rounded-xl h-8 w-2/3"/>
      <div className="skeleton rounded-xl h-16"/>
    </div>);
    if (!coupon || !place || !cat)
        return (<div className="text-center py-20">
      <p className="text-4xl mb-3">🎫</p>
      <p className="text-[var(--text-2)] text-sm">Coupon non trovato</p>
      <react_router_dom_1.Link to="/" className="btn btn-accent mt-5 inline-flex">Torna alla home</react_router_dom_1.Link>
    </div>);
    var isExpired = new Date() > new Date(coupon.validUntil);
    var isExhausted = coupon.maxUses !== null && coupon.usesCount >= coupon.maxUses;
    var qrValue = myCoupon ? "https://panoramabo.onrender.com/validate/".concat(myCoupon.uniqueCode) : '';
    var daysLeft = Math.ceil((new Date(coupon.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return (<div className="max-w-2xl mx-auto pb-10">
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/7' }}>
        <img src={((_b = place.media) === null || _b === void 0 ? void 0 : _b.coverImage) || PLACEHOLDER} alt={place.name} className="w-full h-full object-cover"/>
        <div className="absolute inset-0 hero-overlay"/>
        <button onClick={function () { return navigate(-1); }} className="absolute top-4 left-4 w-9 h-9 rounded-xl glass flex items-center justify-center text-[var(--text-2)] hover:text-white transition-all">
          <lucide_react_1.ArrowLeft size={16}/>
        </button>
        <div className="absolute top-4 right-4">
          <span style={{
            background: 'rgba(232,98,42,0.92)', backdropFilter: 'blur(8px)',
            color: '#fff', fontFamily: 'DM Mono,monospace', fontSize: '13px', fontWeight: 800,
            padding: '4px 12px', borderRadius: '10px', boxShadow: '0 4px 20px rgba(232,98,42,0.5)',
        }}>
            {coupon.discountType === 'percentage' ? "-".concat(coupon.discountValue, "%")
            : coupon.discountType === 'fixed' ? "-\u20AC".concat(coupon.discountValue) : 'OMAGGIO'}
          </span>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-5">
        {/* Title */}
        <div>
          <react_router_dom_1.Link to={"/place/".concat(place.slug)} className="flex items-center gap-1.5 text-[var(--text-3)] text-xs mb-2 hover:text-[var(--accent)] transition-colors">
            <lucide_react_1.MapPin size={10} style={{ color: 'var(--accent)' }}/>
            {place.name} — {(_c = place.location) === null || _c === void 0 ? void 0 : _c.neighborhood}
          </react_router_dom_1.Link>
          <h1 className="font-display font-bold leading-tight" style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(22px,6vw,30px)', fontStyle: 'italic' }}>
            {coupon.title}
          </h1>
          {coupon.description && (<p className="text-[var(--text-2)] text-sm mt-2 leading-relaxed">{coupon.description}</p>)}
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="glass-light rounded-xl p-3">
            <p className="text-[var(--text-3)] text-[9px] font-semibold tracking-widest uppercase mb-1 flex items-center gap-1">
              <lucide_react_1.Clock size={9}/> Valido fino al
            </p>
            <p className="text-[var(--text)] text-sm font-semibold">{formatDate(coupon.validUntil)}</p>
            {!isExpired && daysLeft <= 7 && (<p className="text-[var(--accent)] text-[9px] mt-0.5 font-mono-dm">
                {daysLeft === 1 ? 'Scade oggi!' : "Mancano ".concat(daysLeft, " giorni")}
              </p>)}
          </div>
          <div className="glass-light rounded-xl p-3">
            <p className="text-[var(--text-3)] text-[9px] font-semibold tracking-widest uppercase mb-1 flex items-center gap-1">
              <lucide_react_1.Tag size={9}/> Disponibili
            </p>
            <p className="text-[var(--text)] text-sm font-semibold">
              {coupon.maxUses === null ? '∞ illimitati' : "".concat(coupon.maxUses - coupon.usesCount, " rimasti")}
            </p>
          </div>
        </div>

        {/* Conditions */}
        {coupon.conditions && (<div className="glass-light rounded-xl p-3.5 flex items-start gap-2.5">
            <lucide_react_1.AlertCircle size={14} className="text-yellow-400 mt-0.5 shrink-0"/>
            <div>
              <p className="text-[var(--text-3)] text-[9px] font-semibold tracking-widest uppercase mb-1">Condizioni</p>
              <p className="text-[var(--text-2)] text-xs leading-relaxed">{coupon.conditions}</p>
            </div>
          </div>)}

        {/* QR if claimed */}
        <framer_motion_1.AnimatePresence>
          {myCoupon && (<framer_motion_1.motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{
                background: 'linear-gradient(135deg, rgba(232,98,42,0.08), rgba(240,136,74,0.04))',
                border: '1px solid rgba(232,98,42,0.22)',
                borderRadius: '20px', padding: '20px', textAlign: 'center',
            }}>
              {myCoupon.status === 'used' ? (<div className="space-y-2 py-4">
                  <lucide_react_1.CheckCircle size={36} className="mx-auto text-green-400"/>
                  <p className="text-white font-semibold">Coupon già utilizzato</p>
                  <p className="text-[var(--text-3)] text-xs">Grazie per aver visitato {place.name}!</p>
                </div>) : (<>
                  <p className="text-[var(--text-3)] text-[9px] tracking-widest uppercase font-semibold mb-3">
                    Il tuo QR personale
                  </p>
                  <div className="flex justify-center mb-3">
                    <QRCode value={qrValue} size={200}/>
                  </div>
                  <p className="font-mono-dm text-[var(--text-3)] text-[10px] mb-1">
                    Codice: <span className="text-[var(--accent)]">{myCoupon.uniqueCode.toUpperCase()}</span>
                  </p>
                  <p className="text-[var(--text-3)] text-[10px] mb-4">
                    Mostra al locale per ottenere lo sconto
                  </p>
                  <button onClick={handleDownload} className="btn btn-ghost text-xs flex items-center gap-2 mx-auto">
                    <lucide_react_1.Download size={13}/> Scarica QR
                  </button>
                </>)}
            </framer_motion_1.motion.div>)}
        </framer_motion_1.AnimatePresence>

        {/* CTA */}
        {!myCoupon && (<div className="space-y-3">
            {isExpired || isExhausted ? (<div className="text-center py-4">
                <p className="text-[var(--text-3)] text-sm">
                  {isExpired ? '⏰ Coupon scaduto' : '😔 Coupon esaurito'}
                </p>
              </div>) : (<>
                {!isLoggedIn() && (<div className="glass-light rounded-xl p-3.5 flex items-center gap-2.5">
                    <lucide_react_1.Lock size={13} className="text-[var(--accent)] shrink-0"/>
                    <p className="text-[var(--text-2)] text-xs leading-relaxed">
                      Crea un account gratuito per ottenere il tuo QR personale e usare questo coupon
                    </p>
                  </div>)}
                <button onClick={handleClaim} disabled={claimMutation.isPending} className="btn btn-accent w-full disabled:opacity-50">
                  {claimMutation.isPending
                    ? 'Un momento...'
                    : isLoggedIn()
                        ? '🎫 Ottieni il tuo coupon'
                        : '🔐 Accedi e ottieni coupon'}
                </button>
                {claimMutation.isError && (<p className="text-red-400 text-xs text-center">
                    {((_f = (_e = (_d = claimMutation.error) === null || _d === void 0 ? void 0 : _d.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.error) || 'Errore, riprova'}
                  </p>)}
              </>)}
          </div>)}
      </div>
    </div>);
}
