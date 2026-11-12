# Known issues

## Not verified in a browser this pass

- Widths 768, 1024, and 1920 were reviewed in code (containers at 1360px, `overflow-x: clip` on `body`) and not re-shot.
- A live API with `VITE_USE_MOCK_DATA=false` was not running, so unreachable-API errors were checked in the loading and catch paths only.
- Razorpay’s modal, Google sign-in, and password-reset email were not exercised. Prepaid stays disabled without `VITE_RAZORPAY_KEY_ID`.

## Visual differences from the Kama reference that remain

The layout follows the reference spacing (centred 1360px header, tall wordmark, left thumbnails, white info card, cart progress and sticky checkout). These are still different on purpose or because we do not have their assets:

- Wordmark, colours, photography, and copy are Field & Hearth, not the reference brand.
- Desktop nav uses our department names and diamond separators. The reference “New” ribbon is matched in shape; the label is ours.
- Mega menu and mobile drawer list our categories. There is no botanical illustration.
- Hero, category tiles, cards, and Our Story use our type scale and the stand-in photos in `media.js`. Card ratio is 3:4. Buttons are 44px (`h-11`) or 48px (`h-12`).
- Footer is our five-column workshop footer, not a copy of their link list.
- Cart recommendations reuse the home carousel, so on a narrow cart column the cards are smaller than a full-bleed home row.
- No EMI block, pin-code checker, or manufacturer panel. Those fields are not on the product API.

## Behaviour left as-is

- Newsletter signup is local only (`sessionStorage`).
- Guest orders cannot be tracked. `/track-order` asks for sign-in.
- Sort and “load more” are client-side over the first 100 products.
- Bestseller and gifting fall back to newest products when the API has no matching badge or category. See `TODO-BACKEND.md`.
- Wishlist `DELETE /wishlist/:id` is unused; the toggle is `POST /wishlist`.
- `POST /payments/create-order` is sent `{ orderId, idempotencyKey }`. The feature map lists `orderId`. The extra key is ignored if the API does not read it.
- Admin, lab reports, loyalty, e-gift cards, store locator, and the age gate are stubs and were not part of this pass.
