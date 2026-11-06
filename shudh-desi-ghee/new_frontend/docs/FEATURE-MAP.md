# Feature map — new storefront vs existing API

Verified against `backend/src/modules/**/*.routes.js`, controllers, `prisma/schema.prisma`, and `frontend/src/context/ShopContext.jsx`. The UI may call only these endpoints. Items marked **static** or **unsupported** must not pretend to save on the server.

Base: `VITE_API_BASE_URL` default `http://localhost:5001/api`.

Envelope: `{ success, message, ...data }`.

## Supported (use the real endpoint)

| UI | Endpoint | Auth | Notes |
| --- | --- | --- | --- |
| Announcement bar | `GET /promo-messages` | public | `{ promoMessages: [{ id, message, order }] }`. Rotate client-side. Old context maps each row to `message`. |
| Hero carousel | `GET /hero-slides` | public | `{ heroSlides }` ordered by `order`. Fields: `subtitle`, `title`, `description`, `cta`, `categorySlug`, `image`. Seed slides have empty text and a poster image. CTA links to `/category/:categorySlug`. |
| Category tiles and “By Category” | `GET /categories` | public | `{ categories: [{ id, slug, name, count, image, tagline }] }`. `count` is a display string. Link `/category/:slug`. |
| Product grids and carousels | `GET /products` | public | Query: `categorySlug`, `search`, `minPrice`, `maxPrice`, `size`, `page`, `limit`. Default order is `createdAt desc` (newest first). Each product includes `reviewCount`, `averageRating`. |
| Product detail | `GET /products/:id` | public | Same product shape plus live rating aggregate. |
| Search overlay | `GET /products?search=` | public | Matches name, description, and `fabric`. |
| Price filter | `minPrice`, `maxPrice` | public | Integer rupees. |
| Size / weight filter | `size` | public | Exact match against the `sizes` string array. |
| Reviews list | `GET /products/:id/reviews?page=` | optional | `{ reviews, userReview, canReview, pagination }`. |
| Write review | `POST /products/:id/reviews` | customer | Body `{ rating, comment }`. Rating integer 1–5. Server rejects unless a Delivered order contains the product. |
| Wishlist | `GET /wishlist`, `POST /wishlist` `{ productId }` toggle, `DELETE /wishlist/:productId` | customer | GET returns full product objects. Guest heart uses localStorage until login, then the same merge behaviour as the old context. |
| Cart | `GET/POST /cart`, `PUT /cart/:id`, `DELETE /cart/:id`, `DELETE /cart` | customer | POST body `{ productId, colorName, size, quantity }`. All three strings are required by the controller even if the new labels say “Scent” and “Weight”. Guest cart stays local until login. |
| Addresses | `GET/POST /addresses`, `PUT/DELETE /addresses/:id` | customer | Phone must match `^[6-9]\d{9}$`. |
| Apply offers | `GET /coupons`, `POST /coupons/validate` | public | Validate body `{ code, cartSubtotal }`. Checkout still sends `discountCode`; the server rechecks and ignores a bad code. |
| Free-shipping bar | `GET /store-settings` | public | `settings.freeShippingThreshold`, `settings.shippingFee`. |
| Place order | `POST /orders` | optional | Body needs `customerName`, `customerEmail`, `customerPhone`, `customerAddress`, `items[]` with `id` and `quantity`. Server sets price and total. `idempotencyKey` optional. |
| Razorpay | `POST /payments/create-order` `{ orderId }`, `POST /payments/verify` | public on the API | Verify body: `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`, `orderId`. Key id from `VITE_RAZORPAY_KEY_ID` only. |
| Cash on delivery | `POST /orders` with `paymentMethod` containing `cod` or `cash on delivery` | optional | Status becomes `Processing` immediately. Skip Razorpay. Old CartPage never sends this; the new checkout should offer it. |
| My orders | `GET /orders` | customer | Hides unpaid prepaid (`Pending` + method contains `Prepaid`). |
| Order detail | `GET /orders/:id` | owner or admin | |
| Cancel | `PUT /orders/:id/cancel` `{ reason }` | owner | Only `Pending` or `Processing`. |
| Profile | `GET /users/me`, `PUT /users/me` `{ name, phone }` | customer | |
| Password | `PUT /users/change-password`, `POST /auth/forgot-password`, `POST /auth/reset-password` | mixed | Reset body `{ token, newPassword }`. Min length 6 on the server. |
| Email auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `POST /auth/refresh` | public | Register `{ name, email, phone, password }` returns `{ user, token, refreshToken }`. |
| Google | `POST /auth/google` `{ credential }` | public | Needs `VITE_GOOGLE_CLIENT_ID` and backend `GOOGLE_CLIENT_ID`. Hide the button when the env value is empty. |
| Contact details, WhatsApp, phone | `GET /store-settings` | public | `phone`, `displayPhone`, `email`, `whatsapp`, `instagram`, `facebook`, `address`, `hours`, `googleMaps`. |
| Admin (keep route `/admin`) | `/admin/login`, `/admin/verify`, product/category/hero/promo/order/discount/settings/customer routes, `POST /admin/upload` | admin | Same surface as `AdminPage.jsx`. Restyle can wait; do not drop the route. |

