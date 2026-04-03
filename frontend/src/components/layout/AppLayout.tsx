import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'
import TopBar from './TopBar'
import CouponSlider from '@/components/coupons/CouponSlider'
import CouponNotifications from '@/components/coupons/CouponNotifications'
import PWAInstallPrompt from '@/components/ui/PWAInstallPrompt'

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
      // Safe area for iPhone notch/dynamic island
      paddingTop: 'env(safe-area-inset-top)',
    }}>
      <TopBar />
      <main style={{
        flex: 1,
        paddingTop: '56px',
        paddingBottom: 'calc(148px + env(safe-area-inset-bottom))',
        width: '100%',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch' as any,
      }}>
        <Outlet />
      </main>
      <CouponNotifications />
      <CouponSlider />
      <PWAInstallPrompt />
      <BottomNav />
    </div>
  )
}
