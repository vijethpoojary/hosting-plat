# Complete Setup Guide — RentHub Rental Marketplace

## Prerequisites

- Node.js v16+ and npm
- MongoDB (local or Atlas)
- Cloudinary account (free tier works)

## Step-by-Step Setup

### 1. Clone & Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

### 2. Configure Environment Variables

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/rental_marketplace
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/rental_marketplace

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Get these from cloudinary.com (free account)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Get Cloudinary Credentials

1. Sign up at https://cloudinary.com (free)
2. Go to Dashboard
3. Copy: Cloud Name, API Key, API Secret
4. Paste into `.env`

### 4. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**OR use MongoDB Atlas** (cloud):
- Create free cluster at mongodb.com/cloud/atlas
- Get connection string
- Update MONGO_URI in .env

### 5. Seed Admin User

```bash
cd backend
node src/utils/seed.js
```

This creates:
- Email: `admin@renthub.com`
- Password: `Admin@123`

### 6. Start Development Servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

### 7. Test the Application

1. Open http://localhost:5173
2. Browse products (no login needed)
3. Register as OWNER to list items
4. Login as admin: `admin@renthub.com` / `Admin@123`

## User Flows

### Public User (No Login)
- Browse all products
- Search & filter
- View product details
- Click "Contact Owner" → Opens WhatsApp

### Logged-in User
- All public features
- Rate owners (1-5 stars)

### Owner (Login Required)
- Register with role "OWNER"
- Create/edit/delete products
- Upload images (Cloudinary)
- View dashboard with stats

### Admin
- Login: `admin@renthub.com` / `Admin@123`
- View analytics
- Manage all users/products
- View contact logs

## Production Deployment

### Backend (Node.js)

**Environment Variables:**
```env
NODE_ENV=production
MONGO_URI=<production_mongodb_uri>
JWT_SECRET=<strong_random_secret>
CLIENT_URL=https://your-frontend-domain.com
```

**Deploy to:**
- Heroku: `git push heroku main`
- Railway: Connect GitHub repo
- DigitalOcean App Platform
- AWS Elastic Beanstalk

### Frontend (React)

**Build:**
```bash
cd frontend
npm run build
# Creates dist/ folder
```

**Deploy to:**
- Vercel: `vercel --prod`
- Netlify: Drag & drop `dist/` folder
- AWS S3 + CloudFront
- GitHub Pages

**Update API URL:**
In production, update `frontend/src/api/axios.js`:
```js
baseURL: 'https://your-backend-api.com/api'
```

## Troubleshooting

### MongoDB Connection Error
- Check MongoDB is running: `mongod`
- Verify MONGO_URI in .env
- For Atlas: whitelist your IP

### Cloudinary Upload Fails
- Verify credentials in .env
- Check file size < 5MB
- Ensure image format is jpg/png/webp

### CORS Error
- Backend CLIENT_URL must match frontend URL
- Check cookies are enabled
- In production, use HTTPS

### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000

# Or change PORT in backend/.env
```

## API Testing

Use Postman or curl:

```bash
# Register owner
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"123456","role":"OWNER"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"123456"}' \
  -c cookies.txt

# Get products
curl http://localhost:5000/api/products
```

## Database Indexes

The app automatically creates these indexes for performance:
- Product: category, price, owner, viewsCount, contactCount
- User: email (unique)
- Rating: user + owner (unique composite)
- ViewLog: ipAddress + product (unique, TTL 1 hour)
- ContactLog: product + ipAddress + createdAt

## Security Checklist

✅ JWT in HTTP-only cookies (not localStorage)
✅ Password hashing with bcrypt
✅ Rate limiting on auth & contact endpoints
✅ Input validation with express-validator
✅ Helmet security headers
✅ CORS restricted to frontend origin
✅ Anti-spam tracking (IP-based)
✅ File upload validation (type, size)
✅ Role-based access control (RBAC)

## Tech Stack Summary

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication
- Multer + Cloudinary (file uploads)
- Express-rate-limit (anti-spam)
- Helmet (security)

**Frontend:**
- React 18 + Vite
- React Router v6
- Axios (API calls)
- React Hot Toast (notifications)
- React Icons
- Custom CSS (no framework bloat)

## Support

For issues:
1. Check console logs (browser + terminal)
2. Verify .env configuration
3. Ensure MongoDB is running
4. Check Cloudinary credentials
5. Review API responses in Network tab
