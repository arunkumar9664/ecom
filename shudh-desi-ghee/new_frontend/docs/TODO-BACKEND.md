# Backend follow-ups

Each item is a `// TODO(backend)` in `src`. The shop works without these; the UI falls back as noted.

## Sorting and pagination

- `src/pages/ListingPage.jsx` line 19 — `GET /products` has no sort or cursor. The page loads up to 100 products and sorts in the browser, then reveals 12 at a time. Add `sort` and real pagination on `GET /products`.

## Tags, scent, and gifting

- `src/config/nav.js` line 19 — mega-menu scent links are `?search=` terms (floral, citrus, wood, herb, linen, smoke). There is no scent field. Add a tag or scent on the product and a query param the listing can send.
- `src/utils/collections.js` line 10 — gifting uses category slug `combo-packs`, then `gifting`. If neither slug is in `GET /categories`, the carousel shows the newest products and links to `/shop`. Add a real gifting category or flag.

## Bestseller flag

- `src/utils/collections.js` line 24 and `src/pages/ListingPage.jsx` line 104 — “bestseller” means the badge string contains “best”. If none match, the row shows the newest products. Add a boolean (or a badge enum) the API can filter.

## Newsletter

- `src/components/shell/Footer.jsx` line 83 and `src/components/shell/WelcomePopup.jsx` line 69 — the email is kept in `sessionStorage` only. Add a subscribe endpoint before these forms post anywhere.

## Guest tracking

Not marked with a TODO comment, but the track page cannot look up a guest order. `GET /orders/:id` requires the owner. A guest lookup needs a new token or signed link. Until then the page asks the visitor to sign in.

## Stock

The UI shows `isSoldOut` and does not reserve stock. Quantity is capped at 10 in the browser (`MAX_LINE_QUANTITY`). The server should enforce stock on `POST /orders` and `POST /cart`.

## Gift options

No gift wrap, gift message, or e-gift card. Those need new order fields. They are intentionally not in the UI.

## Other gaps already in FEATURE-MAP.md

- Server-side sort (same as the listing TODO).
- Pin-code delivery quotes, EMI, manufacturer, shelf life, and generic name are not on the product payload, so the product page does not show them.
- Reviews can be written only after a Delivered order that contains the product. Mock mode never saves a review.
