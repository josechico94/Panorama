export default function PlaceCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'hero' }) {
  if (variant === 'hero') {
    return (
      <div className="rounded-[22px] overflow-hidden skeleton" style={{ aspectRatio: '3/4' }} />
    )
  }
  return (
    <div className="rounded-[20px] overflow-hidden border border-[var(--border)]" style={{ background: 'var(--surface)' }}>
      <div className="skeleton" style={{ aspectRatio: '16/10' }} />
      <div className="p-4 space-y-2.5">
        <div className="skeleton rounded-lg h-4 w-3/4" />
        <div className="skeleton rounded-lg h-2.5 w-1/3" />
        <div className="skeleton rounded-lg h-3 w-full" />
        <div className="skeleton rounded-lg h-3 w-4/5" />
        <div className="flex gap-2 pt-1">
          <div className="skeleton rounded-full h-4 w-14" />
          <div className="skeleton rounded-full h-4 w-16" />
        </div>
      </div>
    </div>
  )
}
