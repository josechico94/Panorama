import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { superAdminApi } from '@/lib/api'
import { Plus, Trash2, Store, X, Eye, EyeOff, Copy, Check, Search, Pencil } from 'lucide-react'

const C = {
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' } as React.CSSProperties,
  field: { width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'DM Sans,sans-serif', transition: 'border-color 0.2s' },
  label: { display: 'block' as const, fontSize: 10, fontWeight: 700 as const, color: 'var(--meta-color)', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.12em' },
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
      style={{ padding: 4, borderRadius: 6, border: 'none', cursor: 'pointer', background: 'transparent', color: copied ? '#4ade80' : 'rgba(240,237,232,0.3)' }}>
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  )
}

export default function SAVenues() {
  const [showForm, setShowForm] = useState(false)
  const [editOwner, setEditOwner] = useState<any>(null)
  const [newOwnerCreds, setNewOwnerCreds] = useState<{ email: string; password: string; place: string } | null>(null)
  const [search, setSearch] = useState('')
  const qc = useQueryClient()

  const { data: ownersData, isLoading } = useQuery({
    queryKey: ['sa-venue-owners', search],
    queryFn: () => superAdminApi.listVenueOwners(search ? { search } : undefined),
  })
  const { data: placesData } = useQuery({
    queryKey: ['sa-places-all'],
    queryFn: () => superAdminApi.listPlaces({ limit: 200 }),
  })

  const deleteMutation = useMutation({
    mutationFn: superAdminApi.deleteVenueOwner,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sa-venue-owners'] }),
  })

  const owners = ownersData?.data ?? []
  const places = placesData?.data ?? []

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 28, fontWeight: 700, color: 'var(--text)' }}>Locali & Gestori</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 12, marginTop: 2 }}>{owners.length} account attivi</p>
        </div>
        <button onClick={() => { setEditOwner(null); setShowForm(true) }} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 12,
          background: 'linear-gradient(135deg,#BB00FF,#9000CC)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
        }}>
          <Plus size={14} /> Crea gestore
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca per nome o email..."
          style={{ ...C.field, paddingLeft: 36 }} />
      </div>

      {/* Success banner */}
      {newOwnerCreds && (
        <div style={{ marginBottom: 20, padding: '16px 20px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 14 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <p style={{ color: '#4ade80', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>✅ Gestore creato! Credenziali:</p>
              {[
                { label: 'Locale', value: newOwnerCreds.place, mono: false },
                { label: 'Email', value: newOwnerCreds.email, mono: true },
                { label: 'Password', value: newOwnerCreds.password, mono: true },
                { label: 'URL', value: `${window.location.origin}/locale/login`, mono: true },
              ].map(({ label, value, mono }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--meta-color)', width: 60 }}>{label}:</span>
                  <span style={{ fontSize: 12, color: 'var(--text)', fontFamily: mono ? 'DM Mono,monospace' : 'inherit', fontWeight: 600 }}>{value}</span>
                  <CopyBtn text={value} />
                </div>
              ))}
            </div>
            <button onClick={() => setNewOwnerCreds(null)} style={{ padding: 4, borderRadius: 6, border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--meta-color)' }}>
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={C.card}>
        {isLoading ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-3)' }}>Caricamento...</div>
        ) : owners.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-3)' }}>
            <Store size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p>{search ? 'Nessun risultato' : 'Nessun gestore ancora'}</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Nome', 'Email', 'Locale', 'URL accesso', ''].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {owners.map((owner: any) => (
                  <tr key={owner._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(187,0,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Store size={12} color="#BB00FF" />
                        </div>
                        <span style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600 }}>{owner.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ color: 'var(--text-2)', fontSize: 12, fontFamily: 'DM Mono,monospace' }}>{owner.email}</span>
                        <CopyBtn text={owner.email} />
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 12, color: '#BB00FF', background: 'rgba(187,0,255,0.1)', padding: '2px 8px', borderRadius: 6, fontWeight: 600 }}>
                        {(owner.placeId as any)?.name || '—'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'DM Mono,monospace' }}>/locale/login</span>
                        <CopyBtn text={`${window.location.origin}/locale/login`} />
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <button onClick={() => { setEditOwner(owner); setShowForm(true) }}
                          style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: '#3b82f6' }}
                          onMouseEnter={e => (e.currentTarget as any).style.background = 'rgba(59,130,246,0.1)'}
                          onMouseLeave={e => (e.currentTarget as any).style.background = 'transparent'}>
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => confirm(`Eliminare "${owner.name}"?`) && deleteMutation.mutate(owner._id)}
                          style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--text-3)' }}
                          onMouseEnter={e => { (e.currentTarget as any).style.color = '#f87171'; (e.currentTarget as any).style.background = 'rgba(248,113,113,0.1)' }}
                          onMouseLeave={e => { (e.currentTarget as any).style.color = 'rgba(240,237,232,0.3)'; (e.currentTarget as any).style.background = 'transparent' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <VenueOwnerForm
          places={places}
          owner={editOwner}
          onClose={() => { setShowForm(false); setEditOwner(null) }}
          onSuccess={(creds) => {
            if (creds) setNewOwnerCreds(creds)
            qc.invalidateQueries({ queryKey: ['sa-venue-owners'] })
          }}
        />
      )}
    </div>
  )
}

