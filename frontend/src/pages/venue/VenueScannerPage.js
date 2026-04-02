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
exports.default = VenueScannerPage;
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var api_1 = require("@/lib/api");
// ── Scanner engine: tries BarcodeDetector first, falls back to ZXing WASM ──
function useQRScanner(onResult, active) {
    var _this = this;
    var videoRef = (0, react_1.useRef)(null);
    var streamRef = (0, react_1.useRef)(null);
    var rafRef = (0, react_1.useRef)(0);
    var lastResultRef = (0, react_1.useRef)('');
    var _a = (0, react_1.useState)(false), cameraReady = _a[0], setCameraReady = _a[1];
    var _b = (0, react_1.useState)(''), error = _b[0], setError = _b[1];
    var _c = (0, react_1.useState)(null), engine = _c[0], setEngine = _c[1];
    var stopCamera = (0, react_1.useCallback)(function () {
        cancelAnimationFrame(rafRef.current);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(function (t) { return t.stop(); });
            streamRef.current = null;
        }
        setCameraReady(false);
    }, []);
    (0, react_1.useEffect)(function () {
        if (!active) {
            stopCamera();
            return;
        }
        var stopped = false;
        var startCamera = function () { return __awaiter(_this, void 0, void 0, function () {
            var stream, detector_1, tick_1, jsQR_1, canvas_1, ctx_1, tick_2, err_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, navigator.mediaDevices.getUserMedia({
                                video: {
                                    facingMode: { ideal: 'environment' },
                                    width: { ideal: 1280 },
                                    height: { ideal: 720 },
                                }
                            })];
                    case 1:
                        stream = _a.sent();
                        if (stopped) {
                            stream.getTracks().forEach(function (t) { return t.stop(); });
                            return [2 /*return*/];
                        }
                        streamRef.current = stream;
                        if (!videoRef.current) return [3 /*break*/, 3];
                        videoRef.current.srcObject = stream;
                        return [4 /*yield*/, videoRef.current.play()];
                    case 2:
                        _a.sent();
                        setCameraReady(true);
                        _a.label = 3;
                    case 3:
                        if (!('BarcodeDetector' in window)) return [3 /*break*/, 4];
                        setEngine('native');
                        detector_1 = new window.BarcodeDetector({ formats: ['qr_code'] });
                        tick_1 = function () { return __awaiter(_this, void 0, void 0, function () {
                            var results, raw, code, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (stopped || !videoRef.current)
                                            return [2 /*return*/];
                                        if (!(videoRef.current.readyState >= 2)) return [3 /*break*/, 4];
                                        _b.label = 1;
                                    case 1:
                                        _b.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, detector_1.detect(videoRef.current)];
                                    case 2:
                                        results = _b.sent();
                                        if (results.length > 0) {
                                            raw = results[0].rawValue;
                                            if (raw !== lastResultRef.current) {
                                                lastResultRef.current = raw;
                                                code = extractCode(raw);
                                                onResult(code);
                                                return [2 /*return*/];
                                            }
                                        }
                                        return [3 /*break*/, 4];
                                    case 3:
                                        _a = _b.sent();
                                        return [3 /*break*/, 4];
                                    case 4:
                                        rafRef.current = requestAnimationFrame(tick_1);
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        rafRef.current = requestAnimationFrame(tick_1);
                        return [3 /*break*/, 6];
                    case 4:
                        // Fallback: jsQR (lightweight, pure JS, very reliable)
                        setEngine('wasm');
                        return [4 /*yield*/, Promise.resolve().then(function () { return require('jsqr'); })];
                    case 5:
                        jsQR_1 = (_a.sent()).default;
                        canvas_1 = document.createElement('canvas');
                        ctx_1 = canvas_1.getContext('2d', { willReadFrequently: true });
                        tick_2 = function () {
                            if (stopped || !videoRef.current)
                                return;
                            var video = videoRef.current;
                            if (video.readyState >= 2 && video.videoWidth > 0) {
                                canvas_1.width = video.videoWidth;
                                canvas_1.height = video.videoHeight;
                                ctx_1.drawImage(video, 0, 0);
                                var imageData = ctx_1.getImageData(0, 0, canvas_1.width, canvas_1.height);
                                var result = jsQR_1(imageData.data, imageData.width, imageData.height, {
                                    inversionAttempts: 'dontInvert',
                                });
                                if (result && result.data !== lastResultRef.current) {
                                    lastResultRef.current = result.data;
                                    var code = extractCode(result.data);
                                    onResult(code);
                                    return;
                                }
                            }
                            rafRef.current = requestAnimationFrame(tick_2);
                        };
                        rafRef.current = requestAnimationFrame(tick_2);
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        err_1 = _a.sent();
                        if (!stopped)
                            setError((err_1 === null || err_1 === void 0 ? void 0 : err_1.message) || 'Impossibile accedere alla fotocamera');
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        }); };
        startCamera();
        return function () {
            stopped = true;
            stopCamera();
        };
    }, [active]);
    return { videoRef: videoRef, cameraReady: cameraReady, error: error, engine: engine };
}
function extractCode(raw) {
    var s = raw.trim();
    if (s.includes('/validate/'))
        return s.split('/validate/').pop().toLowerCase().trim();
    return s.toLowerCase().trim();
}
function VenueScannerPage() {
    var _this = this;
    var _a, _b;
    var _c = (0, react_1.useState)('camera'), mode = _c[0], setMode = _c[1];
    var _d = (0, react_1.useState)('idle'), status = _d[0], setStatus = _d[1];
    var _e = (0, react_1.useState)(null), result = _e[0], setResult = _e[1];
    var _f = (0, react_1.useState)(''), manualCode = _f[0], setManualCode = _f[1];
    var _g = (0, react_1.useState)(0), scanKey = _g[0], setScanKey = _g[1];
    var processingRef = (0, react_1.useRef)(false);
    var scannerActive = mode === 'camera' && status === 'idle';
    var handleScan = (0, react_1.useCallback)(function (code) { return __awaiter(_this, void 0, void 0, function () {
        var data, err_2;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (processingRef.current || !code)
                        return [2 /*return*/];
                    processingRef.current = true;
                    setStatus('loading');
                    setResult(null);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, api_1.couponsApi.validate(code)];
                case 2:
                    data = _c.sent();
                    setResult(data);
                    if (!data.valid) {
                        setStatus(data.reason === 'Già utilizzato' ? 'already_used' : 'invalid');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, api_1.couponsApi.markUsed(code)];
                case 3:
                    _c.sent();
                    setStatus('success');
                    return [3 /*break*/, 6];
                case 4:
                    err_2 = _c.sent();
                    setStatus('error');
                    setResult({ valid: false, reason: ((_b = (_a = err_2.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || 'Codice non trovato' });
                    return [3 /*break*/, 6];
                case 5:
                    processingRef.current = false;
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, []);
    var _h = useQRScanner(handleScan, scannerActive), videoRef = _h.videoRef, cameraReady = _h.cameraReady, cameraError = _h.error, engine = _h.engine;
    var reset = function () {
        setStatus('idle');
        setResult(null);
        setManualCode('');
        processingRef.current = false;
        setScanKey(function (k) { return k + 1; });
    };
    var showResult = ['success', 'already_used', 'invalid', 'error'].includes(status);
    var coupon = (_a = result === null || result === void 0 ? void 0 : result.userCoupon) === null || _a === void 0 ? void 0 : _a.couponId;
    var user = (_b = result === null || result === void 0 ? void 0 : result.userCoupon) === null || _b === void 0 ? void 0 : _b.userId;
    return (<div style={{ maxWidth: 420, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 28, height: 2, background: 'linear-gradient(90deg,#e8622a,transparent)', borderRadius: 1 }}/>
          <span style={{ fontSize: 9, color: 'rgba(240,237,232,0.35)', fontFamily: 'DM Mono,monospace', letterSpacing: '0.25em', textTransform: 'uppercase' }}>Validazione coupon</span>
        </div>
        <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 30, fontWeight: 700, color: '#f0ede8', lineHeight: 1 }}>Scanner QR</h1>
      </div>

      {/* Mode toggle */}
      {!showResult && status !== 'loading' && (<div style={{ display: 'flex', gap: 4, padding: 4, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, marginBottom: 16 }}>
          {[{ id: 'camera', icon: lucide_react_1.Camera, label: 'Fotocamera' }, { id: 'manual', icon: lucide_react_1.Keyboard, label: 'Manuale' }].map(function (_a) {
                var id = _a.id, Icon = _a.icon, label = _a.label;
                return (<button key={id} onClick={function () { setMode(id); reset(); }} style={{
                        flex: 1, padding: '9px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                        background: mode === id ? '#e8622a' : 'transparent',
                        color: mode === id ? '#fff' : 'rgba(240,237,232,0.4)',
                        fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}>
              <Icon size={13}/> {label}
            </button>);
            })}
        </div>)}

      <framer_motion_1.AnimatePresence mode="wait">
        {/* Loading */}
        {status === 'loading' && (<framer_motion_1.motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid rgba(232,98,42,0.2)', borderTopColor: '#e8622a', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }}/>
            <p style={{ color: 'rgba(240,237,232,0.5)', fontSize: 13 }}>Verifica coupon...</p>
            <style>{"@keyframes spin { to { transform: rotate(360deg) } }"}</style>
          </framer_motion_1.motion.div>)}

        {/* Camera */}
        {mode === 'camera' && status === 'idle' && (<framer_motion_1.motion.div key={'cam-' + scanKey} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {cameraError ? (<div style={{ padding: 20, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 16, textAlign: 'center' }}>
                <lucide_react_1.XCircle size={28} color="#f87171" style={{ margin: '0 auto 10px' }}/>
                <p style={{ color: '#f87171', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Fotocamera non disponibile</p>
                <p style={{ color: 'rgba(240,237,232,0.4)', fontSize: 12, marginBottom: 14 }}>{cameraError}</p>
                <button onClick={function () { return setMode('manual'); }} style={{ padding: '8px 20px', borderRadius: 10, border: '1px solid rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.1)', color: '#f87171', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                  Usa codice manuale
                </button>
              </div>) : (<div>
                {/* Video viewport */}
                <div style={{
                    position: 'relative', borderRadius: 20, overflow: 'hidden',
                    maxWidth: 340, margin: '0 auto',
                    border: '2px solid rgba(232,98,42,0.5)',
                    background: '#000', aspectRatio: '1',
                }}>
                  <video ref={videoRef} playsInline muted autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>

                  {/* Scan frame overlay */}
                  {cameraReady && (<div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                      {/* Dark corners */}
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.3) 100%)' }}/>
                      {/* Corner markers */}
                      {[
                        { top: '18%', left: '18%', borderTop: '3px solid #e8622a', borderLeft: '3px solid #e8622a' },
                        { top: '18%', right: '18%', borderTop: '3px solid #e8622a', borderRight: '3px solid #e8622a' },
                        { bottom: '18%', left: '18%', borderBottom: '3px solid #e8622a', borderLeft: '3px solid #e8622a' },
                        { bottom: '18%', right: '18%', borderBottom: '3px solid #e8622a', borderRight: '3px solid #e8622a' },
                    ].map(function (s, i) { return (<div key={i} style={__assign({ position: 'absolute', width: 26, height: 26, borderRadius: 3 }, s)}/>); })}
                      {/* Animated scan line */}
                      <div style={{
                        position: 'absolute', left: '18%', right: '18%', height: 2,
                        background: 'linear-gradient(90deg, transparent, #e8622a, transparent)',
                        animation: 'scanLine 1.6s ease-in-out infinite',
                        boxShadow: '0 0 8px #e8622a',
                    }}/>
                    </div>)}

                  {/* Loading spinner before camera ready */}
                  {!cameraReady && !cameraError && (<div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid rgba(232,98,42,0.3)', borderTopColor: '#e8622a', animation: 'spin 0.8s linear infinite' }}/>
                      <span style={{ color: 'rgba(240,237,232,0.5)', fontSize: 12 }}>Avvio fotocamera...</span>
                    </div>)}
                </div>

                {/* Engine indicator + instructions */}
                <div style={{ textAlign: 'center', marginTop: 12 }}>
                  {cameraReady && engine && (<div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 100, padding: '3px 10px', marginBottom: 8 }}>
                      <lucide_react_1.Zap size={10} color="#4ade80"/>
                      <span style={{ fontSize: 10, color: '#4ade80', fontWeight: 600 }}>
                        {engine === 'native' ? 'Scanner nativo attivo' : 'Scanner attivo'}
                      </span>
                    </div>)}
                  <p style={{ color: 'rgba(240,237,232,0.4)', fontSize: 12 }}>
                    Punta la fotocamera sul QR bianco del cliente
                  </p>
                </div>
              </div>)}
          </framer_motion_1.motion.div>)}

        {/* Manual */}
        {mode === 'manual' && status === 'idle' && (<framer_motion_1.motion.div key="manual" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <label style={{ display: 'block', fontSize: 10, color: 'rgba(240,237,232,0.4)', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
              Codice QR del cliente
            </label>
            <textarea value={manualCode} onChange={function (e) { return setManualCode(e.target.value); }} onPaste={function (e) {
                var text = e.clipboardData.getData('text').trim();
                if (text.length > 10)
                    setTimeout(function () { return handleScan(extractCode(text)); }, 100);
            }} placeholder="Incolla o digita il codice qui..." rows={3} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#f0ede8', fontSize: 13, outline: 'none', resize: 'none', fontFamily: 'DM Mono,monospace', boxSizing: 'border-box', marginBottom: 10 }} onFocus={function (e) { return (e.target.style.borderColor = '#e8622a'); }} onBlur={function (e) { return (e.target.style.borderColor = 'rgba(255,255,255,0.1)'); }}/>
            <button onClick={function () { return handleScan(extractCode(manualCode)); }} disabled={!manualCode.trim()} style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#e8622a,#f0884a)', color: '#fff', fontSize: 14, fontWeight: 700, opacity: manualCode.trim() ? 1 : 0.4 }}>
              Valida coupon
            </button>
          </framer_motion_1.motion.div>)}

        {/* Results */}
        {showResult && (<framer_motion_1.motion.div key="result" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            {status === 'success' && (<div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 20, padding: 28, textAlign: 'center' }}>
                <framer_motion_1.motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                  <lucide_react_1.CheckCircle size={56} color="#4ade80" style={{ margin: '0 auto 12px' }}/>
                </framer_motion_1.motion.div>
                <h2 style={{ color: '#4ade80', fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Coupon valido! ✓</h2>
                <p style={{ color: 'rgba(240,237,232,0.5)', fontSize: 13, marginBottom: 20 }}>Sconto applicato con successo</p>
                {coupon && (<div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 14, padding: 16, textAlign: 'left', marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <div>
                        <p style={{ color: 'rgba(240,237,232,0.4)', fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Coupon applicato</p>
                        <p style={{ color: '#f0ede8', fontSize: 15, fontWeight: 700 }}>{coupon.title}</p>
                        {user && <p style={{ color: 'rgba(240,237,232,0.4)', fontSize: 11, marginTop: 3 }}>Cliente: {user.name}</p>}
                      </div>
                      <span style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', borderRadius: 8, padding: '4px 10px', fontSize: 14, fontWeight: 800, fontFamily: 'DM Mono,monospace', flexShrink: 0 }}>
                        {coupon.discountType === 'percentage' ? '-' + coupon.discountValue + '%' : coupon.discountType === 'fixed' ? '-€' + coupon.discountValue : 'OMAGGIO'}
                      </span>
                    </div>
                  </div>)}
                <button onClick={reset} style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.1)', color: '#4ade80', cursor: 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <lucide_react_1.RefreshCw size={14}/> Scansiona un altro
                </button>
              </div>)}

            {status === 'already_used' && (<div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: 20, padding: 28, textAlign: 'center' }}>
                <lucide_react_1.AlertTriangle size={48} color="#fbbf24" style={{ margin: '0 auto 12px' }}/>
                <h2 style={{ color: '#fbbf24', fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Coupon già utilizzato</h2>
                <p style={{ color: 'rgba(240,237,232,0.5)', fontSize: 13, marginBottom: 20 }}>Questo coupon è stato già usato</p>
                <button onClick={reset} style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid rgba(251,191,36,0.3)', background: 'rgba(251,191,36,0.1)', color: '#fbbf24', cursor: 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <lucide_react_1.RefreshCw size={14}/> Riprova
                </button>
              </div>)}

            {(status === 'invalid' || status === 'error') && (<div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 20, padding: 28, textAlign: 'center' }}>
                <lucide_react_1.XCircle size={48} color="#f87171" style={{ margin: '0 auto 12px' }}/>
                <h2 style={{ color: '#f87171', fontSize: 20, fontWeight: 800, marginBottom: 6 }}>
                  {status === 'invalid' ? 'Coupon non valido' : 'Codice non trovato'}
                </h2>
                <p style={{ color: 'rgba(240,237,232,0.5)', fontSize: 13, marginBottom: 20 }}>
                  {(result === null || result === void 0 ? void 0 : result.reason) || 'Verifica che il codice sia corretto'}
                </p>
                <button onClick={reset} style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#f87171', cursor: 'pointer', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <lucide_react_1.RefreshCw size={14}/> Riprova
                </button>
              </div>)}
          </framer_motion_1.motion.div>)}
      </framer_motion_1.AnimatePresence>

      <style>{"\n        @keyframes scanLine { 0%, 100% { top: 20%; } 50% { top: 80%; } }\n        @keyframes spin { to { transform: rotate(360deg); } }\n      "}</style>
    </div>);
}
