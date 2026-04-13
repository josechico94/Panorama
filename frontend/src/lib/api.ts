import axios from 'axios'

const BASE_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
  ? 'https://panoramabo.onrender.com/api/v1'
  : '/api/v1'

const getToken = (role: 'admin' | 'user' | 'venue' | 'any'): string | null => {
  try {
    if (role === 'admin' || role === 'any') {
      const t = localStorage.getItem('cityapp_admin_token')
      if (t) return t
    }
    if (role === 'venue' || role === 'any') {
      const raw = localStorage.getItem('cityapp-venue')
      if (raw) { const t = JSON.parse(raw)?.state?.token; if (t) return t }
    }
    if (role === 'user' || role === 'any') {
      const raw = localStorage.getItem('cityapp-user')
      if (raw) { const t = JSON.parse(raw)?.state?.token; if (t) return t }
    }
  } catch {}
  return null
}

const makeApi = (role: 'admin' | 'user' | 'venue' | 'any') => {
  const instance = axios.create({ baseURL: BASE_URL })

  instance.interceptors.request.use((config) => {
    const token = getToken(role)
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })

  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        const path = window.location.pathname
        if (role === 'admin' && path.startsWith('/admin') && path !== '/admin/login') {
          localStorage.removeItem('cityapp_admin_token')
          window.location.href = '/admin/login'
        }
        if (role === 'venue' && path.startsWith('/locale') && path !== '/locale/login') {
          window.location.href = '/locale/login'
        }
      }
      return Promise.reject(err)
    }
  )

  return instance
}

const apiPublic = makeApi('any')
const apiAdmin  = makeApi('admin')
const apiUser   = makeApi('user')
const apiVenue  = makeApi('venue')

export const placesApi = {
  list:    (params?: Record<string, any>) => apiPublic.get('/places', { params }).then(r => r.data),
  get:     (slug: string) => apiPublic.get(`/places/${slug}`).then(r => r.data),
  featured: () => apiPublic.get('/places/featured').then(r => r.data),
  nearby:  (lat: number, lng: number, params?: any) => apiPublic.get('/places/nearby', { params: { lat, lng, ...params } }).then(r => r.data),
}

export const authApi = {
  adminLogin:   (email: string, password: string) => apiPublic.post('/auth/login', { email, password }).then(r => r.data),
  adminMe:      () => apiAdmin.get('/auth/me').then(r => r.data),
  userRegister: (name: string, email: string, password: string) => apiPublic.post('/auth/user/register', { name, email, password }).then(r => r.data),
  userLogin:    (email: string, password: string) => apiPublic.post('/auth/user/login', { email, password }).then(r => r.data),
  userMe:       () => apiUser.get('/auth/user/me').then(r => r.data),
  venueLogin:   (email: string, password: string) => apiPublic.post('/auth/venue/login', { email, password }).then(r => r.data),
}

export const couponsApi = {
  active:   () => apiPublic.get('/coupons/active').then(r => r.data),
  forPlace: (placeId: string) => apiPublic.get(`/coupons/place/${placeId}`).then(r => r.data),
  get:      (id: string) => apiPublic.get(`/coupons/${id}`).then(r => r.data),
  claim:    (id: string) => apiUser.post(`/coupons/${id}/claim`).then(r => r.data),
  myList:   () => apiUser.get('/coupons/my/list').then(r => r.data),
  validate: (code: string) => apiPublic.get(`/coupons/validate/${code}`).then(r => r.data),
  markUsed: (code: string) => apiPublic.post(`/coupons/use/${code}`).then(r => r.data),
}

export const venueApi = {
  me:           () => apiVenue.get('/venue/me').then(r => r.data),
  updateMe:     (data: any) => apiVenue.put('/venue/me', data).then(r => r.data),
  coupons:      () => apiVenue.get('/venue/coupons').then(r => r.data),
  createCoupon: (data: any) => apiVenue.post('/venue/coupons', data).then(r => r.data),
  updateCoupon: (id: string, data: any) => apiVenue.put(`/venue/coupons/${id}`, data).then(r => r.data),
  deleteCoupon: (id: string) => apiVenue.delete(`/venue/coupons/${id}`).then(r => r.data),
  couponStats:  (id: string) => apiVenue.get(`/venue/coupons/${id}/stats`).then(r => r.data),
}

