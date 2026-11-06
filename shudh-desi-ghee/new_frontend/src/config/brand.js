/**
 * Placeholder brand. Replace the name and the welcome code before launch.
 * The name is not taken from the reference site.
 */
export const brand = {
  name: 'Field & Hearth',
  tagline: 'Handmade soaps, candles, linen, bags, and alcohol-free attars.',
  welcomeCode: 'HEARTH10',
  guestCheckoutNote:
    'Guests receive an email confirmation. A guest order cannot be tracked later. Sign in if you want the order saved to an account.',
};

export const paymentMethods = {
  razorpay: 'Prepaid (Razorpay)',
  cod: 'Cash on Delivery (COD)',
};

export const storageKeys = {
  accessToken: 'fieldhearth_access_token',
  refreshToken: 'fieldhearth_refresh_token',
  rememberedEmail: 'fieldhearth_remembered_email',
  guestCart: 'fieldhearth_guest_cart',
  guestWishlist: 'fieldhearth_guest_wishlist',
  adminToken: 'fieldhearth_admin_token',
  adminAuth: 'fieldhearth_admin_auth',
  newsletterSession: 'fieldhearth_newsletter_session',
};

export const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
export const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
export const offlineDemo = import.meta.env.VITE_OFFLINE_DEMO === 'true';
export const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const MOCK_DISABLED_MESSAGE = 'Mock mode: orders are not placed.';
