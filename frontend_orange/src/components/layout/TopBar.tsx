import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, MapPin } from 'lucide-react'
import { useAppStore } from '@/store'

export default function TopBar() {
  const [searchOpen, setSearchOpen] = useState(false)
  const { searchQuery, setSearchQuery, city } = useAppStore()
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) navigate('/esplora')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass h-14 border-b border-[var(--border)]">
      <div className="max-w-2xl mx-auto px-4 h-full flex items-center justify-between gap-3">
        {searchOpen ? (
          <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2" style={{animation:'slideDown 0.2s ease'}}>
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cerca un posto..."
              className="field py-2 text-sm flex-1"
            />
            <button
              type="button"
              onClick={() => { setSearchOpen(false); setSearchQuery('') }}
              className="p-2 rounded-xl text-[var(--text-3)] hover:text-[var(--text)] transition-colors"
            >
              <X size={16} />
            </button>
          </form>
        ) : (
          <>
            <div className="flex items-center gap-2.5">
              {/* Logo mark */}
              <div className="relative w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden"
                style={{background:'linear-gradient(135deg,var(--accent),var(--accent2))'}}>
                <span className="font-display font-bold text-white text-base leading-none" style={{fontFamily:'Cormorant Garamond,serif'}}>C</span>
              </div>
              {/* City */}
              <div className="flex items-center gap-1.5">
                <MapPin size={10} className="text-[var(--accent)]" strokeWidth={2.5} />
                <span className="text-[var(--text-2)] text-xs font-medium tracking-widest uppercase" style={{letterSpacing:'0.14em'}}>
                  {city}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSearchOpen(true)}
              className="w-8 h-8 rounded-xl glass-light flex items-center justify-center text-[var(--text-2)] hover:text-[var(--text)] transition-all hover:border-[var(--border2)] active:scale-95"
              aria-label="Cerca"
            >
              <Search size={15} />
            </button>
          </>
        )}
      </div>
    </header>
  )
}
