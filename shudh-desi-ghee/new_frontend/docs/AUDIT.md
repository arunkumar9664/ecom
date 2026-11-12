# Phase 0 audit — existing Shudh Desi Ghee app

Read-only audit of `shudh-desi-ghee/frontend` and `shudh-desi-ghee/backend` on 5 Nov 2026. Nothing outside `new_frontend/` was changed.

The live store is a React 19 + Vite + Tailwind v4 storefront talking to an Express + Prisma + PostgreSQL API. The catalog schema and a lot of copy still come from a clothing clone (Suranghi Naar) and a ghee catalog (Rosier-shaped seed). The new storefront must keep the same API contract and restyle the UI for handmade home essentials.

## Repository layout

```
ecom/
  netlify.toml                  # builds shudh-desi-ghee/frontend only
  .gitignore
  shudh-desi-ghee/
    docker-compose.yml          # db, backend :5001, frontend :5174
    README.md
    docs/                       # ARCHITECTURE, FEATURE-LIST, IMPLEMENTATION
    backend/                    # Express modules + prisma/schema.prisma
    frontend/                   # current Vite storefront
    new_frontend/               # this folder (docs only in Phase 0)
```

There is no `frontend/src/assets` directory. The only local image files are:

- `frontend/public/logo.svg`
- `frontend/public/icons.svg`

Every product, hero, and category photo is a remote URL.

## Old frontend

| Item | Value |
| --- | --- |
| Stack | React 19.2, React Router 7, Vite 8, Tailwind 4 (`@tailwindcss/vite`), Axios, `@react-oauth/google`, Lenis, react-hot-toast |
| Dev port | Docker runs `vite --port 5174`. `vite.config.js` does not pin a port, so a bare `npm run dev` uses Vite’s default 5173. New app must use **5175**. |
| Entry | `src/main.jsx` → `App.jsx` |
| State | `src/context/ShopContext.jsx` (catalog, auth, cart, wishlist, orders, admin helpers) |
| HTTP | `src/services/api.js` — Axios, Bearer token, refresh on 401 |
| Demo flag | `src/config/demoMode.js` → `VITE_OFFLINE_DEMO === 'true'` |

### Routes in `App.jsx`

| Path | Page |
| --- | --- |
| `/` | HomePage |
| `/shop` | CategoryPage |
| `/category/:slug` | CategoryPage |
| `/product/:id` | ProductDetailPage |
| `/cart` | CartPage (cart + checkout on one page) |
| `/about`, `/about-us`, `/our-story` | AboutPage |
| `/lab-reports` | LabReportsPage |
| `/contact`, `/contact-us` | ContactPage |
| `/privacy-policy` | PrivacyPolicyPage |
| `/refund-exchange-policy`, `/refund-policy` | RefundExchangePolicyPage |
| `/disclaimer` | DisclaimerPage |
| `/about-contact` | AboutContactPage |
| `/account` | AccountPage |
| `/reset-password` | ResetPasswordPage |
| `/admin` | AdminPage (own chrome; store header/footer hidden) |
| `*` | NotFoundPage |

Login and register are modals (`AuthModal`), not routes. Wishlist and the mini cart are drawers. There is no `/checkout`, `/wishlist`, `/track-order`, or `/orders` route. Account holds profile, addresses, password, and order history.

Home section order today: hero carousel, split hero, category pills, product carousel, combo carousel, experience pillars, testimonials, newsletter.

### Environment variables (old frontend)

There is no `frontend/.env`. Docker Compose injects:

| Name | Compose / production value |
| --- | --- |
| `VITE_API_BASE_URL` | `http://localhost:5001/api` |
| `VITE_GOOGLE_CLIENT_ID` | placeholder Google client id |
| `VITE_RAZORPAY_KEY_ID` | `rzp_test_your_key_id` |
| `VITE_BRAND_NAME` | `Shudh Desi Ghee` |
| `VITE_OFFLINE_DEMO` | `true` in `frontend/.env.production` only |

`api.js` falls back to `http://localhost:5001/api` when `VITE_API_BASE_URL` is unset. The new app should use the same variable name and the same default, with `VITE_OFFLINE_DEMO=false`.

### Demo / offline behaviour (do not copy this hiding)

`localMode` is true when `VITE_OFFLINE_DEMO` is true **or** the first catalog fetch did not succeed.

