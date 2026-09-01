import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import prisma from './config/db.js';

import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/users.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import uploadRoutes from './modules/upload/upload.routes.js';
import productsRoutes from './modules/products/products.routes.js';
import categoriesRoutes from './modules/categories/categories.routes.js';
import heroRoutes from './modules/hero/hero.routes.js';
import promoRoutes from './modules/promo/promo.routes.js';
import settingsRoutes from './modules/settings/settings.routes.js';
import cartRoutes from './modules/cart/cart.routes.js';
import wishlistRoutes from './modules/wishlist/wishlist.routes.js';
import addressesRoutes from './modules/addresses/addresses.routes.js';
import ordersRoutes from './modules/orders/orders.routes.js';
import paymentsRoutes from './modules/payments/payments.routes.js';
import couponsRoutes from './modules/coupons/coupons.routes.js';

import { errorHandler } from './middleware/errorHandler.js';

// Process-level error handlers to log uncaught errors without crashing Node process
process.on('uncaughtException', (err) => {
  console.error('CRITICAL: Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('CRITICAL: Unhandled Rejection at:', promise, 'reason:', reason);
});

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5001;

if (!process.env.FRONTEND_URL) {
  throw new Error('FRONTEND_URL environment variable is required');
}

// Security & Cross-Origin Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

const allowedOrigins = [
  process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : '',
  'https://suranghinaar.com',
  'https://www.suranghinaar.com',
  'https://api.suranghinaar.com',
  'http://localhost:5174',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, '');
    const isAllowed = allowedOrigins.includes(cleanOrigin) ||
                      /^https:\/\/(.*\.)?suranghinaar\.com$/.test(cleanOrigin) ||
                      /^http:\/\/localhost:\d+$/.test(cleanOrigin);
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
}));

// Sanitize URL whitespace & newline breaks (e.g. copied Postman URLs ending in %0A / \n)
app.use((req, res, next) => {
  if (req.url) {
    req.url = req.url.trim().replace(/(%0A|%0D|\r|\n)+$/gi, '');
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root & API Info Check
app.get(['/', '/api'], (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Shudh Desi Ghee Backend API',
    message: 'Shudh Desi Ghee API Server is operational',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      categories: '/api/categories',
      heroSlides: '/api/hero-slides',
      storeSettings: '/api/store-settings',
    },
    timestamp: new Date().toISOString(),
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Shudh Desi Ghee Backend API',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/hero-slides', heroRoutes);
app.use('/api/promo-messages', promoRoutes);
app.use('/api/store-settings', settingsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/addresses', addressesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/coupons', couponsRoutes);

// Centralized Error Handler
app.use(errorHandler);

async function testDatabaseConnection() {
  let timer;
  try {
    const queryPromise = prisma.$queryRaw`SELECT 1`;
    const timeoutPromise = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('Connection timed out after 10s')), 10000);
    });
    await Promise.race([queryPromise, timeoutPromise]);
    console.log('✅ Database connectivity confirmed at startup');
  } catch (err) {
    console.error(`❌ Database connectivity FAILED at startup: ${err?.message || err}`);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Shudh Desi Ghee Backend running on port ${PORT}`);
    testDatabaseConnection();
  });
}

export default app;
