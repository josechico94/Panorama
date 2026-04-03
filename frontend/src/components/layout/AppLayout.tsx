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
      maxWidth: '100vw',
      overflowX: 'hidden',
    }}>
      <TopBar />
      <main style={{
        flex: 1,
        paddingTop: '56px',
        paddingBottom: '148px',
        width: '100%',
        overflowX: 'hidden',
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
