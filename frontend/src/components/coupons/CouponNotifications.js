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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CouponNotifications;
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var api_1 = require("@/lib/api");
var store_1 = require("@/store");
var NOTIFIED_KEY = 'cityapp_notified_coupons';
function getNotified() {
    try {
        return JSON.parse(localStorage.getItem(NOTIFIED_KEY) || '[]');
    }
    catch (_a) {
        return [];
    }
}
function markNotified(id) {
    var list = getNotified();
    if (!list.includes(id)) {
        localStorage.setItem(NOTIFIED_KEY, JSON.stringify(__spreadArray(__spreadArray([], list, true), [id], false)));
    }
}
function requestPermission() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!('Notification' in window))
                        return [2 /*return*/, false];
                    if (Notification.permission === 'granted')
                        return [2 /*return*/, true];
                    if (Notification.permission === 'denied')
                        return [2 /*return*/, false];
                    return [4 /*yield*/, Notification.requestPermission()];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result === 'granted'];
            }
        });
    });
}
function sendNotification(title, body, url) {
    if (Notification.permission !== 'granted')
        return;
    var n = new Notification(title, {
        body: body,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: url, // prevents duplicate notifications
    });
    n.onclick = function () {
        window.focus();
        window.location.href = url;
        n.close();
    };
    setTimeout(function () { return n.close(); }, 8000);
}
function CouponNotifications() {
    var _this = this;
    var isLoggedIn = (0, store_1.useUserStore)().isLoggedIn;
    var data = (0, react_query_1.useQuery)({
        queryKey: ['my-coupons-notify'],
        queryFn: api_1.couponsApi.myList,
        enabled: isLoggedIn(),
        staleTime: 0,
        refetchInterval: 1000 * 60 * 60, // check every hour
        refetchOnWindowFocus: true,
    }).data;
    (0, react_1.useEffect)(function () {
        if (!isLoggedIn() || !(data === null || data === void 0 ? void 0 : data.data))
            return;
        var checkCoupons = function () { return __awaiter(_this, void 0, void 0, function () {
            var granted, notified, now, _i, _a, uc, coupon, until, daysLeft, place, key3, key1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, requestPermission()];
                    case 1:
                        granted = _b.sent();
                        if (!granted)
                            return [2 /*return*/];
                        notified = getNotified();
                        now = Date.now();
                        for (_i = 0, _a = data.data; _i < _a.length; _i++) {
                            uc = _a[_i];
                            if (uc.status !== 'active')
                                continue;
                            coupon = uc.couponId;
                            if (!coupon)
                                continue;
                            until = new Date(coupon.validUntil).getTime();
                            daysLeft = Math.ceil((until - now) / (1000 * 60 * 60 * 24));
                            place = uc.placeId;
                            key3 = "".concat(uc._id, "_3d");
                            key1 = "".concat(uc._id, "_1d");
                            if (daysLeft <= 3 && daysLeft > 1 && !notified.includes(key3)) {
                                sendNotification("\u23F0 Coupon in scadenza \u2014 ".concat((place === null || place === void 0 ? void 0 : place.name) || 'Locale'), "\"".concat(coupon.title, "\" scade tra ").concat(daysLeft, " giorni. Usalo prima che sia troppo tardi!"), "/coupon/".concat(coupon._id));
                                markNotified(key3);
                            }
                            if (daysLeft <= 1 && daysLeft >= 0 && !notified.includes(key1)) {
                                sendNotification("\uD83D\uDEA8 Ultimo giorno! \u2014 ".concat((place === null || place === void 0 ? void 0 : place.name) || 'Locale'), "\"".concat(coupon.title, "\" scade OGGI. Non perdere lo sconto!"), "/coupon/".concat(coupon._id));
                                markNotified(key1);
                            }
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        checkCoupons();
    }, [data, isLoggedIn]);
    // This component renders nothing — it's a background service
    return null;
}
