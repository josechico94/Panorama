"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FafLogo = FafLogo;
exports.FafWordmark = FafWordmark;
exports.FafBrand = FafBrand;
// FAF Logo — F ispirata ai portici bolognesi
function FafLogo(_a) {
    var _b = _a.size, size = _b === void 0 ? 32 : _b, _c = _a.white, white = _c === void 0 ? false : _c;
    var color = white ? '#FFFFFF' : '#BB00FF';
    return (<svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* F shape inspired by Bologna's porticoes */}
      <path d="M20 10 C20 10 80 10 80 10 C80 10 80 25 65 30 C65 30 45 33 35 35 L35 45 C35 45 70 43 70 43 C70 43 70 57 57 62 C57 62 35 65 35 65 L35 90 L20 90 Z" fill={color}/>
      {/* Arch detail — portico curve */}
      <path d="M35 35 C35 35 55 32 65 28 C75 24 80 18 80 10" stroke={white ? 'rgba(255,255,255,0.3)' : 'rgba(144,0,204,0.4)'} strokeWidth="3" fill="none" strokeLinecap="round"/>
    </svg>);
}
function FafWordmark(_a) {
    var _b = _a.size, size = _b === void 0 ? 20 : _b, _c = _a.white, white = _c === void 0 ? false : _c;
    return (<span style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: size,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: white ? '#FFFFFF' : '#BB00FF',
        }}>
      faf
    </span>);
}
function FafBrand(_a) {
    var _b = _a.iconSize, iconSize = _b === void 0 ? 28 : _b, _c = _a.textSize, textSize = _c === void 0 ? 18 : _c, _d = _a.white, white = _d === void 0 ? false : _d;
    return (<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <FafLogo size={iconSize} white={white}/>
      <FafWordmark size={textSize} white={white}/>
    </div>);
}
