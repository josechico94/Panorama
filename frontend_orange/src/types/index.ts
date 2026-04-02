export type Category = 'eat' | 'drink' | 'shop' | 'walk' | 'culture' | 'sport' | 'night'

export interface Place {
  _id: string
  name: string
  slug: string
  city: string
  category: Category
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
  id: Category
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

export const getCategoryConfig = (id: Category): CategoryConfig =>
  CATEGORIES.find(c => c.id === id) ?? CATEGORIES[0]

export const PRICE_LABELS: Record<number, string> = {
  1: '€',
  2: '€€',
  3: '€€€',
  4: '€€€€',
}
