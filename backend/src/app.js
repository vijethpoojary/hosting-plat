const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// Security headers
app.use(helmet());

// CORS — allow frontend origin with credentials
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Trust proxy for accurate IP behind reverse proxy
app.set('trust proxy', 1);

// Global rate limiter
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/ratings', require('./routes/ratingRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Serve MongoDB-stored images (only used when MEDIA=mongo)
app.get('/api/images/:id', async (req, res) => {
  try {
    const Image = require('./models/Image');
    const img = await Image.findById(req.params.id);
    if (!img) return res.status(404).json({ message: 'Image not found' });
    const buffer = Buffer.from(img.data, 'base64');
    res.set('Content-Type', img.contentType);
    res.set('Cache-Control', 'public, max-age=31536000'); // cache 1 year
    res.send(buffer);
  } catch {
    res.status(404).json({ message: 'Image not found' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
