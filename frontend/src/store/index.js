"use strict";
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
exports.useVenueStore = exports.useUserStore = exports.useAdminStore = exports.useAppStore = void 0;
var zustand_1 = require("zustand");
var middleware_1 = require("zustand/middleware");
exports.useAppStore = (0, zustand_1.create)()((0, middleware_1.persist)(function (set, get) { return ({
    city: 'bologna',
    activeCategory: null,
    savedPlaces: [],
    savedExperiences: [],
    searchQuery: '',
    setCity: function (city) { return set({ city: city }); },
    setActiveCategory: function (cat) { return set({ activeCategory: cat }); },
    toggleSaved: function (placeId) {
        var savedPlaces = get().savedPlaces;
        set({ savedPlaces: savedPlaces.includes(placeId)
                ? savedPlaces.filter(function (id) { return id !== placeId; })
                : __spreadArray(__spreadArray([], savedPlaces, true), [placeId], false) });
    },
    isSaved: function (placeId) { return get().savedPlaces.includes(placeId); },
    toggleSavedExperience: function (id) {
        var savedExperiences = get().savedExperiences;
        set({ savedExperiences: savedExperiences.includes(id)
                ? savedExperiences.filter(function (x) { return x !== id; })
                : __spreadArray(__spreadArray([], savedExperiences, true), [id], false) });
    },
    isSavedExperience: function (id) { return get().savedExperiences.includes(id); },
    setSearchQuery: function (q) { return set({ searchQuery: q }); },
}); }, { name: 'cityapp-store' }));
exports.useAdminStore = (0, zustand_1.create)()(function (set) { return ({
    token: localStorage.getItem('cityapp_admin_token'),
    admin: null,
    setAuth: function (token, admin) {
        localStorage.setItem('cityapp_admin_token', token);
        set({ token: token, admin: admin });
    },
    logout: function () {
        localStorage.removeItem('cityapp_admin_token');
        set({ token: null, admin: null });
    },
}); });
exports.useUserStore = (0, zustand_1.create)()((0, middleware_1.persist)(function (set, get) { return ({
    token: null,
    user: null,
    setAuth: function (token, user) { return set({ token: token, user: user }); },
    logout: function () { return set({ token: null, user: null }); },
    isLoggedIn: function () { return !!get().token; },
}); }, { name: 'cityapp-user' }));
exports.useVenueStore = (0, zustand_1.create)()((0, middleware_1.persist)(function (set) { return ({
    token: null,
    owner: null,
    setAuth: function (token, owner) { return set({ token: token, owner: owner }); },
    logout: function () { return set({ token: null, owner: null }); },
}); }, { name: 'cityapp-venue' }));
