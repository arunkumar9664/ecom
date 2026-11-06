# Field & Hearth storefront

This folder is the new shop UI. It does not replace `../frontend` or `../backend`.

## Setup

```bash
cd shudh-desi-ghee/new_frontend
npm install
cp .env.example .env
npm run dev
```

The dev server is `http://localhost:5175` (`strictPort: true`).

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite on port 5175 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serves `dist/` on port 5175 |
| `npm run lint` | oxlint |

## Environment

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | API origin, default `http://localhost:5001/api` |
| `VITE_USE_MOCK_DATA` | `true` loads `src/mocks/catalog.js` and skips the network |
| `VITE_OFFLINE_DEMO` | `true` refuses the live API and shows section errors unless mock mode is on |
| `VITE_GOOGLE_CLIENT_ID` | Shows the Google button only when set |
| `VITE_RAZORPAY_KEY_ID` | Enables Prepaid (Razorpay). Never hardcode a key |

Vite reads these at startup. Restart the dev server after changing `.env`.

## Folder structure

- `src/pages` — routes
- `src/components` — shell, home, product, listing, auth
- `src/context/ShopContext.jsx` — catalog, bag, wishlist, auth, orders
- `src/hooks` — `useShop`, focus trap, document title
- `src/config` — brand, tokens’ companion copy, nav, media URLs, labels
- `src/mocks/catalog.js` — sample catalog used only when mock mode is on
- `src/services/api.js` — axios client
- `docs` — feature map, backend TODOs, and how to connect the API

## Mock mode

Set `VITE_USE_MOCK_DATA=true`. `ShopContext` then calls `mockGet` instead of axios for catalog reads. The badge “Mock data” sits at the bottom left.

Sign-in shows “Mock mode: sign-in is disabled.” Checkout shows “Mock mode: orders are not placed.” and the Place order button stays disabled. Reviews show “Mock mode: reviews are not saved.” The guest bag and wishlist stay in `localStorage` under the keys in `src/config/brand.js`.
