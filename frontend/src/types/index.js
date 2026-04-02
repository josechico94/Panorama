"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRICE_LABELS = exports.getCategoryConfig = exports.CATEGORIES = void 0;
exports.CATEGORIES = [
    { id: 'eat', label: 'Mangiare', emoji: '🍽️', color: '#f97316', bgColor: 'rgba(249,115,22,0.15)' },
    { id: 'drink', label: 'Bere', emoji: '🍹', color: '#a855f7', bgColor: 'rgba(168,85,247,0.15)' },
    { id: 'shop', label: 'Shopping', emoji: '🛍️', color: '#ec4899', bgColor: 'rgba(236,72,153,0.15)' },
    { id: 'walk', label: 'Passeggio', emoji: '🚶', color: '#22c55e', bgColor: 'rgba(34,197,94,0.15)' },
    { id: 'culture', label: 'Cultura', emoji: '🏛️', color: '#3b82f6', bgColor: 'rgba(59,130,246,0.15)' },
    { id: 'sport', label: 'Sport', emoji: '⚡', color: '#84cc16', bgColor: 'rgba(132,204,22,0.15)' },
    { id: 'night', label: 'Notte', emoji: '🌙', color: '#6366f1', bgColor: 'rgba(99,102,241,0.15)' },
];
var getCategoryConfig = function (id) { var _a; return (_a = exports.CATEGORIES.find(function (c) { return c.id === id; })) !== null && _a !== void 0 ? _a : exports.CATEGORIES[0]; };
exports.getCategoryConfig = getCategoryConfig;
exports.PRICE_LABELS = {
    1: '€',
    2: '€€',
    3: '€€€',
    4: '€€€€',
};
