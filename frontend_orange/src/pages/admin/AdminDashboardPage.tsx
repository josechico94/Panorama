import { useQuery } from '@tanstack/react-query'
import { MapPin, Eye, Star, Activity } from 'lucide-react'
import { adminApi } from '@/lib/api'
import { getCategoryConfig } from '@/types'

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminApi.stats,
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 skeleton rounded-xl w-48" />
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-28 skeleton rounded-2xl" />)}
        </div>
      </div>
    )
  }

  const statCards = [
    { label: 'Luoghi totali', value: stats?.total ?? 0, icon: MapPin, color: '#f97316' },
    { label: 'Pubblicati', value: stats?.active ?? 0, icon: Activity, color: '#22c55e' },
    { label: 'In evidenza', value: stats?.featured ?? 0, icon: Star, color: '#f59e0b' },
  ]

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Panoramica CityApp Bologna</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white/50 text-sm">{label}</p>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                <Icon size={16} style={{ color }} />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* By category */}
      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-4">Per categoria</h2>
        <div className="space-y-3">
          {(stats?.byCategory ?? []).map(({ _id, count }: { _id: string; count: number }) => {
            const cat = getCategoryConfig(_id as any)
            const pct = stats?.total ? Math.round((count / stats.total) * 100) : 0
            return (
              <div key={_id} className="flex items-center gap-3">
                <span className="text-lg w-7">{cat.emoji}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70">{cat.label}</span>
                    <span className="text-white/40">{count}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top viewed */}
      {stats?.topViewed?.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-4">Più visti</h2>
          <div className="space-y-3">
            {stats.topViewed.map((p: any, i: number) => (
              <div key={p._id} className="flex items-center gap-3">
                <span className="text-white/20 text-sm w-5 text-right">{i + 1}</span>
                <span className="text-lg">{getCategoryConfig(p.category).emoji}</span>
                <span className="flex-1 text-white/80 text-sm truncate">{p.name}</span>
                <span className="text-white/40 text-xs flex items-center gap-1">
                  <Eye size={11} /> {p.meta?.views ?? 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
