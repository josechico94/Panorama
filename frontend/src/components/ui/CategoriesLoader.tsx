// ── CategoriesLoader ──
// Componente invisibile che carica le categorie dal backend
// e le mette nella cache globale di getCategoryConfig
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { categoriesApi } from '@/lib/api'
import { setCategoriesCache } from '@/types'

export default function CategoriesLoader() {
  const { data } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.list(),
    staleTime: 5 * 60 * 1000, // cache 5 minuti
  })

  useEffect(() => {
    if (data?.data?.length) {
      const mapped = data.data.map((c: any) => ({
        id: c.id,
        label: c.label,
        emoji: c.emoji,
        color: c.color,
        bgColor: c.color + '26',
      }))
      setCategoriesCache(mapped)
    }
  }, [data])

  return null // nessun rendering
}
