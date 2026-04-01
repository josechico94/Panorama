import { motion } from 'framer-motion'
import { CATEGORIES } from '@/types'
import type { Category } from '@/types'
import { useAppStore } from '@/store'

export default function CategoryFilter() {
  const { activeCategory, setActiveCategory } = useAppStore()

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar">
      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={() => setActiveCategory(null)}
        className={`shrink-0 cat-pill transition-all duration-200 ${
          activeCategory === null
            ? 'bg-[var(--text)] text-[var(--bg)] border-transparent'
            : 'bg-transparent text-[var(--text-2)] border-[var(--border2)] hover:border-[var(--text-3)] hover:text-[var(--text)]'
        }`}
      >
        Tutti
      </motion.button>

      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id
        return (
          <motion.button
            key={cat.id}
            whileTap={{ scale: 0.93 }}
            onClick={() => setActiveCategory(isActive ? null : cat.id as Category)}
            className="shrink-0 cat-pill"
            style={
              isActive
                ? {
                    backgroundColor: cat.color,
                    color: '#fff',
                    borderColor: 'transparent',
                    boxShadow: `0 4px 20px ${cat.color}55`,
                  }
                : {
                    backgroundColor: `${cat.color}14`,
                    color: cat.color,
                    borderColor: `${cat.color}35`,
                  }
            }
          >
            <span style={{fontSize:'11px'}}>{cat.emoji}</span>
            {cat.label}
          </motion.button>
        )
      })}
    </div>
  )
}
