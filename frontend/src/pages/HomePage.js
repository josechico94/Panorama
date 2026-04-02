"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HomePage;
var react_query_1 = require("@tanstack/react-query");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var react_router_dom_1 = require("react-router-dom");
var api_1 = require("@/lib/api");
var store_1 = require("@/store");
var CategoryFilter_1 = require("@/components/places/CategoryFilter");
var PlaceCard_1 = require("@/components/places/PlaceCard");
var PlaceCardSkeleton_1 = require("@/components/ui/PlaceCardSkeleton");
function HomePage() {
    var _a, _b, _c, _d;
    var _e = (0, store_1.useAppStore)(), activeCategory = _e.activeCategory, city = _e.city, searchQuery = _e.searchQuery;
    var isFiltering = !!activeCategory || !!searchQuery;
    var _f = (0, react_query_1.useQuery)({
        queryKey: ['places', city, activeCategory, searchQuery],
        queryFn: function () {
            var params = { city: city, limit: '20' };
            if (activeCategory)
                params.category = activeCategory;
            if (searchQuery)
                params.search = searchQuery;
            return api_1.placesApi.list(params);
        },
    }), data = _f.data, isLoading = _f.isLoading;
    var _g = (0, react_query_1.useQuery)({
        queryKey: ['places-featured', city],
        queryFn: function () { return api_1.placesApi.featured(); },
        enabled: !activeCategory && !searchQuery,
    }), featuredData = _g.data, featuredLoading = _g.isLoading;
    var offersData = (0, react_query_1.useQuery)({
        queryKey: ['home-offers'],
        queryFn: function () { return api_1.couponsApi.active(); },
    }).data;
    var expData = (0, react_query_1.useQuery)({
        queryKey: ['home-experiences'],
        queryFn: function () { return api_1.experiencesApi.list({ featured: 'true' }); },
    }).data;
    var places = (_a = data === null || data === void 0 ? void 0 : data.data) !== null && _a !== void 0 ? _a : [];
    var featured = (_b = featuredData === null || featuredData === void 0 ? void 0 : featuredData.data) !== null && _b !== void 0 ? _b : [];
    return (<div className="max-w-2xl mx-auto">
      {/* ── Hero Header ── */}
      <div className="px-4 pt-6 pb-5">
        <framer_motion_1.motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="accent-line"/>
            <span className="font-mono-dm text-[9px] tracking-[0.28em] uppercase" style={{ color: 'var(--text-3)' }}>
              Bologna — Italia
            </span>
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(36px,10vw,52px)', fontWeight: 700, color: 'var(--text)', lineHeight: 0.95, marginBottom: 8 }}>
            Cosa fare a<br />
            <em style={{ color: 'var(--accent)', fontStyle: 'italic', fontWeight: 300 }}>Bolo?</em>
          </h1>
          <p style={{ color: 'var(--text-3)', fontSize: 13, fontStyle: 'italic', fontFamily: 'Cormorant Garamond,serif' }}>
            Nella città fatta di archi, faf è la tua porta d'ingresso.
          </p>
        </framer_motion_1.motion.div>
      </div>

      {/* ── Category Filter ── */}
      <framer_motion_1.motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }} className="px-4 mb-6">
        <CategoryFilter_1.default />
      </framer_motion_1.motion.div>

      {/* ── Featured ── */}
      {!isFiltering && (<section className="px-4 mb-8">
          <div className="divider-label mb-4">In evidenza</div>
          {featuredLoading ? (<div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><div className="skeleton rounded-[22px]" style={{ aspectRatio: '16/9' }}/></div>
              <PlaceCardSkeleton_1.default variant="hero"/><PlaceCardSkeleton_1.default variant="hero"/>
            </div>) : featured.length > 0 ? (<div className="grid grid-cols-2 gap-3">
              {featured[0] && (<framer_motion_1.motion.div className="col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <react_router_dom_1.Link to={'/place/' + featured[0].slug} className="block group relative rounded-[22px] overflow-hidden place-card" style={{ aspectRatio: '16/9' }}>
                    <img src={featured[0].media.coverImage || 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=900&q=80'} alt={featured[0].name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
                    <div className="absolute inset-0 hero-overlay"/>
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 4 }}>{featured[0].location.neighborhood}</p>
                      <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 28, fontStyle: 'italic', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>{featured[0].name}</h2>
                    </div>
                    {featured[0].isOpenNow && (<div className="absolute top-4 right-4">
                        <span className="cat-pill" style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', borderColor: 'rgba(34,197,94,0.3)' }}>
                          <span className="open-dot"/> Aperto
                        </span>
                      </div>)}
                  </react_router_dom_1.Link>
                </framer_motion_1.motion.div>)}
              {featured.slice(1, 3).map(function (place, i) { return <PlaceCard_1.default key={place._id} place={place} index={i + 1} variant="hero"/>; })}
            </div>) : null}
        </section>)}

      {/* ── Open Now ── */}
      {!isFiltering && <OpenNowStrip city={city}/>}

      {/* ── Offerte attive ── */}
      {!isFiltering && ((_c = offersData === null || offersData === void 0 ? void 0 : offersData.data) === null || _c === void 0 ? void 0 : _c.length) > 0 && (<section className="mb-8 px-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <lucide_react_1.Tag size={13} style={{ color: 'var(--accent)' }}/>
              <span className="font-mono-dm text-[9px] tracking-[0.25em] uppercase" style={{ color: 'var(--text-3)' }}>Offerte attive</span>
            </div>
            <react_router_dom_1.Link to="/offerte" style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              Vedi tutte <lucide_react_1.ArrowRight size={11}/>
            </react_router_dom_1.Link>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {offersData.data.slice(0, 6).map(function (c) {
                var _a, _b, _c;
                var days = Math.ceil((new Date(c.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                return (<react_router_dom_1.Link key={c._id} to={'/coupon/' + c._id} style={{ textDecoration: 'none', flexShrink: 0 }}>
                  <div style={{ width: 158, background: '#fff', border: '1px solid rgba(187,0,255,0.12)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(187,0,255,0.08)' }}>
                    <div style={{ height: 80, overflow: 'hidden', position: 'relative' }}>
                      <img src={((_b = (_a = c.placeId) === null || _a === void 0 ? void 0 : _a.media) === null || _b === void 0 ? void 0 : _b.coverImage) || 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=300&q=70'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                      <span style={{ position: 'absolute', top: 6, right: 6, background: 'linear-gradient(135deg,#BB00FF,#9000CC)', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 6, fontFamily: 'DM Mono' }}>
                        {c.discountType === 'percentage' ? '-' + c.discountValue + '%' : c.discountType === 'fixed' ? '-€' + c.discountValue : 'OMAGGIO'}
                      </span>
                    </div>
                    <div style={{ padding: '8px 10px' }}>
                      <p style={{ color: 'var(--text-3)', fontSize: 9, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{(_c = c.placeId) === null || _c === void 0 ? void 0 : _c.name}</p>
                      <p style={{ color: 'var(--text)', fontSize: 11, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>{c.title}</p>
                      <p style={{ color: days <= 2 ? '#ef4444' : 'var(--text-3)', fontSize: 9, marginTop: 3 }}>
                        {days === 0 ? 'Scade oggi!' : days === 1 ? 'Scade domani' : (days + 'g rimasti')}
                      </p>
                    </div>
                  </div>
                </react_router_dom_1.Link>);
            })}
          </div>
        </section>)}

      {/* ── Esperienze in evidenza ── */}
      {!isFiltering && ((_d = expData === null || expData === void 0 ? void 0 : expData.data) === null || _d === void 0 ? void 0 : _d.length) > 0 && (<section className="mb-8 px-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <lucide_react_1.Sparkles size={13} style={{ color: 'var(--accent)' }}/>
              <span className="font-mono-dm text-[9px] tracking-[0.25em] uppercase" style={{ color: 'var(--text-3)' }}>Esperienze</span>
            </div>
            <react_router_dom_1.Link to="/esperienze" style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              Scopri <lucide_react_1.ArrowRight size={11}/>
            </react_router_dom_1.Link>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {expData.data.slice(0, 4).map(function (exp) { return (<react_router_dom_1.Link key={exp._id} to={'/esperienze/' + exp.slug} style={{ textDecoration: 'none', flexShrink: 0, width: 200 }}>
                <div style={{ background: '#fff', border: '1px solid rgba(187,0,255,0.12)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(187,0,255,0.08)' }}>
                  <div style={{ height: 100, position: 'relative', background: '#F0EAFF' }}>
                    {exp.coverImage ? <img src={exp.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>{exp.emoji}</div>}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,0,51,0.6) 0%, transparent 60%)' }}/>
                    <span style={{ position: 'absolute', bottom: 6, right: 6, background: 'linear-gradient(135deg,#BB00FF,#9000CC)', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 6, fontFamily: 'DM Mono' }}>~€{exp.estimatedCost}</span>
                  </div>
                  <div style={{ padding: '8px 10px' }}>
                    <p style={{ color: 'var(--text)', fontSize: 12, fontWeight: 700, fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{exp.emoji} {exp.title}</p>
                    <p style={{ color: 'var(--text-3)', fontSize: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>{exp.tagline}</p>
                  </div>
                </div>
              </react_router_dom_1.Link>); })}
          </div>
        </section>)}

      {/* ── Results ── */}
      <section className="px-4 pb-8">
        <div className="divider-label mb-4">{isFiltering ? places.length + ' risultati' : 'Tutti i posti'}</div>
        {isLoading ? (<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{Array.from({ length: 4 }).map(function (_, i) { return <PlaceCardSkeleton_1.default key={i}/>; })}</div>) : places.length === 0 ? (<div className="text-center py-14">
            <p className="text-4xl mb-3">🔍</p>
            <p style={{ color: 'var(--text-2)', fontWeight: 500, fontSize: 14 }}>Nessun posto trovato</p>
          </div>) : (<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{places.map(function (place, i) { return <PlaceCard_1.default key={place._id} place={place} index={i}/>; })}</div>)}
      </section>
    </div>);
}
function OpenNowStrip(_a) {
    var _b;
    var city = _a.city;
    var _c = (0, react_query_1.useQuery)({
        queryKey: ['open-now', city],
        queryFn: function () { return api_1.placesApi.list({ city: city, open_now: 'true', limit: '8' }); },
    }), data = _c.data, isLoading = _c.isLoading;
    var places = (_b = data === null || data === void 0 ? void 0 : data.data) !== null && _b !== void 0 ? _b : [];
    if (!isLoading && places.length === 0)
        return null;
    return (<section className="mb-8">
      <div className="px-4 mb-3 flex items-center gap-2">
        <span className="open-dot"/>
        <span className="font-mono-dm text-[9px] tracking-[0.25em] uppercase" style={{ color: 'var(--text-3)' }}>Aperto adesso</span>
        <lucide_react_1.Zap size={10} style={{ color: 'var(--gold)' }}/>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-4">
        {isLoading ? Array.from({ length: 3 }).map(function (_, i) { return <div key={i} className="skeleton rounded-2xl shrink-0" style={{ width: 140, height: 180 }}/>; }) :
            places.map(function (place, i) { return (<framer_motion_1.motion.div key={place._id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="shrink-0" style={{ width: 140 }}>
              <react_router_dom_1.Link to={'/place/' + place.slug} className="block group relative rounded-2xl overflow-hidden place-card" style={{ height: 180 }}>
                <img src={place.media.coverImage || 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&q=80'} alt={place.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy"/>
                <div className="absolute inset-0 card-overlay"/>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p style={{ fontFamily: 'Cormorant Garamond,serif', color: '#fff', fontSize: 13, fontWeight: 600 }}>{place.name}</p>
                </div>
              </react_router_dom_1.Link>
            </framer_motion_1.motion.div>); })}
      </div>
    </section>);
}
