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

// ── Apply theme on mount — solo per app pubblica ──
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore()

  useEffect(() => {
    const path = window.location.pathname
    // Admin e venue usano sempre dark — ignora il toggle utente
    const isAdminOrVenue = path.startsWith('/admin') || path.startsWith('/locale') || path.startsWith('/superadmin')
    if (isAdminOrVenue) {
      document.documentElement.setAttribute('data-theme', 'dark')
      return
    }
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Reset a dark quando si entra in admin/venue
  useEffect(() => {
    const handleNav = () => {
      const path = window.location.pathname
      if (path.startsWith('/admin') || path.startsWith('/locale') || path.startsWith('/superadmin')) {
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        document.documentElement.setAttribute('data-theme', theme)
      }
    }
    window.addEventListener('popstate', handleNav)
    return () => window.removeEventListener('popstate', handleNav)
  }, [theme])

  return <>{children}</>
}
