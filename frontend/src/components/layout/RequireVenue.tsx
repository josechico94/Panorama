import { Navigate, Outlet } from 'react-router-dom'
import { useVenueStore } from '@/store'
export default function RequireVenue() {
  const token = useVenueStore(s => s.token)
  if (!token) return <Navigate to="/locale/login" replace />
  return <Outlet />
}
