import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from 'lucide-react'
import { adminApi } from '@/lib/api'
import { getCategoryConfig, CATEGORIES } from '@/types'
import type { Place } from '@/types'

export default function AdminPlacesPage() {
  const [categoryFilter, setCategoryFilter] = useState('')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-places', categoryFilter],
    queryFn: () => adminApi.listPlaces(categoryFilter ? { category: categoryFilter } : undefined),
  })

  const deleteMutation = useMutation({
    mutationFn: adminApi.deletePlace,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-places'] }),
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      adminApi.updatePlace(id, { 'meta.active': active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-places'] }),
  })

  const places: Place[] = data?.data ?? []

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Eliminare "${name}"?`)) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Luoghi</h1>
          <p className="text-white/40 text-sm mt-1">{places.length} posti</p>
        </div>
        <Link to="/admin/places/new" className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Nuovo posto
        </Link>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setCategoryFilter('')}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
            !categoryFilter ? 'bg-white/10 text-white border-white/20' : 'text-white/40 border-white/10 hover:bg-white/5'
          }`}
        >
          Tutti
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id === categoryFilter ? '' : cat.id)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
              cat.id === categoryFilter ? 'text-white' : 'text-white/40 border-white/10 hover:bg-white/5'
            }`}
            style={cat.id === categoryFilter ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-2">
          {[1,2,3,4].map(i => <div key={i} className="h-16 skeleton rounded-xl" />)}
        </div>
      ) : places.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <p className="text-4xl mb-3">📍</p>
          <p>Nessun posto trovato</p>
          <Link to="/admin/places/new" className="btn-primary inline-block mt-4">Aggiungi il primo posto</Link>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
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
              {places.map(place => {
                const cat = getCategoryConfig(place.category)
                return (
                  <tr key={place._id} className="hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {place.meta.featured && <Star size={12} className="text-yellow-400 shrink-0" />}
                        <span className="text-white text-sm font-medium truncate max-w-[160px]">{place.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: cat.bgColor, color: cat.color }}
                      >
                        {cat.emoji}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/40 text-sm hidden sm:table-cell">
                      {place.location.neighborhood || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        place.meta.active
                          ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                          : 'bg-white/5 text-white/30 border border-white/10'
                      }`}>
                        {place.meta.active ? 'Attivo' : 'Nascosto'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleMutation.mutate({ id: place._id, active: !place.meta.active })}
                          className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all"
                          title={place.meta.active ? 'Nascondi' : 'Pubblica'}
                        >
                          {place.meta.active ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <Link
                          to={`/admin/places/${place._id}/edit`}
                          className="p-1.5 rounded-lg text-white/30 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(place._id, place.name)}
                          className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
