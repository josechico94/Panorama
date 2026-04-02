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
exports.default = SAUsers;
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var api_1 = require("@/lib/api");
var lucide_react_1 = require("lucide-react");
var card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' };
var field = { width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f0ede8', fontSize: 13, outline: 'none', boxSizing: 'border-box' };
function SAUsers() {
    var _a, _b;
    var _c = (0, react_1.useState)(''), search = _c[0], setSearch = _c[1];
    var qc = (0, react_query_1.useQueryClient)();
    var _d = (0, react_query_1.useQuery)({
        queryKey: ['sa-users', search],
        queryFn: function () { return api_1.superAdminApi.listUsers(search ? { search: search } : undefined); },
    }), data = _d.data, isLoading = _d.isLoading;
    var deleteMutation = (0, react_query_1.useMutation)({
        mutationFn: api_1.superAdminApi.deleteUser,
        onSuccess: function () { return qc.invalidateQueries({ queryKey: ['sa-users'] }); },
    });
    var users = (_a = data === null || data === void 0 ? void 0 : data.data) !== null && _a !== void 0 ? _a : [];
    return (<div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 28, fontWeight: 700, color: '#f0ede8' }}>Utenti</h1>
        <p style={{ color: 'rgba(240,237,232,0.35)', fontSize: 12, marginTop: 2 }}>{(_b = data === null || data === void 0 ? void 0 : data.total) !== null && _b !== void 0 ? _b : 0} registrati</p>
      </div>

      <div style={{ position: 'relative', marginBottom: 16 }}>
        <lucide_react_1.Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,237,232,0.3)' }}/>
        <input value={search} onChange={function (e) { return setSearch(e.target.value); }} placeholder="Cerca per nome o email..." style={__assign(__assign({}, field), { paddingLeft: 36 })}/>
      </div>

      <div style={card}>
        {isLoading ? (<div style={{ padding: 32, textAlign: 'center', color: 'rgba(240,237,232,0.3)' }}>Caricamento...</div>) : users.length === 0 ? (<div style={{ padding: 48, textAlign: 'center', color: 'rgba(240,237,232,0.3)' }}>
            <lucide_react_1.User size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }}/>
            <p>Nessun utente trovato</p>
          </div>) : (<table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Utente', 'Email', 'Registrato il', ''].map(function (h) { return (<th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'rgba(240,237,232,0.3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{h}</th>); })}
              </tr>
            </thead>
            <tbody>
              {users.map(function (user) {
                var _a;
                return (<tr key={user._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(168,85,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ color: '#a855f7', fontSize: 11, fontWeight: 700 }}>{(_a = user.name) === null || _a === void 0 ? void 0 : _a.charAt(0).toUpperCase()}</span>
                      </div>
                      <span style={{ color: '#f0ede8', fontSize: 13, fontWeight: 600 }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'rgba(240,237,232,0.45)', fontSize: 12 }}>{user.email}</td>
                  <td style={{ padding: '12px 16px', color: 'rgba(240,237,232,0.3)', fontSize: 11, fontFamily: 'DM Mono,monospace' }}>
                    {new Date(user.createdAt).toLocaleDateString('it-IT')}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button onClick={function () { return confirm("Eliminare utente \"".concat(user.name, "\"?")) && deleteMutation.mutate(user._id); }} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: 'rgba(240,237,232,0.3)', transition: 'all 0.15s' }} onMouseEnter={function (e) { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; }} onMouseLeave={function (e) { e.currentTarget.style.color = 'rgba(240,237,232,0.3)'; e.currentTarget.style.background = 'transparent'; }}>
                      <lucide_react_1.Trash2 size={14}/>
                    </button>
                  </td>
                </tr>);
            })}
            </tbody>
          </table>)}
      </div>
    </div>);
}
