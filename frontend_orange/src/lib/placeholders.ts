// Real Bologna photos from Unsplash — free to use
export const CATEGORY_PLACEHOLDERS: Record<string, string> = {
  eat:     'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80', // restaurant
  drink:   'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=800&q=80', // bar aperitivo
  shop:    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80', // shopping
  walk:    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', // walking street
  culture: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800&q=80', // museum
  sport:   'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80', // sport
  night:   'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80', // nightlife
  default: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&q=80', // bologna piazza
}

export function getPlaceholder(category?: string): string {
  return CATEGORY_PLACEHOLDERS[category || 'default'] || CATEGORY_PLACEHOLDERS.default
}
