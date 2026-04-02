"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ExplorePage;
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var lucide_react_1 = require("lucide-react");
var react_leaflet_1 = require("react-leaflet");
var leaflet_1 = require("leaflet");
var react_router_dom_1 = require("react-router-dom");
var framer_motion_1 = require("framer-motion");
var api_1 = require("@/lib/api");
var store_1 = require("@/store");
var CategoryFilter_1 = require("@/components/places/CategoryFilter");
var PlaceCard_1 = require("@/components/places/PlaceCard");
var PlaceCardSkeleton_1 = require("@/components/ui/PlaceCardSkeleton");
var types_1 = require("@/types");
var createIcon = function (emoji) {
    return leaflet_1.default.divIcon({
        html: "<div style=\"font-size:22px;line-height:1;filter:drop-shadow(0 2px 8px rgba(0,0,0,0.8));cursor:pointer\">".concat(emoji, "</div>"),
        className: '',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
    });
};
function ExplorePage() {
    var _a;
    var _b = (0, react_1.useState)('list'), view = _b[0], setView = _b[1];
    var _c = (0, store_1.useAppStore)(), activeCategory = _c.activeCategory, city = _c.city, searchQuery = _c.searchQuery;
    var params = { city: city, limit: '50' };
    if (activeCategory)
        params.category = activeCategory;
    if (searchQuery)
        params.search = searchQuery;
    var _d = (0, react_query_1.useQuery)({
        queryKey: ['explore', city, activeCategory, searchQuery],
        queryFn: function () { return api_1.placesApi.list(params); },
    }), data = _d.data, isLoading = _d.isLoading;
    var places = (_a = data === null || data === void 0 ? void 0 : data.data) !== null && _a !== void 0 ? _a : [];
    return (<div style={{ maxWidth: 672, margin: '0 auto' }}>

      {/* ── Header ── */}
      <div style={{ padding: '24px 16px 16px' }}>
        <framer_motion_1.motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="accent-line"/>
              <span style={{ fontFamily: 'DM Mono', fontSize: 9, color: 'var(--meta-color)', letterSpacing: '0.28em', textTransform: 'uppercase' }}>Scopri</span>
            </div>
            <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 'clamp(30px,8vw,42px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>
              Esplora
            </h1>
          </div>

          {/* View toggle */}
          <div style={{ display: 'flex', gap: 3, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 3 }}>
            {[
            { id: 'list', icon: lucide_react_1.List, label: 'Lista' },
            { id: 'map', icon: lucide_react_1.Map, label: 'Mappa' },
        ].map(function (_a) {
            var id = _a.id, Icon = _a.icon, label = _a.label;
            return (<button key={id} onClick={function () { return setView(id); }} style={{
                    display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px',
                    borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600,
                    background: view === id ? 'linear-gradient(135deg, #BB00FF, #9000CC)' : 'transparent',
                    color: view === id ? '#fff' : 'var(--meta-color)',
                    transition: 'all 0.2s',
                }}>
                <Icon size={12}/> {label}
              </button>);
        })}
          </div>
        </framer_motion_1.motion.div>

        <CategoryFilter_1.default />
      </div>

      {/* ── Results count ── */}
      <div style={{ padding: '0 16px 14px' }}>
        <p style={{ fontFamily: 'DM Mono', fontSize: 9, color: 'var(--meta-color)', letterSpacing: '0.22em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(187,0,255,0.2))' }}/>
          {isLoading ? 'Caricamento...' : "".concat(places.length, " luoghi")}
          <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(187,0,255,0.2), transparent)' }}/>
        </p>
      </div>

      {/* ── MAP VIEW ── */}
      {view === 'map' && (<div style={{ padding: '0 16px 32px' }}>
          <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)', height: '62vh', boxShadow: 'var(--shadow-md)' }}>
            <react_leaflet_1.MapContainer center={[44.4949, 11.3426]} zoom={14} style={{ height: '100%', width: '100%' }}>
              <react_leaflet_1.TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>'/>
              {places.map(function (place) {
                var cat = (0, types_1.getCategoryConfig)(place.category);
                return (<react_leaflet_1.Marker key={place._id} position={[place.location.coordinates.lat, place.location.coordinates.lng]} icon={createIcon(cat.emoji)}>
                    <react_leaflet_1.Popup>
                      <react_router_dom_1.Link to={"/place/".concat(place.slug)} style={{ textDecoration: 'none', display: 'block', minWidth: 160 }}>
                        <div style={{ padding: '6px 2px' }}>
                          <p style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>
                            {place.name}
                          </p>
                          <p style={{ fontSize: 10, color: 'var(--meta-color)', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color, display: 'inline-block' }}/>
                            {place.location.neighborhood || place.location.address}
                          </p>
                          {place.shortDescription && (<p style={{ fontSize: 11, color: 'var(--desc-color)', marginTop: 5, lineHeight: 1.5 }}>
                              {place.shortDescription}
                            </p>)}
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: 10, fontWeight: 700, color: 'var(--accent)' }}>
                            Vedi dettagli →
                          </span>
                        </div>
                      </react_router_dom_1.Link>
                    </react_leaflet_1.Popup>
                  </react_leaflet_1.Marker>);
            })}
            </react_leaflet_1.MapContainer>
          </div>

          {/* Mini list below map */}
          {places.length > 0 && (<div style={{ marginTop: 16 }}>
              <p style={{ fontFamily: 'DM Mono', fontSize: 9, color: 'var(--meta-color)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>
                {places.length} luoghi in questa area
              </p>
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }} className="no-scrollbar">
                {places.slice(0, 8).map(function (place) {
                    var cat = (0, types_1.getCategoryConfig)(place.category);
                    return (<react_router_dom_1.Link key={place._id} to={"/place/".concat(place.slug)} style={{ textDecoration: 'none', flexShrink: 0 }}>
                      <div style={{
                            width: 130, background: 'var(--surface)', border: '1px solid var(--border)',
                            borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.2s',
                        }} onMouseEnter={function (e) { return (e.currentTarget.style.borderColor = 'rgba(187,0,255,0.3)'); }} onMouseLeave={function (e) { return (e.currentTarget.style.borderColor = 'var(--border)'); }}>
                        <div style={{ height: 64, position: 'relative', overflow: 'hidden' }}>
                          <img src={place.media.coverImage || ''} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                          <div className="absolute inset-0 card-overlay"/>
                          <span style={{ position: 'absolute', bottom: 5, left: 7, fontSize: 14 }}>{cat.emoji}</span>
                        </div>
                        <div style={{ padding: '8px 9px' }}>
                          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{place.name}</p>
                          <p style={{ fontSize: 9, color: 'var(--meta-color)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{place.location.neighborhood}</p>
                        </div>
                      </div>
                    </react_router_dom_1.Link>);
                })}
              </div>
            </div>)}
        </div>)}

      {/* ── LIST VIEW ── */}
      {view === 'list' && (<div style={{ padding: '0 16px 32px' }}>
          {isLoading ? (<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {Array.from({ length: 6 }).map(function (_, i) { return <PlaceCardSkeleton_1.default key={i}/>; })}
            </div>) : places.length === 0 ? (<div style={{ textAlign: 'center', padding: '64px 20px' }}>
              <p style={{ fontSize: 40, marginBottom: 12 }}>🗺️</p>
              <p style={{ color: 'var(--text)', fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Nessun posto trovato</p>
              <p style={{ color: 'var(--meta-color)', fontSize: 13 }}>Prova a cambiare categoria o ricerca</p>
            </div>) : (<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {places.map(function (place, i) { return (<PlaceCard_1.default key={place._id} place={place} index={i}/>); })}
            </div>)}
        </div>)}
    </div>);
}
