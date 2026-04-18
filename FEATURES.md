# Feature Documentation

## Core Features

### 1. Public Browsing (No Login Required)

**Home Page:**
- Hero section with search bar
- Category filters (cars, dresses, electronics, etc.)
- Price range filters (min/max)
- Sort options:
  - Newest
  - Top Rated
  - Most Viewed
  - Most Contacted
  - Price: Low to High / High to Low
- Pagination (12 items per page)
- Debounced search (400ms delay)

**Product Cards Display:**
- Product image (or emoji placeholder)
- Title, category, price
- Owner rating (stars + count)
- View count & contact count
- Location badge

### 2. Product Detail Page

**Viewing:**
- Image gallery with thumbnails
- Full description
- Owner info with rating
- Location, views, contacts
- Auto-increments view count (anti-spam: 1 per IP per hour)

**Contact Owner:**
- Click "Contact on WhatsApp" button
- Backend logs the contact attempt
- Anti-spam: max 5 clicks per IP per product per hour
- Opens WhatsApp with prefilled message:
  ```
  Hi, I'm interested in [Product Name]
  ```

**Rating System:**
- Login required to rate
- 1-5 star picker
- Optional review text
- One rating per user per owner
- Can update existing rating
- Real-time average calculation

### 3. Authentication

**Registration:**
- Choose role: USER or OWNER
- Fields: name, email, password, phone (optional)
- Password validation (min 6 chars)
- Auto-login after registration

**Login:**
- Email + password
- JWT stored in HTTP-only cookie
- Auto-redirect based on role:
  - ADMIN → /admin
  - OWNER → /dashboard
  - USER → previous page or home

**Security:**
- Passwords hashed with bcrypt (12 rounds)
- Rate limiting: 10 attempts per 15 minutes
- Input validation with express-validator

### 4. Owner Dashboard

**Stats Overview:**
- Total listings
- Total views across all products
- Total contacts
- Average rating

**Product Management:**
- Table view of all listings
- Shows: thumbnail, title, category, price, views, contacts, status
- Actions: Edit, Delete
- Click "Add New Item" to create

**Create/Edit Product:**
- Title (max 100 chars)
- Description (max 2000 chars)
- Category dropdown
- Price + unit (per day/hour/week/month)
- WhatsApp number
- Location (optional)
- Images: upload up to 5 (max 5MB each)
- Images stored on Cloudinary
- Auto-optimized (800x600, quality: auto)

### 5. Admin Dashboard

**Overview Tab:**
- Stats cards: users, owners, products, contacts
- Most viewed products (top 5)
- Most contacted products (top 5)
- Contact activity chart (last 7 days)

**Users Tab:**
- Paginated table (20 per page)
- Shows: name, email, role, join date
- Delete users (except admins)

**Products Tab:**
- All products across platform
- Shows: title, owner, category, price, views, contacts
- Delete any product

**Contact Logs Tab:**
- Every contact click logged
- Shows: product, owner, user (or "Guest"), IP, timestamp
- Paginated (50 per page)

### 6. Tracking & Analytics

**View Tracking:**
- Increments when product detail page loads
- Anti-spam: uses ViewLog collection with TTL index
- One increment per IP per product per hour
- ViewLog auto-deletes after 1 hour

**Contact Tracking:**
- Logs every "Contact Owner" click
- Stores: IP, user agent, product, owner, user (if logged in), timestamp
- Rate limited: 5 per IP per product per hour
- Global limit: 30 per IP per hour

**Rating Aggregation:**
- Calculates average rating per owner
- Updates on every new/updated rating
- Stored in User.averageRating and User.totalRatings

### 7. Search & Filtering

**Search:**
- Searches in: title, description, location
- Case-insensitive regex
- Debounced (400ms) to reduce API calls

**Filters:**
- Category (all, cars, dresses, etc.)
- Price range (min/max)
- Sort by multiple criteria

**API Features:**
- Pagination with page/limit
- Total count for "X items found"
- Efficient MongoDB indexes

### 8. Image Management

**Upload:**
- Multer handles multipart/form-data
- Cloudinary storage with auto-optimization
- Transformation: max 800x600, quality: auto
- Folder: rental_marketplace

