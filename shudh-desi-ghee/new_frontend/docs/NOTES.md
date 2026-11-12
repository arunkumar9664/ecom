# Notes for later — do not edit the old app from this folder

Phase 0 did not change `frontend/`, `backend/`, or repo root files. If any of the items below are fixed, they belong in a separate task.

- `frontend/src/pages/CartPage.jsx` falls back to a hardcoded Razorpay test key. The new checkout will read `VITE_RAZORPAY_KEY_ID` only.
- `VITE_OFFLINE_DEMO=true` in `frontend/.env.production` hides API failures behind `staticCatalog`. The new app will show an error instead.
- Customer and admin tokens use `surangi_*` localStorage keys. The new app will use one prefix from `src/config/brand.js`.
- About, privacy, refund, disclaimer, contact, emails, and the age-gate still say SURANGHI NAAR. New pages will use original placeholder copy.
- `Order` has no notes field, so the gift-box control is omitted. `stockQuantity` is not decremented. `GET /products` cannot sort. Guest order lookup does not exist. See FEATURE-MAP.md.
- Docker publishes the old UI on port 5174. The new dev server uses 5175 and is not in `docker-compose.yml`.
- Phase 1 storage keys live in `new_frontend/src/config/brand.js` (`fieldhearth_*`). The last-phase AdminPage copy still looks up `surangi_admin_token` unless that one lookup is pointed at `storageKeys` when it is copied.
- Admin mutations are not in ShopContext yet. They arrive with that AdminPage copy.