## Carousels and nav (how to fill them without new fields)

| Section | Source | TODO |
| --- | --- | --- |
| New arrivals | `GET /products?limit=12` (already newest first) | none |
| Gifting | `GET /products?categorySlug=combo-packs` while that slug exists. If the category is missing, show the newest products. | `// TODO(backend)` when a real gifting flag is required |
| Bestsellers | Client filter `badge` containing `best` (seed value `Best Seller`). If none match, show the newest products. | `// TODO(backend)` — `badge` is a free string, not a featured flag |
| Nav “New” tag on Gifting | static decoration | none |
| Mega menu “By Scent / Material” | static links that set `search` to words that can match current `name` / `description` / `fabric` (for example the seed words ghee, honey, oil). Two promo cards are static images from `media.js`. | `// TODO(backend)` for a real attribute taxonomy |
| Sort control | Sort the loaded array in the browser (price, name, newest by `createdAt`). | `// TODO(backend: server-side sort)` — `GET /products` has no sort param |
| Ribbon on the card | `product.badge` when present | none |

Nav labels in the new UI (Soaps, Candles, Home Linen, Bags, Attars & Perfumes, Gifting, Bestsellers, All Products) are presentation. Until the database has those categories, each item links to `/shop?search=` or `/category/:slug` using whatever slugs `GET /categories` returns, and All Products links to `/shop`. Do not invent category rows.

## Static UI (no endpoint — allowed)

| UI | Behaviour |
| --- | --- |
| First-visit email popup | `sessionStorage` flag so it shows once per session. Code string lives in `brand.js`. Success message only. `// TODO(backend)` |
| Footer newsletter | Same. Do not call an API. `// TODO(backend)` |
| Safety note, SEO block, “Behind the Craft” coverflow, Our Story, Journal teaser | Original copy in the new frontend. Journal links to a static page, not a blog engine. |
| Trust icons on the cart | Static. |
| Policy, about, contact pages | Static layout. Contact details that exist on `store-settings` should come from the API. The old about/privacy/refund pages are Suranghi clothing text; write new placeholder copy. |
| 404 | Static. |

## Unsupported — do not build a fake feature

