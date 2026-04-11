import { motion } from 'framer-motion'
import { getAllCategories } from '@/types'
import type { Category } from '@/types'
import { useAppStore } from '@/store'

export default function CategoryFilter() {
  const { activeCategory, setActiveCategory } = useAppStore()

  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        overflowX: 'auto',
        paddingBottom: 4,
        paddingTop: 2,
      }}
      className="no-scrollbar"
    >
      {/* ── Tutti ── */}
      <motion.button
        whileTap={{ scale: 0.93 }}
        whileHover={{ scale: 1.03 }}
        onClick={() => setActiveCategory(null)}
        style={{
          flexShrink: 0,
          width: 80,
          height: 80,
          borderRadius: 14,
          border: activeCategory === null
            ? '2px solid #BB00FF'
            : '2px solid var(--border)',
          background: activeCategory === null
            ? 'linear-gradient(135deg, #BB00FF22, #BB00FF44)'
            : 'var(--surface)',
          boxShadow: activeCategory === null
            ? '0 0 16px rgba(187,0,255,0.35)'
            : 'none',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          transition: 'all 0.2s',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow background quando attivo */}
        {activeCategory === null && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle at 50% 40%, rgba(187,0,255,0.18), transparent 70%)',
            pointerEvents: 'none',
          }} />
        )}
        <span style={{ fontSize: 24 }}>🎯</span>
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          color: activeCategory === null ? '#BB00FF' : 'var(--text-2)',
          fontFamily: 'DM Sans',
          letterSpacing: '-0.01em',
        }}>
          Tutti
        </span>
      </motion.button>

      {/* ── Categorie ── */}
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id
        return (
          <motion.button
            key={cat.id}
            whileTap={{ scale: 0.93 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => setActiveCategory(isActive ? null : cat.id as Category)}
            style={{
              flexShrink: 0,
              width: 80,
              height: 80,
              borderRadius: 14,
              border: isActive
                ? `2px solid ${cat.color}`
                : '2px solid var(--border)',
              background: isActive
                ? `linear-gradient(135deg, ${cat.color}22, ${cat.color}44)`
                : 'var(--surface)',
              boxShadow: isActive
                ? `0 0 16px ${cat.color}55`
                : 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              transition: 'all 0.2s',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Glow background quando attivo */}
            {isActive && (
              <div style={{
                position: 'absolute', inset: 0,
                background: `radial-gradient(circle at 50% 40%, ${cat.color}22, transparent 70%)`,
                pointerEvents: 'none',
              }} />
            )}
            <span style={{ fontSize: 24 }}>{cat.emoji}</span>
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              color: isActive ? cat.color : 'var(--text-2)',
              fontFamily: 'DM Sans',
              letterSpacing: '-0.01em',
              maxWidth: 70,
              textAlign: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {cat.label}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