- Initial React state is `staticCatalog` (ghee products, categories, slides, coupons, settings).
- `OFFLINE_DEMO` skips every API call. Login, cart, and checkout run in the browser and invent a demo order (`paymentMethod: 'Demo (No Payment)'`).
- If the API is down and the flag is false, the UI still shows the static catalog and treats the shop as local. Failures are `console.error` only.
- Netlify (`netlify.toml` + `.env.production`) is this offline build. It never calls the API.

Phase 1 must default demo mode off and show a visible loading and error state when the API is unreachable. Static catalog stays as a typed fallback for images and for local development only after the error is shown, not as a silent success.

### Auth and storage keys to rename

All keys are still named for the clothing clone. Phase 1 puts the prefix in `src/config/brand.js` and uses it everywhere.

| Key | Where |
| --- | --- |
| `surangi_access_token` | localStorage or sessionStorage |
| `surangi_refresh_token` | same |
| `surangi_remembered_email` | localStorage |
| `surangi_guest_cart` | localStorage JSON |
| `surangi_guest_wishlist` | localStorage JSON of product ids |
| `surangi_age_verified` | localStorage (age-gate modal; not required for the new brand) |
| `surangi_admin_token` | sessionStorage (AdminPage also clears a localStorage copy) |
| `surangi_admin_auth` | sessionStorage |

Token attach rule in `api.js`: if the URL contains `/admin`, send the admin token; otherwise send the customer token, then the admin token. Refresh posts `{ refreshToken }` to `POST /api/auth/refresh` and expects `success`, `token`, and `refreshToken` at the top level of the JSON body (`sendSuccess` spreads the payload).

Access tokens last 7 days and include `id`, `email`, `role`, `name`. Refresh tokens last 30 days and are not stored server-side. Logout is `POST /api/auth/logout` and only clears the client.

### Hardcoded payment key

`frontend/src/pages/CartPage.jsx` line 196:

```
import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TRxuLFtnW8n6gu'
```

The new checkout must not keep that fallback. Use `VITE_RAZORPAY_KEY_ID` only. `POST /api/payments/create-order` returns the Razorpay order id and amount; it does not return the publishable key.

Checkout always sends `paymentMethod: 'Prepaid (Razorpay)'`. The COD branch in `CartPage` is dead because of that. The API does support COD (see FEATURE-MAP).

Razorpay modal copy in the old page is “Suranghi Naar Atelier” / “Luxury Ethnic Fashion Order”. Replace it.

### Data flow

1. `ShopProvider` mounts, loads guest cart/wishlist from localStorage, then `GET` products, categories, hero-slides, promo-messages, store-settings, coupons (`Promise.allSettled`).
2. If any call succeeds, `backendOnline` becomes true.
3. If a customer token exists and `localMode` is false, `GET /users/me`, `/cart`, `/wishlist`.
4. Logged-in cart rows are `{ id, product, color: { name }, size, quantity }`. Server cart stores `colorName` and `size` as strings. The colour hex on reload is hardcoded `#C8960C` because the cart table does not store hex.
5. Guest add-to-cart writes localStorage. Login merges the guest cart with `POST /cart` per line, then deletes `surangi_guest_cart`.
6. `POST /orders` creates the order. Prepaid then `POST /payments/create-order` and `POST /payments/verify`. Server recomputes the total; the client `total` is informational.
7. Admin mutations live on the same context (`addProduct`, discounts, hero slides, and so on) and all no-op with an error in `localMode`.

`GET /products` default `limit` is 50, ordered `createdAt desc`. The seed has 19 products, so the home page can use the first page. Listing pages that need filters should call the query params instead of only slicing context state.

## Old backend

Base URL `/api`. JSON envelope: `{ success, message, ...payload }`.

Public reads: products, categories, hero slides, promo messages, store settings, active coupons, product reviews (optional auth for `canReview`).

Auth required: cart, wishlist, addresses, `GET /orders`, `GET /orders/:id`, cancel, reviews write, profile.

Optional auth: `POST /orders` (guest `userId` is null).

No auth on payment create/verify (see NOTES).

Admin: `POST /api/admin/login` then `requireAdmin` (JWT `role === 'admin'`).

### Product query parameters that exist

`GET /api/products`

- `categorySlug` (ignored when value is `all`)
- `minPrice`, `maxPrice`
- `size` (Postgres array contains)
- `search` (case-insensitive contains on `name`, `description`, `fabric`)
- `page` (default 1), `limit` (default 50, no maximum)

