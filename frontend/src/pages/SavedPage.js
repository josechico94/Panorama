"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SavedPage;
var react_query_1 = require("@tanstack/react-query");
var lucide_react_1 = require("lucide-react");
var react_router_dom_1 = require("react-router-dom");
var framer_motion_1 = require("framer-motion");
var api_1 = require("@/lib/api");
var store_1 = require("@/store");
var PlaceCard_1 = require("@/components/places/PlaceCard");
function SavedPage() {
    var _a;
    var _b = (0, store_1.useAppStore)(), savedPlaces = _b.savedPlaces, city = _b.city;
    var _c = (0, react_query_1.useQuery)({
        queryKey: ['all-places-saved', city],
        queryFn: function () { return api_1.placesApi.list({ city: city, limit: '100' }); },
        enabled: savedPlaces.length > 0,
    }), data = _c.data, isLoading = _c.isLoading;
    var allPlaces = (_a = data === null || data === void 0 ? void 0 : data.data) !== null && _a !== void 0 ? _a : [];
    var saved = allPlaces.filter(function (p) { return savedPlaces.includes(p._id); });
    return (<div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <framer_motion_1.motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="accent-line"/>
          <span className="font-mono-dm text-[var(--text-3)] text-[9px] tracking-[0.28em] uppercase">La tua lista</span>
        </div>
        <h1 className="font-display font-bold" style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(30px,8vw,42px)', fontStyle: 'italic' }}>
          Salvati
        </h1>
        <p className="text-[var(--text-3)] text-xs mt-1 font-mono-dm">
          {saved.length} post{saved.length !== 1 ? 'i' : 'o'}
        </p>
      </framer_motion_1.motion.div>

      {savedPlaces.length === 0 || (!isLoading && saved.length === 0) ? (<framer_motion_1.motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-center py-20 space-y-5">
          <div className="w-16 h-16 rounded-2xl glass-light flex items-center justify-center mx-auto" style={{ border: '1px solid var(--border2)' }}>
            <lucide_react_1.Bookmark size={24} className="text-[var(--text-3)]"/>
          </div>
          <div>
            <p className="text-[var(--text-2)] font-medium text-sm">Nessun posto salvato</p>
            <p className="text-[var(--text-3)] text-xs mt-1.5 leading-relaxed">
              Premi 🔖 su qualsiasi posto<br />per aggiungerlo qui
            </p>
          </div>
          <react_router_dom_1.Link to="/" className="btn btn-ghost inline-flex gap-1.5 text-xs">
            Scopri Bologna <lucide_react_1.ArrowRight size={13}/>
          </react_router_dom_1.Link>
        </framer_motion_1.motion.div>) : (<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {saved.map(function (place, i) { return (<PlaceCard_1.default key={place._id} place={place} index={i}/>); })}
        </div>)}
    </div>);
}