function VenueOwnerForm({ places, owner, onClose, onSuccess }: {
  places: any[]
  owner: any | null
  onClose: () => void
  onSuccess: (creds: { email: string; password: string; place: string } | null) => void
}) {
  const isEdit = !!owner
  const [form, setForm] = useState({
    name: owner?.name || '',
    email: owner?.email || '',
    password: '',
    placeId: (owner?.placeId as any)?._id || owner?.placeId || '',
  })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const generatePassword = () => {
    const chars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#'
    set('password', Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join(''))
    setShowPass(true)
  }

  const mutation = useMutation({
    mutationFn: () => isEdit
      ? superAdminApi.updateVenueOwner(owner._id, form)
      : superAdminApi.createVenueOwner(form),
    onSuccess: () => {
      if (!isEdit) {
        const place = places.find(p => p._id === form.placeId)
        onSuccess({ email: form.email, password: form.password, place: place?.name || '' })
      } else {
        onSuccess(null)
      }
      onClose()
    },
    onError: (e: any) => setError(e.response?.data?.error || 'Errore'),
  })

  const isValid = form.name && form.email && form.placeId && (isEdit || form.password.length >= 6)

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={onClose}>
      <div style={{ background: '#0f0f1a', border: '1px solid var(--border)', borderRadius: 20, padding: 24, width: '100%', maxWidth: 440, maxHeight: '90dvh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <h2 style={{ color: 'var(--text)', fontSize: 18, fontWeight: 700 }}>{isEdit ? 'Modifica gestore' : 'Nuovo gestore'}</h2>
          <button onClick={onClose} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'var(--surface)', color: 'var(--text-2)' }}><X size={15} /></button>
        </div>
        <p style={{ color: 'var(--text-3)', fontSize: 12, marginBottom: 20 }}>
          {isEdit ? 'Modifica le credenziali del gestore' : 'Crea accesso per il titolare del locale'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Locale */}
          <div>
            <label style={C.label}>Locale assegnato *</label>
            <select value={form.placeId} onChange={e => set('placeId', e.target.value)}
              style={{ ...C.field, cursor: 'pointer' }}
              onFocus={e => (e.target.style.borderColor = '#BB00FF')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}>
              <option value="">Seleziona il locale...</option>
              {places.map(p => <option key={p._id} value={p._id}>{p.name} — {p.city}</option>)}
            </select>
          </div>

          {/* Nome */}
          <div>
            <label style={C.label}>Nome del gestore *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Es: Mario Rossi"
              style={C.field}
              onFocus={e => (e.target.style.borderColor = '#BB00FF')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>

          {/* Email */}
          <div>
            <label style={C.label}>Email *</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="gestore@locale.com"
              style={C.field}
              onFocus={e => (e.target.style.borderColor = '#BB00FF')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>

          {/* Password */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ ...C.label, marginBottom: 0 }}>{isEdit ? 'Nuova password (lascia vuoto per non cambiare)' : 'Password *'}</label>
              <button onClick={generatePassword} style={{ fontSize: 10, color: '#BB00FF', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                Genera
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)}
                placeholder={isEdit ? 'Lascia vuoto per non modificare' : 'min 6 caratteri'}
                style={{ ...C.field, paddingRight: 40 }}
                onFocus={e => (e.target.style.borderColor = '#BB00FF')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              <button onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)' }}>
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {error && <p style={{ color: '#f87171', fontSize: 12, textAlign: 'center', background: 'rgba(248,113,113,0.1)', borderRadius: 8, padding: '8px 12px' }}>{error}</p>}

          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-2)', cursor: 'pointer', fontSize: 13 }}>Annulla</button>
            <button onClick={() => mutation.mutate()} disabled={!isValid || mutation.isPending}
              style={{ flex: 2, padding: '11px', borderRadius: 12, border: 'none', background: isValid ? 'linear-gradient(135deg,#BB00FF,#9000CC)' : 'rgba(255,255,255,0.08)', color: isValid ? '#fff' : 'rgba(240,237,232,0.3)', cursor: isValid ? 'pointer' : 'not-allowed', fontSize: 13, fontWeight: 700 }}>
              {mutation.isPending ? 'Salvataggio...' : isEdit ? 'Salva modifiche' : '✓ Crea gestore'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
