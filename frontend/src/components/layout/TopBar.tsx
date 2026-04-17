import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useAppStore } from '@/store'
import NotificationBell from '@/components/ui/NotificationBell'
import { useSearchUI } from '@/components/search/SearchOverlay'

export default function TopBar() {
  const { slogan } = useAppStore()
  const { open: openSearch } = useSearchUI()

  return (
    <header
      className="topbar"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'var(--bg)',
        paddingTop: 'env(safe-area-inset-top)',
        height: 'calc(56px + env(safe-area-inset-top))',
        boxSizing: 'border-box',
      }}
    >
      {/* Accent line */}
      <div style={{
        position: 'absolute',
        top: 'env(safe-area-inset-top)',
        left: 0,
        right: 0,
        height: 2,
        background: 'linear-gradient(90deg, #BB00FF, #9000CC, #BB00FF00)',
      }} />

      <div style={{
        width: '100%',
        maxWidth: 672,
        margin: '0 auto',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        boxSizing: 'border-box',
      }}>

        {/* ── Brand: icona tonda + scritta viola ── */}
        <Link
          to="/"
          style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}
        >
          {/* Icona tonda */}
          <img
            src="/icons/icon-192.png"
            alt="faf icon"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              display: 'block',
              flexShrink: 0,
            }}
          />

          {/* ✅ Scritta "Faf" viola + città sotto */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <img
              src="/icons/Faf_Scritta.png"
              alt="faf"
              style={{
                height: 20,
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
              }}
            />
            <span style={{
              fontSize: 7,
              color: 'var(--text-3)',
              display: 'block',
              lineHeight: 1,
              fontFamily: 'DM Mono',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginTop: 2,
            }}>
              {slogan}
            </span>
          </div>
        </Link>

        {/* ── Actions ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <NotificationBell />

          {/* Lente — apre SearchOverlay globale */}
          <button
            onClick={openSearch}
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: 'rgba(187,0,255,0.1)',
              border: '1px solid rgba(187,0,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <Search size={14} color="#BB00FF" />
          </button>
        </div>
      </div>
    </header>
  )
}
