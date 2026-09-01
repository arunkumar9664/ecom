# Shudh Desi Ghee — Feature List

## Storefront (Customer)

| Feature | Phase | Status |
|---------|-------|--------|
| Promo ticker bar | 2 | Done |
| Category mega-menu | 2 | Done |
| Product search | 2 | Done |
| Hero image slider | 2 | Done |
| Category quick-nav pills | 2 | Done |
| Product carousel ("Loved Across Generations") | 2 | Done |
| Product card (badge, rating, variants, qty) | 2 | Done |
| Combo / bundle section ("Buy More. Save More.") | 2 | Done |
| Experience + testimonials sections | 2 | Done |
| Product detail page (food labels: pack, weight, ingredients) | 2 | Done |
| Cart drawer | 3 | Backend ready |
| Full cart + checkout | 3 | Backend ready |
| Coupon codes | 3 | Backend ready |
| COD checkout | 3 | Backend ready |
| Razorpay prepaid | 3 | Backend ready |
| Email + Google auth | 3 | Backend ready |
| Account: profile, orders, addresses | 3 | Backend ready |
| Wishlist | 3 | Backend ready |
| Order cancel | 3 | Backend ready |
| Our Story page | 4 | Done |
| Lab Reports page | 4 | Done |
| Contact page | 4 | Done |
| Policy pages | 4 | Done |
| Blog | 5 | Planned |

## Admin Panel

| Feature | Phase | Status |
|---------|-------|--------|
| Admin login | 1 | Ready |
| Products CRUD | 1 | Ready |
| Categories CRUD | 1 | Ready |
| Hero slides CRUD | 1 | Ready |
| Promo messages CRUD | 1 | Ready |
| Discount codes CRUD | 1 | Ready |
| Order management | 1 | Ready |
| Store settings | 1 | Ready |
| Image upload (Cloudinary) | 1 | Ready (needs keys) |

## Backend API Modules

All routes mirror Surangi architecture under `/api`:

- `/auth` — register, login, Google, refresh, password reset
- `/users` — profile
- `/products`, `/categories`, `/hero-slides`, `/promo-messages`
- `/store-settings`, `/coupons`
- `/cart`, `/wishlist`, `/addresses`
- `/orders`, `/payments`
- `/admin/*` — full admin CRUD

## Infrastructure

| Feature | Phase | Status |
|---------|-------|--------|
| Docker Compose (frontend + backend + postgres) | 1 | Ready |
| Auto migrate + seed on startup | 1 | Ready |
| Separate ports from Surangi | 1 | Ready |
| E2E test guide | 5 | Planned |
