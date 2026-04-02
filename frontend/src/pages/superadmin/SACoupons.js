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
exports.default = SACoupons;
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var api_1 = require("@/lib/api");
var lucide_react_1 = require("lucide-react");
var C = {
    card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' },
    field: { width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f0ede8', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'DM Sans,sans-serif' },
    label: { display: 'block', fontSize: 10, fontWeight: 700, color: 'rgba(240,237,232,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.12em' },
};
var today = function () { return new Date().toISOString().split('T')[0]; };
function SACoupons() {
    var _a;
    var _b = (0, react_1.useState)(''), search = _b[0], setSearch = _b[1];
    var _c = (0, react_1.useState)(''), filterActive = _c[0], setFilterActive = _c[1];
    var _d = (0, react_1.useState)(false), showExpired = _d[0], setShowExpired = _d[1];
    var _e = (0, react_1.useState)(null), editCoupon = _e[0], setEditCoupon = _e[1];
    var qc = (0, react_query_1.useQueryClient)();
    var params = {};
    if (filterActive !== '')
        params.active = filterActive;
    if (search)
        params.search = search;
    var _f = (0, react_query_1.useQuery)({
        queryKey: ['sa-coupons', search, filterActive, showExpired],
        queryFn: function () { return api_1.superAdminApi.listCoupons(Object.keys(params).length ? params : undefined); },
    }), data = _f.data, isLoading = _f.isLoading;
    var deleteMutation = (0, react_query_1.useMutation)({
        mutationFn: api_1.superAdminApi.deleteCoupon,
        onSuccess: function () { return qc.invalidateQueries({ queryKey: ['sa-coupons'] }); },
    });
    var toggleMutation = (0, react_query_1.useMutation)({
        mutationFn: function (_a) {
            var id = _a.id, active = _a.active;
            return api_1.superAdminApi.updateCoupon(id, { active: active });
        },
        onSuccess: function () { return qc.invalidateQueries({ queryKey: ['sa-coupons'] }); },
    });
    var now = new Date();
    var allCoupons = (_a = data === null || data === void 0 ? void 0 : data.data) !== null && _a !== void 0 ? _a : [];
    var coupons = showExpired ? allCoupons : allCoupons.filter(function (c) { return new Date(c.validUntil) >= now; });
    return (<div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 28, fontWeight: 700, color: '#f0ede8' }}>Coupon</h1>
        <p style={{ color: 'rgba(240,237,232,0.35)', fontSize: 12, marginTop: 2 }}>{coupons.length} mostrati</p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <lucide_react_1.Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,237,232,0.3)' }}/>
        <input value={search} onChange={function (e) { return setSearch(e.target.value); }} placeholder="Cerca per titolo coupon..." style={__assign(__assign({}, C.field), { paddingLeft: 36 })}/>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {[{ value: '', label: 'Tutti' }, { value: 'true', label: '✅ Attivi' }, { value: 'false', label: '⏸ Disattivi' }].map(function (_a) {
            var value = _a.value, label = _a.label;
            return (<button key={value} onClick={function () { return setFilterActive(value); }} style={{
                    padding: '5px 12px', borderRadius: 100, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700,
                    background: filterActive === value ? 'rgba(232,98,42,0.15)' : 'rgba(255,255,255,0.04)',
                    color: filterActive === value ? '#e8622a' : 'rgba(240,237,232,0.45)',
                }}>{label}</button>);
        })}
        <button onClick={function () { return setShowExpired(function (s) { return !s; }); }} style={{
            padding: '5px 12px', borderRadius: 100, cursor: 'pointer', fontSize: 11, fontWeight: 700,
            border: "1px solid ".concat(showExpired ? 'rgba(251,191,36,0.4)' : 'transparent'),
            background: showExpired ? 'rgba(251,191,36,0.1)' : 'rgba(255,255,255,0.04)',
            color: showExpired ? '#fbbf24' : 'rgba(240,237,232,0.45)',
        }}>⏰ {showExpired ? 'Nascondi scaduti' : 'Mostra scaduti'}</button>
      </div>

      <div style={C.card}>
        {isLoading ? (<div style={{ padding: 32, textAlign: 'center', color: 'rgba(240,237,232,0.3)' }}>Caricamento...</div>) : coupons.length === 0 ? (<div style={{ padding: 48, textAlign: 'center', color: 'rgba(240,237,232,0.3)' }}>
            <lucide_react_1.Tag size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }}/>
            <p>{search ? 'Nessun risultato' : 'Nessun coupon'}</p>
          </div>) : (<table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Titolo', 'Locale', 'Sconto', 'Validità', 'Scaricati', 'Stato', ''].map(function (h) { return (<th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'rgba(240,237,232,0.3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{h}</th>); })}
              </tr>
            </thead>
            <tbody>
              {coupons.map(function (c) {
                var _a;
                var expired = new Date(c.validUntil) < now;
                var isActive = c.active && !expired;
                return (<tr key={c._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', opacity: expired ? 0.5 : 1 }}>
                    <td style={{ padding: '12px 16px', color: '#f0ede8', fontSize: 13, fontWeight: 600 }}>{c.title}</td>
                    <td style={{ padding: '12px 16px', color: 'rgba(240,237,232,0.45)', fontSize: 12 }}>{((_a = c.placeId) === null || _a === void 0 ? void 0 : _a.name) || '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#e8622a', fontFamily: 'DM Mono,monospace', background: 'rgba(232,98,42,0.1)', padding: '2px 7px', borderRadius: 6 }}>
                        {c.discountType === 'percentage' ? "-".concat(c.discountValue, "%") : c.discountType === 'fixed' ? "-\u20AC".concat(c.discountValue) : 'OMAGGIO'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'rgba(240,237,232,0.35)', fontSize: 11, fontFamily: 'DM Mono,monospace', whiteSpace: 'nowrap' }}>
                      {new Date(c.validFrom).toLocaleDateString('it-IT')} → {new Date(c.validUntil).toLocaleDateString('it-IT')}
                      {expired && <span style={{ marginLeft: 6, color: '#f87171', fontSize: 9, fontWeight: 700 }}>SCADUTO</span>}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'rgba(240,237,232,0.45)', fontSize: 12, textAlign: 'center' }}>{c.usesCount}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <button onClick={function () { return !expired && toggleMutation.mutate({ id: c._id, active: !c.active }); }} disabled={expired} style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 100, border: 'none', cursor: expired ? 'default' : 'pointer', background: isActive ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)', color: isActive ? '#4ade80' : expired ? '#f87171' : 'rgba(240,237,232,0.3)' }}>
                        {expired ? 'Scaduto' : c.active ? 'Attivo' : 'Disattivo'}
                      </button>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <button onClick={function () { return setEditCoupon(c); }} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: '#3b82f6' }} onMouseEnter={function (e) { return e.currentTarget.style.background = 'rgba(59,130,246,0.1)'; }} onMouseLeave={function (e) { return e.currentTarget.style.background = 'transparent'; }}>
                          <lucide_react_1.Pencil size={14}/>
                        </button>
                        <button onClick={function () { return confirm("Eliminare \"".concat(c.title, "\"?")) && deleteMutation.mutate(c._id); }} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: 'rgba(240,237,232,0.3)' }} onMouseEnter={function (e) { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; }} onMouseLeave={function (e) { e.currentTarget.style.color = 'rgba(240,237,232,0.3)'; e.currentTarget.style.background = 'transparent'; }}>
                          <lucide_react_1.Trash2 size={14}/>
                        </button>
                      </div>
                    </td>
                  </tr>);
            })}
            </tbody>
          </table>)}
      </div>

      {editCoupon && <CouponEditModal coupon={editCoupon} onClose={function () { return setEditCoupon(null); }}/>}
    </div>);
}
function CouponEditModal(_a) {
    var _b;
    var coupon = _a.coupon, onClose = _a.onClose;
    var qc = (0, react_query_1.useQueryClient)();
    var _c = (0, react_1.useState)({
        title: coupon.title || '',
        discountType: coupon.discountType || 'percentage',
        discountValue: String(coupon.discountValue || 10),
        validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().split('T')[0] : today(),
        validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().split('T')[0] : '',
        maxUses: coupon.maxUses ? String(coupon.maxUses) : '0',
        active: coupon.active !== false,
        conditions: coupon.conditions || '',
    }), form = _c[0], setForm = _c[1];
    var _d = (0, react_1.useState)(''), error = _d[0], setError = _d[1];
    var set = function (k, v) { return setForm(function (f) {
        var _a;
        return (__assign(__assign({}, f), (_a = {}, _a[k] = v, _a)));
    }); };
    var mutation = (0, react_query_1.useMutation)({
        mutationFn: function () { return api_1.superAdminApi.updateCoupon(coupon._id, {
            title: form.title,
            discountType: form.discountType,
            discountValue: parseFloat(form.discountValue),
            validFrom: form.validFrom,
            validUntil: form.validUntil,
            maxUses: parseInt(form.maxUses) || 0,
            active: form.active,
            conditions: form.conditions,
        }); },
        onSuccess: function () { qc.invalidateQueries({ queryKey: ['sa-coupons'] }); onClose(); },
        onError: function (e) { var _a, _b; return setError(((_b = (_a = e.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || 'Errore'); },
    });
    return (<div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={onClose}>
      <div style={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 24, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }} onClick={function (e) { return e.stopPropagation(); }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <h2 style={{ color: '#f0ede8', fontSize: 18, fontWeight: 700 }}>Modifica coupon</h2>
          <button onClick={onClose} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', color: 'rgba(240,237,232,0.5)' }}><lucide_react_1.X size={15}/></button>
        </div>
        <p style={{ color: 'rgba(240,237,232,0.35)', fontSize: 12, marginBottom: 20 }}>
          Locale: <span style={{ color: '#e8622a' }}>{((_b = coupon.placeId) === null || _b === void 0 ? void 0 : _b.name) || '—'}</span>
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={C.label}>Titolo *</label>
            <input value={form.title} onChange={function (e) { return set('title', e.target.value); }} style={C.field} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>
          </div>

          <div>
            <label style={C.label}>Tipo sconto</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {[{ id: 'percentage', label: '% Percentuale' }, { id: 'fixed', label: '€ Fisso' }, { id: 'freebie', label: '🎁 Omaggio' }].map(function (_a) {
            var id = _a.id, label = _a.label;
            return (<button key={id} onClick={function () { return set('discountType', id); }} style={{
                    padding: '9px 0', borderRadius: 10, border: "1px solid ".concat(form.discountType === id ? '#e8622a' : 'rgba(255,255,255,0.1)'),
                    background: form.discountType === id ? 'rgba(232,98,42,0.15)' : 'transparent',
                    color: form.discountType === id ? '#e8622a' : 'rgba(240,237,232,0.5)',
                    cursor: 'pointer', fontSize: 11, fontWeight: 700,
                }}>{label}</button>);
        })}
            </div>
          </div>

          {form.discountType !== 'freebie' && (<div>
              <label style={C.label}>Valore {form.discountType === 'percentage' ? '(%)' : '(€)'}</label>
              <input type="number" value={form.discountValue} onChange={function (e) { return set('discountValue', e.target.value); }} min="1" style={C.field} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>
            </div>)}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[{ k: 'validFrom', label: 'Valido dal' }, { k: 'validUntil', label: 'Valido fino al' }].map(function (_a) {
            var k = _a.k, label = _a.label;
            return (<div key={k}>
                <label style={C.label}>{label}</label>
                <input type="date" value={form[k]} onChange={function (e) { return set(k, e.target.value); }} style={__assign(__assign({}, C.field), { colorScheme: 'dark' })} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>
              </div>);
        })}
          </div>

          <div>
            <label style={C.label}>Utilizzi massimi (0 = illimitati)</label>
            <input type="number" value={form.maxUses} onChange={function (e) { return set('maxUses', e.target.value); }} min="0" style={C.field} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>
          </div>

          <div>
            <label style={C.label}>Condizioni</label>
            <input value={form.conditions} onChange={function (e) { return set('conditions', e.target.value); }} placeholder="Es: valido solo la sera" style={C.field} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'rgba(240,237,232,0.6)' }}>
            <input type="checkbox" checked={form.active} onChange={function (e) { return set('active', e.target.checked); }} style={{ accentColor: '#e8622a', width: 15, height: 15 }}/>
            ✅ Coupon attivo
          </label>

          {error && <p style={{ color: '#f87171', fontSize: 12, textAlign: 'center', background: 'rgba(248,113,113,0.1)', borderRadius: 8, padding: '8px 12px' }}>{error}</p>}

          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(240,237,232,0.5)', cursor: 'pointer', fontSize: 13 }}>Annulla</button>
            <button onClick={function () { return mutation.mutate(); }} disabled={!form.title || mutation.isPending} style={{ flex: 2, padding: '11px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#e8622a,#f0884a)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, opacity: mutation.isPending ? 0.7 : 1 }}>
              {mutation.isPending ? 'Salvataggio...' : 'Salva modifiche'}
            </button>
          </div>
        </div>
      </div>
    </div>);
}
