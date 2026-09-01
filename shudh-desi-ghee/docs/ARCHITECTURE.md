# Shudh Desi Ghee — Architecture

## System Overview

```
┌─────────────────┐     HTTP      ┌─────────────────┐     Prisma     ┌──────────────┐
│  React Frontend │ ────────────► │  Express API    │ ─────────────► │  PostgreSQL  │
│  :5174 (Vite)   │   /api/*      │  :5001          │                │  (Docker)    │
└─────────────────┘               └─────────────────┘                └──────────────┘
        │                                   │
        │                                   ├── Razorpay (payments)
        │                                   ├── Cloudinary (images)
        │                                   ├── Google OAuth
        │                                   └── SMTP (email)
        │
   ShopContext (global state)
   api.js (axios + JWT interceptors)
```

## Frontend Structure

```
frontend/src/
├── components/     UI building blocks
├── pages/          Route-level views
├── context/        ShopContext — cart, auth, catalog
├── services/       api.js — axios client
├── data/           mockData.js — fallback (dev only)
└── utils/          image helpers
```

**Data flow:** `ShopContext.fetchInitialData()` → parallel API calls → React state → components.

## Backend Structure

```
backend/src/
├── config/         db, email, razorpay, cloudinary
├── middleware/     auth, adminAuth, rateLimiter, upload, errorHandler
├── modules/
│   ├── auth/
│   ├── products/
│   ├── categories/
│   ├── cart/
│   ├── orders/
│   ├── payments/
│   ├── admin/
│   └── ...
├── utils/          jwt, response, emailTemplates
└── server.js       Express app entry
```

**Pattern:** `routes → controller → prisma` with Zod validation on inputs.

## Database (Prisma)

Shared e-commerce schema:

- **Catalog:** Product, Category, HeroSlide, PromoMessage, DiscountCode, StoreSettings
- **Users:** User, Address, CartItem, WishlistItem, Review
- **Orders:** Order (JSON line items, Razorpay IDs, status history)

Ghee-specific data lives in seed files, not schema changes.

## Docker Services

| Service | Image | Role |
|---------|-------|------|
| `db` | postgres:16-alpine | Database |
| `backend` | Built from `backend/Dockerfile` | API + seed on start |
| `frontend` | Built from `frontend/Dockerfile` | Vite dev server |

## Security

- JWT access + refresh tokens
- Helmet + CORS whitelist
- Rate limiting on auth routes
- Server-side price validation on orders
- Idempotency keys for checkout

## Deployment Notes (future)

- Frontend: static build → CDN (Netlify/Vercel)
- Backend: Node container → Railway/Render/Fly
- DB: Neon Postgres or managed PostgreSQL
- Env: separate from Surangi production
