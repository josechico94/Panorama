import { useQuery } from '@tanstack/react-query'
import { superAdminApi } from '@/lib/api'
import { MapPin, Users, Tag, Star, Store, Eye, TrendingUp, Download, RefreshCw, Activity } from 'lucide-react'

// ── Mini bar chart (pure CSS/SVG, no deps) ──
function BarChart({ data, color = '#BB00FF' }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1)
  const labels = ['L','M','M','G','V','S','D']
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 48 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <div style={{
            width: '100%', borderRadius: '3px 3px 0 0',
            height: `${(v / max) * 40}px`, minHeight: 3,
            background: i === data.length - 1 ? color : `${color}55`,
            transition: 'height 0.5s ease',
          }} />
          <span style={{ fontSize: 8, color: 'var(--text-3)' }}>{labels[i]}</span>
        </div>
      ))}
    </div>
  )
}

// ── Donut chart SVG ──
function DonutChart({ segments }: { segments: { value: number; color: string; label: string }[] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0)
  if (total === 0) return <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 10, color: 'var(--text-3)' }}>—</span></div>

  let cumulative = 0
  const r = 28, cx = 40, cy = 40, stroke = 10
  const circumference = 2 * Math.PI * r

  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
      {segments.map((seg, i) => {
        const pct = seg.value / total
        const offset = circumference - pct * circumference
        const rotation = (cumulative / total) * 360 - 90
        cumulative += seg.value
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={seg.color} strokeWidth={stroke}
            strokeDasharray={`${pct * circumference} ${circumference}`}
            strokeDashoffset={offset}
            transform={`rotate(${rotation} ${cx} ${cy})`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.5s ease' }}
          />
        )
      })}
      <text x={cx} y={cy + 4} textAnchor="middle" fill="#f0ede8" fontSize="12" fontWeight="700">{total}</text>
    </svg>
  )
}

const C = {
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 } as React.CSSProperties,
  label: { fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em' } as React.CSSProperties,
}

