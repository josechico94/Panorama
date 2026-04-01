import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import AdminLayout from '@/components/layout/AdminLayout'
import VenueLayout from '@/components/layout/VenueLayout'
import RequireAdmin from '@/components/layout/RequireAdmin'
import RequireVenue from '@/components/layout/RequireVenue'
import SuperAdminLayout from '@/pages/superadmin/SuperAdminLayout'

import HomePage from '@/pages/HomePage'
import ExplorePage from '@/pages/ExplorePage'
import PlaceDetailPage from '@/pages/PlaceDetailPage'
import SavedPage from '@/pages/SavedPage'
import CouponDetailPage from '@/pages/CouponDetailPage'
import AuthPage from '@/pages/user/AuthPage'
import ProfilePage from '@/pages/user/ProfilePage'

import AdminLoginPage from '@/pages/admin/AdminLoginPage'
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'
import AdminPlacesPage from '@/pages/admin/AdminPlacesPage'
import AdminPlaceFormPage from '@/pages/admin/AdminPlaceFormPage'

import VenueLoginPage from '@/pages/venue/VenueLoginPage'
import VenueDashboardPage from '@/pages/venue/VenueDashboardPage'
import VenueScannerPage from '@/pages/venue/VenueScannerPage'
import VenueInfoPage from '@/pages/venue/VenueInfoPage'

import SADashboard from '@/pages/superadmin/SADashboard'
import SAPlaces from '@/pages/superadmin/SAPlaces'
import SAUsers from '@/pages/superadmin/SAUsers'
import SACoupons from '@/pages/superadmin/SACoupons'
import SAReviews from '@/pages/superadmin/SAReviews'
import SAVenues from '@/pages/superadmin/SAVenues'
import SAExperiences from '@/pages/superadmin/SAExperiences'
import ExperiencesPage from '@/pages/ExperiencesPage'
import ExperienceDetailPage from '@/pages/ExperienceDetailPage'
import WeeklyOffersPage from '@/pages/WeeklyOffersPage'

export default function App() {
  return (
    <Routes>
      {/* Public app */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/esplora" element={<ExplorePage />} />
        <Route path="/place/:slug" element={<PlaceDetailPage />} />
        <Route path="/salvati" element={<SavedPage />} />
        <Route path="/coupon/:id" element={<CouponDetailPage />} />
        <Route path="/esperienze" element={<ExperiencesPage />} />
        <Route path="/esperienze/:slug" element={<ExperienceDetailPage />} />
        <Route path="/offerte" element={<WeeklyOffersPage />} />
        <Route path="/profilo" element={<ProfilePage />} />
      </Route>

      {/* Auth */}
      <Route path="/accedi" element={<AuthPage />} />

      {/* Venue portal */}
      <Route path="/locale/login" element={<VenueLoginPage />} />
      <Route element={<RequireVenue />}>
        <Route element={<VenueLayout />}>
          <Route path="/locale" element={<VenueDashboardPage />} />
          <Route path="/locale/scanner" element={<VenueScannerPage />} />
          <Route path="/locale/info" element={<VenueInfoPage />} />
        </Route>
      </Route>

      {/* Super Admin */}
      <Route element={<RequireAdmin />}>
        <Route element={<SuperAdminLayout />}>
          <Route path="/superadmin" element={<SADashboard />} />
          <Route path="/superadmin/places" element={<SAPlaces />} />
          <Route path="/superadmin/users" element={<SAUsers />} />
          <Route path="/superadmin/coupons" element={<SACoupons />} />
          <Route path="/superadmin/reviews" element={<SAReviews />} />
          <Route path="/superadmin/experiences" element={<SAExperiences />} />
          <Route path="/superadmin/venues" element={<SAVenues />} />
        </Route>
      </Route>

      {/* Legacy admin (keep for compatibility) */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route element={<RequireAdmin />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/places" element={<AdminPlacesPage />} />
          <Route path="/admin/places/new" element={<AdminPlaceFormPage />} />
          <Route path="/admin/places/:id/edit" element={<AdminPlaceFormPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
