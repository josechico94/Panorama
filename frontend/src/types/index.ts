export type Category = string

export interface Place {
  _id: string
  name: string
  slug: string
  city: string
  category: string
  tags: string[]
  description: string
  shortDescription: string
  media: {
    coverImage: string
    gallery: string[]
  }
  location: {
    address: string
    neighborhood: string
    coordinates: { lat: number; lng: number }
  }
  hours: {
    [key: string]: { open: string; close: string; closed: boolean } | null
  }
  priceRange: 1 | 2 | 3 | 4
  contact: {
    phone?: string
    website?: string
    instagram?: string
    email?: string
  }
  meta: {
    featured: boolean
    active: boolean
    createdAt: string
    updatedAt: string
    views: number
  }
  isOpenNow?: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface CategoryConfig {
  id: string
  label: string
  emoji: string
  color: string
  bgColor: string
}

export const CATEGORIES: CategoryConfig[] = [
  { id: 'eat',     label: 'Mangiare',  emoji: '🍽️', color: '#f97316', bgColor: 'rgba(249,115,22,0.15)' },
  { id: 'drink',   label: 'Bere',      emoji: '🍹', color: '#a855f7', bgColor: 'rgba(168,85,247,0.15)' },
  { id: 'shop',    label: 'Shopping',  emoji: '🛍️', color: '#ec4899', bgColor: 'rgba(236,72,153,0.15)' },
  { id: 'walk',    label: 'Passeggio', emoji: '🚶', color: '#22c55e', bgColor: 'rgba(34,197,94,0.15)'  },
  { id: 'culture', label: 'Cultura',   emoji: '🏛️', color: '#3b82f6', bgColor: 'rgba(59,130,246,0.15)' },
  { id: 'sport',   label: 'Sport',     emoji: '⚡',  color: '#84cc16', bgColor: 'rgba(132,204,22,0.15)' },
  { id: 'night',   label: 'Notte',     emoji: '🌙', color: '#6366f1', bgColor: 'rgba(99,102,241,0.15)' },
]

// ✅ Cache in memoria delle categorie dal backend (aggiornata da useCategoriesStore)
let _categoriesCache: CategoryConfig[] = []

export function setCategoriesCache(cats: CategoryConfig[]) {
  _categoriesCache = cats
}

// ✅ Lista completa: cache backend + default come fallback
export function getAllCategories(): CategoryConfig[] {
  if (_categoriesCache.length > 0) return _categoriesCache
  return CATEGORIES
}

// ✅ getCategoryConfig cerca nella cache backend, poi default, poi genera fallback
export const getCategoryConfig = (id: string): CategoryConfig => {
  const all = getAllCategories()
  return all.find(c => c.id === id) ?? {
    id,
    label: id.charAt(0).toUpperCase() + id.slice(1),
    emoji: '📍',
    color: '#BB00FF',
    bgColor: 'rgba(187,0,255,0.15)',
  }
}

export const PRICE_LABELS: Record<number, string> = {
  1: '€',
  2: '€€',
  3: '€€€',
  4: '€€€€',
}
