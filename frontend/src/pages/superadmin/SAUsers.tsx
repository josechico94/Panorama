import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { superAdminApi } from '@/lib/api'
import { Trash2, Search, User } from 'lucide-react'

const card = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }
const field = { width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const }

export default function SAUsers() {
  const [search, setSearch] = useState('')
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['sa-users', search],
    queryFn: () => superAdminApi.listUsers(search ? { search } : undefined),
  })

  const deleteMutation = useMutation({
    mutationFn: superAdminApi.deleteUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sa-users'] }),
  })

  const users = data?.data ?? []

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 28, fontWeight: 700, color: 'var(--text)' }}>Utenti</h1>
        <p style={{ color: 'var(--text-3)', fontSize: 12, marginTop: 2 }}>{data?.total ?? 0} registrati</p>
      </div>

      <div style={{ position: 'relative', marginBottom: 16 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca per nome o email..."
          style={{ ...field, paddingLeft: 36 }} />
      </div>

      <div style={card}>
        {isLoading ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-3)' }}>Caricamento...</div>
        ) : users.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-3)' }}>
            <User size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p>Nessun utente trovato</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Utente', 'Email', 'Registrato il', ''].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(168,85,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ color: '#a855f7', fontSize: 11, fontWeight: 700 }}>{user.name?.charAt(0).toUpperCase()}</span>
                      </div>
                      <span style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600 }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-2)', fontSize: 12 }}>{user.email}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-3)', fontSize: 11, fontFamily: 'DM Mono,monospace' }}>
                    {new Date(user.createdAt).toLocaleDateString('it-IT')}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button onClick={() => confirm(`Eliminare utente "${user.name}"?`) && deleteMutation.mutate(user._id)}
                      style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--text-3)', transition: 'all 0.15s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f87171'; (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.1)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(240,237,232,0.3)'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