There is no `sort`, `badge`, `tag`, `featured`, or `inStock` parameter. Response adds `reviewCount` and `averageRating`. The stored `rating` column is a seed default and is not the live average.

### Order and money rules the UI must respect

- Prices are integer rupees. Razorpay amount is `total * 100` paise.
- Server price is `product.price` (the `salePrice` branch in the controller never matches the schema). `originalPrice` is display-only.
- Sold-out check is `isSoldOut` only. `stockQuantity` is not enforced.
- Coupon: active `DiscountCode`, subtotal ≥ `minSpend`, percent of subtotal. No expiry or usage cap.
- Shipping: `StoreSettings.shippingFee` and `freeShippingThreshold`. Seed values are ₹99 and ₹999. If settings are missing, the order controller falls back to ₹250 and ₹5000.
- Payment method string containing `cod` or `cash on delivery` creates the order as `Processing` and clears the user’s cart. Anything else stays `Pending` until `POST /payments/verify` sets `Processing`.
- `GET /orders` hides rows that are `Pending` and whose method contains `Prepaid`.
- `GET /orders/:id` requires the logged-in user to own the order (or be admin). Guest orders cannot be fetched later.
- Cancel is allowed for `Pending` and `Processing`. A Razorpay payment id sets `refundRequired`. There is no automatic refund call.
- Reviews: integer 1–5, one per user per product, only if a `Delivered` order’s JSON items contain that product id.
- `Order` has no notes, gift-wrap, or gift-message column.

### Schema fields the UI will relabel

`Product`: `colorVariants` JSON `[{ name, hex, images[] }]`, `sizes` string array, `fabric`, `care`, `craftsmanship`, `shipping`, `badge`, `image`, `secondaryImage`. Map wording in `src/config/labels.js` only.

`Category`: `id`, `slug`, `name`, `count` (string, not a live count), `image`, `tagline`.

`HeroSlide`: `subtitle`, `title`, `description`, `cta`, `categorySlug`, `image`, `order`. Seed slides are poster-only (empty text).

`StoreSettings`: phone, email, instagram, facebook, whatsapp, address, googleMaps, hours, shippingFee, freeShippingThreshold.

Seed categories (slugs): `desi-cow-ghee`, `a2-bilona-ghee`, `atta`, `healthy-breakfast`, `pickles`, `stone-pressed-oils`, `immunity-booster`, `combo-packs`.

Seed badges in use: `Best Seller`, `Trending`, `Must Try`, `Summer Special`, `Premium`, `Healthy`, `Immunity Booster`, `Combo`, `Best Value`, `Popular`.

Coupons in seed: `GHEE10` (10%, min 0), `BILONA15` (15%, min 1500), `FESTIVE17` (17%, min 2000).

## Remote image URLs

No local product photos. Copy `public/logo.svg` and `public/icons.svg` into `new_frontend/public/images` in Phase 1. Keep using the URLs below until the client supplies photos. Phase 1 lists them in `src/config/media.js` with the required TODO comment.

### Host: `https://www.rosierfoods.com/cdn/shop/files/`

Built as `` `${CDN}/${file}&width=${width}` `` in both `frontend/src/data/staticCatalog.js` and `backend/prisma/ghee-catalog.js`. Same set in `frontend/src/data/rosierContent.js` (icons and two promo tiles) plus mobile-only banners.

Hero and side banners:

- `web_home_pg1.png?v=1788185972` (width 1600)
- `janmashtami_banner_web_1.png?v=1788186000` (width 1600)
- `file_000000003dac72079cfebe0b11c3b066.png?v=1778869603`
- `Untitled-1.png?v=1787768234`
- mobile: `mob_home_pg1.png?v=1788185955`, `janmashtami_banner_mobile_1.png?v=1788186016` (`rosierContent.js` only)

Category / icon:

- `ghee_09a692b1-5b73-4156-a411-b30777b76af0.webp?v=1779380654`
- `atta.webp?v=1779380667`
- `healthy_breakfast.webp?v=1779380683`
- `pickles.webp?v=1779380696`
- `oils.webp?v=1779380714`
- `immunity_bosters.webp?v=1779380728`
- `Ghee_Icons.png?v=1781252536` (width 120)

Products and combos (width 800 unless noted):

