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
exports.default = AdminPlaceFormPage;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var react_query_1 = require("@tanstack/react-query");
var lucide_react_1 = require("lucide-react");
var api_1 = require("@/lib/api");
var types_1 = require("@/types");
var DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
var DAYS_IT = {
    monday: 'Lunedì', tuesday: 'Martedì', wednesday: 'Mercoledì',
    thursday: 'Giovedì', friday: 'Venerdì', saturday: 'Sabato', sunday: 'Domenica'
};
var EMPTY_FORM = {
    name: '', city: 'bologna', category: 'eat',
    shortDescription: '', description: '',
    tags: '',
    'location.address': '', 'location.neighborhood': '',
    'location.coordinates.lat': '44.4949', 'location.coordinates.lng': '11.3426',
    'contact.phone': '', 'contact.website': '', 'contact.instagram': '',
    priceRange: '2',
    'meta.featured': false, 'meta.active': true,
    coverImage: '',
    hours: Object.fromEntries(DAYS.map(function (d) { return [d, { open: '10:00', close: '22:00', closed: false }]; })),
};
function AdminPlaceFormPage() {
    var _this = this;
    var id = (0, react_router_dom_1.useParams)().id;
    var isEdit = !!id;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var queryClient = (0, react_query_1.useQueryClient)();
    var _a = (0, react_1.useState)(EMPTY_FORM), form = _a[0], setForm = _a[1];
    var _b = (0, react_1.useState)(false), uploading = _b[0], setUploading = _b[1];
    var _c = (0, react_1.useState)(''), saveError = _c[0], setSaveError = _c[1];
    var existing = (0, react_query_1.useQuery)({
        queryKey: ['admin-place-edit', id],
        queryFn: function () { return api_1.adminApi.listPlaces({ limit: 1 }).then(function () { return __awaiter(_this, void 0, void 0, function () {
            var all;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, api_1.adminApi.listPlaces({ limit: '200' })];
                    case 1:
                        all = _b.sent();
                        return [2 /*return*/, (_a = all.data) === null || _a === void 0 ? void 0 : _a.find(function (p) { return p._id === id; })];
                }
            });
        }); }); },
        enabled: isEdit,
    }).data;
    (0, react_1.useEffect)(function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        if (existing) {
            setForm({
                name: existing.name,
                city: existing.city,
                category: existing.category,
                shortDescription: existing.shortDescription || '',
                description: existing.description || '',
                tags: (existing.tags || []).join(', '),
                'location.address': ((_a = existing.location) === null || _a === void 0 ? void 0 : _a.address) || '',
                'location.neighborhood': ((_b = existing.location) === null || _b === void 0 ? void 0 : _b.neighborhood) || '',
                'location.coordinates.lat': String(((_d = (_c = existing.location) === null || _c === void 0 ? void 0 : _c.coordinates) === null || _d === void 0 ? void 0 : _d.lat) || 44.4949),
                'location.coordinates.lng': String(((_f = (_e = existing.location) === null || _e === void 0 ? void 0 : _e.coordinates) === null || _f === void 0 ? void 0 : _f.lng) || 11.3426),
                'contact.phone': ((_g = existing.contact) === null || _g === void 0 ? void 0 : _g.phone) || '',
                'contact.website': ((_h = existing.contact) === null || _h === void 0 ? void 0 : _h.website) || '',
                'contact.instagram': ((_j = existing.contact) === null || _j === void 0 ? void 0 : _j.instagram) || '',
                priceRange: String(existing.priceRange || 2),
                'meta.featured': ((_k = existing.meta) === null || _k === void 0 ? void 0 : _k.featured) || false,
                'meta.active': ((_l = existing.meta) === null || _l === void 0 ? void 0 : _l.active) !== false,
                coverImage: ((_m = existing.media) === null || _m === void 0 ? void 0 : _m.coverImage) || '',
                hours: existing.hours || EMPTY_FORM.hours,
            });
        }
    }, [existing]);
    var saveMutation = (0, react_query_1.useMutation)({
        mutationFn: function (payload) { return isEdit ? api_1.adminApi.updatePlace(id, payload) : api_1.adminApi.createPlace(payload); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['admin-places'] });
            navigate('/admin/places');
        },
        onError: function (err) { var _a, _b; return setSaveError(((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || 'Errore nel salvataggio'); },
    });
    var handleUpload = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var file, url_1, _a;
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
                    _c.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, api_1.adminApi.upload(file)];
                case 2:
                    url_1 = (_c.sent()).url;
                    setForm(function (f) { return (__assign(__assign({}, f), { coverImage: url_1 })); });
                    return [3 /*break*/, 5];
                case 3:
                    _a = _c.sent();
                    alert('Upload fallito. Configura Cloudinary nel .env');
                    return [3 /*break*/, 5];
                case 4:
                    setUploading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleSubmit = function (e) {
        e.preventDefault();
        setSaveError('');
        var tags = form.tags.split(',').map(function (t) { return t.trim(); }).filter(Boolean);
        var payload = {
            name: form.name,
            city: form.city,
            category: form.category,
            shortDescription: form.shortDescription,
            description: form.description,
            tags: tags,
            location: {
                address: form['location.address'],
                neighborhood: form['location.neighborhood'],
                coordinates: {
                    lat: parseFloat(form['location.coordinates.lat']),
                    lng: parseFloat(form['location.coordinates.lng']),
                },
            },
            contact: {
                phone: form['contact.phone'] || undefined,
                website: form['contact.website'] || undefined,
                instagram: form['contact.instagram'] || undefined,
            },
            priceRange: parseInt(form.priceRange),
            media: { coverImage: form.coverImage, gallery: [] },
            hours: form.hours,
            meta: { featured: form['meta.featured'], active: form['meta.active'] },
        };
        saveMutation.mutate(payload);
    };
    var set = function (key, val) { return setForm(function (f) {
        var _a;
        return (__assign(__assign({}, f), (_a = {}, _a[key] = val, _a)));
    }); };
    var setHour = function (day, field, val) {
        return setForm(function (f) {
            var _a, _b;
            return (__assign(__assign({}, f), { hours: __assign(__assign({}, f.hours), (_a = {}, _a[day] = __assign(__assign({}, f.hours[day]), (_b = {}, _b[field] = val, _b)), _a)) }));
        });
    };
    return (<div className="max-w-2xl space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={function () { return navigate('/admin/places'); }} className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all">
          <lucide_react_1.ArrowLeft size={18}/>
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">
            {isEdit ? 'Modifica posto' : 'Nuovo posto'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cover image */}
        <div className="glass rounded-2xl p-5 space-y-3">
          <h2 className="font-medium text-white text-sm">Immagine di copertina</h2>
          {form.coverImage ? (<div className="relative rounded-xl overflow-hidden aspect-video">
              <img src={form.coverImage} alt="Cover" className="w-full h-full object-cover"/>
              <button type="button" onClick={function () { return set('coverImage', ''); }} className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-all">
                <lucide_react_1.X size={14}/>
              </button>
            </div>) : (<label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-white/20 transition-all">
              <lucide_react_1.Upload size={24} className="text-white/30 mb-2"/>
              <span className="text-white/40 text-sm">{uploading ? 'Caricamento...' : 'Carica immagine'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading}/>
            </label>)}
          <div>
            <label className="block text-xs text-white/40 mb-1">O incolla URL immagine</label>
            <input type="url" value={form.coverImage} onChange={function (e) { return set('coverImage', e.target.value); }} className="input-field text-sm" placeholder="https://..."/>
          </div>
        </div>

        {/* Basic info */}
        <div className="glass rounded-2xl p-5 space-y-4">
          <h2 className="font-medium text-white text-sm">Informazioni base</h2>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Nome *</label>
            <input required value={form.name} onChange={function (e) { return set('name', e.target.value); }} className="input-field" placeholder="Nome del posto"/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Categoria *</label>
              <select value={form.category} onChange={function (e) { return set('category', e.target.value); }} className="input-field">
                {types_1.CATEGORIES.map(function (c) { return <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>; })}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Fascia prezzo</label>
              <select value={form.priceRange} onChange={function (e) { return set('priceRange', e.target.value); }} className="input-field">
                <option value="1">€ Economico</option>
                <option value="2">€€ Medio</option>
                <option value="3">€€€ Alto</option>
                <option value="4">€€€€ Luxury</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Descrizione breve (max 160 caratteri)</label>
            <input value={form.shortDescription} onChange={function (e) { return set('shortDescription', e.target.value); }} maxLength={160} className="input-field" placeholder="Una riga che descrive il posto..."/>
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Descrizione completa</label>
            <textarea value={form.description} onChange={function (e) { return set('description', e.target.value); }} rows={4} className="input-field resize-none" placeholder="Racconta il posto in dettaglio..."/>
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Tag (separati da virgola)</label>
            <input value={form.tags} onChange={function (e) { return set('tags', e.target.value); }} className="input-field" placeholder="aperitivo, cocktail, rooftop"/>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form['meta.active']} onChange={function (e) { return set('meta.active', e.target.checked); }} className="w-4 h-4 accent-orange-500"/>
              <span className="text-sm text-white/70">Pubblicato</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form['meta.featured']} onChange={function (e) { return set('meta.featured', e.target.checked); }} className="w-4 h-4 accent-orange-500"/>
              <span className="text-sm text-white/70 flex items-center gap-1"><lucide_react_1.Star size={12} className="text-yellow-400"/> In evidenza</span>
            </label>
          </div>
        </div>

        {/* Location */}
        <div className="glass rounded-2xl p-5 space-y-4">
          <h2 className="font-medium text-white text-sm">Posizione</h2>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Indirizzo</label>
            <input value={form['location.address']} onChange={function (e) { return set('location.address', e.target.value); }} className="input-field" placeholder="Via Indipendenza 1, Bologna"/>
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Quartiere</label>
            <input value={form['location.neighborhood']} onChange={function (e) { return set('location.neighborhood', e.target.value); }} className="input-field" placeholder="Centro Storico, Bolognina, Quadrilatero..."/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Latitudine</label>
              <input type="number" step="any" value={form['location.coordinates.lat']} onChange={function (e) { return set('location.coordinates.lat', e.target.value); }} className="input-field"/>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Longitudine</label>
              <input type="number" step="any" value={form['location.coordinates.lng']} onChange={function (e) { return set('location.coordinates.lng', e.target.value); }} className="input-field"/>
            </div>
          </div>
        </div>

        {/* Hours */}
        <div className="glass rounded-2xl p-5 space-y-3">
          <h2 className="font-medium text-white text-sm">Orari</h2>
          {DAYS.map(function (day) {
            var h = form.hours[day] || { open: '10:00', close: '22:00', closed: false };
            return (<div key={day} className="flex items-center gap-3">
                <span className="text-white/50 text-sm w-24 shrink-0">{DAYS_IT[day]}</span>
                <label className="flex items-center gap-1.5 text-xs text-white/40 cursor-pointer shrink-0">
                  <input type="checkbox" checked={h.closed} onChange={function (e) { return setHour(day, 'closed', e.target.checked); }} className="w-3.5 h-3.5 accent-orange-500"/>
                  Chiuso
                </label>
                {!h.closed && (<>
                    <input type="time" value={h.open} onChange={function (e) { return setHour(day, 'open', e.target.value); }} className="input-field py-1.5 text-sm w-24"/>
                    <span className="text-white/30 text-sm">–</span>
                    <input type="time" value={h.close} onChange={function (e) { return setHour(day, 'close', e.target.value); }} className="input-field py-1.5 text-sm w-24"/>
                  </>)}
              </div>);
        })}
        </div>

        {/* Contacts */}
        <div className="glass rounded-2xl p-5 space-y-4">
          <h2 className="font-medium text-white text-sm">Contatti</h2>
          {[
            { key: 'contact.phone', label: 'Telefono', placeholder: '+39 051 000000' },
            { key: 'contact.website', label: 'Sito web', placeholder: 'https://...' },
            { key: 'contact.instagram', label: 'Instagram handle', placeholder: 'nomeutente (senza @)' },
        ].map(function (_a) {
            var key = _a.key, label = _a.label, placeholder = _a.placeholder;
            return (<div key={key}>
              <label className="block text-xs text-white/40 mb-1.5">{label}</label>
              <input value={form[key]} onChange={function (e) { return set(key, e.target.value); }} className="input-field" placeholder={placeholder}/>
            </div>);
        })}
        </div>

        {/* Error */}
        {saveError && (<p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">{saveError}</p>)}

        {/* Actions */}
        <div className="flex gap-3 pb-8">
          <button type="button" onClick={function () { return navigate('/admin/places'); }} className="btn-ghost flex-1">
            Annulla
          </button>
          <button type="submit" disabled={saveMutation.isPending} className="btn-primary flex-1 disabled:opacity-50">
            {saveMutation.isPending ? 'Salvataggio...' : isEdit ? 'Salva modifiche' : 'Crea posto'}
          </button>
        </div>
      </form>
    </div>);
}
