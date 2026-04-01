import { useEffect } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ── Theme store ──
interface ThemeState {
  theme: 'dark' | 'light'
  toggle: () => void
  setTheme: (t: 'dark' | 'light') => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark' as const,
      toggle: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        document.documentElement.setAttribute('data-theme', next)
        set({ theme: next })
      },
      setTheme: (t) => {
        document.documentElement.setAttribute('data-theme', t)
        set({ theme: t })
      },
    }),
    { name: 'faf-theme' }
  )
)

// ── Apply theme on mount ──
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return <>{children}</>
}
