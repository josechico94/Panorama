import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { categoriesApi } from '@/lib/api'

const EMOJI_PRESETS = ['🍽️','🍹','🛍️','🚶','🏛️','⚡','🌙','☕','🍝','🍕','🍸','🏋️','💅','💆','🧘','🎭','🎵','🎨','🏊','🚴','🍦','🧁','🍷','🥗','🏥','💊','✂️','👔','👠','🛒','🏠','🌿','🐾','📚','🎓']
const COLOR_PRESETS = ['#f97316','#a855f7','#ec4899','#22c55e','#3b82f6','#84cc16','#6366f1','#f59e0b','#ef4444','#06b6d4','#14b8a6','#8b5cf6','#d946ef','#0ea5e9','#BB00FF','#10b981']

const field = { width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f0ede8', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'DM Sans,sans-serif' }

function generateId(label: string) {
  return label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '')
}

export default function SACategories() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editCat, setEditCat] = useState<any>(null)
  const [form, setForm] = useState({ id: '', label: '', emoji: '🍽️', color: '#BB00FF' })
  const [error, setError] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['sa-categories'],
    queryFn: () => categoriesApi.list(),
  })
  const categories = data?.data ?? []

  const createMutation = useMutation({
    mutationFn: () => categoriesApi.create(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sa-categories'] }); qc.invalidateQueries({ queryKey: ['categories'] }); setShowForm(false) },
    onError: (e: any) => setError(e.response?.data?.error || 'Errore'),
  })

  const updateMutation = useMutation({
    mutationFn: () => categoriesApi.update(editCat.id, { label: form.label, emoji: form.emoji, color: form.color }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sa-categories'] }); qc.invalidateQueries({ queryKey: ['categories'] }); setShowForm(false) },
    onError: (e: any) => setError(e.response?.data?.error || 'Errore'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sa-categories'] }); qc.invalidateQueries({ queryKey: ['categories'] }) },
    onError: (e: any) => alert(e.response?.data?.error || 'Errore'),
  })

  const openNew = () => {
    setEditCat(null)
    setForm({ id: '', label: '', emoji: '🍽️', color: '#BB00FF' })
    setError('')
    setShowForm(true)
  }

  const openEdit = (cat: any) => {
    setEditCat(cat)
    setForm({ id: cat.id, label: cat.label, emoji: cat.emoji, color: cat.color })
    setError('')
    setShowForm(true)
  }

  const handleSave = () => {
    if (!form.label.trim()) { setError('Il nome è obbligatorio'); return }
    if (!editCat && !form.id.trim()) { setError("L'ID è obbligatorio"); return }
    if (editCat) updateMutation.mutate()
    else createMutation.mutate()
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 28, fontWeight: 700, color: '#f0ede8' }}>Categorie</h1>
          <p style={{ color: 'rgba(240,237,232,0.4)', fontSize: 12, marginTop: 2 }}>{categories.length} categorie · sincronizzate con il DB</p>
        </div>
        <button onClick={openNew} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 12, background: 'linear-gradient(135deg,#BB00FF,#9000CC)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
          <Plus size={14} /> Nuova categoria
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: '12px 16px', background: 'rgba(187,0,255,0.08)', border: '1px solid rgba(187,0,255,0.2)', borderRadius: 14, marginBottom: 20 }}>
        <p style={{ fontSize: 12, color: 'rgba(187,0,255,0.9)', lineHeight: 1.5 }}>
          💡 Le categorie sono salvate nel database e si aggiornano automaticamente in tutta l'app. Le categorie di default non possono essere eliminate.
        </p>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 48, color: 'rgba(240,237,232,0.3)' }}>Caricamento...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {categories.map((cat: any) => (
            <motion.div key={cat.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              style={{ background: 'var(--surface)', border: `1px solid ${cat.color}30`, borderRadius: 16, overflow: 'hidden', transition: 'box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${cat.color}60`; e.currentTarget.style.boxShadow = `0 4px 16px ${cat.color}20` }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${cat.color}30`; e.currentTarget.style.boxShadow = 'none' }}>
              <div style={{ height: 4, background: `linear-gradient(90deg, ${cat.color}, ${cat.color}88)` }} />
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${cat.color}18`, border: `1px solid ${cat.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                    {cat.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: '#f0ede8', fontSize: 14, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.label}</p>
                    <p style={{ color: 'rgba(240,237,232,0.35)', fontSize: 10, fontFamily: 'DM Mono', marginTop: 2 }}>id: {cat.id}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: cat.color }} />
                    <span style={{ fontSize: 10, color: 'rgba(240,237,232,0.4)', fontFamily: 'DM Mono' }}>{cat.color}</span>
                  </div>
                  {cat.isDefault && <span style={{ fontSize: 9, color: 'rgba(240,237,232,0.3)', background: 'rgba(255,255,255,0.05)', padding: '2px 7px', borderRadius: 100, fontWeight: 600 }}>DEFAULT</span>}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => openEdit(cat)} style={{ flex: 1, padding: '7px', borderRadius: 9, border: '1px solid rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.08)', color: '#3b82f6', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <Pencil size={11} /> Modifica
                  </button>
                  {!cat.isDefault && (
                    <button onClick={() => confirm(`Eliminare "${cat.label}"?`) && deleteMutation.mutate(cat.id)}
                      style={{ width: 32, padding: '7px', borderRadius: 9, border: '1px solid rgba(248,113,113,0.2)', background: 'rgba(248,113,113,0.06)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Trash2 size={11} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Add new */}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={openNew}
            style={{ background: 'transparent', border: '2px dashed rgba(187,0,255,0.3)', borderRadius: 16, padding: '32px 16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(187,0,255,0.6)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(187,0,255,0.3)')}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(187,0,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={20} color="#BB00FF" />
            </div>
            <span style={{ fontSize: 12, color: 'rgba(187,0,255,0.7)', fontWeight: 600 }}>Nuova categoria</span>
          </motion.button>
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
            onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              style={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 24, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}
              onClick={e => e.stopPropagation()}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ color: '#f0ede8', fontSize: 18, fontWeight: 700 }}>{editCat ? 'Modifica' : 'Nuova'} categoria</h2>
                <button onClick={() => setShowForm(false)} style={{ padding: 6, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.06)', color: 'rgba(240,237,232,0.6)' }}><X size={15} /></button>
              </div>

              {/* Preview */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: `${form.color}12`, border: `1px solid ${form.color}30`, borderRadius: 14, marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 13, background: `${form.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{form.emoji}</div>
                <div>
                  <p style={{ color: '#f0ede8', fontSize: 15, fontWeight: 700 }}>{form.label || 'Nome categoria'}</p>
                  <p style={{ color: form.color, fontSize: 11, marginTop: 2 }}>id: {form.id || 'id_categoria'}</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Nome */}
                <div>
                  <label style={{ display: 'block', fontSize: 10, color: 'rgba(240,237,232,0.4)', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Nome *</label>
                  <input value={form.label} onChange={e => { const label = e.target.value; setForm(f => ({ ...f, label, id: editCat ? f.id : generateId(label) })) }}
                    placeholder="Es: Benessere" style={field}
                    onFocus={e => (e.target.style.borderColor = '#BB00FF')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                </div>

                {/* ID */}
                <div>
                  <label style={{ display: 'block', fontSize: 10, color: 'rgba(240,237,232,0.4)', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>ID univoco *</label>
                  <input value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                    placeholder="benessere" disabled={!!editCat}
                    style={{ ...field, opacity: editCat ? 0.5 : 1, fontFamily: 'DM Mono,monospace' }}
                    onFocus={e => (e.target.style.borderColor = '#BB00FF')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                  {editCat && <p style={{ fontSize: 10, color: 'rgba(240,237,232,0.3)', marginTop: 4 }}>L'ID non può essere modificato</p>}
                </div>

                {/* Emoji */}
                <div>
                  <label style={{ display: 'block', fontSize: 10, color: 'rgba(240,237,232,0.4)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Emoji</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                    {EMOJI_PRESETS.map(e => (
                      <button key={e} onClick={() => setForm(f => ({ ...f, emoji: e }))}
                        style={{ width: 36, height: 36, borderRadius: 8, border: `2px solid ${form.emoji === e ? '#BB00FF' : 'transparent'}`, background: form.emoji === e ? 'rgba(187,0,255,0.15)' : 'rgba(255,255,255,0.05)', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colore */}
                <div>
                  <label style={{ display: 'block', fontSize: 10, color: 'rgba(240,237,232,0.4)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Colore</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                    {COLOR_PRESETS.map(color => (
                      <button key={color} onClick={() => setForm(f => ({ ...f, color }))}
                        style={{ width: 32, height: 32, borderRadius: 8, border: `3px solid ${form.color === color ? '#fff' : 'transparent'}`, background: color, cursor: 'pointer', transform: form.color === color ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.15s' }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} style={{ width: 40, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'none' }} />
                    <input value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} placeholder="#BB00FF" style={{ ...field, width: 120, fontFamily: 'DM Mono,monospace' }} />
                  </div>
                </div>

                {error && <p style={{ color: '#f87171', fontSize: 12, textAlign: 'center', background: 'rgba(248,113,113,0.1)', borderRadius: 8, padding: '8px 12px' }}>{error}</p>}

                <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                  <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(240,237,232,0.5)', cursor: 'pointer', fontSize: 13 }}>Annulla</button>
                  <button onClick={handleSave} disabled={isPending} style={{ flex: 2, padding: '11px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#BB00FF,#9000CC)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, opacity: isPending ? 0.7 : 1 }}>
                    {isPending ? 'Salvataggio...' : editCat ? '✓ Salva modifiche' : '✓ Crea categoria'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
