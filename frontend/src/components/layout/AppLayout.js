"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AppLayout;
var react_router_dom_1 = require("react-router-dom");
var BottomNav_1 = require("./BottomNav");
var TopBar_1 = require("./TopBar");
var CouponSlider_1 = require("@/components/coupons/CouponSlider");
var CouponNotifications_1 = require("@/components/coupons/CouponNotifications");
var PWAInstallPrompt_1 = require("@/components/ui/PWAInstallPrompt");
function AppLayout() {
    return (<div style={{
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg)',
            transition: 'background 0.3s ease',
        }}>
      <TopBar_1.default />
      <main style={{
            flex: 1,
            paddingTop: '56px', /* TopBar height */
            paddingBottom: '136px', /* BottomNav + CouponSlider */
        }}>
        <react_router_dom_1.Outlet />
      </main>
      <CouponNotifications_1.default />
      <CouponSlider_1.default />
      <PWAInstallPrompt_1.default />
      <BottomNav_1.default />
    </div>);
}
