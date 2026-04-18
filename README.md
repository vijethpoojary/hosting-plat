# RentHub — Rental Marketplace

A production-ready MERN stack rental marketplace.

## Project Structure

```
rental-marketplace/
├── backend/          # Node.js + Express API
│   ├── src/
│   │   ├── config/       # DB + Cloudinary config
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Auth, roles, rate limiting, errors
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # Express routers
│   │   └── utils/        # JWT helpers, API features, seed
│   └── server.js
└── frontend/         # React + Vite
    └── src/
        ├── api/          # Axios API calls
        ├── components/   # Reusable UI + layout
        ├── context/      # Auth context
        ├── hooks/        # useDebounce, useProducts
        └── pages/        # All page components
```

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
# Fill in MONGO_URI, JWT_SECRET, Cloudinary credentials
npm run dev
```

### 2. Seed Admin User

```bash
cd backend
node src/utils/seed.js
# Creates: admin@renthub.com / Admin@123
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | Public | Register user/owner |
| POST | /api/auth/login | Public | Login |
| POST | /api/auth/logout | Public | Logout |
| GET | /api/auth/me | JWT | Get current user |
| GET | /api/products | Public | List products (filter/sort/paginate) |
| GET | /api/products/:id | Public | Product detail + view tracking |
| POST | /api/products/:id/contact | Public | Log contact + get WhatsApp URL |
| POST | /api/products | OWNER | Create product |
| PUT | /api/products/:id | OWNER | Update product |
| DELETE | /api/products/:id | OWNER | Delete product |
| GET | /api/products/owner/dashboard | OWNER | Owner's products |
| POST | /api/ratings | USER | Rate an owner |
| GET | /api/ratings/owner/:id | Public | Get owner ratings |
| GET | /api/admin/stats | ADMIN | Analytics |
| GET | /api/admin/users | ADMIN | All users |
| GET | /api/admin/products | ADMIN | All products |
| GET | /api/admin/contacts | ADMIN | All contact logs |

## Roles

- **USER** — Browse, contact (no login), rate owners (login required)
- **OWNER** — All USER features + manage own listings + dashboard
- **ADMIN** — Full access, analytics, delete anything

## Security Features

- JWT in HTTP-only cookies (no localStorage)
- Rate limiting on auth (10/15min) and contact (5/product/hour)
- Helmet security headers
- Input validation with express-validator
- Anti-spam view tracking (TTL-indexed ViewLog)
- CORS restricted to frontend origin