- `rosier-foods-ghee-500-ml-gir-cow-a2-ghee-made-from-curd-1239446978.jpg?v=1779283720`
- `rosier-foods-ghee-gir-cow-a2-ghee-made-from-curd-1210408687.jpg?v=1769604150` (also `frontend/src/data/brand.js` founder image)
- `rosier-foods-ghee-250-ml-gir-cow-a2-ghee-made-from-curd-250-ml-1240619455.jpg?v=1779888192`
- `rosier-foods-honey-500g-wild-forest-honey-1238550349.jpg?v=1778873413`
- `rosier-foods-honey-500g-wild-forest-honey-1248149128.webp?v=1783502591`
- `rosier-foods-flour-2-kg-khapli-emmer-wheat-atta-1239446981.jpg?v=1779283597`
- `rosier-foods-flour-khapli-emmer-wheat-atta-1218401189.jpg?v=1772123192`
- `rosier-foods-oil-1000-ml-pet-bottle-stone-pressed-black-mustard-oil-1238506731.jpg?v=1778844370`
- `rosier-foods-oil-stone-pressed-black-mustard-oil-1217524985.jpg?v=1768916437`
- `rosier-foods-oil-1000-ml-pet-bottle-stone-pressed-groundnut-oil-1238550351.jpg?v=1778873379`
- `rosier-foods-oil-1000-ml-pet-bottle-stone-pressed-coconut-oil-1238550353.jpg?v=1778873320`
- `rosier-foods-oil-stone-pressed-yellow-mustard-oil-1253320259.webp?v=1786037109`
- `rosier-foods-pickle-300-gms-mango-pickle-natural-sun-dried-1239710636.jpg?v=1779377171`
- `rosier-foods-pickle-300-gms-mango-pickle-natural-sun-dried-1233338543.png?v=1776765159`
- `rosier-foods-combo-a2-ghee-1-ltr-wild-forest-honey-500g-mother-s-pure-delight-1256539139.png?v=1788196631`
- `rosier-foods-1-ltr-yellow-mustard-1-ltr-groundnut-1-ltr-black-mustard-oil-cold-pressed-trio-1256539133.png?v=1788196841`
- `rosier-foods-combo-jowar-flour-1kg-sattu-flour-1kg-ragi-flour-1kg-grain-trial-trio-1256539142.png?v=1788196753`
- `rosier-foods-combo-black-mustard-oil-5-ltr-a2-ghee-500-ml-grandma-s-kitchen-essentials-1256539137.png?v=1788196723`
- `rosier-foods-combo-khapli-flour-2kg-gir-cow-a2-ghee-1-ltr-cooking-pack-1256539134.png?v=1788196813`
- `rosier-foods-combo-a2-ghee-500-ml-groundnut-oil-1-ltr-wild-forest-honey-300g-mom-s-wholesome-trio-1256539140.png?v=1788196658`
- `rosier-foods-combo-a2-ghee-500ml-black-mustard-oil-1-ltr-wild-forest-honey-300g-mango-pickle-essential-kitchen-pack-1256539135.png?v=1788196782`
- `rosier-foods-combo-a2-ghee-250-ml-wild-forest-honey-300g-immunity-pack-1256539138.png?v=1788196696`

When the API is up, the same Rosier URLs arrive inside product, category, and hero records from the database seed. `media.js` should export the CDN base and these path keys so components do not hardcode them again.

### Host: `https://res.cloudinary.com/ztgqdi6r/image/upload/`

Only in `frontend/src/data/mockData.js` (unused clothing fallback, files `surangi-naar/products/real_product_1.jpg` through `real_product_18.png`, versions in the filename path). The running catalog does not use these unless something imports `mockData`. List them in `media.js` as legacy and do not use them on the new pages.

### Broken-image behaviour

`frontend/src/utils/image.js` rewrites relative uploads against the API host. The new UI needs a neutral placeholder component when an `<img>` errors, including these third-party URLs.

## What Phase 1 should copy, and what it should not

Copy behaviour from:

- `services/api.js` (interceptors, refresh shape, FormData content-type)
- `ShopContext.jsx` cart / wishlist / auth / coupon / order functions
- `staticCatalog.js` as the offline image catalog, behind an explicit error state

Do not copy:

- Suranghi page copy, age gate, custom cursor, Lenis (unless motion is rebuilt simply and `prefers-reduced-motion` is honoured)
- The Razorpay test-key fallback
- Silent `localMode` when the API fails
- `surangi_*` key strings scattered through components
