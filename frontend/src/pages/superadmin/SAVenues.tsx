import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { superAdminApi } from '@/lib/api'
import { Plus, Trash2, Store, X, Eye, EyeOff, Copy, Check } from 'lucide-react'

const C = {
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' } as React.CSSProperties,
  field: { width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f0ede8', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'DM Sans,sans-serif', transition: 'border-color 0.2s' },
  label: { display: 'block' as const, fontSize: 10, fontWeight: 700 as const, color: 'rgba(240,237,232,0.4)', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.12em' },
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
  const [newOwnerCreds, setNewOwnerCreds] = useState<{ email: string; password: string; place: string } | null>(null)
  const qc = useQueryClient()

  const { data: ownersData, isLoading } = useQuery({ queryKey: ['sa-venue-owners'], queryFn: superAdminApi.listVenueOwners })
  const { data: placesData } = useQuery({ queryKey: ['sa-places-all'], queryFn: () => superAdminApi.listPlaces({ limit: 200 }) })

  const deleteMutation = useMutation({
    mutationFn: superAdminApi.deleteVenueOwner,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sa-venue-owners'] }),
  })

  const owners = ownersData?.data ?? []
  const places = placesData?.data ?? []

  // Map placeId → owners count
  const ownersByPlace: Record<string, number> = {}
  owners.forEach((o: any) => {
    const pid = (o.placeId as any)?._id || o.placeId
    if (pid) ownersByPlace[pid] = (ownersByPlace[pid] || 0) + 1
  })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 28, fontWeight: 700, color: '#f0ede8' }}>Locali & Gestori</h1>
          <p style={{ color: 'rgba(240,237,232,0.35)', fontSize: 12, marginTop: 2 }}>{owners.length} account attivi</p>
        </div>
        <button onClick={() => setShowForm(true)} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 12,
          background: 'linear-gradient(135deg,#e8622a,#f0884a)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
        }}>
          <Plus size={14} /> Crea gestore locale
        </button>
      </div>

      {/* Success banner after creation */}
      {newOwnerCreds && (
        <div style={{ marginBottom: 20, padding: '16px 20px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 14 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <p style={{ color: '#4ade80', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>✅ Gestore creato! Credenziali di accesso:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: 'rgba(240,237,232,0.45)', width: 60 }}>Locale:</span>
                  <span style={{ fontSize: 12, color: '#f0ede8', fontWeight: 600 }}>{newOwnerCreds.place}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: 'rgba(240,237,232,0.45)', width: 60 }}>Email:</span>
                  <span style={{ fontSize: 12, color: '#f0ede8', fontFamily: 'DM Mono,monospace' }}>{newOwnerCreds.email}</span>
                  <CopyBtn text={newOwnerCreds.email} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: 'rgba(240,237,232,0.45)', width: 60 }}>Password:</span>
                  <span style={{ fontSize: 12, color: '#f0ede8', fontFamily: 'DM Mono,monospace' }}>{newOwnerCreds.password}</span>
                  <CopyBtn text={newOwnerCreds.password} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: 'rgba(240,237,232,0.45)', width: 60 }}>URL:</span>
                  <span style={{ fontSize: 12, color: '#e8622a', fontFamily: 'DM Mono,monospace' }}>/locale/login</span>
                  <CopyBtn text={`${window.location.origin}/locale/login`} />
                </div>
              </div>
            </div>
            <button onClick={() => setNewOwnerCreds(null)} style={{ padding: 4, borderRadius: 6, border: 'none', cursor: 'pointer', background: 'transparent', color: 'rgba(240,237,232,0.4)' }}>
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Owners table */}
      <div style={C.card}>
        {isLoading ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'rgba(240,237,232,0.3)' }}>Caricamento...</div>
        ) : owners.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'rgba(240,237,232,0.3)' }}>
            <Store size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p style={{ fontSize: 14, marginBottom: 4 }}>Nessun gestore ancora</p>
            <p style={{ fontSize: 12 }}>Crea il primo account per un locale</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Nome', 'Email', 'Locale assegnato', 'URL accesso', ''].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'rgba(240,237,232,0.3)', textTransform: 'uppercase', letterSpacing: '0.12em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {owners.map((owner: any) => (
                  <tr key={owner._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(232,98,42,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Store size={12} color="#e8622a" />
                        </div>
                        <span style={{ color: '#f0ede8', fontSize: 13, fontWeight: 600 }}>{owner.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: 'rgba(240,237,232,0.5)', fontSize: 12, fontFamily: 'DM Mono,monospace' }}>{owner.email}</span>
                        <CopyBtn text={owner.email} />
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 12, color: '#e8622a', background: 'rgba(232,98,42,0.1)', padding: '2px 8px', borderRadius: 6, fontWeight: 600 }}>
                        {(owner.placeId as any)?.name || '—'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 11, color: 'rgba(240,237,232,0.35)', fontFamily: 'DM Mono,monospace' }}>/locale/login</span>
                        <CopyBtn text={`${window.location.origin}/locale/login`} />
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button
                        onClick={() => confirm(`Eliminare gestore "${owner.name}"?\nL'account non potrà più accedere al pannello.`) && deleteMutation.mutate(owner._id)}
                        style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: 'rgba(240,237,232,0.3)' }}
                        onMouseEnter={e => { (e.currentTarget as any).style.color = '#f87171'; (e.currentTarget as any).style.background = 'rgba(248,113,113,0.1)' }}
                        onMouseLeave={e => { (e.currentTarget as any).style.color = 'rgba(240,237,232,0.3)'; (e.currentTarget as any).style.background = 'transparent' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create form modal */}
      {showForm && (
        <VenueOwnerForm
          places={places}
          onClose={() => setShowForm(false)}
          onSuccess={(creds) => { setNewOwnerCreds(creds); qc.invalidateQueries({ queryKey: ['sa-venue-owners'] }) }}
        />
      )}
    </div>
  )
}

