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
exports.default = SAPlaces;
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var api_1 = require("@/lib/api");
var types_1 = require("@/types");
var lucide_react_1 = require("lucide-react");
var geocode_1 = require("@/lib/geocode");
var card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 };
var field = { width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f0ede8', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'DM Sans,sans-serif' };
var EMPTY = { name: '', city: 'bologna', category: 'eat', shortDescription: '', description: '', tags: '', 'location.address': '', 'location.neighborhood': '', 'location.coordinates.lat': '44.4949', 'location.coordinates.lng': '11.3426', 'contact.phone': '', 'contact.website': '', 'contact.instagram': '', priceRange: '2', coverImage: '' };
function SAPlaces() {
    var _a, _b;
    var _c = (0, react_1.useState)(''), search = _c[0], setSearch = _c[1];
    var _d = (0, react_1.useState)(''), activeCategory = _d[0], setActiveCategory = _d[1];
    var _e = (0, react_1.useState)(''), activeStatus = _e[0], setActiveStatus = _e[1];
    var _f = (0, react_1.useState)(null), editPlace = _f[0], setEditPlace = _f[1];
    var _g = (0, react_1.useState)(false), showForm = _g[0], setShowForm = _g[1];
    var qc = (0, react_query_1.useQueryClient)();
    var params = {};
    if (search)
        params.search = search;
    if (activeCategory)
        params.category = activeCategory;
    if (activeStatus !== '')
        params.active = activeStatus;
    var _h = (0, react_query_1.useQuery)({
        queryKey: ['sa-places', search, activeCategory, activeStatus],
        queryFn: function () { return api_1.superAdminApi.listPlaces(Object.keys(params).length ? params : undefined); },
    }), data = _h.data, isLoading = _h.isLoading;
    var deleteMutation = (0, react_query_1.useMutation)({
        mutationFn: api_1.superAdminApi.deletePlace,
        onSuccess: function () { return qc.invalidateQueries({ queryKey: ['sa-places'] }); },
    });
    var toggleMutation = (0, react_query_1.useMutation)({
        mutationFn: function (_a) {
            var id = _a.id, active = _a.active;
            return api_1.superAdminApi.updatePlace(id, { 'meta.active': active });
        },
        onSuccess: function () { return qc.invalidateQueries({ queryKey: ['sa-places'] }); },
    });
    var places = (_a = data === null || data === void 0 ? void 0 : data.data) !== null && _a !== void 0 ? _a : [];
    return (<div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 28, fontWeight: 700, color: '#f0ede8' }}>Luoghi</h1>
          <p style={{ color: 'rgba(240,237,232,0.35)', fontSize: 12, marginTop: 2 }}>{(_b = data === null || data === void 0 ? void 0 : data.total) !== null && _b !== void 0 ? _b : 0} totali</p>
        </div>
        <button onClick={function () { setEditPlace(null); setShowForm(true); }} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 12,
            background: 'linear-gradient(135deg,#e8622a,#f0884a)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
        }}>
          <lucide_react_1.Plus size={14}/> Nuovo posto
        </button>
      </div>

      <div style={{ position: 'relative', marginBottom: 16 }}>
        <lucide_react_1.Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,237,232,0.3)' }}/>
        <input value={search} onChange={function (e) { return setSearch(e.target.value); }} placeholder="Cerca per nome..." style={__assign(__assign({}, field), { paddingLeft: 36 })}/>
      </div>

      {/* ── Category + Status filters ── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={function () { return setActiveCategory(''); }} style={{
            padding: '5px 14px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700,
            background: activeCategory === '' ? '#f0ede8' : 'rgba(255,255,255,0.05)',
            color: activeCategory === '' ? '#07070f' : 'rgba(240,237,232,0.5)',
            transition: 'all 0.15s',
        }}>Tutti</button>
        {types_1.CATEGORIES.map(function (cat) { return (<button key={cat.id} onClick={function () { return setActiveCategory(activeCategory === cat.id ? '' : cat.id); }} style={{
                padding: '5px 12px', borderRadius: 100, cursor: 'pointer', fontSize: 11, fontWeight: 700,
                border: "1px solid ".concat(activeCategory === cat.id ? cat.color : 'transparent'),
                background: activeCategory === cat.id ? "".concat(cat.color, "20") : 'rgba(255,255,255,0.04)',
                color: activeCategory === cat.id ? cat.color : 'rgba(240,237,232,0.45)',
                transition: 'all 0.15s',
            }}>{cat.emoji} {cat.label}</button>); })}

        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)' }}/>

        {[
            { value: '', label: 'Tutti gli stati' },
            { value: 'true', label: '✅ Attivi' },
            { value: 'false', label: '👁 Nascosti' },
        ].map(function (_a) {
            var value = _a.value, label = _a.label;
            return (<button key={value} onClick={function () { return setActiveStatus(value); }} style={{
                    padding: '5px 12px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700,
                    background: activeStatus === value ? 'rgba(232,98,42,0.15)' : 'rgba(255,255,255,0.04)',
                    color: activeStatus === value ? '#e8622a' : 'rgba(240,237,232,0.45)',
                    transition: 'all 0.15s',
                }}>{label}</button>);
        })}

        {(activeCategory || activeStatus) && (<button onClick={function () { setActiveCategory(''); setActiveStatus(''); }} style={{
                padding: '5px 12px', borderRadius: 100, cursor: 'pointer', fontSize: 11, fontWeight: 700,
                border: '1px solid rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.08)', color: '#f87171',
            }}>✕ Rimuovi filtri</button>)}
      </div>

      <div style={__assign(__assign({}, card), { overflow: 'hidden' })}>
        {isLoading ? (<div style={{ padding: 32, textAlign: 'center', color: 'rgba(240,237,232,0.3)' }}>Caricamento...</div>) : (<table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Immagine', 'Nome', 'Categoria', 'Città', 'Stato', ''].map(function (h) { return (<th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'rgba(240,237,232,0.3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{h}</th>); })}
              </tr>
            </thead>
            <tbody>
              {places.map(function (place) {
                var _a, _b, _c, _d, _e, _f, _g;
                var cat = (0, types_1.getCategoryConfig)(place.category);
                return (<tr key={place._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '8px 16px' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', background: 'rgba(255,255,255,0.05)', flexShrink: 0 }}>
                        {((_a = place.media) === null || _a === void 0 ? void 0 : _a.coverImage) ? (<img src={place.media.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>) : (<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{cat.emoji}</div>)}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {((_b = place.meta) === null || _b === void 0 ? void 0 : _b.featured) && <lucide_react_1.Star size={11} color="#f59e0b"/>}
                        <span style={{ color: '#f0ede8', fontSize: 13, fontWeight: 600 }}>{place.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: cat.color, background: "".concat(cat.color, "18"), border: "1px solid ".concat(cat.color, "30"), borderRadius: 100, padding: '2px 8px' }}>
                        {cat.emoji} {cat.label}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'rgba(240,237,232,0.4)', fontSize: 12 }}>{place.city}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 100, background: ((_c = place.meta) === null || _c === void 0 ? void 0 : _c.active) ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)', color: ((_d = place.meta) === null || _d === void 0 ? void 0 : _d.active) ? '#4ade80' : 'rgba(240,237,232,0.3)', border: "1px solid ".concat(((_e = place.meta) === null || _e === void 0 ? void 0 : _e.active) ? 'rgba(34,197,94,0.25)' : 'transparent') }}>
                        {((_f = place.meta) === null || _f === void 0 ? void 0 : _f.active) ? 'Attivo' : 'Nascosto'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                        <ActionBtn icon={((_g = place.meta) === null || _g === void 0 ? void 0 : _g.active) ? lucide_react_1.EyeOff : lucide_react_1.Eye} onClick={function () { var _a; return toggleMutation.mutate({ id: place._id, active: !((_a = place.meta) === null || _a === void 0 ? void 0 : _a.active) }); }}/>
                        <ActionBtn icon={lucide_react_1.Pencil} onClick={function () { setEditPlace(place); setShowForm(true); }} color="#3b82f6"/>
                        <ActionBtn icon={lucide_react_1.Trash2} onClick={function () { return confirm("Eliminare \"".concat(place.name, "\"?")) && deleteMutation.mutate(place._id); }} color="#f87171"/>
                      </div>
                    </td>
                  </tr>);
            })}
            </tbody>
          </table>)}
      </div>

      {showForm && <PlaceFormModal place={editPlace} onClose={function () { return setShowForm(false); }}/>}
    </div>);
}
function ActionBtn(_a) {
    var Icon = _a.icon, onClick = _a.onClick, _b = _a.color, color = _b === void 0 ? 'rgba(240,237,232,0.35)' : _b;
    return (<button onClick={onClick} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: color, transition: 'all 0.15s' }} onMouseEnter={function (e) { return (e.currentTarget.style.background = 'rgba(255,255,255,0.06)'); }} onMouseLeave={function (e) { return (e.currentTarget.style.background = 'transparent'); }}>
      <Icon size={14}/>
    </button>);
}
function ImageUploader(_a) {
    var _this = this;
    var value = _a.value, onChange = _a.onChange;
    var _b = (0, react_1.useState)(false), uploading = _b[0], setUploading = _b[1];
    var _c = (0, react_1.useState)('url'), uploadMode = _c[0], setUploadMode = _c[1];
    var _d = (0, react_1.useState)(value || ''), urlInput = _d[0], setUrlInput = _d[1];
    var _e = (0, react_1.useState)(''), error = _e[0], setError = _e[1];
    var fileRef = (0, react_1.useRef)(null);
    var handleFile = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var file, url, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    file = (_b = e.target.files) === null || _b === void 0 ? void 0 : _b[0];
                    if (!file)
                        return [2 /*return*/];
                    if (file.size > 10 * 1024 * 1024) {
                        setError('File troppo grande (max 10MB)');
                        return [2 /*return*/];
                    }
                    setUploading(true);
                    setError('');
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, api_1.superAdminApi.upload(file)];
                case 2:
                    url = (_c.sent()).url;
                    onChange(url);
                    setUrlInput(url);
                    return [3 /*break*/, 5];
                case 3:
                    _a = _c.sent();
                    setError('Upload fallito. Riprova o usa un URL.');
                    return [3 /*break*/, 5];
                case 4:
                    setUploading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleUrlConfirm = function () {
        if (urlInput.startsWith('http'))
            onChange(urlInput);
        else
            setError('URL non valido — deve iniziare con https://');
    };
    return (<div>
      <label style={{ display: 'block', fontSize: 10, color: 'rgba(240,237,232,0.4)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        Immagine copertina
      </label>

      {/* Preview */}
      {value && (<div style={{ position: 'relative', marginBottom: 10, borderRadius: 12, overflow: 'hidden', height: 140 }}>
          <img src={value} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
          <button onClick={function () { onChange(''); setUrlInput(''); }} style={{ position: 'absolute', top: 8, right: 8, width: 26, height: 26, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(0,0,0,0.7)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <lucide_react_1.X size={13}/>
          </button>
        </div>)}

      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 8, background: 'rgba(255,255,255,0.04)', padding: 3, borderRadius: 8 }}>
        {['url', 'file'].map(function (m) { return (<button key={m} onClick={function () { setUploadMode(m); setError(''); }} style={{
                flex: 1, padding: '6px', borderRadius: 6, border: 'none', cursor: 'pointer',
                background: uploadMode === m ? 'rgba(232,98,42,0.2)' : 'transparent',
                color: uploadMode === m ? '#e8622a' : 'rgba(240,237,232,0.4)',
                fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            }}>
            {m === 'url' ? <><lucide_react_1.Link size={11}/> URL</> : <><lucide_react_1.Upload size={11}/> Carica file</>}
          </button>); })}
      </div>

      {uploadMode === 'url' ? (<div style={{ display: 'flex', gap: 6 }}>
          <input value={urlInput} onChange={function (e) { return setUrlInput(e.target.value); }} onKeyDown={function (e) { return e.key === 'Enter' && handleUrlConfirm(); }} placeholder="https://images.unsplash.com/..." style={__assign(__assign({}, field), { flex: 1 })} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>
          <button onClick={handleUrlConfirm} style={{
                padding: '0 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: 'rgba(232,98,42,0.2)', color: '#e8622a', fontSize: 12, fontWeight: 700, flexShrink: 0,
            }}>
            OK
          </button>
        </div>) : (<div>
          <input ref={fileRef} type="file" accept="image/*,image/gif" onChange={handleFile} style={{ display: 'none' }}/>
          <button onClick={function () { var _a; return (_a = fileRef.current) === null || _a === void 0 ? void 0 : _a.click(); }} disabled={uploading} style={{
                width: '100%', padding: '12px', borderRadius: 10, border: '2px dashed rgba(232,98,42,0.3)',
                background: 'rgba(232,98,42,0.05)', color: uploading ? '#e8622a' : 'rgba(240,237,232,0.5)',
                cursor: uploading ? 'default' : 'pointer', fontSize: 13,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s',
            }} onMouseEnter={function (e) { return !uploading && (e.currentTarget.style.borderColor = 'rgba(232,98,42,0.6)'); }} onMouseLeave={function (e) { return e.currentTarget.style.borderColor = 'rgba(232,98,42,0.3)'; }}>
            {uploading ? (<><lucide_react_1.Loader size={14} style={{ animation: 'spin 1s linear infinite' }}/> Caricamento...</>) : (<><lucide_react_1.Upload size={14}/> Clicca per caricare (JPG, PNG, GIF — max 10MB)</>)}
          </button>
        </div>)}

      {error && <p style={{ color: '#f87171', fontSize: 11, marginTop: 5 }}>{error}</p>}
      <style>{"@keyframes spin { to { transform: rotate(360deg) } }"}</style>
    </div>);
}
function AddressField(_a) {
    var _this = this;
    var value = _a.value, city = _a.city, onChange = _a.onChange, onGeocode = _a.onGeocode;
    var _b = (0, react_1.useState)(false), geocoding = _b[0], setGeocoding = _b[1];
    var _c = (0, react_1.useState)('idle'), status = _c[0], setStatus = _c[1];
    var handleGeocode = function () { return __awaiter(_this, void 0, void 0, function () {
        var coords;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!value.trim())
                        return [2 /*return*/];
                    setGeocoding(true);
                    setStatus('idle');
                    return [4 /*yield*/, (0, geocode_1.geocodeAddress)(value, city)];
                case 1:
                    coords = _a.sent();
                    setGeocoding(false);
                    if (coords) {
                        onGeocode(coords.lat, coords.lng);
                        setStatus('ok');
                        setTimeout(function () { return setStatus('idle'); }, 2000);
                    }
                    else {
                        setStatus('error');
                        setTimeout(function () { return setStatus('idle'); }, 3000);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    return (<div>
      <label style={{ display: 'block', fontSize: 10, color: 'rgba(240,237,232,0.4)', marginBottom: 5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        Indirizzo
      </label>
      <div style={{ display: 'flex', gap: 6 }}>
        <input value={value} onChange={function (e) { onChange(e.target.value); setStatus('idle'); }} placeholder="Via Roma 1, Bologna" style={__assign(__assign({}, field), { flex: 1 })} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }} onKeyDown={function (e) { return e.key === 'Enter' && handleGeocode(); }}/>
        <button onClick={handleGeocode} disabled={geocoding || !value.trim()} title="Trova coordinate dall'indirizzo" style={{
            padding: '0 12px', borderRadius: 10, border: 'none', cursor: 'pointer', flexShrink: 0,
            background: status === 'ok' ? 'rgba(34,197,94,0.2)' : status === 'error' ? 'rgba(248,113,113,0.15)' : 'rgba(232,98,42,0.15)',
            color: status === 'ok' ? '#4ade80' : status === 'error' ? '#f87171' : '#e8622a',
            fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4,
            opacity: geocoding || !value.trim() ? 0.5 : 1, transition: 'all 0.2s',
        }}>
          {geocoding ? (<lucide_react_1.Loader size={13} style={{ animation: 'spin 1s linear infinite' }}/>) : status === 'ok' ? (<><lucide_react_1.Check size={13}/> OK</>) : status === 'error' ? (<>✗ Non trovato</>) : (<><lucide_react_1.MapPin size={13}/> Geocodifica</>)}
        </button>
      </div>
      {status === 'error' && (<p style={{ fontSize: 10, color: '#f87171', marginTop: 4 }}>
          Indirizzo non trovato. Verifica e riprova, o inserisci le coordinate manualmente.
        </p>)}
      {status === 'ok' && (<p style={{ fontSize: 10, color: '#4ade80', marginTop: 4 }}>
          ✓ Coordinate aggiornate automaticamente
        </p>)}
    </div>);
}
function PlaceFormModal(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    var place = _a.place, onClose = _a.onClose;
    var qc = (0, react_query_1.useQueryClient)();
    var isEdit = !!place;
    // Use ref to always have latest coords in mutationFn closure
    var coordsRef = (0, react_1.useRef)(null);
    var _m = (0, react_1.useState)(place ? {
        name: place.name, city: place.city, category: place.category,
        shortDescription: place.shortDescription || '', description: place.description || '',
        tags: (place.tags || []).join(', '),
        'location.address': ((_b = place.location) === null || _b === void 0 ? void 0 : _b.address) || '',
        'location.neighborhood': ((_c = place.location) === null || _c === void 0 ? void 0 : _c.neighborhood) || '',
        'location.coordinates.lat': String(((_e = (_d = place.location) === null || _d === void 0 ? void 0 : _d.coordinates) === null || _e === void 0 ? void 0 : _e.lat) || 44.4949),
        'location.coordinates.lng': String(((_g = (_f = place.location) === null || _f === void 0 ? void 0 : _f.coordinates) === null || _g === void 0 ? void 0 : _g.lng) || 11.3426),
        'contact.phone': ((_h = place.contact) === null || _h === void 0 ? void 0 : _h.phone) || '',
        'contact.website': ((_j = place.contact) === null || _j === void 0 ? void 0 : _j.website) || '',
        'contact.instagram': ((_k = place.contact) === null || _k === void 0 ? void 0 : _k.instagram) || '',
        priceRange: String(place.priceRange || 2),
        coverImage: ((_l = place.media) === null || _l === void 0 ? void 0 : _l.coverImage) || '',
    } : __assign({}, EMPTY)), form = _m[0], setForm = _m[1];
    var _o = (0, react_1.useState)(''), error = _o[0], setError = _o[1];
    var set = function (k, v) { return setForm(function (f) {
        var _a;
        return (__assign(__assign({}, f), (_a = {}, _a[k] = v, _a)));
    }); };
    var mutation = (0, react_query_1.useMutation)({
        mutationFn: function () {
            var _a, _b, _c, _d, _e;
            var payload = {
                name: form.name, city: form.city, category: form.category,
                shortDescription: form.shortDescription, description: form.description,
                tags: form.tags.split(',').map(function (t) { return t.trim(); }).filter(Boolean),
                location: {
                    address: form['location.address'],
                    neighborhood: form['location.neighborhood'],
                    coordinates: {
                        lat: parseFloat((_b = (_a = coordsRef.current) === null || _a === void 0 ? void 0 : _a.lat) !== null && _b !== void 0 ? _b : form['location.coordinates.lat']),
                        lng: parseFloat((_d = (_c = coordsRef.current) === null || _c === void 0 ? void 0 : _c.lng) !== null && _d !== void 0 ? _d : form['location.coordinates.lng']),
                    }
                },
                contact: {
                    phone: form['contact.phone'] || undefined,
                    website: form['contact.website'] || undefined,
                    instagram: form['contact.instagram'] || undefined
                },
                priceRange: parseInt(form.priceRange),
                media: { coverImage: form.coverImage || '', gallery: ((_e = place === null || place === void 0 ? void 0 : place.media) === null || _e === void 0 ? void 0 : _e.gallery) || [] },
            };
            return isEdit ? api_1.superAdminApi.updatePlace(place._id, payload) : api_1.superAdminApi.createPlace(payload);
        },
        onSuccess: function () { qc.invalidateQueries({ queryKey: ['sa-places'] }); onClose(); },
        onError: function (e) { var _a, _b; return setError(((_b = (_a = e.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || 'Errore'); },
    });
    return (<div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={onClose}>
      <div style={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 24, width: '100%', maxWidth: 580, maxHeight: '88vh', overflowY: 'auto' }} onClick={function (e) { return e.stopPropagation(); }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ color: '#f0ede8', fontSize: 18, fontWeight: 700 }}>{isEdit ? 'Modifica' : 'Nuovo'} posto</h2>
          <button onClick={onClose} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', color: 'rgba(240,237,232,0.5)' }}><lucide_react_1.X size={16}/></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Image uploader */}
          <ImageUploader value={form.coverImage} onChange={function (url) { return set('coverImage', url); }}/>

          {/* Address with geocoding */}
          <AddressField value={form['location.address'] || ''} city={form.city || 'bologna'} onChange={function (v) { return set('location.address', v); }} onGeocode={function (lat, lng) {
            var latStr = String(lat.toFixed(6));
            var lngStr = String(lng.toFixed(6));
            coordsRef.current = { lat: latStr, lng: lngStr };
            setForm(function (f) { return (__assign(__assign({}, f), { 'location.coordinates.lat': latStr, 'location.coordinates.lng': lngStr })); });
        }}/>

          {/* Coordinate display */}
          {form['location.coordinates.lat'] !== '44.4949' && (<div style={{ padding: '8px 12px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <lucide_react_1.MapPin size={11} color="#4ade80"/>
              <span style={{ fontSize: 11, color: 'rgba(240,237,232,0.5)', fontFamily: 'DM Mono,monospace' }}>
                {parseFloat(form['location.coordinates.lat']).toFixed(4)}, {parseFloat(form['location.coordinates.lng']).toFixed(4)}
              </span>
            </div>)}

          {/* Text fields */}
          {[
            { k: 'name', label: 'Nome *', ph: 'Nome del posto' },
            { k: 'shortDescription', label: 'Descrizione breve', ph: 'Max 160 caratteri' },
            { k: 'tags', label: 'Tag (virgola)', ph: 'aperitivo, vista, centro' },
            { k: 'location.neighborhood', label: 'Quartiere', ph: 'Centro Storico' },
            { k: 'contact.phone', label: 'Telefono *', ph: '+39 051...' },
            { k: 'contact.website', label: 'Sito web', ph: 'https://...' },
            { k: 'contact.instagram', label: 'Instagram', ph: 'handle senza @' },
        ].map(function (_a) {
            var k = _a.k, label = _a.label, ph = _a.ph;
            return (<div key={k}>
              <label style={{ display: 'block', fontSize: 10, color: 'rgba(240,237,232,0.4)', marginBottom: 5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</label>
              <input value={form[k] || ''} onChange={function (e) { return set(k, e.target.value); }} placeholder={ph} style={field} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>
            </div>);
        })}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, color: 'rgba(240,237,232,0.4)', marginBottom: 5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Categoria</label>
              <select value={form.category} onChange={function (e) { return set('category', e.target.value); }} style={__assign(__assign({}, field), { cursor: 'pointer' })}>
                {types_1.CATEGORIES.map(function (c) { return <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>; })}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, color: 'rgba(240,237,232,0.4)', marginBottom: 5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Prezzo</label>
              <select value={form.priceRange} onChange={function (e) { return set('priceRange', e.target.value); }} style={__assign(__assign({}, field), { cursor: 'pointer' })}>
                <option value="1">€ Economico</option>
                <option value="2">€€ Medio</option>
                <option value="3">€€€ Alto</option>
                <option value="4">€€€€ Luxury</option>
              </select>
            </div>
          </div>

          {error && <p style={{ color: '#f87171', fontSize: 12, textAlign: 'center', background: 'rgba(248,113,113,0.1)', borderRadius: 8, padding: '8px 12px' }}>{error}</p>}

          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(240,237,232,0.5)', cursor: 'pointer', fontSize: 13 }}>Annulla</button>
            {(!form.name || !form['location.address'] || !form['contact.phone']) && (<p style={{ fontSize: 11, color: '#fbbf24', background: 'rgba(251,191,36,0.08)', borderRadius: 8, padding: '7px 12px', textAlign: 'center' }}>
                ⚠ Nome, indirizzo e telefono sono obbligatori
              </p>)}
            <button onClick={function () { return mutation.mutate(); }} disabled={mutation.isPending || !form.name || !form['location.address'] || !form['contact.phone']} style={{ flex: 1, padding: '11px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#e8622a,#f0884a)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, opacity: mutation.isPending || !form.name || !form['location.address'] || !form['contact.phone'] ? 0.5 : 1 }}>
              {mutation.isPending ? 'Salvataggio...' : isEdit ? 'Salva' : 'Crea'}
            </button>
          </div>
        </div>
      </div>
    </div>);
}
