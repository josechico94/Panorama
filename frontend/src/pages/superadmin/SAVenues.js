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
exports.default = SAVenues;
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var api_1 = require("@/lib/api");
var lucide_react_1 = require("lucide-react");
var C = {
    card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' },
    field: { width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f0ede8', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'DM Sans,sans-serif', transition: 'border-color 0.2s' },
    label: { display: 'block', fontSize: 10, fontWeight: 700, color: 'rgba(240,237,232,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.12em' },
};
function CopyBtn(_a) {
    var text = _a.text;
    var _b = (0, react_1.useState)(false), copied = _b[0], setCopied = _b[1];
    return (<button onClick={function () { navigator.clipboard.writeText(text); setCopied(true); setTimeout(function () { return setCopied(false); }, 1500); }} style={{ padding: 4, borderRadius: 6, border: 'none', cursor: 'pointer', background: 'transparent', color: copied ? '#4ade80' : 'rgba(240,237,232,0.3)' }}>
      {copied ? <lucide_react_1.Check size={12}/> : <lucide_react_1.Copy size={12}/>}
    </button>);
}
function SAVenues() {
    var _a, _b;
    var _c = (0, react_1.useState)(false), showForm = _c[0], setShowForm = _c[1];
    var _d = (0, react_1.useState)(null), editOwner = _d[0], setEditOwner = _d[1];
    var _e = (0, react_1.useState)(null), newOwnerCreds = _e[0], setNewOwnerCreds = _e[1];
    var _f = (0, react_1.useState)(''), search = _f[0], setSearch = _f[1];
    var qc = (0, react_query_1.useQueryClient)();
    var _g = (0, react_query_1.useQuery)({
        queryKey: ['sa-venue-owners', search],
        queryFn: function () { return api_1.superAdminApi.listVenueOwners(search ? { search: search } : undefined); },
    }), ownersData = _g.data, isLoading = _g.isLoading;
    var placesData = (0, react_query_1.useQuery)({
        queryKey: ['sa-places-all'],
        queryFn: function () { return api_1.superAdminApi.listPlaces({ limit: 200 }); },
    }).data;
    var deleteMutation = (0, react_query_1.useMutation)({
        mutationFn: api_1.superAdminApi.deleteVenueOwner,
        onSuccess: function () { return qc.invalidateQueries({ queryKey: ['sa-venue-owners'] }); },
    });
    var owners = (_a = ownersData === null || ownersData === void 0 ? void 0 : ownersData.data) !== null && _a !== void 0 ? _a : [];
    var places = (_b = placesData === null || placesData === void 0 ? void 0 : placesData.data) !== null && _b !== void 0 ? _b : [];
    return (<div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 28, fontWeight: 700, color: '#f0ede8' }}>Locali & Gestori</h1>
          <p style={{ color: 'rgba(240,237,232,0.35)', fontSize: 12, marginTop: 2 }}>{owners.length} account attivi</p>
        </div>
        <button onClick={function () { setEditOwner(null); setShowForm(true); }} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 12,
            background: 'linear-gradient(135deg,#e8622a,#f0884a)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
        }}>
          <lucide_react_1.Plus size={14}/> Crea gestore
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <lucide_react_1.Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,237,232,0.3)' }}/>
        <input value={search} onChange={function (e) { return setSearch(e.target.value); }} placeholder="Cerca per nome o email..." style={__assign(__assign({}, C.field), { paddingLeft: 36 })}/>
      </div>

      {/* Success banner */}
      {newOwnerCreds && (<div style={{ marginBottom: 20, padding: '16px 20px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 14 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <p style={{ color: '#4ade80', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>✅ Gestore creato! Credenziali:</p>
              {[
                { label: 'Locale', value: newOwnerCreds.place, mono: false },
                { label: 'Email', value: newOwnerCreds.email, mono: true },
                { label: 'Password', value: newOwnerCreds.password, mono: true },
                { label: 'URL', value: "".concat(window.location.origin, "/locale/login"), mono: true },
            ].map(function (_a) {
                var label = _a.label, value = _a.value, mono = _a.mono;
                return (<div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: 'rgba(240,237,232,0.4)', width: 60 }}>{label}:</span>
                  <span style={{ fontSize: 12, color: '#f0ede8', fontFamily: mono ? 'DM Mono,monospace' : 'inherit', fontWeight: 600 }}>{value}</span>
                  <CopyBtn text={value}/>
                </div>);
            })}
            </div>
            <button onClick={function () { return setNewOwnerCreds(null); }} style={{ padding: 4, borderRadius: 6, border: 'none', cursor: 'pointer', background: 'transparent', color: 'rgba(240,237,232,0.4)' }}>
              <lucide_react_1.X size={14}/>
            </button>
          </div>
        </div>)}

      {/* Table */}
      <div style={C.card}>
        {isLoading ? (<div style={{ padding: 32, textAlign: 'center', color: 'rgba(240,237,232,0.3)' }}>Caricamento...</div>) : owners.length === 0 ? (<div style={{ padding: 48, textAlign: 'center', color: 'rgba(240,237,232,0.3)' }}>
            <lucide_react_1.Store size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }}/>
            <p>{search ? 'Nessun risultato' : 'Nessun gestore ancora'}</p>
          </div>) : (<div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Nome', 'Email', 'Locale', 'URL accesso', ''].map(function (h) { return (<th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'rgba(240,237,232,0.3)', textTransform: 'uppercase', letterSpacing: '0.12em', whiteSpace: 'nowrap' }}>{h}</th>); })}
                </tr>
              </thead>
              <tbody>
                {owners.map(function (owner) {
                var _a;
                return (<tr key={owner._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(232,98,42,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <lucide_react_1.Store size={12} color="#e8622a"/>
                        </div>
                        <span style={{ color: '#f0ede8', fontSize: 13, fontWeight: 600 }}>{owner.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ color: 'rgba(240,237,232,0.5)', fontSize: 12, fontFamily: 'DM Mono,monospace' }}>{owner.email}</span>
                        <CopyBtn text={owner.email}/>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 12, color: '#e8622a', background: 'rgba(232,98,42,0.1)', padding: '2px 8px', borderRadius: 6, fontWeight: 600 }}>
                        {((_a = owner.placeId) === null || _a === void 0 ? void 0 : _a.name) || '—'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontSize: 11, color: 'rgba(240,237,232,0.35)', fontFamily: 'DM Mono,monospace' }}>/locale/login</span>
                        <CopyBtn text={"".concat(window.location.origin, "/locale/login")}/>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <button onClick={function () { setEditOwner(owner); setShowForm(true); }} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: '#3b82f6' }} onMouseEnter={function (e) { return e.currentTarget.style.background = 'rgba(59,130,246,0.1)'; }} onMouseLeave={function (e) { return e.currentTarget.style.background = 'transparent'; }}>
                          <lucide_react_1.Pencil size={14}/>
                        </button>
                        <button onClick={function () { return confirm("Eliminare \"".concat(owner.name, "\"?")) && deleteMutation.mutate(owner._id); }} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: 'rgba(240,237,232,0.3)' }} onMouseEnter={function (e) { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; }} onMouseLeave={function (e) { e.currentTarget.style.color = 'rgba(240,237,232,0.3)'; e.currentTarget.style.background = 'transparent'; }}>
                          <lucide_react_1.Trash2 size={14}/>
                        </button>
                      </div>
                    </td>
                  </tr>);
            })}
              </tbody>
            </table>
          </div>)}
      </div>

      {showForm && (<VenueOwnerForm places={places} owner={editOwner} onClose={function () { setShowForm(false); setEditOwner(null); }} onSuccess={function (creds) {
                if (creds)
                    setNewOwnerCreds(creds);
                qc.invalidateQueries({ queryKey: ['sa-venue-owners'] });
            }}/>)}
    </div>);
}
function VenueOwnerForm(_a) {
    var _b;
    var places = _a.places, owner = _a.owner, onClose = _a.onClose, onSuccess = _a.onSuccess;
    var isEdit = !!owner;
    var _c = (0, react_1.useState)({
        name: (owner === null || owner === void 0 ? void 0 : owner.name) || '',
        email: (owner === null || owner === void 0 ? void 0 : owner.email) || '',
        password: '',
        placeId: ((_b = owner === null || owner === void 0 ? void 0 : owner.placeId) === null || _b === void 0 ? void 0 : _b._id) || (owner === null || owner === void 0 ? void 0 : owner.placeId) || '',
    }), form = _c[0], setForm = _c[1];
    var _d = (0, react_1.useState)(false), showPass = _d[0], setShowPass = _d[1];
    var _e = (0, react_1.useState)(''), error = _e[0], setError = _e[1];
    var set = function (k, v) { return setForm(function (f) {
        var _a;
        return (__assign(__assign({}, f), (_a = {}, _a[k] = v, _a)));
    }); };
    var generatePassword = function () {
        var chars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#';
        set('password', Array.from({ length: 12 }, function () { return chars[Math.floor(Math.random() * chars.length)]; }).join(''));
        setShowPass(true);
    };
    var mutation = (0, react_query_1.useMutation)({
        mutationFn: function () { return isEdit
            ? api_1.superAdminApi.updateVenueOwner(owner._id, form)
            : api_1.superAdminApi.createVenueOwner(form); },
        onSuccess: function () {
            if (!isEdit) {
                var place = places.find(function (p) { return p._id === form.placeId; });
                onSuccess({ email: form.email, password: form.password, place: (place === null || place === void 0 ? void 0 : place.name) || '' });
            }
            else {
                onSuccess(null);
            }
            onClose();
        },
        onError: function (e) { var _a, _b; return setError(((_b = (_a = e.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || 'Errore'); },
    });
    var isValid = form.name && form.email && form.placeId && (isEdit || form.password.length >= 6);
    return (<div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={onClose}>
      <div style={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 24, width: '100%', maxWidth: 440, maxHeight: '90dvh', overflowY: 'auto' }} onClick={function (e) { return e.stopPropagation(); }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <h2 style={{ color: '#f0ede8', fontSize: 18, fontWeight: 700 }}>{isEdit ? 'Modifica gestore' : 'Nuovo gestore'}</h2>
          <button onClick={onClose} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', color: 'rgba(240,237,232,0.5)' }}><lucide_react_1.X size={15}/></button>
        </div>
        <p style={{ color: 'rgba(240,237,232,0.35)', fontSize: 12, marginBottom: 20 }}>
          {isEdit ? 'Modifica le credenziali del gestore' : 'Crea accesso per il titolare del locale'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Locale */}
          <div>
            <label style={C.label}>Locale assegnato *</label>
            <select value={form.placeId} onChange={function (e) { return set('placeId', e.target.value); }} style={__assign(__assign({}, C.field), { cursor: 'pointer' })} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}>
              <option value="">Seleziona il locale...</option>
              {places.map(function (p) { return <option key={p._id} value={p._id}>{p.name} — {p.city}</option>; })}
            </select>
          </div>

          {/* Nome */}
          <div>
            <label style={C.label}>Nome del gestore *</label>
            <input value={form.name} onChange={function (e) { return set('name', e.target.value); }} placeholder="Es: Mario Rossi" style={C.field} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>
          </div>

          {/* Email */}
          <div>
            <label style={C.label}>Email *</label>
            <input type="email" value={form.email} onChange={function (e) { return set('email', e.target.value); }} placeholder="gestore@locale.com" style={C.field} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>
          </div>

          {/* Password */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={__assign(__assign({}, C.label), { marginBottom: 0 })}>{isEdit ? 'Nuova password (lascia vuoto per non cambiare)' : 'Password *'}</label>
              <button onClick={generatePassword} style={{ fontSize: 10, color: '#e8622a', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                Genera
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} value={form.password} onChange={function (e) { return set('password', e.target.value); }} placeholder={isEdit ? 'Lascia vuoto per non modificare' : 'min 6 caratteri'} style={__assign(__assign({}, C.field), { paddingRight: 40 })} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>
              <button onClick={function () { return setShowPass(function (s) { return !s; }); }} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(240,237,232,0.3)' }}>
                {showPass ? <lucide_react_1.EyeOff size={14}/> : <lucide_react_1.Eye size={14}/>}
              </button>
            </div>
          </div>

          {error && <p style={{ color: '#f87171', fontSize: 12, textAlign: 'center', background: 'rgba(248,113,113,0.1)', borderRadius: 8, padding: '8px 12px' }}>{error}</p>}

          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(240,237,232,0.5)', cursor: 'pointer', fontSize: 13 }}>Annulla</button>
            <button onClick={function () { return mutation.mutate(); }} disabled={!isValid || mutation.isPending} style={{ flex: 2, padding: '11px', borderRadius: 12, border: 'none', background: isValid ? 'linear-gradient(135deg,#e8622a,#f0884a)' : 'rgba(255,255,255,0.08)', color: isValid ? '#fff' : 'rgba(240,237,232,0.3)', cursor: isValid ? 'pointer' : 'not-allowed', fontSize: 13, fontWeight: 700 }}>
              {mutation.isPending ? 'Salvataggio...' : isEdit ? 'Salva modifiche' : '✓ Crea gestore'}
            </button>
          </div>
        </div>
      </div>
    </div>);
}
