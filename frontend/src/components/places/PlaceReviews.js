"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PlaceReviews;
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var api_1 = require("@/lib/api");
var store_1 = require("@/store");
var react_router_dom_1 = require("react-router-dom");
function Stars(_a) {
    var rating = _a.rating, _b = _a.interactive, interactive = _b === void 0 ? false : _b, onRate = _a.onRate;
    var _c = (0, react_1.useState)(0), hover = _c[0], setHover = _c[1];
    return (<div style={{ display: 'flex', gap: 3 }}>
      {[1, 2, 3, 4, 5].map(function (i) { return (<button key={i} onClick={function () { return interactive && (onRate === null || onRate === void 0 ? void 0 : onRate(i)); }} onMouseEnter={function () { return interactive && setHover(i); }} onMouseLeave={function () { return interactive && setHover(0); }} style={{ background: 'none', border: 'none', cursor: interactive ? 'pointer' : 'default', padding: 0, lineHeight: 0 }}>
          <lucide_react_1.Star size={interactive ? 22 : 12} fill={(hover || rating) >= i ? '#f59e0b' : 'transparent'} color={(hover || rating) >= i ? '#f59e0b' : 'rgba(240,237,232,0.2)'} style={{ transition: 'all 0.1s' }}/>
        </button>); })}
    </div>);
}
function PlaceReviews(_a) {
    var _b, _c, _d, _e;
    var placeId = _a.placeId;
    var _f = (0, store_1.useUserStore)(), isLoggedIn = _f.isLoggedIn, user = _f.user;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var qc = (0, react_query_1.useQueryClient)();
    var _g = (0, react_1.useState)(0), rating = _g[0], setRating = _g[1];
    var _h = (0, react_1.useState)(''), comment = _h[0], setComment = _h[1];
    var _j = (0, react_1.useState)(false), showForm = _j[0], setShowForm = _j[1];
    var data = (0, react_query_1.useQuery)({
        queryKey: ['reviews', placeId],
        queryFn: function () { return api_1.reviewsApi.forPlace(placeId); },
    }).data;
    var createMutation = (0, react_query_1.useMutation)({
        mutationFn: function () { return api_1.reviewsApi.create(placeId, { rating: rating, comment: comment }); },
        onSuccess: function () {
            qc.invalidateQueries({ queryKey: ['reviews', placeId] });
            setRating(0);
            setComment('');
            setShowForm(false);
        },
    });
    var deleteMutation = (0, react_query_1.useMutation)({
        mutationFn: api_1.reviewsApi.delete,
        onSuccess: function () { return qc.invalidateQueries({ queryKey: ['reviews', placeId] }); },
    });
    var reviews = (_b = data === null || data === void 0 ? void 0 : data.data) !== null && _b !== void 0 ? _b : [];
    var stats = data === null || data === void 0 ? void 0 : data.stats;
    return (<div>
      {/* Stats */}
      {stats && stats.total > 0 && (<div style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px',
                background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: 16, marginBottom: 16,
            }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 32, fontWeight: 800, color: '#f59e0b', lineHeight: 1 }}>{stats.avg}</p>
            <Stars rating={Math.round(stats.avg)}/>
            <p style={{ fontSize: 10, color: 'rgba(240,237,232,0.4)', marginTop: 3 }}>{stats.total} recens.</p>
          </div>
          <div style={{ flex: 1 }}>
            {[5, 4, 3, 2, 1].map(function (n) { return (<div key={n} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <span style={{ fontSize: 10, color: 'rgba(240,237,232,0.4)', width: 8 }}>{n}</span>
                <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', background: '#f59e0b', borderRadius: 2,
                    width: "".concat(stats.total > 0 ? (stats.distribution[n] / stats.total) * 100 : 0, "%"),
                    transition: 'width 0.5s ease',
                }}/>
                </div>
                <span style={{ fontSize: 10, color: 'rgba(240,237,232,0.35)', width: 16, textAlign: 'right' }}>{stats.distribution[n]}</span>
              </div>); })}
          </div>
        </div>)}

      {/* Write review CTA */}
      {!showForm && (<button onClick={function () { return isLoggedIn() ? setShowForm(true) : navigate('/accedi', { state: { from: "/place/".concat(placeId) } }); }} style={{
                width: '100%', padding: '12px', borderRadius: 14, border: '1px dashed rgba(245,158,11,0.3)',
                background: 'rgba(245,158,11,0.05)', color: 'rgba(240,237,232,0.5)',
                cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                marginBottom: 16, transition: 'all 0.2s',
            }} onMouseEnter={function (e) { return (e.currentTarget.style.background = 'rgba(245,158,11,0.1)'); }} onMouseLeave={function (e) { return (e.currentTarget.style.background = 'rgba(245,158,11,0.05)'); }}>
          <lucide_react_1.Star size={14} color="#f59e0b"/> Scrivi una recensione
        </button>)}

      {/* Review form */}
      <framer_motion_1.AnimatePresence>
        {showForm && (<framer_motion_1.motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{
                background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: 16, padding: 16, marginBottom: 16, overflow: 'hidden',
            }}>
            <p style={{ color: 'rgba(240,237,232,0.5)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 10 }}>
              La tua recensione
            </p>
            <div style={{ marginBottom: 12 }}>
              <Stars rating={rating} interactive onRate={setRating}/>
            </div>
            <textarea value={comment} onChange={function (e) { return setComment(e.target.value); }} placeholder="Racconta la tua esperienza... (opzionale)" rows={3} style={{
                width: '100%', padding: '10px 12px', borderRadius: 10,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#f0ede8', fontSize: 13, outline: 'none', resize: 'none',
                fontFamily: 'DM Sans,sans-serif', boxSizing: 'border-box',
                marginBottom: 10,
            }} onFocus={function (e) { return (e.target.style.borderColor = '#f59e0b'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>
            {createMutation.isError && (<p style={{ color: '#f87171', fontSize: 11, marginBottom: 8 }}>
                {((_e = (_d = (_c = createMutation.error) === null || _c === void 0 ? void 0 : _c.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.error) || 'Errore'}
              </p>)}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={function () { return setShowForm(false); }} style={{ flex: 1, padding: '9px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(240,237,232,0.4)', cursor: 'pointer', fontSize: 12 }}>
                Annulla
              </button>
              <button onClick={function () { return createMutation.mutate(); }} disabled={rating === 0 || createMutation.isPending} style={{ flex: 2, padding: '9px', borderRadius: 10, border: 'none', background: rating > 0 ? '#f59e0b' : 'rgba(255,255,255,0.08)', color: rating > 0 ? '#000' : 'rgba(240,237,232,0.3)', cursor: rating > 0 ? 'pointer' : 'not-allowed', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s' }}>
                <lucide_react_1.Send size={12}/> {createMutation.isPending ? 'Invio...' : 'Pubblica'}
              </button>
            </div>
          </framer_motion_1.motion.div>)}
      </framer_motion_1.AnimatePresence>

      {/* Reviews list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {reviews.length === 0 && !showForm && (<p style={{ color: 'rgba(240,237,232,0.3)', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>
            Ancora nessuna recensione. Sii il primo!
          </p>)}
        {reviews.map(function (r) {
            var _a, _b, _c, _d;
            var isOwn = user && ((_a = r.userId) === null || _a === void 0 ? void 0 : _a._id) === user.id;
            return (<div key={r._id} style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 14, padding: '12px 14px',
                }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#f59e0b', fontSize: 10, fontWeight: 700 }}>{(_c = (_b = r.userId) === null || _b === void 0 ? void 0 : _b.name) === null || _c === void 0 ? void 0 : _c.charAt(0).toUpperCase()}</span>
                  </div>
                  <span style={{ color: '#f0ede8', fontSize: 12, fontWeight: 600 }}>{(_d = r.userId) === null || _d === void 0 ? void 0 : _d.name}</span>
                  <Stars rating={r.rating}/>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: 'rgba(240,237,232,0.25)', fontSize: 10, fontFamily: 'DM Mono,monospace' }}>
                    {new Date(r.createdAt).toLocaleDateString('it-IT')}
                  </span>
                  {isOwn && (<button onClick={function () { return deleteMutation.mutate(r._id); }} style={{ padding: 4, borderRadius: 6, border: 'none', cursor: 'pointer', background: 'transparent', color: 'rgba(240,237,232,0.2)' }} onMouseEnter={function (e) { return (e.currentTarget.style.color = '#f87171'); }} onMouseLeave={function (e) { return (e.currentTarget.style.color = 'rgba(240,237,232,0.2)'); }}>
                      <lucide_react_1.Trash2 size={11}/>
                    </button>)}
                </div>
              </div>
              {r.comment && <p style={{ color: 'rgba(240,237,232,0.6)', fontSize: 12, lineHeight: 1.5 }}>{r.comment}</p>}
            </div>);
        })}
      </div>
    </div>);
}
