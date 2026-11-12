# Switch from mock data to the API

1. Start the API so `GET http://localhost:5001/api/health` returns success. Default base URL is `VITE_API_BASE_URL=http://localhost:5001/api`.
2. In `new_frontend/.env` set `VITE_USE_MOCK_DATA=false` and `VITE_OFFLINE_DEMO=false`.
3. Stop and start `npm run dev` so Vite picks up the env file.
4. Open `/`. Confirm the announcement, hero, category tiles, and product rows. Each section shows its own error and Retry if that request fails. There is no silent fallback catalog.
5. Open a product. Add a variant and a size to the bag. Guests keep the bag in `localStorage` (`fieldhearth_guest_cart`).
6. Sign in with email. The guest bag is posted to `POST /cart` and then cleared locally. Google appears only when `VITE_GOOGLE_CLIENT_ID` is set, and the API must have the matching `GOOGLE_CLIENT_ID`.
7. Apply a code from `GET /coupons`. Checkout sends `discountCode`; the server recomputes the total. Trust the `total` on the order response, not the estimate on the page.
8. Cash on Delivery uses the string `Cash on Delivery (COD)` and does not open Razorpay.
9. Prepaid uses `Prepaid (Razorpay)`. It stays disabled, with a message, until `VITE_RAZORPAY_KEY_ID` is set. The key is read only from that variable. After `POST /orders`, the page calls `POST /payments/create-order` and `POST /payments/verify`. A dismissed or failed payment keeps the same order id and idempotency key so retry does not create a second order.
10. Account pages need a signed-in customer: `GET/PUT /users/me`, addresses, `GET /orders`, cancel for Pending or Processing.
11. Forgot password and reset need SMTP on the API. Without it, the request can still return the generic “if an account exists” message and no mail arrives.
12. Product photos that still point at remote URLs live in `src/config/media.js`. Replace them before launch. Upload itself is an admin route and is not wired in this UI.
13. Cloudinary (or whatever the API uses for `POST /admin/upload`) is only needed when the admin screen is connected. This phase does not restyle admin.

What stays dark until keys exist:

| Missing | What the shop does |
| --- | --- |
| `VITE_GOOGLE_CLIENT_ID` | No Google button |
| `VITE_RAZORPAY_KEY_ID` | Prepaid radio disabled; COD still works |
| SMTP | Reset mail is not delivered |
| Cloudinary / upload env on the API | Admin image upload fails; storefront reads existing image URLs |
