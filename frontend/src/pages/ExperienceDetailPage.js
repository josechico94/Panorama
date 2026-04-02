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
exports.default = ExperienceDetailPage;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var react_query_1 = require("@tanstack/react-query");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var api_1 = require("@/lib/api");
var types_1 = require("@/types");
var store_1 = require("@/store");
var PLACEHOLDER = 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=900&q=80';
function getYouTubeId(url) {
    try {
        var u = new URL(url);
        if (u.hostname.includes('youtube.com'))
            return u.searchParams.get('v');
        if (u.hostname.includes('youtu.be'))
            return u.pathname.slice(1).split('?')[0];
        if (u.pathname.includes('/embed/'))
            return u.pathname.split('/embed/')[1];
    }
    catch (_a) { }
    return null;
}
function getVimeoId(url) {
    try {
        var u = new URL(url);
        if (u.hostname.includes('vimeo.com'))
            return u.pathname.replace('/', '').split('/')[0];
    }
    catch (_a) { }
    return null;
}
function VideoPlayer(_a) {
    var url = _a.url;
    var _b = (0, react_1.useState)(false), playing = _b[0], setPlaying = _b[1];
    var ytId = getYouTubeId(url);
    var vimeoId = getVimeoId(url);
    var embedUrl = ytId
        ? 'https://www.youtube.com/embed/' + ytId + '?autoplay=1&rel=0'
        : vimeoId
            ? 'https://player.vimeo.com/video/' + vimeoId + '?autoplay=1'
            : null;
    var thumb = ytId ? 'https://img.youtube.com/vi/' + ytId + '/hqdefault.jpg' : null;
    if (!embedUrl)
        return (<a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 glass-light rounded-xl p-4">
      <span style={{ fontSize: 18 }}>▶️</span>
      <div><p className="text-[var(--text)] text-sm font-semibold">Guarda il video</p><p className="text-[var(--text-3)] text-xs">Apre in una nuova finestra</p></div>
    </a>);
    return (<div>
      <p className="divider-label mb-3">Video</p>
      {!playing ? (<button onClick={function () { return setPlaying(true); }} style={{ width: '100%', position: 'relative', borderRadius: 16, overflow: 'hidden', aspectRatio: '16/9', border: 'none', cursor: 'pointer', background: '#000', display: 'block' }}>
          {thumb && <img src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(232,98,42,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 24px rgba(232,98,42,0.5)' }}>
              <span style={{ fontSize: 24, marginLeft: 4, color: '#fff' }}>▶</span>
            </div>
          </div>
        </button>) : (<div style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '16/9' }}>
          <iframe src={embedUrl} width="100%" height="100%" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ display: 'block', border: 'none' }}/>
        </div>)}
    </div>);
}
function StarsInput(_a) {
    var rating = _a.rating, onRate = _a.onRate;
    var _b = (0, react_1.useState)(0), hover = _b[0], setHover = _b[1];
    return (<div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(function (i) { return (<button key={i} onClick={function () { return onRate(i); }} onMouseEnter={function () { return setHover(i); }} onMouseLeave={function () { return setHover(0); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 0 }}>
          <lucide_react_1.Star size={24} fill={(hover || rating) >= i ? '#f59e0b' : 'transparent'} color={(hover || rating) >= i ? '#f59e0b' : 'rgba(240,237,232,0.2)'} style={{ transition: 'all 0.1s' }}/>
        </button>); })}
    </div>);
}
function StarsDisplay(_a) {
    var rating = _a.rating;
    return (<div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(function (i) { return <lucide_react_1.Star key={i} size={11} fill={i <= rating ? '#f59e0b' : 'transparent'} color={i <= rating ? '#f59e0b' : 'rgba(240,237,232,0.2)'}/>; })}
    </div>);
}
function ExperienceDetailPage() {
    var _this = this;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var slug = (0, react_router_dom_1.useParams)().slug;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _k = (0, store_1.useAppStore)(), toggleSavedExperience = _k.toggleSavedExperience, isSavedExperience = _k.isSavedExperience;
    var _l = (0, store_1.useUserStore)(), isLoggedIn = _l.isLoggedIn, user = _l.user;
    var qc = (0, react_query_1.useQueryClient)();
    var _m = (0, react_1.useState)(0), rating = _m[0], setRating = _m[1];
    var _o = (0, react_1.useState)(''), comment = _o[0], setComment = _o[1];
    var _p = (0, react_1.useState)(false), showReviewForm = _p[0], setShowReviewForm = _p[1];
    var _q = (0, react_query_1.useQuery)({
        queryKey: ['experience', slug],
        queryFn: function () { return api_1.experiencesApi.get(slug); },
        enabled: !!slug,
    }), data = _q.data, isLoading = _q.isLoading;
    var exp = data === null || data === void 0 ? void 0 : data.data;
    var stops = (_a = exp === null || exp === void 0 ? void 0 : exp.stops) !== null && _a !== void 0 ? _a : [];
    var saved = exp ? isSavedExperience(exp._id) : false;
    var hours = exp ? Math.floor(exp.duration / 60) : 0;
    var mins = exp ? exp.duration % 60 : 0;
    // Reviews
    var reviewsData = (0, react_query_1.useQuery)({
        queryKey: ['exp-reviews', exp === null || exp === void 0 ? void 0 : exp._id],
        queryFn: function () { return api_1.reviewsApi.forExperience(exp._id); },
        enabled: !!(exp === null || exp === void 0 ? void 0 : exp._id),
    }).data;
    // Nearby places — use coordinates of first stop
    var firstStop = (_b = stops[0]) === null || _b === void 0 ? void 0 : _b.placeId;
    var nearbyData = (0, react_query_1.useQuery)({
        queryKey: ['nearby-exp', exp === null || exp === void 0 ? void 0 : exp._id],
        queryFn: function () {
            var _a, _b, _c, _d;
            var lat = (_b = (_a = firstStop === null || firstStop === void 0 ? void 0 : firstStop.location) === null || _a === void 0 ? void 0 : _a.coordinates) === null || _b === void 0 ? void 0 : _b.lat;
            var lng = (_d = (_c = firstStop === null || firstStop === void 0 ? void 0 : firstStop.location) === null || _c === void 0 ? void 0 : _c.coordinates) === null || _d === void 0 ? void 0 : _d.lng;
            if (!lat || !lng)
                return { data: [] };
            var excludeIds = stops.map(function (s) { var _a; return (_a = s.placeId) === null || _a === void 0 ? void 0 : _a._id; }).filter(Boolean).join(',');
            return api_1.placesApi.nearby(lat, lng, { radius: 800, limit: 6, exclude: excludeIds });
        },
        enabled: !!((_c = firstStop === null || firstStop === void 0 ? void 0 : firstStop.location) === null || _c === void 0 ? void 0 : _c.coordinates),
    }).data;
    var createReview = (0, react_query_1.useMutation)({
        mutationFn: function () { return api_1.reviewsApi.createForExp(exp._id, { rating: rating, comment: comment }); },
        onSuccess: function () { qc.invalidateQueries({ queryKey: ['exp-reviews'] }); setRating(0); setComment(''); setShowReviewForm(false); },
    });
    var deleteReview = (0, react_query_1.useMutation)({
        mutationFn: function (id) { return api_1.reviewsApi.delete(id); },
        onSuccess: function () { return qc.invalidateQueries({ queryKey: ['exp-reviews'] }); },
    });
    var handleShare = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(navigator.share && exp)) return [3 /*break*/, 2];
                    return [4 /*yield*/, navigator.share({ title: exp.title, text: exp.tagline, url: window.location.href })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copiato!');
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    if (isLoading)
        return (<div className="max-w-2xl mx-auto px-4 pt-8 space-y-4">
      <div className="skeleton rounded-2xl h-56"/>
      <div className="skeleton rounded-xl h-8 w-2/3"/>
    </div>);
    if (!exp)
        return (<div className="text-center py-20">
      <p className="text-4xl mb-3">✨</p>
      <p className="text-[var(--text-2)] text-sm">Esperienza non trovata</p>
      <react_router_dom_1.Link to="/esperienze" className="btn btn-accent mt-5 inline-flex">Torna alle esperienze</react_router_dom_1.Link>
    </div>);
    var reviews = (_d = reviewsData === null || reviewsData === void 0 ? void 0 : reviewsData.data) !== null && _d !== void 0 ? _d : [];
    var stats = reviewsData === null || reviewsData === void 0 ? void 0 : reviewsData.stats;
    var nearby = (_e = nearbyData === null || nearbyData === void 0 ? void 0 : nearbyData.data) !== null && _e !== void 0 ? _e : [];
    return (<div className="max-w-2xl mx-auto pb-10">
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/8' }}>
        <img src={exp.coverImage || PLACEHOLDER} alt={exp.title} className="w-full h-full object-cover"/>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(7,7,15,0.3) 0%, rgba(7,7,15,0.85) 100%)' }}/>

        <button onClick={function () { return navigate(-1); }} className="absolute top-4 left-4 w-9 h-9 rounded-xl glass flex items-center justify-center">
          <lucide_react_1.ArrowLeft size={16} className="text-white"/>
        </button>

        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={handleShare} className="w-9 h-9 rounded-xl glass flex items-center justify-center">
            <lucide_react_1.Share2 size={14} className="text-white"/>
          </button>
          <button onClick={function () { return toggleSavedExperience(exp._id); }} className="w-9 h-9 rounded-xl glass flex items-center justify-center">
            {saved ? <lucide_react_1.BookmarkCheck size={14} style={{ color: 'var(--accent)' }}/> : <lucide_react_1.Bookmark size={14} className="text-white"/>}
          </button>
        </div>

        <div className="absolute top-4" style={{ right: '50%', transform: 'translateX(50%)' }}>
          <span style={{ background: 'rgba(7,7,15,0.8)', backdropFilter: 'blur(8px)', color: '#f0ede8', fontSize: 14, fontWeight: 800, padding: '5px 12px', borderRadius: 12, fontFamily: 'DM Mono,monospace', border: '1px solid rgba(255,255,255,0.15)' }}>
            ~€{exp.estimatedCost}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5">
          {stats && stats.total > 0 && (<div className="flex items-center gap-2 mb-2">
              <StarsDisplay rating={Math.round(stats.avg)}/>
              <span style={{ color: 'rgba(240,237,232,0.6)', fontSize: 11 }}>{stats.avg} ({stats.total})</span>
            </div>)}
          <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 'clamp(24px,6vw,34px)', fontWeight: 700, color: '#f0ede8', lineHeight: 1.1, marginBottom: 4 }}>
            {exp.emoji} {exp.title}
          </h1>
          <p style={{ color: 'rgba(240,237,232,0.65)', fontSize: 13 }}>{exp.tagline}</p>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-6">
        {/* Meta */}
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2 glass-light rounded-xl px-3 py-2">
            <lucide_react_1.Clock size={13} style={{ color: 'var(--accent)' }}/>
            <span className="text-[var(--text-2)] text-xs font-semibold">{hours > 0 ? hours + 'h ' : ''}{mins > 0 ? mins + 'min' : ''}</span>
          </div>
          <div className="flex items-center gap-2 glass-light rounded-xl px-3 py-2">
            <lucide_react_1.MapPin size={13} style={{ color: 'var(--accent)' }}/>
            <span className="text-[var(--text-2)] text-xs font-semibold">{stops.length} {stops.length === 1 ? 'tappa' : 'tappe'}</span>
          </div>
          {(_f = exp.tags) === null || _f === void 0 ? void 0 : _f.map(function (tag) { return <span key={tag} className="tag-chip">#{tag}</span>; })}
        </div>

        {exp.description && <p className="text-[var(--text-2)] text-sm leading-relaxed">{exp.description}</p>}

        {/* Video */}
        {exp.videoUrl && <VideoPlayer url={exp.videoUrl}/>}

        {/* Itinerary */}
        <div>
          <p className="divider-label mb-4">Itinerario</p>
          {stops.length === 0 ? (<div style={{ padding: '24px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 16 }}>
              <p style={{ color: 'rgba(240,237,232,0.3)', fontSize: 13 }}>Nessuna tappa ancora</p>
            </div>) : (<div className="space-y-3">
              {stops.sort(function (a, b) { return a.order - b.order; }).map(function (stop, i) {
                var _a, _b, _c, _d;
                var place = stop.placeId;
                if (!place)
                    return null;
                var cat = (0, types_1.getCategoryConfig)(place.category);
                return (<framer_motion_1.motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', gap: 12, padding: '14px 16px' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>{i + 1}</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                            <react_router_dom_1.Link to={'/place/' + place.slug} style={{ textDecoration: 'none' }}>
                              <h3 style={{ color: '#f0ede8', fontSize: 15, fontWeight: 700, fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic' }}>{place.name}</h3>
                            </react_router_dom_1.Link>
                            <span style={{ fontSize: 9, fontWeight: 700, color: cat.color, background: cat.color + '18', border: '1px solid ' + cat.color + '30', borderRadius: 100, padding: '1px 6px' }}>{cat.emoji} {cat.label}</span>
                          </div>
                          <p style={{ color: 'rgba(240,237,232,0.4)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <lucide_react_1.MapPin size={9} color="var(--accent)"/> {((_a = place.location) === null || _a === void 0 ? void 0 : _a.neighborhood) || ((_b = place.location) === null || _b === void 0 ? void 0 : _b.address)}
                          </p>
                          {stop.duration > 0 && <p style={{ color: 'rgba(240,237,232,0.3)', fontSize: 10, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}><lucide_react_1.Clock size={9}/> ~{stop.duration} min</p>}
                        </div>
                        <div style={{ width: 56, height: 56, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
                          <img src={((_c = place.media) === null || _c === void 0 ? void 0 : _c.coverImage) || PLACEHOLDER} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                        </div>
                      </div>
                      {stop.note && (<div style={{ padding: '0 16px 12px 60px' }}>
                          <p style={{ fontSize: 12, color: 'rgba(240,237,232,0.55)', lineHeight: 1.5, background: 'rgba(232,98,42,0.06)', border: '1px solid rgba(232,98,42,0.15)', borderRadius: 10, padding: '8px 12px', fontStyle: 'italic' }}>
                            💡 {stop.note}
                          </p>
                        </div>)}
                      <div style={{ padding: '0 16px 12px 60px', display: 'flex', gap: 12 }}>
                        <react_router_dom_1.Link to={'/place/' + place.slug} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>
                          Vedi dettagli <lucide_react_1.ExternalLink size={10}/>
                        </react_router_dom_1.Link>
                        {((_d = place.contact) === null || _d === void 0 ? void 0 : _d.phone) && (<a href={'tel:' + place.contact.phone} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'rgba(240,237,232,0.4)' }}>
                            <lucide_react_1.Phone size={10}/> Chiama
                          </a>)}
                      </div>
                    </div>
                    {i < stops.length - 1 && (<div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
                        <div style={{ width: 2, height: 20, background: 'linear-gradient(to bottom, var(--accent), transparent)' }}/>
                      </div>)}
                  </framer_motion_1.motion.div>);
            })}
            </div>)}
        </div>

        {/* Start CTA */}
        {((_j = (_h = (_g = stops[0]) === null || _g === void 0 ? void 0 : _g.placeId) === null || _h === void 0 ? void 0 : _h.location) === null || _j === void 0 ? void 0 : _j.coordinates) && (<a href={'https://maps.google.com/?q=' + stops[0].placeId.location.coordinates.lat + ',' + stops[0].placeId.location.coordinates.lng} target="_blank" rel="noopener noreferrer" className="btn btn-accent w-full flex items-center justify-center gap-2">
            <lucide_react_1.MapPin size={15}/> Inizia da qui
          </a>)}

        {/* Nearby places */}
        {nearby.length > 0 && (<div>
            <p className="divider-label mb-3">Nella zona</p>
            <p style={{ color: 'rgba(240,237,232,0.4)', fontSize: 12, marginBottom: 12 }}>Altri posti interessanti vicino all'itinerario</p>
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {nearby.map(function (place) {
                var _a;
                var cat = (0, types_1.getCategoryConfig)(place.category);
                return (<react_router_dom_1.Link key={place._id} to={'/place/' + place.slug} style={{ textDecoration: 'none', flexShrink: 0, width: 140 }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
                      <div style={{ height: 80, position: 'relative' }}>
                        <img src={((_a = place.media) === null || _a === void 0 ? void 0 : _a.coverImage) || PLACEHOLDER} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,7,15,0.7) 0%, transparent 60%)' }}/>
                        <span style={{ position: 'absolute', bottom: 5, left: 6, fontSize: 9, fontWeight: 700, color: cat.color, background: cat.color + '25', padding: '1px 5px', borderRadius: 4 }}>{cat.emoji}</span>
                        {place.distance && <span style={{ position: 'absolute', top: 5, right: 5, fontSize: 8, color: 'rgba(240,237,232,0.7)', background: 'rgba(0,0,0,0.5)', padding: '1px 5px', borderRadius: 4 }}>{place.distance}m</span>}
                      </div>
                      <div style={{ padding: '7px 8px' }}>
                        <p style={{ color: '#f0ede8', fontSize: 11, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{place.name}</p>
                      </div>
                    </div>
                  </react_router_dom_1.Link>);
            })}
            </div>
          </div>)}

        {/* Reviews */}
        <div>
          <p className="divider-label mb-4">Recensioni</p>

          {/* Stats */}
          {stats && stats.total > 0 && (<div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 16, marginBottom: 16 }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 32, fontWeight: 800, color: '#f59e0b', lineHeight: 1 }}>{stats.avg}</p>
                <StarsDisplay rating={Math.round(stats.avg)}/>
                <p style={{ fontSize: 10, color: 'rgba(240,237,232,0.4)', marginTop: 3 }}>{stats.total} recens.</p>
              </div>
              <div style={{ flex: 1 }}>
                {[5, 4, 3, 2, 1].map(function (n) { return (<div key={n} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <span style={{ fontSize: 10, color: 'rgba(240,237,232,0.4)', width: 8 }}>{n}</span>
                    <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: '#f59e0b', borderRadius: 2, width: (stats.total > 0 ? (stats.distribution[n] / stats.total) * 100 : 0) + '%' }}/>
                    </div>
                    <span style={{ fontSize: 10, color: 'rgba(240,237,232,0.35)', width: 16, textAlign: 'right' }}>{stats.distribution[n]}</span>
                  </div>); })}
              </div>
            </div>)}

          {/* Write review CTA */}
          {!showReviewForm && (<button onClick={function () { return isLoggedIn() ? setShowReviewForm(true) : navigate('/accedi'); }} style={{ width: '100%', padding: '12px', borderRadius: 14, border: '1px dashed rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.05)', color: 'rgba(240,237,232,0.5)', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16, transition: 'all 0.2s' }}>
              <lucide_react_1.Star size={14} color="#f59e0b"/> Scrivi una recensione
            </button>)}

          {/* Review form */}
          <framer_motion_1.AnimatePresence>
            {showReviewForm && (<framer_motion_1.motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 16, padding: 16, marginBottom: 16, overflow: 'hidden' }}>
                <p style={{ color: 'rgba(240,237,232,0.5)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 10 }}>La tua recensione</p>
                <div style={{ marginBottom: 12 }}><StarsInput rating={rating} onRate={setRating}/></div>
                <textarea value={comment} onChange={function (e) { return setComment(e.target.value); }} placeholder="Racconta la tua esperienza... (opzionale)" rows={3} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f0ede8', fontSize: 13, outline: 'none', resize: 'none', fontFamily: 'DM Sans,sans-serif', boxSizing: 'border-box', marginBottom: 10 }} onFocus={function (e) { return (e.target.style.borderColor = '#f59e0b'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={function () { return setShowReviewForm(false); }} style={{ flex: 1, padding: '9px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(240,237,232,0.4)', cursor: 'pointer', fontSize: 12 }}>Annulla</button>
                  <button onClick={function () { return createReview.mutate(); }} disabled={rating === 0 || createReview.isPending} style={{ flex: 2, padding: '9px', borderRadius: 10, border: 'none', background: rating > 0 ? '#f59e0b' : 'rgba(255,255,255,0.08)', color: rating > 0 ? '#000' : 'rgba(240,237,232,0.3)', cursor: rating > 0 ? 'pointer' : 'not-allowed', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <lucide_react_1.Send size={12}/> {createReview.isPending ? 'Invio...' : 'Pubblica'}
                  </button>
                </div>
              </framer_motion_1.motion.div>)}
          </framer_motion_1.AnimatePresence>

          {/* Reviews list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {reviews.length === 0 && !showReviewForm && (<p style={{ color: 'rgba(240,237,232,0.3)', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>Ancora nessuna recensione. Sii il primo!</p>)}
            {reviews.map(function (r) {
            var _a, _b, _c, _d;
            var isOwn = user && ((_a = r.userId) === null || _a === void 0 ? void 0 : _a._id) === user.id;
            return (<div key={r._id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#f59e0b', fontSize: 10, fontWeight: 700 }}>{(_c = (_b = r.userId) === null || _b === void 0 ? void 0 : _b.name) === null || _c === void 0 ? void 0 : _c.charAt(0).toUpperCase()}</span>
                      </div>
                      <span style={{ color: '#f0ede8', fontSize: 12, fontWeight: 600 }}>{(_d = r.userId) === null || _d === void 0 ? void 0 : _d.name}</span>
                      <StarsDisplay rating={r.rating}/>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: 'rgba(240,237,232,0.25)', fontSize: 10, fontFamily: 'DM Mono,monospace' }}>{new Date(r.createdAt).toLocaleDateString('it-IT')}</span>
                      {isOwn && (<button onClick={function () { return deleteReview.mutate(r._id); }} style={{ padding: 4, borderRadius: 6, border: 'none', cursor: 'pointer', background: 'transparent', color: 'rgba(240,237,232,0.2)' }} onMouseEnter={function (e) { return (e.currentTarget.style.color = '#f87171'); }} onMouseLeave={function (e) { return (e.currentTarget.style.color = 'rgba(240,237,232,0.2)'); }}>
                          <lucide_react_1.Trash2 size={11}/>
                        </button>)}
                    </div>
                  </div>
                  {r.comment && <p style={{ color: 'rgba(240,237,232,0.6)', fontSize: 12, lineHeight: 1.5 }}>{r.comment}</p>}
                </div>);
        })}
          </div>
        </div>
      </div>
    </div>);
}
