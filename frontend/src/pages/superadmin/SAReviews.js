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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SAReviews;
var react_query_1 = require("@tanstack/react-query");
var api_1 = require("@/lib/api");
var lucide_react_1 = require("lucide-react");
var card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' };
function Stars(_a) {
    var rating = _a.rating;
    return (<div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(function (i) { return (<lucide_react_1.Star key={i} size={11} fill={i <= rating ? '#f59e0b' : 'transparent'} color={i <= rating ? '#f59e0b' : 'rgba(240,237,232,0.2)'}/>); })}
    </div>);
}
function SAReviews() {
    var _a, _b;
    var qc = (0, react_query_1.useQueryClient)();
    var _c = (0, react_query_1.useQuery)({ queryKey: ['sa-reviews'], queryFn: function () { return api_1.superAdminApi.listReviews(); } }), data = _c.data, isLoading = _c.isLoading;
    var deleteMutation = (0, react_query_1.useMutation)({
        mutationFn: api_1.superAdminApi.deleteReview,
        onSuccess: function () { return qc.invalidateQueries({ queryKey: ['sa-reviews'] }); },
    });
    var reviews = (_a = data === null || data === void 0 ? void 0 : data.data) !== null && _a !== void 0 ? _a : [];
    return (<div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 28, fontWeight: 700, color: '#f0ede8' }}>Recensioni</h1>
        <p style={{ color: 'rgba(240,237,232,0.35)', fontSize: 12, marginTop: 2 }}>{(_b = data === null || data === void 0 ? void 0 : data.total) !== null && _b !== void 0 ? _b : 0} totali</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {isLoading ? (<div style={__assign(__assign({}, card), { padding: 32, textAlign: 'center', color: 'rgba(240,237,232,0.3)' })}>Caricamento...</div>) : reviews.length === 0 ? (<div style={__assign(__assign({}, card), { padding: 48, textAlign: 'center', color: 'rgba(240,237,232,0.3)' })}>
            <lucide_react_1.Star size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }}/>
            <p>Nessuna recensione</p>
          </div>) : (reviews.map(function (r) {
            var _a, _b, _c, _d;
            return (<div key={r._id} style={__assign(__assign({}, card), { padding: 16, display: 'flex', gap: 14 })}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#f59e0b', fontSize: 13, fontWeight: 700 }}>{(_b = (_a = r.userId) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.charAt(0).toUpperCase()}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ color: '#f0ede8', fontSize: 13, fontWeight: 600 }}>{(_c = r.userId) === null || _c === void 0 ? void 0 : _c.name}</span>
                  <Stars rating={r.rating}/>
                  <span style={{ color: 'rgba(240,237,232,0.3)', fontSize: 11, marginLeft: 'auto' }}>
                    {(_d = r.placeId) === null || _d === void 0 ? void 0 : _d.name}
                  </span>
                </div>
                {r.comment && <p style={{ color: 'rgba(240,237,232,0.55)', fontSize: 12, lineHeight: 1.5 }}>{r.comment}</p>}
                <p style={{ color: 'rgba(240,237,232,0.25)', fontSize: 10, fontFamily: 'DM Mono,monospace', marginTop: 4 }}>
                  {new Date(r.createdAt).toLocaleDateString('it-IT')}
                </p>
              </div>
              <button onClick={function () { return confirm('Eliminare questa recensione?') && deleteMutation.mutate(r._id); }} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: 'rgba(240,237,232,0.3)', alignSelf: 'flex-start' }} onMouseEnter={function (e) { e.currentTarget.style.color = '#f87171'; }} onMouseLeave={function (e) { e.currentTarget.style.color = 'rgba(240,237,232,0.3)'; }}>
                <lucide_react_1.Trash2 size={14}/>
              </button>
            </div>);
        }))}
      </div>
    </div>);
}
