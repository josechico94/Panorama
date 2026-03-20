import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { venueApi } from '@/lib/api'
import { getCategoryConfig } from '@/types'
import { CheckCircle, MapPin, Phone, Globe, Instagram, Mail, Clock } from 'lucide-react'

const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'] as const
const DAYS_IT: Record<string, string> = {
  monday:'Lunedì', tuesday:'Martedì', wednesday:'Mercoledì',
  thursday:'Giovedì', friday:'Venerdì', saturday:'Sabato', sunday:'Domenica'
}

const fieldStyle = {
  width: '100%', padding: '12px 14px', borderRadius: 12, boxSizing: 'border-box' as const,
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  color: '#f0ede8', fontSize: 14, outline: 'none', transition: 'border-color 0.2s',
  fontFamily: 'DM Sans, sans-serif',
}

const labelStyle = {
  display: 'block' as const, fontSize: 10, fontWeight: 700 as const,
  color: 'rgba(240,237,232,0.4)', letterSpacing: '0.15em',
  textTransform: 'uppercase' as const, marginBottom: 6,
}

const sectionStyle = {
  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 18, padding: 18, marginBottom: 16,
}

export default function VenueInfoPage() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['venue-me'], queryFn: venueApi.me })
  const place = data?.data

  const [form, setForm] = useState<any>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (place) {
      setForm({
        shortDescription: place.shortDescription || '',
        description: place.description || '',
        phone: place.contact?.phone || '',
        website: place.contact?.website || '',
        instagram: place.contact?.instagram || '',
        email: place.contact?.email || '',
        address: place.location?.address || '',
        neighborhood: place.location?.neighborhood || '',
        hours: place.hours || Object.fromEntries(
          DAYS.map(d => [d, { open: '10:00', close: '22:00', closed: false }])
        ),
      })
    }
  }, [place])

  const mutation = useMutation({
    mutationFn: () => venueApi.updateMe({
      shortDescription: form.shortDescription,
      description: form.description,
      contact: {
        phone: form.phone,
        website: form.website,
        instagram: form.instagram,
        email: form.email,
      },
      location: {
        ...place?.location,
        address: form.address,
        neighborhood: form.neighborhood,
      },
      hours: form.hours,
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['venue-me'] })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    },
  })

  const set = (k: string, v: string) => setForm((f: any) => ({ ...f, [k]: v }))
  const setHour = (day: string, field: string, val: any) =>
    setForm((f: any) => ({ ...f, hours: { ...f.hours, [day]: { ...f.hours[day], [field]: val } } }))

  if (isLoading || !form) return (
    <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[1,2,3].map(i => (
        <div key={i} style={{ height: 80, borderRadius: 14, background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.5s infinite' }} />
      ))}
    </div>
  )

  const cat = place ? getCategoryConfig(place.category) : null

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 28, height: 2, background: 'linear-gradient(90deg,#e8622a,transparent)', borderRadius: 1 }} />
          <span style={{ fontSize: 9, color: 'rgba(240,237,232,0.35)', fontFamily: 'DM Mono,monospace', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
            Il tuo locale
          </span>
        </div>
        <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 30, fontWeight: 700, color: '#f0ede8', lineHeight: 1 }}>
          Informazioni
        </h1>

        {/* Place preview card */}
        {place && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: 16, borderRadius: 16, overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.08)', display: 'flex',
            }}
          >
            <div style={{ width: 80, height: 80, flexShrink: 0 }}>
              <img src={place.media?.coverImage || 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=200&q=80'}
                alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1, padding: '12px 14px', background: 'rgba(255,255,255,0.03)' }}>
              <p style={{ color: '#f0ede8', fontSize: 14, fontWeight: 700, fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic' }}>
                {place.name}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                {cat && (
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: cat.color, background: `${cat.color}18`, border: `1px solid ${cat.color}30`,
                    borderRadius: 100, padding: '2px 6px',
                  }}>
                    {cat.emoji} {cat.label}
                  </span>
                )}
                <span style={{ fontSize: 10, color: 'rgba(240,237,232,0.4)', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <MapPin size={9} color="#e8622a" /> {place.location?.neighborhood}
                </span>
              </div>
              <p style={{ fontSize: 10, color: place.meta?.active ? '#4ade80' : 'rgba(240,237,232,0.3)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: place.meta?.active ? '#4ade80' : '#666', display: 'inline-block' }} />
                {place.meta?.active ? 'Pubblicato' : 'Non pubblicato'}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Descrizione */}
      <div style={sectionStyle}>
        <p style={{ ...labelStyle, marginBottom: 12 }}>📝 Descrizione</p>
        <div style={{ marginBottom: 10 }}>
          <label style={labelStyle}>Breve (max 160 caratteri)</label>
          <input
            value={form.shortDescription}
            onChange={e => set('shortDescription', e.target.value)}
            maxLength={160}
            placeholder="Una riga che descrive il locale..."
            style={fieldStyle}
            onFocus={e => (e.target.style.borderColor = '#e8622a')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
        </div>
        <div>
          <label style={labelStyle}>Completa</label>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="Racconta il tuo locale in dettaglio..."
            rows={4}
            style={{ ...fieldStyle, resize: 'none' }}
            onFocus={e => (e.target.style.borderColor = '#e8622a')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
        </div>
      </div>

      {/* Posizione */}
      <div style={sectionStyle}>
        <p style={{ ...labelStyle, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <MapPin size={11} color="#e8622a" /> Posizione
        </p>
        <div style={{ marginBottom: 10 }}>
          <label style={labelStyle}>Indirizzo</label>
          <input value={form.address} onChange={e => set('address', e.target.value)}
            placeholder="Via Roma 1, Bologna" style={fieldStyle}
            onFocus={e => (e.target.style.borderColor = '#e8622a')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
        </div>
        <div>
          <label style={labelStyle}>Quartiere</label>
          <input value={form.neighborhood} onChange={e => set('neighborhood', e.target.value)}
            placeholder="Centro Storico, Bolognina..." style={fieldStyle}
            onFocus={e => (e.target.style.borderColor = '#e8622a')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
        </div>
      </div>

      {/* Contatti */}
      <div style={sectionStyle}>
        <p style={{ ...labelStyle, marginBottom: 12 }}>📞 Contatti</p>
        {[
          { key: 'phone', label: 'Telefono', placeholder: '+39 051 000000', icon: Phone },
          { key: 'website', label: 'Sito web', placeholder: 'https://...', icon: Globe },
          { key: 'instagram', label: 'Instagram', placeholder: 'handle senza @', icon: Instagram },
          { key: 'email', label: 'Email pubblica', placeholder: 'info@locale.it', icon: Mail },
        ].map(({ key, label, placeholder, icon: Icon }) => (
          <div key={key} style={{ marginBottom: 10, position: 'relative' }}>
            <label style={labelStyle}>{label}</label>
            <div style={{ position: 'relative' }}>
              <Icon size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,237,232,0.3)' }} />
              <input value={(form as any)[key]} onChange={e => set(key, e.target.value)}
                placeholder={placeholder}
                style={{ ...fieldStyle, paddingLeft: 36 }}
                onFocus={e => (e.target.style.borderColor = '#e8622a')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
            </div>
          </div>
        ))}
      </div>

      {/* Orari */}
      <div style={sectionStyle}>
        <p style={{ ...labelStyle, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Clock size={11} color="#e8622a" /> Orari di apertura
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {DAYS.map(day => {
            const h = form.hours?.[day] || { open: '10:00', close: '22:00', closed: false }
            return (
              <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 72, fontSize: 12, color: 'rgba(240,237,232,0.6)', flexShrink: 0 }}>
                  {DAYS_IT[day]}
                </span>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', flexShrink: 0 }}>
                  <input type="checkbox" checked={h.closed}
                    onChange={e => setHour(day, 'closed', e.target.checked)}
                    style={{ accentColor: '#e8622a', width: 14, height: 14 }} />
                  <span style={{ fontSize: 10, color: 'rgba(240,237,232,0.4)' }}>Chiuso</span>
                </label>
                {!h.closed && (
                  <>
                    <input type="time" value={h.open} onChange={e => setHour(day, 'open', e.target.value)}
                      style={{ ...fieldStyle, padding: '8px 10px', width: 'auto', flex: 1, fontSize: 12, colorScheme: 'dark' }} />
                    <span style={{ color: 'rgba(240,237,232,0.3)', fontSize: 12, flexShrink: 0 }}>–</span>
                    <input type="time" value={h.close} onChange={e => setHour(day, 'close', e.target.value)}
                      style={{ ...fieldStyle, padding: '8px 10px', width: 'auto', flex: 1, fontSize: 12, colorScheme: 'dark' }} />
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Save button */}
      {/* Required fields warning */}
      {(!form.address || !form.phone) && (
        <div style={{ padding: '10px 14px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 10, marginBottom: 4 }}>
          <p style={{ fontSize: 12, color: '#fbbf24', fontWeight: 600 }}>⚠ Indirizzo e telefono sono obbligatori</p>
        </div>
      )}

      <button
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending || !form.address || !form.phone}
        style={{
          width: '100%', padding: '15px', borderRadius: 14, border: 'none', cursor: 'pointer',
          background: saved ? 'rgba(34,197,94,0.15)' : 'linear-gradient(135deg, #e8622a, #f0884a)',
          border: saved ? '1px solid rgba(34,197,94,0.4)' : 'none',
          color: saved ? '#4ade80' : '#fff', fontSize: 14, fontWeight: 700,
          boxShadow: saved ? 'none' : '0 4px 20px rgba(232,98,42,0.4)',
          opacity: mutation.isPending || !form.address || !form.phone ? 0.5 : 1,
          transition: 'all 0.3s',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          marginBottom: 32,
        }}
      >
        {saved
          ? <><CheckCircle size={16} /> Salvato con successo!</>
          : mutation.isPending
            ? 'Salvataggio...'
            : 'Salva modifiche'
        }
      </button>
    </div>
  )
}
