import { useQuery } from '@tanstack/react-query'
import { Bookmark, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { placesApi } from '@/lib/api'
import { useAppStore } from '@/store'
import PlaceCard from '@/components/places/PlaceCard'
import type { Place } from '@/types'

export default function SavedPage() {
  const { savedPlaces, city } = useAppStore()

  const { data, isLoading } = useQuery({
    queryKey: ['all-places-saved', city],
    queryFn: () => placesApi.list({ city, limit: '100' }),
    enabled: savedPlaces.length > 0,
  })

  const allPlaces: Place[] = data?.data ?? []
  const saved = allPlaces.filter(p => savedPlaces.includes(p._id))

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="accent-line" />
          <span className="font-mono-dm text-[var(--text-3)] text-[9px] tracking-[0.28em] uppercase">La tua lista</span>
        </div>
        <h1 className="font-display font-bold"
          style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(30px,8vw,42px)', fontStyle:'italic' }}>
          Salvati
        </h1>
        <p className="text-[var(--text-3)] text-xs mt-1 font-mono-dm">
          {saved.length} post{saved.length !== 1 ? 'i' : 'o'}
        </p>
      </motion.div>

      {savedPlaces.length === 0 || (!isLoading && saved.length === 0) ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center py-20 space-y-5"
        >
          <div className="w-16 h-16 rounded-2xl glass-light flex items-center justify-center mx-auto"
            style={{ border: '1px solid var(--border2)' }}>
            <Bookmark size={24} className="text-[var(--text-3)]" />
          </div>
          <div>
            <p className="text-[var(--text-2)] font-medium text-sm">Nessun posto salvato</p>
            <p className="text-[var(--text-3)] text-xs mt-1.5 leading-relaxed">
              Premi 🔖 su qualsiasi posto<br />per aggiungerlo qui
            </p>
          </div>
          <Link to="/"
            className="btn btn-ghost inline-flex gap-1.5 text-xs">
            Scopri Bologna <ArrowRight size={13} />
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {saved.map((place, i) => (
            <PlaceCard key={place._id} place={place} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
