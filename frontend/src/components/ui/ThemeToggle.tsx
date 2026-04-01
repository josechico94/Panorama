import { useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Theme store
interface ThemeState {
  theme: 'dark' | 'light'
  toggle: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggle: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        set({ theme: next })
        document.documentElement.setAttribute('data-theme', next)
      },
    }),
    { name: 'faf-theme' }
  )
)

// Apply theme on mount
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore()
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
  return <>{children}</>
}

// Toggle button
export function ThemeToggle() {
  const { theme, toggle } = useThemeStore()
  return (
    <button onClick={toggle} style={{
      width: 36, height: 36, borderRadius: 10,
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', transition: 'all 0.2s', color: 'var(--text-2)',
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
      {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  )
}
