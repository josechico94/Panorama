"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CouponSlider;
var react_query_1 = require("@tanstack/react-query");
var react_router_dom_1 = require("react-router-dom");
var framer_motion_1 = require("framer-motion");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var api_1 = require("@/lib/api");
function CouponSlider() {
    var _a;
    var _b = (0, react_1.useState)(false), dismissed = _b[0], setDismissed = _b[1];
    var data = (0, react_query_1.useQuery)({
        queryKey: ['active-coupons-slider'],
        queryFn: function () { return api_1.couponsApi.active(); },
        refetchInterval: 5 * 60 * 1000,
    }).data;
    var coupons = (_a = data === null || data === void 0 ? void 0 : data.data) !== null && _a !== void 0 ? _a : [];
    if (!coupons.length || dismissed)
        return null;
    return (<framer_motion_1.AnimatePresence>
      <framer_motion_1.motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }} style={{
            position: 'fixed', bottom: 68, left: 0, right: 0, zIndex: 38,
            background: 'linear-gradient(135deg, #BB00FF, #9000CC)',
            padding: '10px 16px',
            boxShadow: '0 -4px 24px rgba(187,0,255,0.35)',
        }}>
        <div style={{
            maxWidth: 672, margin: '0 auto',
            display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
        }}>
            <lucide_react_1.Tag size={13} color="rgba(255,255,255,0.8)"/>
            <span style={{
            fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.75)',
            letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'DM Mono',
        }}>
              OFFERTE
            </span>
            <span style={{
            fontSize: 9, fontWeight: 800, background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%', width: 16, height: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontFamily: 'DM Mono',
        }}>
              {coupons.length}
            </span>
          </div>

          {/* Scrolling coupons */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ display: 'flex', gap: 8, overflow: 'hidden' }}>
              {coupons.slice(0, 3).map(function (c) {
            var _a, _b;
            return (<react_router_dom_1.Link key={c._id} to={"/coupon/".concat(c._id)} style={{ textDecoration: 'none', flexShrink: 0 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: 8, padding: '4px 8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                }}>
                    {((_b = (_a = c.placeId) === null || _a === void 0 ? void 0 : _a.media) === null || _b === void 0 ? void 0 : _b.coverImage) && (<img src={c.placeId.media.coverImage} alt="" style={{ width: 20, height: 20, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }}/>)}
                    <div style={{ minWidth: 0 }}>
                      <p style={{
                    color: '#fff', fontSize: 11, fontWeight: 700,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    maxWidth: 100,
                }}>
                        {c.title}
                      </p>
                      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9, fontFamily: 'DM Mono', fontWeight: 600 }}>
                        {c.discountType === 'percentage' ? "-".concat(c.discountValue, "%")
                    : c.discountType === 'fixed' ? "-\u20AC".concat(c.discountValue)
                        : 'OMAGGIO'}
                      </p>
                    </div>
                  </div>
                </react_router_dom_1.Link>);
        })}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <react_router_dom_1.Link to="/offerte" style={{
            display: 'flex', alignItems: 'center', gap: 3,
            color: 'rgba(255,255,255,0.85)', textDecoration: 'none',
            fontSize: 10, fontWeight: 600,
        }}>
              Tutte <lucide_react_1.ChevronRight size={11}/>
            </react_router_dom_1.Link>
            <button onClick={function () { return setDismissed(true); }} style={{
            width: 22, height: 22, borderRadius: 6, border: 'none',
            background: 'rgba(255,255,255,0.15)', color: '#fff',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginLeft: 4,
        }}>
              <lucide_react_1.X size={11}/>
            </button>
          </div>
        </div>
      </framer_motion_1.motion.div>
    </framer_motion_1.AnimatePresence>);
}
