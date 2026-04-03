import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'
import TopBar from './TopBar'
import CouponSlider from '@/components/coupons/CouponSlider'
import CouponNotifications from '@/components/coupons/CouponNotifications'
import PWAInstallPrompt from '@/components/ui/PWAInstallPrompt'
import SearchOverlay from '@/components/search/SearchOverlay'

export default function AppLayout() {
  return (
    <div style={{
      minHeight: '100svh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg)',
      transition: 'background 0.3s ease',
      width: '100%',
      maxWidth: '100vw',
      overflowX: 'hidden',
      // ✅ Nessun paddingTop qui — la TopBar è fixed e gestisce da sola la safe area
    }}>
      <TopBar />

      <main style={{
        flex: 1,
        // ✅ Compensa: altezza TopBar (56px) + safe-area-inset-top (Dynamic Island / notch)
        paddingTop: 'calc(56px + env(safe-area-inset-top))',
        paddingBottom: 'calc(148px + env(safe-area-inset-bottom))',
        width: '100%',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch' as any,
      }}>
        <Outlet />
      </main>

      <CouponNotifications />
      <CouponSlider />

      {/* ✅ SearchOverlay globale — accessibile da TopBar in qualsiasi pagina */}
      <SearchOverlay />

      <PWAInstallPrompt />
      <BottomNav />
    </div>
  )
}
