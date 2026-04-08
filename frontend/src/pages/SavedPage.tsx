import { useQuery } from '@tanstack/react-query'
import { Bookmark, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { placesApi } from '@/lib/api'
import { useAppStore } from '@/store'
import PlaceCard from '@/components/places/PlaceCard'
import PlaceCardSkeleton from '@/components/ui/PlaceCardSkeleton'
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
  const isEmpty = savedPlaces.length === 0 || (!isLoading && saved.length === 0)

  return (
    <div style={{ maxWidth: 672, margin: '0 auto' }}>

      {/* ── Header ── */}
      <div style={{ padding: '24px 16px 20px' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="accent-line" />
            <span style={{ fontFamily: 'DM Mono', fontSize: 9, color: 'var(--meta-color)', letterSpacing: '0.28em', textTransform: 'uppercase' }}>
              La tua lista
            </span>
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', fontSize: 'clamp(30px,8vw,42px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1, marginBottom: 6 }}>
            Salvati
          </h1>
          <p style={{ fontFamily: 'DM Mono', fontSize: 9, color: 'var(--meta-color)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            {isLoading ? '...' : `${saved.length} post${saved.length !== 1 ? 'i' : 'o'}`}
          </p>
        </motion.div>
      </div>

      {/* ── Empty state ── */}
      {isEmpty && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{ padding: '48px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center' }}
        >
          {/* Icon */}
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 24px rgba(187,0,255,0.08)',
          }}>
            <Bookmark size={28} color="var(--text-3)" />
          </div>

          {/* Text */}
          <div>
            <p style={{ color: 'var(--text)', fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
              Nessun posto salvato
            </p>
            <p style={{ color: 'var(--meta-color)', fontSize: 13, lineHeight: 1.6 }}>
              Premi 🔖 su qualsiasi posto<br />per aggiungerlo qui
            </p>
          </div>

          {/* CTA */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 12,
              background: 'linear-gradient(135deg,#BB00FF,#9000CC)',
              color: '#fff', fontSize: 13, fontWeight: 700,
              boxShadow: '0 4px 20px rgba(187,0,255,0.35)',
            }}>
              Scopri Bologna <ArrowRight size={14} />
            </div>
          </Link>
        </motion.div>
      )}

      {/* ── Loading skeleton ── */}
      {isLoading && savedPlaces.length > 0 && (
        <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {Array.from({ length: 4 }).map((_, i) => <PlaceCardSkeleton key={i} />)}
        </div>
      )}

      {/* ── Saved grid ── */}
      {!isEmpty && !isLoading && (
        <>
          {/* Divider label */}
          <div style={{ padding: '0 16px 14px' }}>
            <p style={{ fontFamily: 'DM Mono', fontSize: 9, color: 'var(--meta-color)', letterSpacing: '0.22em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,transparent,rgba(187,0,255,0.2))' }} />
              {saved.length} luoghi salvati
              <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,rgba(187,0,255,0.2),transparent)' }} />
            </p>
          </div>

          <div style={{ padding: '0 16px 32px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {saved.map((place, i) => (
              <motion.div
                key={place._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <PlaceCard place={place} index={i} />
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
