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
exports.weeklyOffersApi = exports.experiencesApi = exports.api = exports.reviewsApi = exports.superAdminApi = exports.adminApi = exports.venueApi = exports.couponsApi = exports.authApi = exports.placesApi = void 0;
var axios_1 = require("axios");
var BASE_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? 'https://panoramabo.onrender.com/api/v1'
    : '/api/v1';
var getToken = function (role) {
    var _a, _b, _c, _d;
    try {
        if (role === 'admin' || role === 'any') {
            var t = localStorage.getItem('cityapp_admin_token');
            if (t)
                return t;
        }
        if (role === 'venue' || role === 'any') {
            var raw = localStorage.getItem('cityapp-venue');
            if (raw) {
                var t = (_b = (_a = JSON.parse(raw)) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.token;
                if (t)
                    return t;
            }
        }
        if (role === 'user' || role === 'any') {
            var raw = localStorage.getItem('cityapp-user');
            if (raw) {
                var t = (_d = (_c = JSON.parse(raw)) === null || _c === void 0 ? void 0 : _c.state) === null || _d === void 0 ? void 0 : _d.token;
                if (t)
                    return t;
            }
        }
    }
    catch (_e) { }
    return null;
};
var makeApi = function (role) {
    var instance = axios_1.default.create({ baseURL: BASE_URL });
    instance.interceptors.request.use(function (config) {
        var token = getToken(role);
        if (token)
            config.headers.Authorization = "Bearer ".concat(token);
        return config;
    });
    instance.interceptors.response.use(function (res) { return res; }, function (err) {
        var _a;
        if (((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
            var path = window.location.pathname;
            if (role === 'admin' && path.startsWith('/admin') && path !== '/admin/login') {
                localStorage.removeItem('cityapp_admin_token');
                window.location.href = '/admin/login';
            }
            if (role === 'venue' && path.startsWith('/locale') && path !== '/locale/login') {
                window.location.href = '/locale/login';
            }
        }
        return Promise.reject(err);
    });
    return instance;
};
var apiPublic = makeApi('any');
var apiAdmin = makeApi('admin');
var apiUser = makeApi('user');
var apiVenue = makeApi('venue');
exports.placesApi = {
    list: function (params) { return apiPublic.get('/places', { params: params }).then(function (r) { return r.data; }); },
    get: function (slug) { return apiPublic.get("/places/".concat(slug)).then(function (r) { return r.data; }); },
    featured: function () { return apiPublic.get('/places/featured').then(function (r) { return r.data; }); },
    nearby: function (lat, lng, params) { return apiPublic.get('/places/nearby', { params: __assign({ lat: lat, lng: lng }, params) }).then(function (r) { return r.data; }); },
};
exports.authApi = {
    adminLogin: function (email, password) { return apiPublic.post('/auth/login', { email: email, password: password }).then(function (r) { return r.data; }); },
    adminMe: function () { return apiAdmin.get('/auth/me').then(function (r) { return r.data; }); },
    userRegister: function (name, email, password) { return apiPublic.post('/auth/user/register', { name: name, email: email, password: password }).then(function (r) { return r.data; }); },
    userLogin: function (email, password) { return apiPublic.post('/auth/user/login', { email: email, password: password }).then(function (r) { return r.data; }); },
    userMe: function () { return apiUser.get('/auth/user/me').then(function (r) { return r.data; }); },
    venueLogin: function (email, password) { return apiPublic.post('/auth/venue/login', { email: email, password: password }).then(function (r) { return r.data; }); },
};
exports.couponsApi = {
    active: function () { return apiPublic.get('/coupons/active').then(function (r) { return r.data; }); },
    forPlace: function (placeId) { return apiPublic.get("/coupons/place/".concat(placeId)).then(function (r) { return r.data; }); },
    get: function (id) { return apiPublic.get("/coupons/".concat(id)).then(function (r) { return r.data; }); },
    claim: function (id) { return apiUser.post("/coupons/".concat(id, "/claim")).then(function (r) { return r.data; }); },
    myList: function () { return apiUser.get('/coupons/my/list').then(function (r) { return r.data; }); },
    validate: function (code) { return apiPublic.get("/coupons/validate/".concat(code)).then(function (r) { return r.data; }); },
    markUsed: function (code) { return apiPublic.post("/coupons/use/".concat(code)).then(function (r) { return r.data; }); },
};
exports.venueApi = {
    me: function () { return apiVenue.get('/venue/me').then(function (r) { return r.data; }); },
    updateMe: function (data) { return apiVenue.put('/venue/me', data).then(function (r) { return r.data; }); },
    coupons: function () { return apiVenue.get('/venue/coupons').then(function (r) { return r.data; }); },
    createCoupon: function (data) { return apiVenue.post('/venue/coupons', data).then(function (r) { return r.data; }); },
    updateCoupon: function (id, data) { return apiVenue.put("/venue/coupons/".concat(id), data).then(function (r) { return r.data; }); },
    deleteCoupon: function (id) { return apiVenue.delete("/venue/coupons/".concat(id)).then(function (r) { return r.data; }); },
    couponStats: function (id) { return apiVenue.get("/venue/coupons/".concat(id, "/stats")).then(function (r) { return r.data; }); },
};
exports.adminApi = {
    login: function (email, password) { return apiPublic.post('/auth/login', { email: email, password: password }).then(function (r) { return r.data; }); },
    me: function () { return apiAdmin.get('/auth/me').then(function (r) { return r.data; }); },
    stats: function () { return apiAdmin.get('/admin/stats').then(function (r) { return r.data; }); },
    listPlaces: function (params) { return apiAdmin.get('/admin/places', { params: params }).then(function (r) { return r.data; }); },
    createPlace: function (data) { return apiAdmin.post('/admin/places', data).then(function (r) { return r.data; }); },
    updatePlace: function (id, data) { return apiAdmin.put("/admin/places/".concat(id), data).then(function (r) { return r.data; }); },
    deletePlace: function (id) { return apiAdmin.delete("/admin/places/".concat(id)).then(function (r) { return r.data; }); },
    upload: function (file) {
        var fd = new FormData();
        fd.append('image', file);
        return apiAdmin.post('/admin/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(function (r) { return r.data; });
    },
};
exports.superAdminApi = {
    stats: function () { return apiAdmin.get('/superadmin/stats').then(function (r) { return r.data; }); },
    listPlaces: function (params) { return apiAdmin.get('/superadmin/places', { params: params }).then(function (r) { return r.data; }); },
    createPlace: function (data) { return apiAdmin.post('/superadmin/places', data).then(function (r) { return r.data; }); },
    updatePlace: function (id, data) { return apiAdmin.put("/superadmin/places/".concat(id), data).then(function (r) { return r.data; }); },
    deletePlace: function (id) { return apiAdmin.delete("/superadmin/places/".concat(id)).then(function (r) { return r.data; }); },
    listUsers: function (params) { return apiAdmin.get('/superadmin/users', { params: params }).then(function (r) { return r.data; }); },
    deleteUser: function (id) { return apiAdmin.delete("/superadmin/users/".concat(id)).then(function (r) { return r.data; }); },
    listCoupons: function (params) { return apiAdmin.get('/superadmin/coupons', { params: params }).then(function (r) { return r.data; }); },
    updateCoupon: function (id, data) { return apiAdmin.put("/superadmin/coupons/".concat(id), data).then(function (r) { return r.data; }); },
    deleteCoupon: function (id) { return apiAdmin.delete("/superadmin/coupons/".concat(id)).then(function (r) { return r.data; }); },
    listReviews: function (params) { return apiAdmin.get('/superadmin/reviews', { params: params }).then(function (r) { return r.data; }); },
    deleteReview: function (id) { return apiAdmin.delete("/superadmin/reviews/".concat(id)).then(function (r) { return r.data; }); },
    listVenueOwners: function (params) { return apiAdmin.get('/superadmin/venue-owners', { params: params }).then(function (r) { return r.data; }); },
    createVenueOwner: function (data) { return apiAdmin.post('/superadmin/venue-owners', data).then(function (r) { return r.data; }); },
    updateVenueOwner: function (id, data) { return apiAdmin.put("/superadmin/venue-owners/".concat(id), data).then(function (r) { return r.data; }); },
    deleteVenueOwner: function (id) { return apiAdmin.delete("/superadmin/venue-owners/".concat(id)).then(function (r) { return r.data; }); },
    upload: function (file) {
        var fd = new FormData();
        fd.append('image', file);
        return apiAdmin.post('/superadmin/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(function (r) { return r.data; });
    },
};
exports.reviewsApi = {
    forPlace: function (placeId) { return apiPublic.get("/reviews/place/".concat(placeId)).then(function (r) { return r.data; }); },
    create: function (placeId, data) { return apiUser.post("/reviews/place/".concat(placeId), data).then(function (r) { return r.data; }); },
    forExperience: function (experienceId) { return apiPublic.get("/reviews/experience/".concat(experienceId)).then(function (r) { return r.data; }); },
    createForExp: function (experienceId, data) { return apiUser.post("/reviews/experience/".concat(experienceId), data).then(function (r) { return r.data; }); },
    delete: function (id) { return apiUser.delete("/reviews/".concat(id)).then(function (r) { return r.data; }); },
};
exports.api = apiPublic;
// ── Experiences API ──
exports.experiencesApi = {
    list: function (params) { return apiPublic.get('/experiences', { params: params }).then(function (r) { return r.data; }); },
    get: function (slug) { return apiPublic.get("/experiences/".concat(slug)).then(function (r) { return r.data; }); },
    create: function (data) { return apiAdmin.post('/experiences', data).then(function (r) { return r.data; }); },
    update: function (id, data) { return apiAdmin.put("/experiences/".concat(id), data).then(function (r) { return r.data; }); },
    delete: function (id) { return apiAdmin.delete("/experiences/".concat(id)).then(function (r) { return r.data; }); },
};
// ── Weekly Offers API ──
exports.weeklyOffersApi = {
    list: function () { return apiPublic.get('/coupons/active?limit=50').then(function (r) { return r.data; }); },
};
