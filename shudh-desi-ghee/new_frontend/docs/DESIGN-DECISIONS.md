# Design decisions — pass 3

Pages without a reference screenshot. Layout, type, and colour stay on the existing tokens (paper, sand, ink, olive, terracotta, gold, line). Copy is original and lives in `src/content/siteCopy.js` unless it is already in `brand.js`.

## Product page

- Add to Bag and Buy Now sit side by side under the quantity row. Both say Sold out and are disabled when `isSoldOut` is true. A separate wishlist control sits under them; the gallery heart is unchanged.
- The delivery line uses `shippingQuote`. When settings have not loaded it is exactly “Shipping calculated at checkout”.
- Detail accordions use `labels.js`, hide empty fields, open Description first, and animate height. Reduced motion drops the transition via the global stylesheet.
- “Why you will love it” is generic copy from `siteCopy.js`, not product fields.
- Reviews use `averageRating` and `reviewCount` for the summary. There is no star distribution, because the reviews endpoint is paginated and a partial page would lie. Every stored review is tagged “Verified buyer” because the API only accepts a review after a Delivered order contains the product. The form is shown only when `canReview` is true. Mock mode lists the sample reviews and disables the form with “Mock mode: reviews are not saved.”
- “You may also like” is the same category, otherwise newest products. “Recently viewed” is local only (`fieldhearth_recently_viewed`, max 8) and hidden below two items.
- The sticky bar is mobile only, appears after the main Add to Bag leaves the viewport, and hides while the cart drawer is open or the visual viewport shrinks (keyboard).

## Account

- `/account` and its sub-routes require a session. Logged-out visitors go to `/login?next=`. `/orders` and `/orders/:id` redirect to the account routes.
- Desktop is a sticky side menu plus a white card. Mobile home is the greeting and the menu; each other page has a back bar and no side menu.
- Profile saves with `PUT /users/me`. Email is read-only. Phone uses `^[6-9]\d{9}$`. A dirty form warns on leave. Mock mode does not pretend to save; the account screen shows “Mock mode: sign-in is disabled.”
- Addresses use the existing address API. Delete asks for confirmation.
- Password uses `PUT /users/change-password` (minimum 6, confirm on the client). Google accounts get the server’s own error.

## Orders

Statuses that exist:

| Status | Where it comes from | Chip |
| --- | --- | --- |
| Pending | Prepaid order before payment. `GET /orders` hides unpaid prepaid, so this list rarely shows it. | Sand / ink |
| Processing | Cash on delivery, or prepaid after a verified payment | Olive outline |
| Shipped | Only if an admin sets that status or the history contains it | Ink / paper |
| Delivered | Admin status. Required before a review. | Olive fill |
| Cancelled | Owner or admin cancel of Pending or Processing | Terracotta / paper |
| Flagged for Review | Payment amount mismatch | Terracotta outline |

- Active tab is everything that is not Delivered or Cancelled.
- Cancel sends `{ reason }` to `PUT /orders/:id/cancel`. Reasons are the four named choices; Other sends the typed text. The button disables while the request is in flight.
- The timeline is Placed, Processing, Shipped only when that status exists, then Delivered. Cancelled is a separate block and mentions `refundRequired`.
- Line prices are summed for a subtotal. The order record does not store discount and shipping separately, so the gap between that subtotal and `order.total` is labelled Discount when the total is lower, or Shipping and charges when it is higher. The total row is always the server total. No tracking number or courier link is shown.
- Item names fall back to the loaded catalog when the order snapshot has no name.

## Wishlist

- Guests keep the list in `fieldhearth_guest_wishlist` and see a sign-in banner. Move to bag uses the shared variant picker when a product has more than one scent or size.
- Sort is client-side: recently added (wishlist order), or price.

## Supporting pages

- Order confirmation is `/order-success`. The placed order is passed in router state and `sessionStorage` (`fieldhearth_last_order`) so a refresh of that screen can still show it. Guests see `guestCheckoutNote`.
- Track order sends a signed-in person to their orders. Everyone else gets Login and Register. There is no lookup form.
- About and Our Story share one layout. The words are placeholders in `siteCopy.js` with a client TODO.
- Contact reads phone, email, address, hours, and the map link from store settings. There is no contact form.
- FAQs are grouped and filtered in the browser.
- Policy pages share one template: a narrow column, a desktop contents list, a last-updated line, and a placeholder banner.
- 404 has a search box that goes to `/shop?search=` and links to the categories that actually loaded.

## Needs client content or backend support

- About, policies, FAQs, and the highlight tiles are placeholder copy.
- Discount and shipping are not separate order fields, so the breakdown is inferred from line prices and `total`.
- No public guest-order lookup, no courier tracking URL, and no review histogram.
- Mock mode cannot sign in, so the account screens are not filled with invented orders.