**Delete:**
- When product deleted, images removed from Cloudinary
- Uses publicId for deletion

**Display:**
- Lazy loading on product cards
- Thumbnail gallery on detail page
- Fallback emoji if no image

### 9. Role-Based Access Control (RBAC)

**Middleware Chain:**
```
protect → requireRole(['OWNER', 'ADMIN']) → controller
```

**Permissions:**
- Public routes: browse, view, contact
- USER: + rate owners
- OWNER: + manage own products, dashboard
- ADMIN: + manage all users/products, analytics

**Protected Routes:**
- Frontend: `<ProtectedRoute roles={['OWNER']} />`
- Backend: `requireRole('OWNER', 'ADMIN')`

### 10. Error Handling

**Centralized Middleware:**
- Catches all errors
- Normalizes error responses
- Handles:
  - Mongoose validation errors
  - Duplicate key errors (11000)
  - Cast errors (invalid ObjectId)
  - JWT errors
  - Multer file size errors

**User-Friendly Messages:**
- Toast notifications on frontend
- Clear error messages
- No stack traces in production

### 11. Performance Optimizations

**Backend:**
- MongoDB indexes on frequently queried fields
- Pagination to limit response size
- Lean queries where possible
- TTL index for auto-cleanup (ViewLog)

**Frontend:**
- Debounced search
- Lazy image loading
- React.memo for expensive components
- Pagination to limit DOM nodes
- Efficient re-renders with proper keys

**Caching:**
- Browser caches static assets
- Cloudinary CDN for images

### 12. Security Features

**Authentication:**
- JWT in HTTP-only cookies (XSS protection)
- SameSite cookie attribute (CSRF protection)
- Secure flag in production (HTTPS only)

**Rate Limiting:**
- Auth endpoints: 10 per 15 min
- Contact endpoint: 5 per product per hour per IP
- Global API: 200 per 15 min

**Input Validation:**
- Express-validator on auth routes
- Mongoose schema validation
- File type/size validation

**Headers:**
- Helmet.js security headers
- CORS restricted to frontend origin
- Trust proxy for accurate IP behind reverse proxy

### 13. Responsive Design

**Mobile-First CSS:**
- Flexbox & Grid layouts
- Media queries for breakpoints
- Touch-friendly buttons (min 44x44px)
- Readable font sizes (min 16px)

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Adaptive UI:**
- Navbar collapses on mobile
- Product grid adjusts columns
- Tables scroll horizontally
- Modals fit viewport

### 14. Accessibility

**Semantic HTML:**
- Proper heading hierarchy
- `<nav>`, `<main>`, `<footer>` landmarks
- `<article>` for product cards

**ARIA:**
- Labels on interactive elements
- Roles on custom components
- Live regions for toasts

**Keyboard Navigation:**
- Tab order follows visual flow
- Enter key activates cards
- Escape closes modals
- Focus visible styles

**Screen Readers:**
- Alt text on images
- Descriptive link text
- Form labels associated with inputs

### 15. Developer Experience

**Code Organization:**
- Clear folder structure
- Separation of concerns
- Reusable components
- Custom hooks

**Error Messages:**
- Descriptive console logs
- Stack traces in development
- Validation error details

**Documentation:**
- Inline comments for complex logic
- README with setup instructions
- API endpoint documentation
- Feature documentation (this file)

## Advanced Features

### WhatsApp Integration
- Dynamic message generation
- Phone number formatting (removes non-digits)
- Opens in new tab
- Works on mobile & desktop

### Rating System
- Prevents self-rating
- Upsert pattern (update or insert)
- Aggregation pipeline for average
- Displays on product cards & detail

### Anti-Spam Measures
- IP-based tracking
- TTL indexes for auto-cleanup
- Rate limiting per endpoint
- Duplicate prevention

### Image Optimization
- Cloudinary transformations
- Responsive images
- WebP support
- CDN delivery

### Real-Time Updates
- Refetch after mutations
- Optimistic UI updates
- Toast notifications
- Loading states

## Future Enhancements (Not Implemented)

- Email notifications
- Payment integration
- Booking calendar
- Chat system
- Favorites/wishlist
- Advanced search (location-based)
- Product reviews (separate from owner ratings)
- Multi-language support
- Dark mode
- PWA features