export const adminApi = {
  login:       (email: string, password: string) => apiPublic.post('/auth/login', { email, password }).then(r => r.data),
  me:          () => apiAdmin.get('/auth/me').then(r => r.data),
  stats:       () => apiAdmin.get('/admin/stats').then(r => r.data),
  listPlaces:  (params?: any) => apiAdmin.get('/admin/places', { params }).then(r => r.data),
  createPlace: (data: any) => apiAdmin.post('/admin/places', data).then(r => r.data),
  updatePlace: (id: string, data: any) => apiAdmin.put(`/admin/places/${id}`, data).then(r => r.data),
  deletePlace: (id: string) => apiAdmin.delete(`/admin/places/${id}`).then(r => r.data),
  upload:      (file: File) => {
    const fd = new FormData(); fd.append('image', file)
    return apiAdmin.post('/admin/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data)
  },
}

export const superAdminApi = {
  stats:            () => apiAdmin.get('/superadmin/stats').then(r => r.data),
  listPlaces:       (params?: any) => apiAdmin.get('/superadmin/places', { params }).then(r => r.data),
  createPlace:      (data: any) => apiAdmin.post('/superadmin/places', data).then(r => r.data),
  updatePlace:      (id: string, data: any) => apiAdmin.put(`/superadmin/places/${id}`, data).then(r => r.data),
  deletePlace:      (id: string) => apiAdmin.delete(`/superadmin/places/${id}`).then(r => r.data),
  listUsers:        (params?: any) => apiAdmin.get('/superadmin/users', { params }).then(r => r.data),
  deleteUser:       (id: string) => apiAdmin.delete(`/superadmin/users/${id}`).then(r => r.data),
  listCoupons:      (params?: any) => apiAdmin.get('/superadmin/coupons', { params }).then(r => r.data),
  updateCoupon:     (id: string, data: any) => apiAdmin.put(`/superadmin/coupons/${id}`, data).then(r => r.data),
  deleteCoupon:     (id: string) => apiAdmin.delete(`/superadmin/coupons/${id}`).then(r => r.data),
  listReviews:      (params?: any) => apiAdmin.get('/superadmin/reviews', { params }).then(r => r.data),
  deleteReview:     (id: string) => apiAdmin.delete(`/superadmin/reviews/${id}`).then(r => r.data),
  listVenueOwners:  (params?: any) => apiAdmin.get('/superadmin/venue-owners', { params }).then(r => r.data),
  createVenueOwner: (data: any) => apiAdmin.post('/superadmin/venue-owners', data).then(r => r.data),
  updateVenueOwner: (id: string, data: any) => apiAdmin.put(`/superadmin/venue-owners/${id}`, data).then(r => r.data),
  deleteVenueOwner: (id: string) => apiAdmin.delete(`/superadmin/venue-owners/${id}`).then(r => r.data),
  upload: (file: File) => {
    const fd = new FormData(); fd.append('image', file)
    return apiAdmin.post('/superadmin/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data)
  },
}

export const reviewsApi = {
  forPlace:       (placeId: string) => apiPublic.get(`/reviews/place/${placeId}`).then(r => r.data),
  create:         (placeId: string, data: { rating: number; comment: string }) => apiUser.post(`/reviews/place/${placeId}`, data).then(r => r.data),
  forExperience:  (experienceId: string) => apiPublic.get(`/reviews/experience/${experienceId}`).then(r => r.data),
  createForExp:   (experienceId: string, data: { rating: number; comment: string }) => apiUser.post(`/reviews/experience/${experienceId}`, data).then(r => r.data),
  delete:         (id: string) => apiUser.delete(`/reviews/${id}`).then(r => r.data),
}

export const categoriesApi = {
  list:   () => apiPublic.get('/categories').then(r => r.data),
  create: (data: any) => apiAdmin.post('/categories', data).then(r => r.data),
  update: (id: string, data: any) => apiAdmin.put(`/categories/${id}`, data).then(r => r.data),
  delete: (id: string) => apiAdmin.delete(`/categories/${id}`).then(r => r.data),
}

export const api = apiPublic

// ── Experiences API ──
export const experiencesApi = {
  list:   (params?: any) => apiPublic.get('/experiences', { params }).then(r => r.data),
  get:    (slug: string) => apiPublic.get(`/experiences/${slug}`).then(r => r.data),
  create: (data: any) => apiAdmin.post('/experiences', data).then(r => r.data),
  update: (id: string, data: any) => apiAdmin.put(`/experiences/${id}`, data).then(r => r.data),
  delete: (id: string) => apiAdmin.delete(`/experiences/${id}`).then(r => r.data),
}

// ── Weekly Offers API ──
export const weeklyOffersApi = {
  list: () => apiPublic.get('/coupons/active?limit=50').then(r => r.data),
}
