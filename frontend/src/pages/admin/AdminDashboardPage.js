"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminDashboardPage;
var react_query_1 = require("@tanstack/react-query");
var lucide_react_1 = require("lucide-react");
var api_1 = require("@/lib/api");
var types_1 = require("@/types");
function AdminDashboardPage() {
    var _a, _b, _c, _d, _e;
    var _f = (0, react_query_1.useQuery)({
        queryKey: ['admin-stats'],
        queryFn: api_1.adminApi.stats,
    }), stats = _f.data, isLoading = _f.isLoading;
    if (isLoading) {
        return (<div className="space-y-6">
        <div className="h-8 skeleton rounded-xl w-48"/>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(function (i) { return <div key={i} className="h-28 skeleton rounded-2xl"/>; })}
        </div>
      </div>);
    }
    var statCards = [
        { label: 'Luoghi totali', value: (_a = stats === null || stats === void 0 ? void 0 : stats.total) !== null && _a !== void 0 ? _a : 0, icon: lucide_react_1.MapPin, color: '#f97316' },
        { label: 'Pubblicati', value: (_b = stats === null || stats === void 0 ? void 0 : stats.active) !== null && _b !== void 0 ? _b : 0, icon: lucide_react_1.Activity, color: '#22c55e' },
        { label: 'In evidenza', value: (_c = stats === null || stats === void 0 ? void 0 : stats.featured) !== null && _c !== void 0 ? _c : 0, icon: lucide_react_1.Star, color: '#f59e0b' },
    ];
    return (<div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Panoramica CityApp Bologna</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map(function (_a) {
            var label = _a.label, value = _a.value, Icon = _a.icon, color = _a.color;
            return (<div key={label} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white/50 text-sm">{label}</p>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: "".concat(color, "20") }}>
                <Icon size={16} style={{ color: color }}/>
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{value}</p>
          </div>);
        })}
      </div>

      {/* By category */}
      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-4">Per categoria</h2>
        <div className="space-y-3">
          {((_d = stats === null || stats === void 0 ? void 0 : stats.byCategory) !== null && _d !== void 0 ? _d : []).map(function (_a) {
            var _id = _a._id, count = _a.count;
            var cat = (0, types_1.getCategoryConfig)(_id);
            var pct = (stats === null || stats === void 0 ? void 0 : stats.total) ? Math.round((count / stats.total) * 100) : 0;
            return (<div key={_id} className="flex items-center gap-3">
                <span className="text-lg w-7">{cat.emoji}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70">{cat.label}</span>
                    <span className="text-white/40">{count}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: "".concat(pct, "%"), backgroundColor: cat.color }}/>
                  </div>
                </div>
              </div>);
        })}
        </div>
      </div>

      {/* Top viewed */}
      {((_e = stats === null || stats === void 0 ? void 0 : stats.topViewed) === null || _e === void 0 ? void 0 : _e.length) > 0 && (<div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-4">Più visti</h2>
          <div className="space-y-3">
            {stats.topViewed.map(function (p, i) {
                var _a, _b;
                return (<div key={p._id} className="flex items-center gap-3">
                <span className="text-white/20 text-sm w-5 text-right">{i + 1}</span>
                <span className="text-lg">{(0, types_1.getCategoryConfig)(p.category).emoji}</span>
                <span className="flex-1 text-white/80 text-sm truncate">{p.name}</span>
                <span className="text-white/40 text-xs flex items-center gap-1">
                  <lucide_react_1.Eye size={11}/> {(_b = (_a = p.meta) === null || _a === void 0 ? void 0 : _a.views) !== null && _b !== void 0 ? _b : 0}
                </span>
              </div>);
            })}
          </div>
        </div>)}
    </div>);
}
