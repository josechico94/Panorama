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
exports.default = PWAInstallPrompt;
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
function FafIcon() {
    return (<svg width="22" height="22" viewBox="0 0 100 100" fill="none">
      <path d="M18 10 L82 10 C82 10 82 27 65 32 L36 37 L36 47 L69 45 C69 45 69 59 57 64 L36 67 L36 90 L18 90 Z" fill="white"/>
    </svg>);
}
function PWAInstallPrompt() {
    var _this = this;
    var _a = (0, react_1.useState)(null), deferredPrompt = _a[0], setDeferredPrompt = _a[1];
    var _b = (0, react_1.useState)(false), show = _b[0], setShow = _b[1];
    (0, react_1.useEffect)(function () {
        var handler = function (e) {
            e.preventDefault();
            setDeferredPrompt(e);
            setTimeout(function () { return setShow(true); }, 30000);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return function () { return window.removeEventListener('beforeinstallprompt', handler); };
    }, []);
    var install = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!deferredPrompt)
                        return [2 /*return*/];
                    deferredPrompt.prompt();
                    return [4 /*yield*/, deferredPrompt.userChoice];
                case 1:
                    _a.sent();
                    setDeferredPrompt(null);
                    setShow(false);
                    return [2 /*return*/];
            }
        });
    }); };
    return (<framer_motion_1.AnimatePresence>
      {show && (<framer_motion_1.motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ type: 'spring', stiffness: 280, damping: 26 }} style={{
                position: 'fixed', bottom: 80, left: 16, right: 16, zIndex: 50,
                background: 'var(--bg2)',
                border: '1px solid rgba(187,0,255,0.25)',
                borderRadius: 18,
                padding: '14px 16px',
                display: 'flex', alignItems: 'center', gap: 12,
                boxShadow: '0 8px 32px rgba(187,0,255,0.2)',
            }}>
          <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'linear-gradient(135deg, #BB00FF, #9000CC)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, boxShadow: '0 2px 10px rgba(187,0,255,0.4)',
            }}>
            <FafIcon />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'var(--text)', fontSize: 13, fontWeight: 700, marginBottom: 2 }}>
              Installa FafApp
            </p>
            <p style={{ color: 'var(--text-3)', fontSize: 11 }}>
              Aggiungila alla schermata home
            </p>
          </div>
          <button onClick={install} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '8px 13px', borderRadius: 10,
                background: 'linear-gradient(135deg, #BB00FF, #9000CC)',
                color: '#fff', border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: 700, flexShrink: 0,
                boxShadow: '0 2px 10px rgba(187,0,255,0.35)',
            }}>
            <lucide_react_1.Download size={12}/> Installa
          </button>
          <button onClick={function () { return setShow(false); }} style={{
                padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer',
                background: 'transparent', color: 'var(--text-3)', flexShrink: 0,
            }}>
            <lucide_react_1.X size={15}/>
          </button>
        </framer_motion_1.motion.div>)}
    </framer_motion_1.AnimatePresence>);
}
