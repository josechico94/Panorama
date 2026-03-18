# CityApp 🏙️

> Scopri cosa fare a Bologna — ristoranti, locali, cultura, shopping e molto altro.

## Stack

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS + Framer Motion
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB (Atlas o locale)
- **Storage immagini**: Cloudinary
- **Mappa**: Leaflet + OpenStreetMap

## Setup iniziale

### 1. Requisiti

- Node.js >= 18
- MongoDB (locale o Atlas)
- Account Cloudinary (gratuito — per upload immagini)

### 2. Installa dipendenze

```bash
npm run install:all
```

### 3. Configura il backend

```bash
cd backend
cp .env.example .env
```

Modifica `backend/.env` con le tue credenziali:
- `MONGODB_URI` — URI MongoDB
- `JWT_SECRET` — stringa segreta (usa una lunga e random)
- `CLOUDINARY_*` — credenziali dal tuo account Cloudinary
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — credenziali admin iniziali

### 4. Seed del database

Popola il database con i dati di esempio per Bologna:

```bash
cd backend
npm run seed
```

Questo crea:
- 7 posti di esempio per Bologna
- L'utente admin con le credenziali del `.env`

### 5. Avvia in sviluppo

Dalla root del progetto:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Admin panel: http://localhost:5173/admin/login

## Struttura del progetto

```
cityapp/
├── frontend/          # React app
│   └── src/
│       ├── components/
│       │   ├── layout/    # AppLayout, BottomNav, TopBar, AdminLayout
│       │   ├── places/    # PlaceCard, CategoryFilter
│       │   └── ui/        # Skeleton, ecc.
│       ├── pages/
│       │   ├── HomePage.tsx
│       │   ├── ExplorePage.tsx
│       │   ├── PlaceDetailPage.tsx
│       │   ├── SavedPage.tsx
│       │   └── admin/     # Login, Dashboard, Places, PlaceForm
│       ├── lib/api.ts     # Axios client
│       ├── store/         # Zustand store
│       └── types/         # TypeScript types + CATEGORIES config
│
└── backend/           # Express API
    └── src/
        ├── config/        # MongoDB, Cloudinary
        ├── models/        # Place, Admin
        ├── routes/        # places, admin, auth, cities
        ├── middleware/    # JWT auth
        └── utils/seed.ts  # Seed script
```

## API Endpoints

### Pubblici
| Method | URL | Descrizione |
|--------|-----|-------------|
| GET | `/api/v1/places` | Lista posti (filtri: city, category, neighborhood, open_now, search) |
| GET | `/api/v1/places/featured` | Posti in evidenza |
| GET | `/api/v1/places/:slug` | Dettaglio posto |
| GET | `/api/v1/cities` | Città disponibili |
| POST | `/api/v1/auth/login` | Login admin |

### Admin (JWT required)
| Method | URL | Descrizione |
|--------|-----|-------------|
| GET | `/api/v1/admin/places` | Lista posti (admin) |
| GET | `/api/v1/admin/stats` | Statistiche dashboard |
| POST | `/api/v1/admin/places` | Crea posto |
| PUT | `/api/v1/admin/places/:id` | Aggiorna posto |
| DELETE | `/api/v1/admin/places/:id` | Elimina posto |
| POST | `/api/v1/admin/upload` | Upload immagine |

## Deploy

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy la cartella dist/ su Vercel
```

### Backend (Railway / Render)
```bash
cd backend
npm run build
# Deploy con: node dist/index.js
# Imposta le variabili d'ambiente nel pannello
```

### Variabili d'ambiente produzione (backend)
```
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<stringa-lunga-e-sicura>
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
FRONTEND_URL=https://tuo-dominio.vercel.app
```

## Prossimi step (Fase 2)

- [ ] Auth utenti (Clerk o JWT custom)
- [ ] Sistema ruoli: superadmin / admin / venue_owner
- [ ] Ogni locale gestisce il proprio profilo
- [ ] Aggiunta nuove città
- [ ] Recensioni e rating
- [ ] Liste curate dagli editor
- [ ] PWA / notifiche push
