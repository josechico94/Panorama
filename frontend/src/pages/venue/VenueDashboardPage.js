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
exports.default = VenueDashboardPage;
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var framer_motion_1 = require("framer-motion");
var api_1 = require("@/lib/api");
var lucide_react_1 = require("lucide-react");
var field = {
    width: '100%', padding: '11px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)', color: '#f0ede8', fontSize: 14, outline: 'none',
    fontFamily: 'DM Sans, sans-serif', transition: 'border-color 0.2s', boxSizing: 'border-box',
};
var today = function () { return new Date().toISOString().split('T')[0]; };
var EMPTY_FORM = {
    title: '', description: '', discountType: 'percentage', discountValue: '10',
    conditions: '', validFrom: today(), validUntil: '', maxUses: '',
};
function formatDate(d) {
    return new Date(d).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' });
}
function VenueDashboardPage() {
    var _a, _b, _c;
    var qc = (0, react_query_1.useQueryClient)();
    var _d = (0, react_1.useState)(false), showForm = _d[0], setShowForm = _d[1];
    var _e = (0, react_1.useState)(null), editCoupon = _e[0], setEditCoupon = _e[1];
    var _f = (0, react_1.useState)('attivi'), tab = _f[0], setTab = _f[1];
    var venueData = (0, react_query_1.useQuery)({ queryKey: ['venue-me'], queryFn: api_1.venueApi.me }).data;
    var couponsData = (0, react_query_1.useQuery)({ queryKey: ['venue-coupons'], queryFn: api_1.venueApi.coupons }).data;
    var place = venueData === null || venueData === void 0 ? void 0 : venueData.data;
    var allCoupons = (_a = couponsData === null || couponsData === void 0 ? void 0 : couponsData.data) !== null && _a !== void 0 ? _a : [];
    var now = new Date();
    var activeCoupons = allCoupons.filter(function (c) { return c.active && new Date(c.validUntil) >= now; });
    var historyCoupons = allCoupons.filter(function (c) { return !c.active || new Date(c.validUntil) < now; });
    var totalEmessi = allCoupons.reduce(function (s, c) { return s + (c.usesCount || 0); }, 0);
    var deleteMutation = (0, react_query_1.useMutation)({
        mutationFn: api_1.venueApi.deleteCoupon,
        onSuccess: function () { return qc.invalidateQueries({ queryKey: ['venue-coupons'] }); },
    });
    var openEdit = function (coupon) {
        setEditCoupon(coupon);
        setShowForm(true);
    };
    var openNew = function () {
        setEditCoupon(null);
        setShowForm(true);
    };
    return (<div style={{ maxWidth: 480, margin: '0 auto' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 24 }}>
        {[
            { icon: lucide_react_1.Tag, label: 'Coupon attivi', value: activeCoupons.length, color: '#e8622a' },
            { icon: lucide_react_1.Users, label: 'Tot. emessi', value: totalEmessi, color: '#a855f7' },
            { icon: lucide_react_1.Eye, label: 'Visualizzazioni', value: (_c = (_b = place === null || place === void 0 ? void 0 : place.meta) === null || _b === void 0 ? void 0 : _b.views) !== null && _c !== void 0 ? _c : 0, color: '#22c55e' },
        ].map(function (_a) {
            var Icon = _a.icon, label = _a.label, value = _a.value, color = _a.color;
            return (<div key={label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px 12px', textAlign: 'center' }}>
            <Icon size={18} color={color} style={{ margin: '0 auto 8px' }}/>
            <p style={{ fontSize: 24, fontWeight: 800, color: '#f0ede8', lineHeight: 1 }}>{value}</p>
            <p style={{ fontSize: 9, color: 'rgba(240,237,232,0.4)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>{label}</p>
          </div>);
        })}
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 4, padding: 4, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, marginBottom: 16 }}>
        {[
            { id: 'attivi', icon: lucide_react_1.Tag, label: "Coupon (".concat(activeCoupons.length, ")") },
            { id: 'storico', icon: lucide_react_1.BarChart2, label: "Storico (".concat(historyCoupons.length, ")") },
        ].map(function (_a) {
            var id = _a.id, Icon = _a.icon, label = _a.label;
            return (<button key={id} onClick={function () { return setTab(id); }} style={{
                    flex: 1, padding: '9px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: tab === id ? '#e8622a' : 'transparent',
                    color: tab === id ? '#fff' : 'rgba(240,237,232,0.4)',
                    fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    transition: 'all 0.2s',
                }}>
            <Icon size={13}/> {label}
          </button>);
        })}
      </div>

      <framer_motion_1.AnimatePresence mode="wait">
        {/* ── COUPON ATTIVI ── */}
        {tab === 'attivi' && (<framer_motion_1.motion.div key="attivi" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button onClick={openNew} style={{
                width: '100%', padding: '13px', borderRadius: 14, border: '2px dashed rgba(232,98,42,0.35)',
                background: 'rgba(232,98,42,0.06)', color: '#e8622a', cursor: 'pointer',
                fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                marginBottom: 14, transition: 'all 0.2s',
            }} onMouseEnter={function (e) { return (e.currentTarget.style.borderColor = 'rgba(232,98,42,0.6)'); }} onMouseLeave={function (e) { return (e.currentTarget.style.borderColor = 'rgba(232,98,42,0.35)'); }}>
              <lucide_react_1.Plus size={16}/> Crea nuovo coupon
            </button>

            {activeCoupons.length === 0 ? (<div style={{ textAlign: 'center', padding: '32px 0', color: 'rgba(240,237,232,0.3)' }}>
                <lucide_react_1.Tag size={28} style={{ margin: '0 auto 10px', opacity: 0.3 }}/>
                <p style={{ fontSize: 13 }}>Nessun coupon attivo</p>
              </div>) : (<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {activeCoupons.map(function (coupon) { return (<CouponCard key={coupon._id} coupon={coupon} onEdit={function () { return openEdit(coupon); }} onDelete={function () { return confirm("Eliminare \"".concat(coupon.title, "\"?")) && deleteMutation.mutate(coupon._id); }}/>); })}
              </div>)}
          </framer_motion_1.motion.div>)}

        {/* ── STORICO ── */}
        {tab === 'storico' && (<framer_motion_1.motion.div key="storico" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {historyCoupons.length === 0 ? (<div style={{ textAlign: 'center', padding: '32px 0', color: 'rgba(240,237,232,0.3)' }}>
                <lucide_react_1.Clock size={28} style={{ margin: '0 auto 10px', opacity: 0.3 }}/>
                <p style={{ fontSize: 13 }}>Nessun coupon nello storico</p>
              </div>) : (<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {historyCoupons.map(function (coupon) { return (<HistoryCouponCard key={coupon._id} coupon={coupon}/>); })}
              </div>)}
          </framer_motion_1.motion.div>)}
      </framer_motion_1.AnimatePresence>

      {/* Form modal */}
      {showForm && (<CouponFormModal coupon={editCoupon} onClose={function () { setShowForm(false); setEditCoupon(null); }}/>)}
    </div>);
}
function CouponCard(_a) {
    var coupon = _a.coupon, onEdit = _a.onEdit, onDelete = _a.onDelete;
    var daysLeft = Math.ceil((new Date(coupon.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return (<div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#e8622a', fontFamily: 'DM Mono,monospace', background: 'rgba(232,98,42,0.12)', border: '1px solid rgba(232,98,42,0.25)', borderRadius: 7, padding: '2px 8px' }}>
              {coupon.discountType === 'percentage' ? "-".concat(coupon.discountValue, "%") : coupon.discountType === 'fixed' ? "-\u20AC".concat(coupon.discountValue) : 'OMAGGIO'}
            </span>
            {daysLeft <= 3 && <span style={{ fontSize: 9, color: '#fbbf24', fontWeight: 700, background: 'rgba(251,191,36,0.1)', borderRadius: 100, padding: '1px 6px' }}>⚠ {daysLeft}g rimasti</span>}
          </div>
          <p style={{ color: '#f0ede8', fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{coupon.title}</p>
          <p style={{ color: 'rgba(240,237,232,0.4)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
            <lucide_react_1.Clock size={9}/> Fino al {formatDate(coupon.validUntil)}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={onEdit} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
              <lucide_react_1.Pencil size={13}/>
            </button>
            <button onClick={onDelete} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(248,113,113,0.08)', color: '#f87171' }}>
              <lucide_react_1.Trash2 size={13}/>
            </button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 16 }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 16, fontWeight: 800, color: '#f0ede8' }}>{coupon.usesCount || 0}</p>
          <p style={{ fontSize: 9, color: 'rgba(240,237,232,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Scaricati</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 16, fontWeight: 800, color: '#f0ede8' }}>{coupon.maxUses || '∞'}</p>
          <p style={{ fontSize: 9, color: 'rgba(240,237,232,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Max</p>
        </div>
        {coupon.maxUses > 0 && (<div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: '#e8622a', borderRadius: 2, width: "".concat(Math.min(100, (coupon.usesCount / coupon.maxUses) * 100), "%"), transition: 'width 0.5s' }}/>
            </div>
          </div>)}
      </div>
    </div>);
}
function HistoryCouponCard(_a) {
    var coupon = _a.coupon;
    var expired = new Date(coupon.validUntil) < new Date();
    return (<div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 14, padding: '12px 16px', opacity: 0.75 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <p style={{ color: '#f0ede8', fontSize: 13, fontWeight: 600 }}>{coupon.title}</p>
            <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 100, background: expired ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.05)', color: expired ? '#f87171' : 'rgba(240,237,232,0.35)' }}>
              {expired ? 'Scaduto' : 'Disattivo'}
            </span>
          </div>
          <p style={{ fontSize: 10, color: 'rgba(240,237,232,0.35)', fontFamily: 'DM Mono,monospace' }}>
            {formatDate(coupon.validFrom)} → {formatDate(coupon.validUntil)}
          </p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ fontSize: 18, fontWeight: 800, color: '#f0ede8' }}>{coupon.usesCount || 0}</p>
          <p style={{ fontSize: 9, color: 'rgba(240,237,232,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Scaricati</p>
        </div>
      </div>
    </div>);
}
function CouponFormModal(_a) {
    var coupon = _a.coupon, onClose = _a.onClose;
    var qc = (0, react_query_1.useQueryClient)();
    var isEdit = !!coupon;
    var _b = (0, react_1.useState)(coupon ? {
        title: coupon.title || '',
        description: coupon.description || '',
        discountType: coupon.discountType || 'percentage',
        discountValue: String(coupon.discountValue || 10),
        conditions: coupon.conditions || '',
        validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().split('T')[0] : today(),
        validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().split('T')[0] : '',
        maxUses: coupon.maxUses ? String(coupon.maxUses) : '',
    } : __assign({}, EMPTY_FORM)), form = _b[0], setForm = _b[1];
    var _c = (0, react_1.useState)(''), error = _c[0], setError = _c[1];
    var set = function (k, v) { return setForm(function (f) {
        var _a;
        return (__assign(__assign({}, f), (_a = {}, _a[k] = v, _a)));
    }); };
    var mutation = (0, react_query_1.useMutation)({
        mutationFn: function () {
            var payload = {
                title: form.title,
                description: form.description,
                discountType: form.discountType,
                discountValue: parseFloat(form.discountValue),
                conditions: form.conditions,
                validFrom: form.validFrom,
                validUntil: form.validUntil,
                maxUses: form.maxUses ? parseInt(form.maxUses) : 0,
            };
            return isEdit ? api_1.venueApi.updateCoupon(coupon._id, payload) : api_1.venueApi.createCoupon(payload);
        },
        onSuccess: function () { qc.invalidateQueries({ queryKey: ['venue-coupons'] }); onClose(); },
        onError: function (e) { var _a, _b; return setError(((_b = (_a = e.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || 'Errore'); },
    });
    var isValid = form.title && form.discountValue && form.validUntil;
    return (<div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={onClose}>
      <framer_motion_1.motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} style={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px 24px 0 0', padding: 24, width: '100%', maxWidth: 520, maxHeight: '90dvh', overflowY: 'auto' }} onClick={function (e) { return e.stopPropagation(); }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ color: '#f0ede8', fontSize: 18, fontWeight: 700 }}>{isEdit ? 'Modifica coupon' : 'Nuovo coupon'}</h2>
          <button onClick={onClose} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', color: 'rgba(240,237,232,0.5)' }}><lucide_react_1.X size={16}/></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Titolo */}
          <div>
            <label style={{ display: 'block', fontSize: 10, color: 'rgba(240,237,232,0.4)', marginBottom: 6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Titolo *</label>
            <input value={form.title} onChange={function (e) { return set('title', e.target.value); }} placeholder="Es: Aperitivo gratis con cena" style={field} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>
          </div>

          {/* Tipo sconto */}
          <div>
            <label style={{ display: 'block', fontSize: 10, color: 'rgba(240,237,232,0.4)', marginBottom: 6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Tipo di sconto</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {[
            { id: 'percentage', label: '% Percentuale' },
            { id: 'fixed', label: '€ Fisso' },
            { id: 'freebie', label: '🎁 Omaggio' },
        ].map(function (_a) {
            var id = _a.id, label = _a.label;
            return (<button key={id} onClick={function () { return set('discountType', id); }} style={{
                    padding: '10px 0', borderRadius: 10, border: "1px solid ".concat(form.discountType === id ? '#e8622a' : 'rgba(255,255,255,0.1)'),
                    background: form.discountType === id ? 'rgba(232,98,42,0.15)' : 'transparent',
                    color: form.discountType === id ? '#e8622a' : 'rgba(240,237,232,0.5)',
                    cursor: 'pointer', fontSize: 11, fontWeight: 700, transition: 'all 0.15s',
                }}>{label}</button>);
        })}
            </div>
          </div>

          {/* Valore */}
          {form.discountType !== 'freebie' && (<div>
              <label style={{ display: 'block', fontSize: 10, color: 'rgba(240,237,232,0.4)', marginBottom: 6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Valore {form.discountType === 'percentage' ? '(%)' : '(€)'} *
              </label>
              <input type="number" value={form.discountValue} onChange={function (e) { return set('discountValue', e.target.value); }} placeholder={form.discountType === 'percentage' ? '10' : '5'} min="1" style={field} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>
            </div>)}

          {/* Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
            { k: 'validFrom', label: 'Valido dal *' },
            { k: 'validUntil', label: 'Valido fino al *' },
        ].map(function (_a) {
            var k = _a.k, label = _a.label;
            return (<div key={k}>
                <label style={{ display: 'block', fontSize: 10, color: 'rgba(240,237,232,0.4)', marginBottom: 6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{label}</label>
                <input type="date" value={form[k]} onChange={function (e) { return set(k, e.target.value); }} min={today()} style={__assign(__assign({}, field), { colorScheme: 'dark' })} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>
              </div>);
        })}
          </div>

          {/* Max uses */}
          <div>
            <label style={{ display: 'block', fontSize: 10, color: 'rgba(240,237,232,0.4)', marginBottom: 6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Utilizzi massimi (0 = illimitati)</label>
            <input type="number" value={form.maxUses} onChange={function (e) { return set('maxUses', e.target.value); }} placeholder="0" min="0" style={field} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>
          </div>

          {error && <p style={{ color: '#f87171', fontSize: 12, textAlign: 'center', background: 'rgba(248,113,113,0.1)', borderRadius: 8, padding: '8px 12px' }}>{error}</p>}

          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button onClick={onClose} style={{ flex: 1, padding: '13px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(240,237,232,0.5)', cursor: 'pointer', fontSize: 13 }}>Annulla</button>
            <button onClick={function () { return mutation.mutate(); }} disabled={!isValid || mutation.isPending} style={{ flex: 2, padding: '13px', borderRadius: 12, border: 'none', background: isValid ? 'linear-gradient(135deg,#e8622a,#f0884a)' : 'rgba(255,255,255,0.08)', color: isValid ? '#fff' : 'rgba(240,237,232,0.3)', cursor: isValid ? 'pointer' : 'not-allowed', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {mutation.isPending ? 'Salvataggio...' : isEdit ? <><lucide_react_1.CheckCircle size={14}/> Salva modifiche</> : <><lucide_react_1.Plus size={14}/> Crea coupon</>}
            </button>
          </div>
        </div>
      </framer_motion_1.motion.div>
    </div>);
}
