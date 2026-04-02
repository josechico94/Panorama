import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'
import TopBar from './TopBar'
import CouponSlider from '@/components/coupons/CouponSlider'
import CouponNotifications from '@/components/coupons/CouponNotifications'
import PWAInstallPrompt from '@/components/ui/PWAInstallPrompt'

export default function AppLayout() {
  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg)',
      transition: 'background 0.3s ease',
    }}>
      <TopBar />
      <main style={{
        flex: 1,
        paddingTop: '56px',    /* TopBar height */
        paddingBottom: '136px', /* BottomNav + CouponSlider */
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
