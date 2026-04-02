"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminPlacesPage;
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var api_1 = require("@/lib/api");
var types_1 = require("@/types");
function AdminPlacesPage() {
    var _a;
    var _b = (0, react_1.useState)(''), categoryFilter = _b[0], setCategoryFilter = _b[1];
    var queryClient = (0, react_query_1.useQueryClient)();
    var _c = (0, react_query_1.useQuery)({
        queryKey: ['admin-places', categoryFilter],
        queryFn: function () { return api_1.adminApi.listPlaces(categoryFilter ? { category: categoryFilter } : undefined); },
    }), data = _c.data, isLoading = _c.isLoading;
    var deleteMutation = (0, react_query_1.useMutation)({
        mutationFn: api_1.adminApi.deletePlace,
        onSuccess: function () { return queryClient.invalidateQueries({ queryKey: ['admin-places'] }); },
    });
    var toggleMutation = (0, react_query_1.useMutation)({
        mutationFn: function (_a) {
            var id = _a.id, active = _a.active;
            return api_1.adminApi.updatePlace(id, { 'meta.active': active });
        },
        onSuccess: function () { return queryClient.invalidateQueries({ queryKey: ['admin-places'] }); },
    });
    var places = (_a = data === null || data === void 0 ? void 0 : data.data) !== null && _a !== void 0 ? _a : [];
    var handleDelete = function (id, name) {
        if (confirm("Eliminare \"".concat(name, "\"?"))) {
            deleteMutation.mutate(id);
        }
    };
    return (<div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Luoghi</h1>
          <p className="text-white/40 text-sm mt-1">{places.length} posti</p>
        </div>
        <react_router_dom_1.Link to="/admin/places/new" className="btn-primary flex items-center gap-2">
          <lucide_react_1.Plus size={16}/> Nuovo posto
        </react_router_dom_1.Link>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button onClick={function () { return setCategoryFilter(''); }} className={"shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ".concat(!categoryFilter ? 'bg-white/10 text-white border-white/20' : 'text-white/40 border-white/10 hover:bg-white/5')}>
          Tutti
        </button>
        {types_1.CATEGORIES.map(function (cat) { return (<button key={cat.id} onClick={function () { return setCategoryFilter(cat.id === categoryFilter ? '' : cat.id); }} className={"shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ".concat(cat.id === categoryFilter ? 'text-white' : 'text-white/40 border-white/10 hover:bg-white/5')} style={cat.id === categoryFilter ? { backgroundColor: cat.color, borderColor: cat.color } : {}}>
            {cat.emoji} {cat.label}
          </button>); })}
      </div>

      {/* Table */}
      {isLoading ? (<div className="space-y-2">
          {[1, 2, 3, 4].map(function (i) { return <div key={i} className="h-16 skeleton rounded-xl"/>; })}
        </div>) : places.length === 0 ? (<div className="text-center py-16 text-white/30">
          <p className="text-4xl mb-3">📍</p>
          <p>Nessun posto trovato</p>
          <react_router_dom_1.Link to="/admin/places/new" className="btn-primary inline-block mt-4">Aggiungi il primo posto</react_router_dom_1.Link>
        </div>) : (<div className="glass rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th className="px-4 py-3 text-xs font-medium text-white/30 uppercase tracking-wider">Nome</th>
                <th className="px-4 py-3 text-xs font-medium text-white/30 uppercase tracking-wider">Cat.</th>
                <th className="px-4 py-3 text-xs font-medium text-white/30 uppercase tracking-wider hidden sm:table-cell">Zona</th>
                <th className="px-4 py-3 text-xs font-medium text-white/30 uppercase tracking-wider">Stato</th>
                <th className="px-4 py-3 text-xs font-medium text-white/30 uppercase tracking-wider text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {places.map(function (place) {
                var cat = (0, types_1.getCategoryConfig)(place.category);
                return (<tr key={place._id} className="hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {place.meta.featured && <lucide_react_1.Star size={12} className="text-yellow-400 shrink-0"/>}
                        <span className="text-white text-sm font-medium truncate max-w-[160px]">{place.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: cat.bgColor, color: cat.color }}>
                        {cat.emoji}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/40 text-sm hidden sm:table-cell">
                      {place.location.neighborhood || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={"inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ".concat(place.meta.active
                        ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                        : 'bg-white/5 text-white/30 border border-white/10')}>
                        {place.meta.active ? 'Attivo' : 'Nascosto'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={function () { return toggleMutation.mutate({ id: place._id, active: !place.meta.active }); }} className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all" title={place.meta.active ? 'Nascondi' : 'Pubblica'}>
                          {place.meta.active ? <lucide_react_1.EyeOff size={14}/> : <lucide_react_1.Eye size={14}/>}
                        </button>
                        <react_router_dom_1.Link to={"/admin/places/".concat(place._id, "/edit")} className="p-1.5 rounded-lg text-white/30 hover:text-blue-400 hover:bg-blue-400/10 transition-all">
                          <lucide_react_1.Pencil size={14}/>
                        </react_router_dom_1.Link>
                        <button onClick={function () { return handleDelete(place._id, place.name); }} className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all">
                          <lucide_react_1.Trash2 size={14}/>
                        </button>
                      </div>
                    </td>
                  </tr>);
            })}
            </tbody>
          </table>
        </div>)}
    </div>);
}