export default function SADashboard() {
  const { data, isLoading, refetch } = useQuery({ queryKey: ['sa-stats'], queryFn: superAdminApi.stats, refetchInterval: 30000 })
  const s = data?.data

  const handlePrint = () => window.print()

  if (isLoading) return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12 }}>
      {[...Array(6)].map((_, i) => <div key={i} style={{ ...C.card, height: 96, animation: 'pulse 1.5s infinite' }} />)}
    </div>
  )

  const statCards = [
    { label: 'Luoghi totali', value: s?.places ?? 0, icon: MapPin, color: '#BB00FF', sub: 'in piattaforma' },
    { label: 'Utenti registrati', value: s?.users ?? 0, icon: Users, color: '#a855f7', sub: 'account attivi' },
    { label: 'Coupon attivi', value: s?.activeCoupons ?? 0, icon: Tag, color: '#22c55e', sub: `di ${s?.coupons ?? 0} totali` },
    { label: 'Scaricati', value: s?.userCoupons ?? 0, icon: TrendingUp, color: '#f59e0b', sub: 'claim totali' },
    { label: 'Recensioni', value: s?.reviews ?? 0, icon: Star, color: '#3b82f6', sub: 'pubblicate' },
    { label: 'Gestori locali', value: s?.venueOwners ?? 0, icon: Store, color: '#ec4899', sub: 'account attivi' },
  ]

  // Mock weekly data (replace with real data from backend when available)
  const weeklyUsers = [2, 5, 3, 8, 4, 6, (s?.users ?? 0) % 10]
  const weeklyDownloads = [1, 3, 2, 5, 4, 7, (s?.userCoupons ?? 0) % 10]

  const categoryColors: Record<string, string> = {
    eat: '#f97316', drink: '#a855f7', shop: '#ec4899',
    walk: '#22c55e', culture: '#3b82f6', sport: '#84cc16', night: '#6366f1',
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 30, fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>Dashboard</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 12, marginTop: 4 }}>
            Aggiornato: {new Date().toLocaleString('it-IT')}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => refetch()} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-2)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
            <RefreshCw size={13} /> Aggiorna
          </button>
          <button onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#BB00FF,#9000CC)', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
            <Download size={13} /> Stampa
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 24 }}>
        {statCards.map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} style={C.card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={C.label}>{label}</span>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={13} color={color} />
              </div>
            </div>
            <p style={{ fontSize: 34, fontWeight: 800, color: 'var(--text)', lineHeight: 1, marginBottom: 4 }}>{value}</p>
            <p style={{ fontSize: 10, color: 'var(--text-3)' }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16, marginBottom: 20 }}>

        {/* Weekly users */}
        <div style={C.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <p style={C.label}>Nuovi utenti</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginTop: 2 }}>{s?.users ?? 0}</p>
            </div>
            <Activity size={16} color="#a855f7" />
          </div>
          <BarChart data={weeklyUsers} color="#a855f7" />
        </div>

        {/* Weekly downloads */}
        <div style={C.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <p style={C.label}>Download coupon</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginTop: 2 }}>{s?.userCoupons ?? 0}</p>
            </div>
            <Tag size={16} color="#22c55e" />
          </div>
          <BarChart data={weeklyDownloads} color="#22c55e" />
        </div>

        {/* Categories donut */}
        <div style={C.card}>
          <p style={{ ...C.label, marginBottom: 14 }}>Distribuzione categorie</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <DonutChart
              segments={(s?.byCategory ?? []).map((c: any) => ({
                value: c.count,
                color: categoryColors[c._id] || '#666',
                label: c._id,
              }))}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {(s?.byCategory ?? []).slice(0, 5).map((c: any) => (
                <div key={c._id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: categoryColors[c._id] || '#666', flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: 'var(--text-2)', flex: 1 }}>{c._id}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'DM Mono,monospace' }}>{c.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom tables */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>

        {/* Recent users */}
        <div style={C.card}>
          <p style={{ ...C.label, marginBottom: 14 }}>Ultimi utenti registrati</p>
          {(s?.recentUsers ?? []).length === 0 ? (
            <p style={{ color: 'var(--text-3)', fontSize: 12, textAlign: 'center', padding: '16px 0' }}>Nessun utente</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(s?.recentUsers ?? []).map((u: any) => (
                <div key={u._id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(168,85,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: '#a855f7', fontSize: 11, fontWeight: 700 }}>{u.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: 'var(--text)', fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</p>
                    <p style={{ color: 'var(--text-3)', fontSize: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</p>
                  </div>
                  <span style={{ fontSize: 9, color: 'var(--text-3)', fontFamily: 'DM Mono,monospace', flexShrink: 0 }}>
                    {new Date(u.createdAt).toLocaleDateString('it-IT')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top places */}
        <div style={C.card}>
          <p style={{ ...C.label, marginBottom: 14 }}>Luoghi più visti</p>
          {(s?.topPlaces ?? []).length === 0 ? (
            <p style={{ color: 'var(--text-3)', fontSize: 12, textAlign: 'center', padding: '16px 0' }}>Nessun dato</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(s?.topPlaces ?? []).map((p: any, i: number) => (
                <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: i === 0 ? '#f59e0b' : 'rgba(240,237,232,0.2)', width: 18, textAlign: 'center', flexShrink: 0 }}>{i + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: 'var(--text)', fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                    <div style={{ height: 3, background: 'var(--surface)', borderRadius: 2, marginTop: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: '#BB00FF', borderRadius: 2, width: `${Math.min(100, ((p.meta?.views ?? 0) / Math.max(...(s?.topPlaces ?? []).map((x: any) => x.meta?.views ?? 1), 1)) * 100)}%`, transition: 'width 0.5s' }} />
                    </div>
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                    <Eye size={10} /> {p.meta?.views ?? 0}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Coupon conversion */}
        <div style={C.card}>
          <p style={{ ...C.label, marginBottom: 14 }}>Performance coupon</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Coupon creati', value: s?.coupons ?? 0, color: '#BB00FF', max: Math.max(s?.coupons ?? 1, 1) },
              { label: 'Scaricati', value: s?.userCoupons ?? 0, color: '#22c55e', max: Math.max(s?.coupons ?? 1, 1) },
              { label: 'Attivi ora', value: s?.activeCoupons ?? 0, color: '#3b82f6', max: Math.max(s?.coupons ?? 1, 1) },
            ].map(({ label, value, color, max }) => (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-2)' }}>{label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color, fontFamily: 'DM Mono,monospace' }}>{value}</span>
                </div>
                <div style={{ height: 5, background: 'var(--surface)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: color, borderRadius: 3, width: `${Math.min(100, (value / max) * 100)}%`, transition: 'width 0.6s ease' }} />
                </div>
              </div>
            ))}
            {s?.coupons > 0 && (
              <div style={{ marginTop: 8, padding: '10px 12px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, textAlign: 'center' }}>
                <p style={{ color: '#4ade80', fontSize: 18, fontWeight: 800 }}>
                  {s?.userCoupons > 0 ? Math.round((s.userCoupons / (s.coupons * 10)) * 100) : 0}%
                </p>
                <p style={{ color: 'var(--meta-color)', fontSize: 10, marginTop: 2 }}>conversion rate</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .sa-sidebar { display: none !important; }
          .sa-main header { display: none !important; }
          button { display: none !important; }
        }
      `}</style>
    </div>
  )
}