| Reference-site feature | Why | What to do |
| --- | --- | --- |
| Guest order tracking by email + order id | `GET /orders/:id` requires login and ownership. Guest `POST /orders` does not return a later lookup token. | “Track your order” opens login, then `/account` orders. No public tracking form that claims to query the API. |
| Newsletter subscription stored | No model or route | Popup and footer form are local-only (see above). |
| Gift-box checkbox / gift message | `Order` has no notes or gift field. `createOrder` drops unknown fields. | Omit the checkbox. |
| Complimentary gift with purchase | No gift-line or threshold-gift model | Omit. A progress bar may only reflect `freeShippingThreshold`. |
| Loyalty points, membership | No model | Omit the link. |
| E-gift card | No model | Omit. |
| Store locator | Only `address` and `googleMaps` on settings | One static contact/visit line using those fields. No locator search. |
| Blog, video stories, “In the Spotlight” video | `TESTIMONIALS` and `LAB_REPORTS` in the seed file are not tables and have no routes | Coverflow and journal are static. Lab reports stay a static page if the old route is kept, with no upload. |
| Sort, tags, scent filters on the server | Not query params | Client sort and search links only, with the TODOs above. |
| Stock-aware stepper | `stockQuantity` is stored and ignored at checkout | Stepper can show the number; do not tell the user the server will reserve it. `// TODO(backend)` |
| EMI, Snapmint, American Express points | Not in the API | Omit. |
| Variant-specific price | One `price` per product. `sizes` do not change price. | Show one price. Mention in the size control that weight does not change price until the API grows. |

## Pages that are not in the screenshots

These get the same tokens, type, and 2–4px controls. Decisions for later phases:

| Page | Decision |
| --- | --- |
| Product detail | Gallery from `image`, `secondaryImage`, and `colorVariants[].images`. Selectors labelled from `labels.js`. Accordions: description, `fabric` as ingredients, `care` as how to use, `craftsmanship`, `shipping`. Reviews use the real endpoints. Recommendations: other products in the same `categorySlug`, else newest. |
| Shop / listing | Banner can be the category image. Intro uses `tagline`. Filters: price (server), size (server), scent/material as search links (static). Sort is client-side. Grid 4 / 2. |
| Checkout | Split from the cart page as `/checkout`, still calling `POST /orders` then Razorpay or COD. Require login when the API is online, matching the old CartPage (`cart` and saved addresses need auth). Guest checkout is possible on the API but the cart resource is not, so the new UI keeps “sign in to pay” for the live API. |
| Login / register | Route plus the header dropdown. Google button only if `VITE_GOOGLE_CLIENT_ID` is set. Forgot-password and `/reset-password` stay. |
| Account, orders, wishlist | `/account`, orders inside it (and a `/orders` alias if useful), `/wishlist` page plus the header link. |
| Track order | Logged-in users go to their orders. Logged-out users go to login. |
| Admin | Keep `/admin` wired to the existing admin endpoints. Visual restyle can be thin as long as login and the current actions still work. |

## Endpoint index (complete)

Public:

- `POST /api/auth/register|login|google|forgot-password|reset-password|refresh|logout`
- `GET /api/products`, `GET /api/products/:id`, `GET /api/products/:id/reviews`
- `GET /api/categories`, `/hero-slides`, `/promo-messages`, `/store-settings`, `/coupons`
- `POST /api/coupons/validate`
- `POST /api/orders` (optional auth)
- `POST /api/payments/create-order`, `POST /api/payments/verify`
- `POST /api/admin/login`
- `GET /api/health`

Customer:

- `GET/PUT /api/users/me`, `PUT /api/users/change-password`
- cart, wishlist, addresses as above
- `GET /api/orders`, `GET /api/orders/:id`, `PUT /api/orders/:id/cancel`
- `POST /api/products/:id/reviews`

Admin (all under `/api/admin`, plus upload):

- `GET /verify`
- products `POST`, `PUT /:id`, `DELETE /:id`
- categories `POST`, `PUT /:id`, `DELETE /:id`
- hero-slides `PUT`, `POST`, `DELETE /:id`
- promo-messages `PUT`, `POST`, `DELETE /:id`
- `GET /orders`, `PUT /orders/:id/status`, `PUT /orders/:id/cancel`
- `GET/POST /discounts`, `PUT/DELETE /discounts/:code`
- `PUT /store-settings`
- `GET /customers`
- `POST /api/admin/upload` (multipart images)