function VenueOwnerForm({ places, onClose, onSuccess }: {
  places: any[]
  onClose: () => void
  onSuccess: (creds: { email: string; password: string; place: string }) => void
}) {
  const [form, setForm] = useState({ name: '', email: '', password: '', placeId: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const generatePassword = () => {
    const chars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#'
    set('password', Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join(''))
    setShowPass(true)
  }

  const mutation = useMutation({
    mutationFn: () => superAdminApi.createVenueOwner(form),
    onSuccess: () => {
      const place = places.find(p => p._id === form.placeId)
      onSuccess({ email: form.email, password: form.password, place: place?.name || '' })
      onClose()
    },
    onError: (e: any) => setError(e.response?.data?.error || 'Errore nella creazione'),
  })

  const isValid = form.name && form.email && form.password.length >= 6 && form.placeId

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={onClose}>
      <div style={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 24, width: '100%', maxWidth: 440, maxHeight: '90dvh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <h2 style={{ color: '#f0ede8', fontSize: 18, fontWeight: 700 }}>Nuovo gestore locale</h2>
          <button onClick={onClose} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', color: 'rgba(240,237,232,0.5)' }}>
            <X size={15} />
          </button>
        </div>
        <p style={{ color: 'rgba(240,237,232,0.35)', fontSize: 12, marginBottom: 20 }}>
          Crea le credenziali per il titolare del locale. Condividile in modo sicuro.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Locale */}
          <div>
            <label style={C.label}>Locale assegnato *</label>
            <select value={form.placeId} onChange={e => set('placeId', e.target.value)} style={{ ...C.field, cursor: 'pointer' }}
              onFocus={e => (e.target.style.borderColor = '#e8622a')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}>
              <option value="">Seleziona il locale...</option>
              {places.map(p => <option key={p._id} value={p._id}>{p.name} — {p.city}</option>)}
            </select>
          </div>

          {/* Nome */}
          <div>
            <label style={C.label}>Nome del gestore *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Es: Mario Rossi" style={C.field}
              onFocus={e => (e.target.style.borderColor = '#e8622a')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
          </div>

          {/* Email */}
          <div>
            <label style={C.label}>Email di accesso *</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="gestore@locale.com" style={C.field}
              onFocus={e => (e.target.style.borderColor = '#e8622a')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
          </div>

          {/* Password */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ ...C.label, marginBottom: 0 }}>Password *</label>
              <button onClick={generatePassword} style={{ fontSize: 10, color: '#e8622a', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                Genera automatica
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={e => set('password', e.target.value)}
                placeholder="min 6 caratteri"
                style={{ ...C.field, paddingRight: 40 }}
                onFocus={e => (e.target.style.borderColor = '#e8622a')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
              <button onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(240,237,232,0.3)' }}>
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {form.password && form.password.length < 6 && (
              <p style={{ fontSize: 10, color: '#f87171', marginTop: 4 }}>Minimo 6 caratteri</p>
            )}
          </div>

          {/* Info box */}
          <div style={{ padding: '10px 12px', background: 'rgba(232,98,42,0.08)', border: '1px solid rgba(232,98,42,0.2)', borderRadius: 10 }}>
            <p style={{ fontSize: 11, color: 'rgba(240,237,232,0.5)', lineHeight: 1.5 }}>
              📋 Dopo la creazione, le credenziali appariranno in evidenza.<br />
              Il gestore accede da: <strong style={{ color: '#e8622a' }}>/locale/login</strong>
            </p>
          </div>

          {error && <p style={{ color: '#f87171', fontSize: 12, textAlign: 'center', background: 'rgba(248,113,113,0.1)', borderRadius: 8, padding: '8px 12px' }}>{error}</p>}

          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(240,237,232,0.5)', cursor: 'pointer', fontSize: 13 }}>
              Annulla
            </button>
            <button
              onClick={() => mutation.mutate()}
              disabled={!isValid || mutation.isPending}
              style={{ flex: 2, padding: '11px', borderRadius: 12, border: 'none', background: isValid ? 'linear-gradient(135deg,#e8622a,#f0884a)' : 'rgba(255,255,255,0.08)', color: isValid ? '#fff' : 'rgba(240,237,232,0.3)', cursor: isValid ? 'pointer' : 'not-allowed', fontSize: 13, fontWeight: 700, transition: 'all 0.2s' }}
            >
              {mutation.isPending ? 'Creazione...' : '✓ Crea gestore'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
