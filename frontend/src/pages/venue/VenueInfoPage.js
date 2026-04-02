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
exports.default = VenueInfoPage;
var react_query_1 = require("@tanstack/react-query");
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var api_1 = require("@/lib/api");
var types_1 = require("@/types");
var lucide_react_1 = require("lucide-react");
var DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
var DAYS_IT = {
    monday: 'Lunedì', tuesday: 'Martedì', wednesday: 'Mercoledì',
    thursday: 'Giovedì', friday: 'Venerdì', saturday: 'Sabato', sunday: 'Domenica'
};
var fieldStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 12, boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#f0ede8', fontSize: 14, outline: 'none', transition: 'border-color 0.2s',
    fontFamily: 'DM Sans, sans-serif',
};
var labelStyle = {
    display: 'block', fontSize: 10, fontWeight: 700,
    color: 'rgba(240,237,232,0.4)', letterSpacing: '0.15em',
    textTransform: 'uppercase', marginBottom: 6,
};
var sectionStyle = {
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 18, padding: 18, marginBottom: 16,
};
function VenueInfoPage() {
    var _a, _b, _c, _d, _e;
    var qc = (0, react_query_1.useQueryClient)();
    var _f = (0, react_query_1.useQuery)({ queryKey: ['venue-me'], queryFn: api_1.venueApi.me }), data = _f.data, isLoading = _f.isLoading;
    var place = data === null || data === void 0 ? void 0 : data.data;
    var _g = (0, react_1.useState)(null), form = _g[0], setForm = _g[1];
    var _h = (0, react_1.useState)(false), saved = _h[0], setSaved = _h[1];
    (0, react_1.useEffect)(function () {
        var _a, _b, _c, _d, _e, _f;
        if (place) {
            setForm({
                shortDescription: place.shortDescription || '',
                description: place.description || '',
                phone: ((_a = place.contact) === null || _a === void 0 ? void 0 : _a.phone) || '',
                website: ((_b = place.contact) === null || _b === void 0 ? void 0 : _b.website) || '',
                instagram: ((_c = place.contact) === null || _c === void 0 ? void 0 : _c.instagram) || '',
                email: ((_d = place.contact) === null || _d === void 0 ? void 0 : _d.email) || '',
                address: ((_e = place.location) === null || _e === void 0 ? void 0 : _e.address) || '',
                neighborhood: ((_f = place.location) === null || _f === void 0 ? void 0 : _f.neighborhood) || '',
                hours: place.hours || Object.fromEntries(DAYS.map(function (d) { return [d, { open: '10:00', close: '22:00', closed: false }]; })),
            });
        }
    }, [place]);
    var mutation = (0, react_query_1.useMutation)({
        mutationFn: function () { return api_1.venueApi.updateMe({
            shortDescription: form.shortDescription,
            description: form.description,
            contact: {
                phone: form.phone,
                website: form.website,
                instagram: form.instagram,
                email: form.email,
            },
            location: __assign(__assign({}, place === null || place === void 0 ? void 0 : place.location), { address: form.address, neighborhood: form.neighborhood }),
            hours: form.hours,
        }); },
        onSuccess: function () {
            qc.invalidateQueries({ queryKey: ['venue-me'] });
            setSaved(true);
            setTimeout(function () { return setSaved(false); }, 2500);
        },
    });
    var set = function (k, v) { return setForm(function (f) {
        var _a;
        return (__assign(__assign({}, f), (_a = {}, _a[k] = v, _a)));
    }); };
    var setHour = function (day, field, val) {
        return setForm(function (f) {
            var _a, _b;
            return (__assign(__assign({}, f), { hours: __assign(__assign({}, f.hours), (_a = {}, _a[day] = __assign(__assign({}, f.hours[day]), (_b = {}, _b[field] = val, _b)), _a)) }));
        });
    };
    if (isLoading || !form)
        return (<div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[1, 2, 3].map(function (i) { return (<div key={i} style={{ height: 80, borderRadius: 14, background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.5s infinite' }}/>); })}
    </div>);
    var cat = place ? (0, types_1.getCategoryConfig)(place.category) : null;
    return (<div style={{ maxWidth: 480, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 28, height: 2, background: 'linear-gradient(90deg,#e8622a,transparent)', borderRadius: 1 }}/>
          <span style={{ fontSize: 9, color: 'rgba(240,237,232,0.35)', fontFamily: 'DM Mono,monospace', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
            Il tuo locale
          </span>
        </div>
        <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 30, fontWeight: 700, color: '#f0ede8', lineHeight: 1 }}>
          Informazioni
        </h1>

        {/* Place preview card */}
        {place && (<framer_motion_1.motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{
                marginTop: 16, borderRadius: 16, overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.08)', display: 'flex',
            }}>
            <div style={{ width: 80, height: 80, flexShrink: 0 }}>
              <img src={((_a = place.media) === null || _a === void 0 ? void 0 : _a.coverImage) || 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=200&q=80'} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            </div>
            <div style={{ flex: 1, padding: '12px 14px', background: 'rgba(255,255,255,0.03)' }}>
              <p style={{ color: '#f0ede8', fontSize: 14, fontWeight: 700, fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic' }}>
                {place.name}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                {cat && (<span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: cat.color, background: "".concat(cat.color, "18"), border: "1px solid ".concat(cat.color, "30"),
                    borderRadius: 100, padding: '2px 6px',
                }}>
                    {cat.emoji} {cat.label}
                  </span>)}
                <span style={{ fontSize: 10, color: 'rgba(240,237,232,0.4)', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <lucide_react_1.MapPin size={9} color="#e8622a"/> {(_b = place.location) === null || _b === void 0 ? void 0 : _b.neighborhood}
                </span>
              </div>
              <p style={{ fontSize: 10, color: ((_c = place.meta) === null || _c === void 0 ? void 0 : _c.active) ? '#4ade80' : 'rgba(240,237,232,0.3)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: ((_d = place.meta) === null || _d === void 0 ? void 0 : _d.active) ? '#4ade80' : '#666', display: 'inline-block' }}/>
                {((_e = place.meta) === null || _e === void 0 ? void 0 : _e.active) ? 'Pubblicato' : 'Non pubblicato'}
              </p>
            </div>
          </framer_motion_1.motion.div>)}
      </div>

      {/* Descrizione */}
      <div style={sectionStyle}>
        <p style={__assign(__assign({}, labelStyle), { marginBottom: 12 })}>📝 Descrizione</p>
        <div style={{ marginBottom: 10 }}>
          <label style={labelStyle}>Breve (max 160 caratteri)</label>
          <input value={form.shortDescription} onChange={function (e) { return set('shortDescription', e.target.value); }} maxLength={160} placeholder="Una riga che descrive il locale..." style={fieldStyle} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>
        </div>
        <div>
          <label style={labelStyle}>Completa</label>
          <textarea value={form.description} onChange={function (e) { return set('description', e.target.value); }} placeholder="Racconta il tuo locale in dettaglio..." rows={4} style={__assign(__assign({}, fieldStyle), { resize: 'none' })} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>
        </div>
      </div>

      {/* Posizione */}
      <div style={sectionStyle}>
        <p style={__assign(__assign({}, labelStyle), { marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 })}>
          <lucide_react_1.MapPin size={11} color="#e8622a"/> Posizione
        </p>
        <div style={{ marginBottom: 10 }}>
          <label style={labelStyle}>Indirizzo</label>
          <input value={form.address} onChange={function (e) { return set('address', e.target.value); }} placeholder="Via Roma 1, Bologna" style={fieldStyle} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>
        </div>
        <div>
          <label style={labelStyle}>Quartiere</label>
          <input value={form.neighborhood} onChange={function (e) { return set('neighborhood', e.target.value); }} placeholder="Centro Storico, Bolognina..." style={fieldStyle} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>
        </div>
      </div>

      {/* Contatti */}
      <div style={sectionStyle}>
        <p style={__assign(__assign({}, labelStyle), { marginBottom: 12 })}>📞 Contatti</p>
        {[
            { key: 'phone', label: 'Telefono', placeholder: '+39 051 000000', icon: lucide_react_1.Phone },
            { key: 'website', label: 'Sito web', placeholder: 'https://...', icon: lucide_react_1.Globe },
            { key: 'instagram', label: 'Instagram', placeholder: 'handle senza @', icon: lucide_react_1.Instagram },
            { key: 'email', label: 'Email pubblica', placeholder: 'info@locale.it', icon: lucide_react_1.Mail },
        ].map(function (_a) {
            var key = _a.key, label = _a.label, placeholder = _a.placeholder, Icon = _a.icon;
            return (<div key={key} style={{ marginBottom: 10, position: 'relative' }}>
            <label style={labelStyle}>{label}</label>
            <div style={{ position: 'relative' }}>
              <Icon size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,237,232,0.3)' }}/>
              <input value={form[key]} onChange={function (e) { return set(key, e.target.value); }} placeholder={placeholder} style={__assign(__assign({}, fieldStyle), { paddingLeft: 36 })} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>
            </div>
          </div>);
        })}
      </div>

      {/* Orari */}
      <div style={sectionStyle}>
        <p style={__assign(__assign({}, labelStyle), { marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 })}>
          <lucide_react_1.Clock size={11} color="#e8622a"/> Orari di apertura
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {DAYS.map(function (day) {
            var _a;
            var h = ((_a = form.hours) === null || _a === void 0 ? void 0 : _a[day]) || { open: '10:00', close: '22:00', closed: false };
            return (<div key={day} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 72, fontSize: 12, color: 'rgba(240,237,232,0.6)', flexShrink: 0 }}>
                  {DAYS_IT[day]}
                </span>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', flexShrink: 0 }}>
                  <input type="checkbox" checked={h.closed} onChange={function (e) { return setHour(day, 'closed', e.target.checked); }} style={{ accentColor: '#e8622a', width: 14, height: 14 }}/>
                  <span style={{ fontSize: 10, color: 'rgba(240,237,232,0.4)' }}>Chiuso</span>
                </label>
                {!h.closed && (<>
                    <input type="time" value={h.open} onChange={function (e) { return setHour(day, 'open', e.target.value); }} style={__assign(__assign({}, fieldStyle), { padding: '8px 10px', width: 'auto', flex: 1, fontSize: 12, colorScheme: 'dark' })}/>
                    <span style={{ color: 'rgba(240,237,232,0.3)', fontSize: 12, flexShrink: 0 }}>–</span>
                    <input type="time" value={h.close} onChange={function (e) { return setHour(day, 'close', e.target.value); }} style={__assign(__assign({}, fieldStyle), { padding: '8px 10px', width: 'auto', flex: 1, fontSize: 12, colorScheme: 'dark' })}/>
                  </>)}
              </div>);
        })}
        </div>
      </div>

      {/* Save button */}
      {/* Required fields warning */}
      {(!form.address || !form.phone) && (<div style={{ padding: '10px 14px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 10, marginBottom: 4 }}>
          <p style={{ fontSize: 12, color: '#fbbf24', fontWeight: 600 }}>⚠ Indirizzo e telefono sono obbligatori</p>
        </div>)}

      <button onClick={function () { return mutation.mutate(); }} disabled={mutation.isPending || !form.address || !form.phone} style={{
            width: '100%', padding: '15px', borderRadius: 14, cursor: 'pointer',
            background: saved ? 'rgba(34,197,94,0.15)' : 'linear-gradient(135deg, #e8622a, #f0884a)',
            border: saved ? '1px solid rgba(34,197,94,0.4)' : 'none',
            boxShadow: saved ? 'none' : '0 4px 20px rgba(232,98,42,0.4)',
            opacity: mutation.isPending || !form.address || !form.phone ? 0.5 : 1,
            transition: 'all 0.3s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            marginBottom: 32,
        }}>
        {saved
            ? <><lucide_react_1.CheckCircle size={16}/> Salvato con successo!</>
            : mutation.isPending
                ? 'Salvataggio...'
                : 'Salva modifiche'}
      </button>
    </div>);
}
