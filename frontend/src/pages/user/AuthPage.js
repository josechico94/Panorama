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
exports.default = AuthPage;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var api_1 = require("@/lib/api");
var store_1 = require("@/store");
// @ts-ignore
var API_BASE = 'https://panoramabo.onrender.com';
function FafIcon() {
    return (<svg width="22" height="22" viewBox="0 0 100 100" fill="none">
      <path d="M18 10 L82 10 C82 10 82 27 65 32 L36 37 L36 47 L69 45 C69 45 69 59 57 64 L36 67 L36 90 L18 90 Z" fill="white"/>
    </svg>);
}
function AuthPage() {
    var _this = this;
    var _a;
    var _b = (0, react_1.useState)('login'), mode = _b[0], setMode = _b[1];
    var _c = (0, react_1.useState)({ name: '', email: '', password: '' }), form = _c[0], setForm = _c[1];
    var _d = (0, react_1.useState)(false), showPass = _d[0], setShowPass = _d[1];
    var _e = (0, react_1.useState)(''), error = _e[0], setError = _e[1];
    var _f = (0, react_1.useState)(''), success = _f[0], setSuccess = _f[1];
    var _g = (0, react_1.useState)(false), loading = _g[0], setLoading = _g[1];
    var setAuth = (0, store_1.useUserStore)().setAuth;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var location = (0, react_router_dom_1.useLocation)();
    var from = ((_a = location.state) === null || _a === void 0 ? void 0 : _a.from) || '/';
    var set = function (k, v) { setForm(function (f) {
        var _a;
        return (__assign(__assign({}, f), (_a = {}, _a[k] = v, _a)));
    }); setError(''); };
    var handleSubmit = function () { return __awaiter(_this, void 0, void 0, function () {
        var api, _a, res, res, err_1;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!form.email) {
                        setError('Inserisci la tua email');
                        return [2 /*return*/];
                    }
                    setError('');
                    setLoading(true);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 12, 13, 14]);
                    if (!(mode === 'forgot')) return [3 /*break*/, 7];
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 5, , 6]);
                    api = api_1.authApi;
                    if (!api.forgotPassword) return [3 /*break*/, 4];
                    return [4 /*yield*/, api.forgotPassword(form.email)];
                case 3:
                    _d.sent();
                    _d.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    _a = _d.sent();
                    return [3 /*break*/, 6];
                case 6:
                    setSuccess('Link di recupero inviato! Controlla la tua email.');
                    setLoading(false);
                    return [2 /*return*/];
                case 7:
                    if (!(mode === 'register')) return [3 /*break*/, 9];
                    if (!form.name.trim()) {
                        setError('Il nome è obbligatorio');
                        setLoading(false);
                        return [2 /*return*/];
                    }
                    if (form.password.length < 6) {
                        setError('Password minimo 6 caratteri');
                        setLoading(false);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, api_1.authApi.userRegister(form.name, form.email, form.password)];
                case 8:
                    res = _d.sent();
                    setAuth(res.token, res.user);
                    return [3 /*break*/, 11];
                case 9:
                    if (!form.password) {
                        setError('Inserisci la password');
                        setLoading(false);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, api_1.authApi.userLogin(form.email, form.password)];
                case 10:
                    res = _d.sent();
                    setAuth(res.token, res.user);
                    _d.label = 11;
                case 11:
                    navigate(from, { replace: true });
                    return [3 /*break*/, 14];
                case 12:
                    err_1 = _d.sent();
                    setError(((_c = (_b = err_1.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.error) || 'Errore, riprova');
                    return [3 /*break*/, 14];
                case 13:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 14: return [2 /*return*/];
            }
        });
    }); };
    var titles = { login: 'Bentornato', register: 'Crea account', forgot: 'Recupera accesso' };
    var subtitles = {
        login: 'Accedi per i tuoi coupon e preferiti',
        register: 'Unisciti alla community faf',
        forgot: 'Ti mandiamo un link via email',
    };
    return (<div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>

      {/* Ambient glow */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: '140%', height: '60%', background: 'radial-gradient(ellipse, rgba(187,0,255,0.18) 0%, transparent 65%)', borderRadius: '50%' }}/>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-20%', width: '60%', height: '40%', background: 'radial-gradient(ellipse, rgba(144,0,204,0.1) 0%, transparent 65%)', borderRadius: '50%' }}/>
      </div>

      {/* Back */}
      <div style={{ position: 'relative', zIndex: 1, padding: '16px 20px' }}>
        <button onClick={function () { return navigate(-1); }} style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-2)' }}>
          <lucide_react_1.ArrowLeft size={16}/>
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px 24px 40px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: 360 }}>

          {/* Logo */}
          <framer_motion_1.motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ position: 'relative', display: 'inline-flex', marginBottom: 16 }}>
              <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', background: 'radial-gradient(circle, rgba(187,0,255,0.3), transparent 70%)', animation: 'pulse-ring 3s ease-in-out infinite' }}/>
              <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, #BB00FF 0%, #7700CC 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(187,0,255,0.5), inset 0 1px 0 rgba(255,255,255,0.15)', position: 'relative' }}>
                <FafIcon />
              </div>
            </div>
            <framer_motion_1.AnimatePresence mode="wait">
              <framer_motion_1.motion.div key={mode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 32, fontWeight: 700, color: 'var(--text)', marginBottom: 6, lineHeight: 1 }}>
                  {titles[mode]}
                </h1>
                <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.5 }}>{subtitles[mode]}</p>
              </framer_motion_1.motion.div>
            </framer_motion_1.AnimatePresence>
          </framer_motion_1.motion.div>

          {/* Tabs */}
          {mode !== 'forgot' && (<framer_motion_1.motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 4, marginBottom: 24 }}>
              {['login', 'register'].map(function (m) { return (<button key={m} onClick={function () { setMode(m); setError(''); setSuccess(''); }} style={{
                    flex: 1, padding: '9px 0', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                    background: mode === m ? 'linear-gradient(135deg, #BB00FF, #9000CC)' : 'transparent',
                    color: mode === m ? '#fff' : 'var(--text-3)',
                    transition: 'all 0.2s',
                    boxShadow: mode === m ? '0 2px 12px rgba(187,0,255,0.35)' : 'none',
                }}>
                  {m === 'login' ? 'Accedi' : 'Registrati'}
                </button>); })}
            </framer_motion_1.motion.div>)}

          {/* Social */}
          {mode !== 'forgot' && (<framer_motion_1.motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              <a href={API_BASE + '/api/v1/auth/user/google'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '12px 0', borderRadius: 13, textDecoration: 'none', background: 'var(--surface)', border: '1px solid var(--border2)', color: 'var(--text)', fontSize: 14, fontWeight: 600 }}>
                <GoogleIcon /> Continua con Google
              </a>
              <a href={API_BASE + '/api/v1/auth/user/facebook'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '12px 0', borderRadius: 13, textDecoration: 'none', background: 'rgba(24,119,242,0.08)', border: '1px solid rgba(24,119,242,0.2)', color: 'var(--text)', fontSize: 14, fontWeight: 600 }}>
                <FacebookIcon /> Continua con Facebook
              </a>
            </framer_motion_1.motion.div>)}

          {/* Divider */}
          {mode !== 'forgot' && (<div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, var(--border2))' }}/>
              <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, letterSpacing: '0.1em' }}>OPPURE</span>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, var(--border2), transparent)' }}/>
            </div>)}

          {/* Fields */}
          <framer_motion_1.motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <framer_motion_1.AnimatePresence>
              {mode === 'register' && (<framer_motion_1.motion.div key="name" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <InputField icon={<lucide_react_1.User size={15}/>} placeholder="Il tuo nome" value={form.name} onChange={function (v) { return set('name', v); }}/>
                </framer_motion_1.motion.div>)}
            </framer_motion_1.AnimatePresence>

            <InputField icon={<lucide_react_1.Mail size={15}/>} placeholder="Email" type="email" value={form.email} onChange={function (v) { return set('email', v); }}/>

            {mode !== 'forgot' && (<InputField icon={<lucide_react_1.Lock size={15}/>} placeholder="Password" type={showPass ? 'text' : 'password'} value={form.password} onChange={function (v) { return set('password', v); }} onKeyDown={function (e) { return e.key === 'Enter' && handleSubmit(); }} suffix={<button type="button" onClick={function () { return setShowPass(function (s) { return !s; }); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', alignItems: 'center', padding: 0 }}>
                    {showPass ? <lucide_react_1.EyeOff size={15}/> : <lucide_react_1.Eye size={15}/>}
                  </button>}/>)}

            <framer_motion_1.AnimatePresence>
              {error && (<framer_motion_1.motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 12 }}>
                  <lucide_react_1.AlertCircle size={13} color="#f87171"/>
                  <span style={{ fontSize: 12, color: '#f87171' }}>{error}</span>
                </framer_motion_1.motion.div>)}
            </framer_motion_1.AnimatePresence>

            <framer_motion_1.AnimatePresence>
              {success && (<framer_motion_1.motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '10px 14px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 12, fontSize: 12, color: '#4ade80' }}>
                  {success}
                </framer_motion_1.motion.div>)}
            </framer_motion_1.AnimatePresence>

            <framer_motion_1.motion.button whileTap={{ scale: 0.97 }} onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '14px 0', borderRadius: 14, border: 'none', background: loading ? 'rgba(187,0,255,0.3)' : 'linear-gradient(135deg, #BB00FF 0%, #9000CC 100%)', color: '#fff', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 4px 20px rgba(187,0,255,0.45)', transition: 'all 0.2s', marginTop: 4 }}>
              {loading
            ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite', display: 'inline-block' }}/>
                    {mode === 'forgot' ? 'Invio...' : mode === 'login' ? 'Accesso...' : 'Registrazione...'}
                  </span>
            : mode === 'forgot' ? 'Invia link' : mode === 'login' ? 'Accedi' : 'Crea account'}
            </framer_motion_1.motion.button>
          </framer_motion_1.motion.div>

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {mode === 'login' && (<button onClick={function () { setMode('forgot'); setError(''); setSuccess(''); }} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: 12 }}>
                Password dimenticata?
              </button>)}
            {mode === 'forgot' && (<button onClick={function () { setMode('login'); setError(''); setSuccess(''); }} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: 12 }}>
                ← Torna al login
              </button>)}
            <div style={{ height: 1, background: 'var(--border)' }}/>
            <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
              Puoi esplorare Bologna senza account.{' '}
              <button onClick={function () { return navigate('/'); }} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                Continua come ospite
              </button>
            </p>
          </div>
        </div>
      </div>

      <style>{"\n        @keyframes spin { to { transform: rotate(360deg); } }\n        @keyframes pulse-ring { 0%,100% { opacity:0.4; transform:scale(1); } 50% { opacity:0.8; transform:scale(1.08); } }\n      "}</style>
    </div>);
}
function InputField(_a) {
    var icon = _a.icon, placeholder = _a.placeholder, _b = _a.type, type = _b === void 0 ? 'text' : _b, value = _a.value, onChange = _a.onChange, suffix = _a.suffix, onKeyDown = _a.onKeyDown;
    var _c = (0, react_1.useState)(false), focused = _c[0], setFocused = _c[1];
    return (<div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <div style={{ position: 'absolute', left: 14, color: focused ? 'var(--accent)' : 'var(--text-3)', display: 'flex', transition: 'color 0.2s', pointerEvents: 'none', zIndex: 1 }}>
        {icon}
      </div>
      <input type={type} value={value} onChange={function (e) { return onChange(e.target.value); }} placeholder={placeholder} onKeyDown={onKeyDown} onFocus={function () { return setFocused(true); }} onBlur={function () { return setFocused(false); }} style={{ width: '100%', padding: '13px 42px', borderRadius: 13, background: focused ? 'rgba(187,0,255,0.06)' : 'var(--surface)', border: '1.5px solid ' + (focused ? 'rgba(187,0,255,0.5)' : 'var(--border)'), color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'DM Sans, sans-serif', boxShadow: focused ? '0 0 0 3px rgba(187,0,255,0.1)' : 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}/>
      {suffix && <div style={{ position: 'absolute', right: 14, zIndex: 1 }}>{suffix}</div>}
    </div>);
}
function GoogleIcon() {
    return (<svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
    </svg>);
}
function FacebookIcon() {
    return (<svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>);
}
// v2
