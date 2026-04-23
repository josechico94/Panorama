import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Category } from '@/types'

// ── App store ──//
interface AppState {
  city: string
  activeCategory: Category | null
  savedPlaces: string[]
  savedExperiences: string[]
  searchQuery: string
  setCity: (city: string) => void
  setActiveCategory: (cat: Category | null) => void
  toggleSaved: (placeId: string) => void
  isSaved: (placeId: string) => boolean
  toggleSavedExperience: (id: string) => void
  isSavedExperience: (id: string) => boolean
  setSearchQuery: (q: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      city: 'bologna',
      activeCategory: null,
      savedPlaces: [],
      savedExperiences: [],
      searchQuery: '',
      setCity: (city) => set({ city }),
      setActiveCategory: (cat) => set({ activeCategory: cat }),
      toggleSaved: (placeId) => {
        const { savedPlaces } = get()
        set({ savedPlaces: savedPlaces.includes(placeId)
          ? savedPlaces.filter(id => id !== placeId)
          : [...savedPlaces, placeId] })
      },
      isSaved: (placeId) => get().savedPlaces.includes(placeId),
      toggleSavedExperience: (id) => {
        const { savedExperiences } = get()
        set({ savedExperiences: savedExperiences.includes(id)
          ? savedExperiences.filter(x => x !== id)
          : [...savedExperiences, id] })
      },
      isSavedExperience: (id) => get().savedExperiences.includes(id),
      setSearchQuery: (q) => set({ searchQuery: q }),
    }),
    { 
      name: 'cityapp-store',
      partialize: (state) => ({
        city: state.city,
        savedPlaces: state.savedPlaces,
        savedExperiences: state.savedExperiences,
        // searchQuery and activeCategory are NOT persisted - reset on page load
      }),
    }
  )
)

// ── Admin store ──
interface AdminState {
  token: string | null
  admin: { email: string; name: string; role: string } | null
  setAuth: (token: string, admin: AdminState['admin']) => void
  logout: () => void
}

export const useAdminStore = create<AdminState>()((set) => ({
  token: localStorage.getItem('cityapp_admin_token'),
  admin: null,
  setAuth: (token, admin) => {
    localStorage.setItem('cityapp_admin_token', token)
    set({ token, admin })
  },
  logout: () => {
    localStorage.removeItem('cityapp_admin_token')
    set({ token: null, admin: null })
  },
}))

// ── User store ──
interface UserState {
  token: string | null
  user: { id: string; email: string; name: string } | null
  setAuth: (token: string, user: UserState['user']) => void
  logout: () => void
  isLoggedIn: () => boolean
  refreshIfNeeded: () => Promise<void>
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      isLoggedIn: () => !!get().token,
      // ✅ Rinnova token se mancano meno di 7 giorni alla scadenza
      refreshIfNeeded: async () => {
        const { token } = get()
        if (!token) return
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          const expiresIn = payload.exp * 1000 - Date.now()
          // ✅ Token completamente scaduto — logout
          if (expiresIn <= 0) {
            set({ token: null, user: null })
            return
          }
          // ✅ Rinnova solo se scade entro 7 giorni
          if (expiresIn < 7 * 24 * 60 * 60 * 1000) {
            try {
              const { authUserApi } = await import('@/lib/api')
              const data = await authUserApi.refresh()
              if (data?.token) set({ token: data.token, user: data.user })
            } catch {
              // ✅ Errore di rete — NON fare logout, il token è ancora valido
              console.log('[Auth] Refresh failed due to network, keeping existing token')
            }
          }
        } catch {
          // ✅ Token malformato — logout
          set({ token: null, user: null })
        }
      },
    }),
    { name: 'cityapp-user' }
  )
)

// ── Venue owner store ──
interface VenueState {
  token: string | null
  owner: { id: string; email: string; name: string; placeId: string } | null
  setAuth: (token: string, owner: VenueState['owner']) => void
  logout: () => void
}

export const useVenueStore = create<VenueState>()(
  persist(
    (set) => ({
      token: null,
      owner: null,
      setAuth: (token, owner) => set({ token, owner }),
      logout: () => set({ token: null, owner: null }),
    }),
    { name: 'cityapp-venue' }
  )
)
