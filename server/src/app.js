import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import mongoSanitize from './middleware/mongoSanitize.js';
import env from './config/env.js';
import errorHandler from './middleware/errorMiddleware.js';
import xssSanitization from './middleware/xssSanitization.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { stripeWebhook } from './controllers/paymentController.js';

const app = express();

// ─── Security Middleware ─────────────────────────────────────

// 1. Helmet — Hardened HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // unsafe-inline/eval needed for Vite dev
      styleSrc: ["'self'", "'unsafe-inline'"], // unsafe-inline needed for CSS-in-JS
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "https://placehold.co"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://api.stripe.com"],
      frameSrc: ["https://js.stripe.com", "https://hooks.stripe.com"],
      scriptSrcAttr: ["'unsafe-inline'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  crossOriginResourcePolicy: { policy: 'same-origin' },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// 2. CORS — Cross-Origin Resource Sharing
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 3. Rate Limiting — Per route type
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  message: 'Too many requests from this IP. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 auth attempts per 15 min
  message: 'Too many authentication attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 payment attempts per 15 min
  message: 'Too many payment attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200, // 200 general API requests per 15 min
  message: 'Too many API requests. Please slow down.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', globalLimiter);

// ─── Stripe Webhook (MUST be before express.json() for raw body) ──
app.post(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

// ─── Body Parsing ───────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// ─── NoSQL Injection Protection ─────────────────────────────
app.use(mongoSanitize);

// ─── XSS Protection ─────────────────────────────────────────
app.use(xssSanitization);

// ─── HTTP Security Headers (additional) ─────────────────────
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.removeHeader('X-Powered-By');
  next();
});

// ─── Logging ────────────────────────────────────────────────
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── API Routes ─────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);          // Auth: strict rate limit
app.use('/api/products', apiLimiter, productRoutes);    // Products: moderate
app.use('/api/cart', apiLimiter, cartRoutes);            // Cart: moderate
app.use('/api/orders', apiLimiter, orderRoutes);         // Orders: moderate
app.use('/api/reviews', apiLimiter, reviewRoutes);       // Reviews: moderate
app.use('/api/wishlist', apiLimiter, wishlistRoutes);    // Wishlist: moderate
app.use('/api/admin', apiLimiter, adminRoutes);           // Admin: moderate
app.use('/api/payments', paymentLimiter, paymentRoutes);  // Payments: strict

// ─── Health Check ───────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// ─── 404 Handler ────────────────────────────────────────────
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ───────────────────────────────────
app.use(errorHandler);

export default app;