import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { create } from 'zustand'
import { placesApi } from '@/lib/api'
import { useAppStore } from '@/store'
import { getCategoryConfig } from '@/types'
import type { Place } from '@/types'

// ── Store globale per aprire/chiudere l'overlay da qualsiasi componente ──
interface SearchUIStore {
  isOpen: boolean
  open: () => void
  close: () => void
}
export const useSearchUI = create<SearchUIStore>(set => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))

export default function SearchOverlay() {
  const { isOpen, close } = useSearchUI()
  const { city, setSearchQuery } = useAppStore()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [input, setInput] = useState('')

  const { data: searchData } = useQuery({
    queryKey: ['search-suggest', input],
    queryFn: () => placesApi.list({ city, search: input, limit: '6' }),
    enabled: input.length >= 2,
  })
  const suggestions: Place[] = searchData?.data ?? []

  // Focus automatico e reset input alla chiusura
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setInput('')
    }
  }, [isOpen])

  const handleSelect = (place: Place) => {
    close()
    navigate(`/place/${place.slug}`)
  }

  const handleSubmit = () => {
    if (!input.trim()) return
    setSearchQuery(input)
    close()
    navigate('/esplora')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(7,7,15,0.85)',
            backdropFilter: 'blur(8px)',
          }}
          onClick={e => { if (e.target === e.currentTarget) close() }}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            style={{
              background: 'var(--bg2)',
              borderBottom: '1px solid var(--border)',
              // ✅ Safe area: l'overlay parte da sotto il Dynamic Island
              paddingTop: 'calc(16px + env(safe-area-inset-top))',
              padding: '16px',
              paddingTop: 'calc(16px + env(safe-area-inset-top))',
            }}
          >
            <div style={{ maxWidth: 640, margin: '0 auto' }}>

              {/* Input row */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }} />
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    placeholder="Cerca locali, categorie, quartieri..."
                    style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: 13, background: 'var(--surface)', border: '1.5px solid rgba(187,0,255,0.3)', color: 'var(--text)', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'DM Sans' }}
                  />
                </div>
                <button
                  onClick={close}
                  style={{ width: 38, height: 38, borderRadius: 10, border: 'none', background: 'var(--surface)', color: 'var(--text-3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {suggestions.map(place => {
                    const cat = getCategoryConfig(place.category)
                    return (
                      <button key={place._id} onClick={() => handleSelect(place)}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 12, border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s', width: '100%' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(187,0,255,0.08)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div style={{ width: 36, height: 36, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: 'var(--bg3)' }}>
                          {place.media?.coverImage
                            ? <img src={place.media.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{cat.emoji}</div>}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ color: 'var(--text)', fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{place.name}</p>
                          <p style={{ color: 'var(--meta-color)', fontSize: 10, marginTop: 2 }}>{cat.emoji} {cat.label} · {place.location?.neighborhood}</p>
                        </div>
                        {(place as any).isOpenNow && (
                          <span style={{ fontSize: 9, color: '#4ade80', fontWeight: 700, flexShrink: 0 }}>Aperto</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              {input.length >= 2 && suggestions.length === 0 && (
                <p style={{ color: 'var(--text-3)', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>
                  Nessun risultato per "{input}"
                </p>
              )}

              {input.length < 2 && (
                <p style={{ color: 'var(--text-3)', fontSize: 12, textAlign: 'center', padding: '16px 0' }}>
                  Scrivi almeno 2 caratteri per cercare
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}