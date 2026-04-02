"use strict";
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
exports.default = VenueLoginPage;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var react_query_1 = require("@tanstack/react-query");
var api_1 = require("@/lib/api");
var store_1 = require("@/store");
function VenueLoginPage() {
    var _this = this;
    var _a = (0, react_1.useState)(''), email = _a[0], setEmail = _a[1];
    var _b = (0, react_1.useState)(''), password = _b[0], setPassword = _b[1];
    var _c = (0, react_1.useState)(''), error = _c[0], setError = _c[1];
    var _d = (0, react_1.useState)(false), loading = _d[0], setLoading = _d[1];
    var setAuth = (0, store_1.useVenueStore)().setAuth;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var qc = (0, react_query_1.useQueryClient)();
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var _a, token, owner, err_1;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    e.preventDefault();
                    setError('');
                    setLoading(true);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, api_1.authApi.venueLogin(email, password)];
                case 2:
                    _a = _d.sent(), token = _a.token, owner = _a.owner;
                    setAuth(token, owner);
                    qc.clear(); // clear all cached data so new venue sees fresh data
                    navigate('/locale');
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _d.sent();
                    setError(((_c = (_b = err_1.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.error) || 'Credenziali non valide');
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="min-h-dvh flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg,var(--accent),var(--accent2))' }}>
            <span className="font-display font-bold text-white text-xl" style={{ fontFamily: 'Cormorant Garamond,serif' }}>🏪</span>
          </div>
          <h1 className="font-display font-bold text-white" style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '28px', fontStyle: 'italic' }}>
            Portale Locale
          </h1>
          <p className="text-[var(--text-3)] text-sm mt-1">Gestisci il tuo locale su CityApp</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[var(--text-3)] mb-1.5 tracking-wide">Email</label>
            <input type="email" value={email} onChange={function (e) { return setEmail(e.target.value); }} className="field" placeholder="locale@esempio.com" required/>
          </div>
          <div>
            <label className="block text-xs text-[var(--text-3)] mb-1.5 tracking-wide">Password</label>
            <input type="password" value={password} onChange={function (e) { return setPassword(e.target.value); }} className="field" placeholder="••••••••" required/>
          </div>
          {error && <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2.5 text-center">{error}</p>}
          <button type="submit" disabled={loading} className="btn btn-accent w-full disabled:opacity-50">
            {loading ? 'Accesso...' : 'Accedi al pannello'}
          </button>
        </form>

        <p className="text-center text-[var(--text-3)] text-xs">
          Non hai accesso? Contatta <span className="text-[var(--accent)]">admin@cityapp.com</span>
        </p>
      </div>
    </div>);
}
