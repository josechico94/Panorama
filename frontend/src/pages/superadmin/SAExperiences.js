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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SAExperiences;
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var api_1 = require("@/lib/api");
var lucide_react_1 = require("lucide-react");
var react_2 = require("react");
var C = {
    card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' },
    field: { width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f0ede8', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'DM Sans,sans-serif', transition: 'border-color 0.2s' },
    label: { display: 'block', fontSize: 10, fontWeight: 700, color: 'rgba(240,237,232,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.12em' },
};
var EXP_CATEGORIES = [
    { id: 'romantica', label: 'Romantica', emoji: '🕯️' },
    { id: 'colazione', label: 'Colazione', emoji: '☕' },
    { id: 'pasta', label: 'Pasta & Tradizione', emoji: '🍝' },
    { id: 'aperitivo', label: 'Aperitivo + Cena', emoji: '🍹' },
    { id: 'budget', label: 'Budget', emoji: '💶' },
    { id: 'serata', label: 'Serata', emoji: '🌙' },
    { id: 'cultura', label: 'Cultura', emoji: '🏛️' },
    { id: 'sport', label: 'Sport & Natura', emoji: '⚽' },
    { id: 'famiglia', label: 'Famiglia', emoji: '👨‍👩‍👧' },
];
function SAExperiences() {
    var _a;
    var _b = (0, react_1.useState)(''), search = _b[0], setSearch = _b[1];
    var _c = (0, react_1.useState)(false), showForm = _c[0], setShowForm = _c[1];
    var _d = (0, react_1.useState)(null), editExp = _d[0], setEditExp = _d[1];
    var qc = (0, react_query_1.useQueryClient)();
    var _e = (0, react_query_1.useQuery)({
        queryKey: ['sa-experiences', search],
        queryFn: function () { return api_1.experiencesApi.list({}); },
    }), data = _e.data, isLoading = _e.isLoading;
    var deleteMutation = (0, react_query_1.useMutation)({
        mutationFn: api_1.experiencesApi.delete,
        onSuccess: function () { return qc.invalidateQueries({ queryKey: ['sa-experiences'] }); },
    });
    var experiences = ((_a = data === null || data === void 0 ? void 0 : data.data) !== null && _a !== void 0 ? _a : []).filter(function (e) {
        return !search || e.title.toLowerCase().includes(search.toLowerCase());
    });
    return (<div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 28, fontWeight: 700, color: '#f0ede8' }}>Esperienze</h1>
          <p style={{ color: 'rgba(240,237,232,0.35)', fontSize: 12, marginTop: 2 }}>{experiences.length} itinerari</p>
        </div>
        <button onClick={function () { setEditExp(null); setShowForm(true); }} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 12,
            background: 'linear-gradient(135deg,#e8622a,#f0884a)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
        }}>
          <lucide_react_1.Plus size={14}/> Nuova esperienza
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <lucide_react_1.Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,237,232,0.3)' }}/>
        <input value={search} onChange={function (e) { return setSearch(e.target.value); }} placeholder="Cerca per titolo..." style={__assign(__assign({}, C.field), { paddingLeft: 36 })}/>
      </div>

      {/* List */}
      <div style={C.card}>
        {isLoading ? (<div style={{ padding: 32, textAlign: 'center', color: 'rgba(240,237,232,0.3)' }}>Caricamento...</div>) : experiences.length === 0 ? (<div style={{ padding: 48, textAlign: 'center', color: 'rgba(240,237,232,0.3)' }}>
            <span style={{ fontSize: 32, display: 'block', marginBottom: 12 }}>✨</span>
            <p>Nessuna esperienza. Crea la prima!</p>
          </div>) : (<table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['', 'Titolo', 'Categoria', 'Costo', 'Tappe', 'Stato', ''].map(function (h) { return (<th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'rgba(240,237,232,0.3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{h}</th>); })}
              </tr>
            </thead>
            <tbody>
              {experiences.map(function (exp) {
                var _a;
                var cat = EXP_CATEGORIES.find(function (c) { return c.id === exp.category; });
                return (<tr key={exp._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '8px 16px' }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
                        {exp.coverImage
                        ? <img src={exp.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{exp.emoji}</div>}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ color: '#f0ede8', fontSize: 13, fontWeight: 700 }}>{exp.title}</p>
                      <p style={{ color: 'rgba(240,237,232,0.35)', fontSize: 11 }}>{exp.tagline}</p>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 11, color: 'rgba(240,237,232,0.5)' }}>{cat === null || cat === void 0 ? void 0 : cat.emoji} {(cat === null || cat === void 0 ? void 0 : cat.label) || exp.category}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#e8622a', fontSize: 13, fontWeight: 700, fontFamily: 'DM Mono,monospace' }}>
                      ~€{exp.estimatedCost}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'rgba(240,237,232,0.45)', fontSize: 12, textAlign: 'center' }}>
                      {((_a = exp.stops) === null || _a === void 0 ? void 0 : _a.length) || 0}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 100, background: exp.active ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)', color: exp.active ? '#4ade80' : 'rgba(240,237,232,0.3)' }}>
                        {exp.active ? 'Attiva' : 'Nascosta'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <button onClick={function () { setEditExp(exp); setShowForm(true); }} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: '#3b82f6' }} onMouseEnter={function (e) { return e.currentTarget.style.background = 'rgba(59,130,246,0.1)'; }} onMouseLeave={function (e) { return e.currentTarget.style.background = 'transparent'; }}>
                          <lucide_react_1.Pencil size={14}/>
                        </button>
                        <button onClick={function () { return confirm("Eliminare \"".concat(exp.title, "\"?")) && deleteMutation.mutate(exp._id); }} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: 'rgba(240,237,232,0.3)' }} onMouseEnter={function (e) { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; }} onMouseLeave={function (e) { e.currentTarget.style.color = 'rgba(240,237,232,0.3)'; e.currentTarget.style.background = 'transparent'; }}>
                          <lucide_react_1.Trash2 size={14}/>
                        </button>
                      </div>
                    </td>
                  </tr>);
            })}
            </tbody>
          </table>)}
      </div>

      {showForm && (<ExperienceFormModal exp={editExp} onClose={function () { setShowForm(false); setEditExp(null); }}/>)}
    </div>);
}
function ExperienceFormModal(_a) {
    var _this = this;
    var _b, _c;
    var exp = _a.exp, onClose = _a.onClose;
    var qc = (0, react_query_1.useQueryClient)();
    var isEdit = !!exp;
    var fileRef = (0, react_2.useRef)(null);
    var _d = (0, react_1.useState)(false), uploading = _d[0], setUploading = _d[1];
    var _e = (0, react_1.useState)('url'), imgMode = _e[0], setImgMode = _e[1];
    var _f = (0, react_1.useState)(exp ? {
        title: exp.title || '',
        emoji: exp.emoji || '✨',
        tagline: exp.tagline || '',
        description: exp.description || '',
        category: exp.category || 'romantica',
        estimatedCost: String(exp.estimatedCost || 0),
        duration: String(exp.duration || 120),
        coverImage: exp.coverImage || '',
        videoUrl: exp.videoUrl || '',
        featured: exp.featured || false,
        active: exp.active !== false,
        tags: (exp.tags || []).join(', '),
        stops: ((_b = exp.stops) === null || _b === void 0 ? void 0 : _b.map(function (s) {
            var _a, _b;
            return ({
                placeId: ((_a = s.placeId) === null || _a === void 0 ? void 0 : _a._id) || s.placeId,
                placeName: ((_b = s.placeId) === null || _b === void 0 ? void 0 : _b.name) || '',
                order: s.order,
                note: s.note || '',
                duration: String(s.duration || 60),
            });
        })) || [],
    } : {
        title: '', emoji: '✨', tagline: '', description: '',
        category: 'romantica', estimatedCost: '0', duration: '120',
        coverImage: '', videoUrl: '', featured: false, active: true,
        tags: '', stops: [],
    }), form = _f[0], setForm = _f[1];
    var _g = (0, react_1.useState)(''), error = _g[0], setError = _g[1];
    var _h = (0, react_1.useState)(''), stopSearch = _h[0], setStopSearch = _h[1];
    var set = function (k, v) { return setForm(function (f) {
        var _a;
        return (__assign(__assign({}, f), (_a = {}, _a[k] = v, _a)));
    }); };
    // Search places for stops
    var placesData = (0, react_query_1.useQuery)({
        queryKey: ['sa-places-for-exp', stopSearch],
        queryFn: function () { return api_1.superAdminApi.listPlaces(stopSearch ? { search: stopSearch, limit: 8 } : { limit: 8 }); },
        enabled: stopSearch.length > 1,
    }).data;
    var addStop = function (place) {
        var exists = form.stops.find(function (s) { return s.placeId === place._id; });
        if (exists)
            return;
        set('stops', __spreadArray(__spreadArray([], form.stops, true), [{
                placeId: place._id,
                placeName: place.name,
                order: form.stops.length + 1,
                note: '',
                duration: '60',
            }], false));
        setStopSearch('');
    };
    var removeStop = function (idx) {
        set('stops', form.stops.filter(function (_, i) { return i !== idx; }).map(function (s, i) { return (__assign(__assign({}, s), { order: i + 1 })); }));
    };
    var updateStop = function (idx, k, v) {
        var _a;
        var stops = __spreadArray([], form.stops, true);
        stops[idx] = __assign(__assign({}, stops[idx]), (_a = {}, _a[k] = v, _a));
        set('stops', stops);
    };
    var handleImageUpload = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var file, url, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    file = (_b = e.target.files) === null || _b === void 0 ? void 0 : _b[0];
                    if (!file)
                        return [2 /*return*/];
                    setUploading(true);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, api_1.superAdminApi.upload(file)];
                case 2:
                    url = (_c.sent()).url;
                    set('coverImage', url);
                    return [3 /*break*/, 4];
                case 3:
                    _a = _c.sent();
                    setError('Upload fallito');
                    return [3 /*break*/, 4];
                case 4:
                    setUploading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var mutation = (0, react_query_1.useMutation)({
        mutationFn: function () {
            var payload = {
                title: form.title,
                emoji: form.emoji,
                tagline: form.tagline,
                description: form.description,
                category: form.category,
                estimatedCost: parseInt(form.estimatedCost) || 0,
                duration: parseInt(form.duration) || 120,
                coverImage: form.coverImage,
                videoUrl: form.videoUrl,
                featured: form.featured,
                active: form.active,
                tags: form.tags.split(',').map(function (t) { return t.trim(); }).filter(Boolean),
                city: 'bologna',
                stops: form.stops.map(function (s, i) { return ({
                    placeId: s.placeId,
                    order: i + 1,
                    note: s.note,
                    duration: parseInt(s.duration) || 60,
                }); }),
            };
            return isEdit ? api_1.experiencesApi.update(exp._id, payload) : api_1.experiencesApi.create(payload);
        },
        onSuccess: function () { qc.invalidateQueries({ queryKey: ['sa-experiences'] }); qc.invalidateQueries({ queryKey: ['home-experiences'] }); onClose(); },
        onError: function (e) { var _a, _b; return setError(((_b = (_a = e.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || 'Errore'); },
    });
    return (<div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={onClose}>
      <div style={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 24, width: '100%', maxWidth: 640, maxHeight: '90vh', overflowY: 'auto' }} onClick={function (e) { return e.stopPropagation(); }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ color: '#f0ede8', fontSize: 18, fontWeight: 700 }}>{isEdit ? 'Modifica' : 'Nuova'} esperienza</h2>
          <button onClick={onClose} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', color: 'rgba(240,237,232,0.5)' }}><lucide_react_1.X size={15}/></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Cover image */}
          <div>
            <label style={C.label}>Immagine copertina</label>
            {form.coverImage && (<div style={{ position: 'relative', height: 120, borderRadius: 12, overflow: 'hidden', marginBottom: 8 }}>
                <img src={form.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                <button onClick={function () { return set('coverImage', ''); }} style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: 6, border: 'none', cursor: 'pointer', background: 'rgba(0,0,0,0.7)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><lucide_react_1.X size={12}/></button>
              </div>)}
            <div style={{ display: 'flex', gap: 4, marginBottom: 6, background: 'rgba(255,255,255,0.04)', padding: 3, borderRadius: 8 }}>
              {['url', 'file'].map(function (m) { return (<button key={m} onClick={function () { return setImgMode(m); }} style={{ flex: 1, padding: '5px', borderRadius: 6, border: 'none', cursor: 'pointer', background: imgMode === m ? 'rgba(232,98,42,0.2)' : 'transparent', color: imgMode === m ? '#e8622a' : 'rgba(240,237,232,0.4)', fontSize: 11, fontWeight: 600 }}>
                  {m === 'url' ? '🔗 URL' : '📁 Upload file'}
                </button>); })}
            </div>
            {imgMode === 'url' ? (<input value={form.coverImage} onChange={function (e) { return set('coverImage', e.target.value); }} placeholder="https://..." style={C.field} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>) : (<>
                <input ref={fileRef} type="file" accept="image/*,video/mp4" onChange={handleImageUpload} style={{ display: 'none' }}/>
                <button onClick={function () { var _a; return (_a = fileRef.current) === null || _a === void 0 ? void 0 : _a.click(); }} disabled={uploading} style={{ width: '100%', padding: '10px', borderRadius: 10, border: '2px dashed rgba(232,98,42,0.3)', background: 'rgba(232,98,42,0.05)', color: 'rgba(240,237,232,0.5)', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  {uploading ? <><lucide_react_1.Loader size={13} style={{ animation: 'spin 1s linear infinite' }}/> Caricamento...</> : <><lucide_react_1.Upload size={13}/> Carica immagine o GIF (max 10MB)</>}
                </button>
              </>)}
          </div>

          {/* Video URL */}
          <div>
            <label style={C.label}>Video URL (YouTube / Vimeo — opzionale)</label>
            <input value={form.videoUrl} onChange={function (e) { return set('videoUrl', e.target.value); }} placeholder="https://youtube.com/watch?v=..." style={C.field} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>
          </div>

          {/* Title + Emoji */}
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 10 }}>
            <div>
              <label style={C.label}>Emoji</label>
              <input value={form.emoji} onChange={function (e) { return set('emoji', e.target.value); }} placeholder="✨" style={__assign(__assign({}, C.field), { textAlign: 'center', fontSize: 22 })} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>
            </div>
            <div>
              <label style={C.label}>Titolo *</label>
              <input value={form.title} onChange={function (e) { return set('title', e.target.value); }} placeholder="Es: Cena Romantica a Bologna" style={C.field} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>
            </div>
          </div>

          <div>
            <label style={C.label}>Tagline</label>
            <input value={form.tagline} onChange={function (e) { return set('tagline', e.target.value); }} placeholder="Una serata perfetta per due" style={C.field} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>
          </div>

          <div>
            <label style={C.label}>Descrizione</label>
            <textarea value={form.description} onChange={function (e) { return set('description', e.target.value); }} placeholder="Racconta l'esperienza..." rows={3} style={__assign(__assign({}, C.field), { resize: 'none' })} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>
          </div>

          {/* Category + Cost + Duration */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <div>
              <label style={C.label}>Categoria *</label>
              <select value={form.category} onChange={function (e) { return set('category', e.target.value); }} style={__assign(__assign({}, C.field), { cursor: 'pointer' })}>
                {EXP_CATEGORIES.map(function (c) { return <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>; })}
              </select>
            </div>
            <div>
              <label style={C.label}>Costo stimato (€)</label>
              <input type="number" value={form.estimatedCost} onChange={function (e) { return set('estimatedCost', e.target.value); }} placeholder="50" min="0" style={C.field} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>
            </div>
            <div>
              <label style={C.label}>Durata (minuti)</label>
              <input type="number" value={form.duration} onChange={function (e) { return set('duration', e.target.value); }} placeholder="120" min="0" style={C.field} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>
            </div>
          </div>

          <div>
            <label style={C.label}>Tag (virgola)</label>
            <input value={form.tags} onChange={function (e) { return set('tags', e.target.value); }} placeholder="romantica, cena, aperitivo" style={C.field} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>
          </div>

          {/* Flags */}
          <div style={{ display: 'flex', gap: 16 }}>
            {[
            { k: 'featured', label: '⭐ In evidenza' },
            { k: 'active', label: '✅ Attiva' },
        ].map(function (_a) {
            var k = _a.k, label = _a.label;
            return (<label key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'rgba(240,237,232,0.6)' }}>
                <input type="checkbox" checked={form[k]} onChange={function (e) { return set(k, e.target.checked); }} style={{ accentColor: '#e8622a', width: 15, height: 15 }}/>
                {label}
              </label>);
        })}
          </div>

          {/* ── Stops (Tappe) ── */}
          <div>
            <label style={__assign(__assign({}, C.label), { marginBottom: 10 })}>Tappe dell'itinerario</label>

            {/* Search places */}
            <div style={{ position: 'relative', marginBottom: 10 }}>
              <lucide_react_1.Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,237,232,0.3)' }}/>
              <input value={stopSearch} onChange={function (e) { return setStopSearch(e.target.value); }} placeholder="Cerca e aggiungi un locale..." style={__assign(__assign({}, C.field), { paddingLeft: 32 })} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>
              {stopSearch.length > 1 && ((_c = placesData === null || placesData === void 0 ? void 0 : placesData.data) === null || _c === void 0 ? void 0 : _c.length) > 0 && (<div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, marginTop: 4, overflow: 'hidden' }}>
                  {placesData.data.map(function (place) {
                var _a, _b;
                return (<button key={place._id} onClick={function () { return addStop(place); }} style={{ width: '100%', padding: '8px 12px', border: 'none', cursor: 'pointer', background: 'transparent', color: '#f0ede8', fontSize: 13, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.15s' }} onMouseEnter={function (e) { return (e.currentTarget.style.background = 'rgba(232,98,42,0.1)'); }} onMouseLeave={function (e) { return (e.currentTarget.style.background = 'transparent'); }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: 'rgba(255,255,255,0.05)' }}>
                        {((_a = place.media) === null || _a === void 0 ? void 0 : _a.coverImage) && <img src={place.media.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>}
                      </div>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 600 }}>{place.name}</p>
                        <p style={{ fontSize: 10, color: 'rgba(240,237,232,0.4)' }}>{(_b = place.location) === null || _b === void 0 ? void 0 : _b.neighborhood}</p>
                      </div>
                      <lucide_react_1.Plus size={12} style={{ marginLeft: 'auto', color: '#e8622a' }}/>
                    </button>);
            })}
                </div>)}
            </div>

            {/* Stops list */}
            {form.stops.length === 0 ? (<div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, textAlign: 'center', color: 'rgba(240,237,232,0.3)', fontSize: 12 }}>
                Cerca e aggiungi i locali dell'itinerario
              </div>) : (<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {form.stops.map(function (stop, i) { return (<div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#e8622a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>{i + 1}</span>
                      </div>
                      <span style={{ color: '#f0ede8', fontSize: 13, fontWeight: 700, flex: 1 }}>{stop.placeName}</span>
                      <input type="number" value={stop.duration} onChange={function (e) { return updateStop(i, 'duration', e.target.value); }} placeholder="min" min="0" style={__assign(__assign({}, C.field), { width: 70, padding: '5px 8px', fontSize: 11 })}/>
                      <span style={{ fontSize: 10, color: 'rgba(240,237,232,0.3)' }}>min</span>
                      <button onClick={function () { return removeStop(i); }} style={{ padding: 4, borderRadius: 6, border: 'none', cursor: 'pointer', background: 'transparent', color: '#f87171' }}>
                        <lucide_react_1.X size={13}/>
                      </button>
                    </div>
                    <input value={stop.note} onChange={function (e) { return updateStop(i, 'note', e.target.value); }} placeholder="💡 Suggerimento per questa tappa... (opzionale)" style={__assign(__assign({}, C.field), { fontSize: 11 })} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>
                  </div>); })}
              </div>)}
          </div>

          {error && <p style={{ color: '#f87171', fontSize: 12, textAlign: 'center', background: 'rgba(248,113,113,0.1)', borderRadius: 8, padding: '8px 12px' }}>{error}</p>}

          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(240,237,232,0.5)', cursor: 'pointer', fontSize: 13 }}>Annulla</button>
            <button onClick={function () { return mutation.mutate(); }} disabled={!form.title || mutation.isPending} style={{ flex: 2, padding: '11px', borderRadius: 12, border: 'none', background: form.title ? 'linear-gradient(135deg,#e8622a,#f0884a)' : 'rgba(255,255,255,0.08)', color: form.title ? '#fff' : 'rgba(240,237,232,0.3)', cursor: form.title ? 'pointer' : 'not-allowed', fontSize: 13, fontWeight: 700 }}>
              {mutation.isPending ? 'Salvataggio...' : isEdit ? 'Salva' : 'Crea esperienza'}
            </button>
          </div>
        </div>
        <style>{"@keyframes spin { to { transform: rotate(360deg) } }"}</style>
      </div>
    </div>);
}
