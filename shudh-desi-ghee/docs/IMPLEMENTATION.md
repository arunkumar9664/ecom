# Shudh Desi Ghee — Implementation Plan

> **Brand:** Shudh Desi Ghee  
> **UI Reference:** [Rosier Foods](https://www.rosierfoods.com/)  
> **Backend Pattern:** Surangi Naar Express + Prisma architecture (cloned, not linked)  
> **Constraint:** `surangi-naar-frontend` must never be modified

---

## 1. Project Goals

Build a standalone organic food e-commerce store for **Shudh Desi Ghee** with:

- Rosier Foods–inspired storefront (promo bar, category nav, product carousels, combos)
- Production-grade backend (auth, cart, orders, Razorpay, admin)
- Dockerized local development on **non-conflicting ports**
- Full documentation for features, architecture, and E2E testing

---

## 2. Repository Layout

```
ecom/shudh-desi-ghee/
├── frontend/          React 19 + Vite + Tailwind 4
├── backend/           Express + Prisma + PostgreSQL
├── docs/              Implementation, features, architecture
├── docker-compose.yml
└── README.md
```

---

## 3. Port Allocation

| Service    | URL                         | Notes                    |
|------------|-----------------------------|--------------------------|
| Frontend   | http://localhost:5174       | Avoids Surangi `:5173`   |
| Backend    | http://localhost:5001/api   | Avoids Surangi `:5000`   |
| PostgreSQL | internal (`db:5432`)        | Separate Docker volume   |

---

## 4. Implementation Phases

### Phase 1 — Bootstrap ✅ (current)

| Task | Status |
|------|--------|
| Create `ecom/shudh-desi-ghee/` monorepo | ✅ |
| Copy & rebrand backend from Surangi | ✅ |
| Ghee catalog seed (`ghee-catalog.js`) | ✅ |
| Copy frontend skeleton + basic rebrand | ✅ |
| Docker Compose (3 services) | ✅ |
| Docs: IMPLEMENTATION, FEATURE-LIST, ARCHITECTURE | ✅ |
| Verify `docker compose up --build` | ✅ |

**Deliverables:** Running stack with ghee categories/products in DB, placeholder UI wired to API.

---

### Phase 2 — Rosier-Style UI (next)

| Task | Priority |
|------|----------|
| Design tokens (gold `#C8960C`, cream `#FFF8E7`, brown `#3E2723`) | P0 |
| Promo ticker bar | P0 |
| Mega-menu navbar with shop categories | P0 |
| Hero slider + category pill nav | P0 |
| Product card: badge, rating, variant, inline qty, add-to-cart | P0 |
| "Loved Across Generations" product carousel | P0 |
| "Buy More Save More" combo section | P0 |
| Home: brand story + experience pillars | P1 |
| Testimonials carousel | P1 |
| Footer (links, policies, newsletter) | P1 |

---

### Phase 3 — Product & Checkout UX

| Task | Priority |
|------|----------|
| Product detail: pack variants (250ml–5L) not fashion colors | P0 |
| Relabel UI: `fabric` → Ingredients, `craftsmanship` → Method | P0 |
| Cart drawer + checkout flow | P0 |
| Coupon validation (GHEE10, festival codes) | P0 |
| COD + Razorpay integration | P0 |
| Account: orders, addresses, cancel | P0 |

---

### Phase 4 — Admin & Content Pages

| Task | Priority |
|------|----------|
| Admin panel rebrand | P0 |
| Our Story page | P1 |
| Lab Reports page (static/PDF links) | P1 |
| Contact page | P1 |
| Policy pages (refund, shipping, privacy) | P1 |
| Blog (Phase 2 — optional CMS or static) | P2 |

---

### Phase 5 — Polish & Launch Prep

| Task | Priority |
|------|----------|
| E2E test seed + guide | P1 |
| Email templates rebrand | P1 |
| Cloudinary product images | P1 |
| Search with popular terms | P2 |
| Newsletter API hookup | P2 |
| Performance: lazy routes, image optimization | P2 |

---

## 5. Schema Mapping (Fashion → Ghee)

Surangi Prisma schema is reused without breaking changes:

| DB Field | Ghee UI Label | Example |
|----------|---------------|---------|
| `colorVariants` | Pack type | Glass Jar, Tin Pack, Steel Dolchi |
| `sizes` | Weight / volume | 250 ML, 500 ML, 1 Ltr |
| `fabric` | Ingredients | 100% A2 Gir cow milk |
| `care` | Storage | Cool, dry place |
| `craftsmanship` | Method | Bilona churned, wood fire |
| `badge` | Product tag | Best Seller, Trending |

---

## 6. Seed Data Strategy

- `backend/prisma/ghee-catalog.js` — single source of truth for catalog
- `backend/prisma/seed.js` — imports catalog, upserts all tables
- Categories: Desi Cow Ghee, A2 Bilona, Oils, Atta, Pickles, Combos, Immunity
- Products inspired by Rosier Foods catalog structure (not copied assets)

---

## 7. Environment Variables

See `backend/.env.example`. Key vars:

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/shudh_desi_ghee?sslmode=disable
FRONTEND_URL=http://localhost:5174
PORT=5001
ADMIN_EMAIL=admin@shudhdesighee.com
```

Frontend:

```env
VITE_API_BASE_URL=http://localhost:5001/api
VITE_BRAND_NAME=Shudh Desi Ghee
```

---

## 8. Commands

```powershell
# From ecom/shudh-desi-ghee/
docker compose up --build -d
docker compose logs -f
docker compose exec backend npm run seed
docker compose down
docker compose down -v   # fresh DB
```

---

## 9. Success Criteria — Phase 1

- [ ] `docker compose up --build` exits 0
- [ ] `GET /api/health` returns OK on `:5001`
- [ ] `GET /api/categories` returns ghee categories (not kurtis)
- [ ] Frontend loads on `:5174` and fetches API data
- [ ] Admin login works: `admin@shudhdesighee.com` / `admin123`
- [ ] Zero files changed in `surangi-naar-frontend`

---

## 10. Risk & Mitigation

| Risk | Mitigation |
|------|------------|
| Port conflict with Surangi | Use 5174 / 5001 |
| Fashion labels in UI | Phase 2 relabeling; schema unchanged |
| Docker DB has old data | Named volume `shudh_postgres_data` |
| Accidental Surangi edits | Separate repo folder under `ecom/` |

---

*Last updated: Phase 1 bootstrap*
