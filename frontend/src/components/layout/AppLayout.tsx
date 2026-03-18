import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'
import TopBar from './TopBar'
import CouponSlider from '@/components/coupons/CouponSlider'
import CouponNotifications from '@/components/coupons/CouponNotifications'
import PWAInstallPrompt from '@/components/ui/PWAInstallPrompt'

export default function AppLayout() {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <TopBar />
      <main style={{ flex: 1, paddingTop: '56px', paddingBottom: '140px' }}>
        <Outlet />
      </main>
      <CouponNotifications />
      <CouponSlider />
      <PWAInstallPrompt />
      <BottomNav />
    </div>
  )
}
