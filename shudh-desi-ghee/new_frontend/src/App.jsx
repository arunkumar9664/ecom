import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import { ShopProvider } from './context/ShopContext';
import { googleClientId } from './config/brand';
import StoreShell from './components/shell/StoreShell';
import HomePage from './pages/HomePage';

const ListingPage = lazy(() => import('./pages/ListingPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const StubPage = lazy(() => import('./pages/StubPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const AccountLayout = lazy(() => import('./pages/account/AccountLayout'));
const AccountOverview = lazy(() => import('./pages/account/AccountOverview'));
const AccountProfile = lazy(() => import('./pages/account/AccountProfile'));
const AccountOrders = lazy(() => import('./pages/account/AccountOrders'));
const AccountOrderDetail = lazy(() => import('./pages/account/AccountOrderDetail'));
const AccountAddresses = lazy(() => import('./pages/account/AccountAddresses'));
const AccountPassword = lazy(() => import('./pages/account/AccountPassword'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const TrackOrderPage = lazy(() => import('./pages/TrackOrderPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

function named(loader, name) {
  return lazy(() => loader().then((mod) => ({ default: mod[name] })));
}

const AboutPage = named(() => import('./pages/StaticPages'), 'AboutPage');
const StoryPage = named(() => import('./pages/StaticPages'), 'StoryPage');
const ContactPage = named(() => import('./pages/StaticPages'), 'ContactPage');
const DeliveryPage = named(() => import('./pages/StaticPages'), 'DeliveryPage');
const PrivacyPage = named(() => import('./pages/StaticPages'), 'PrivacyPage');
const TermsPage = named(() => import('./pages/StaticPages'), 'TermsPage');
const RefundPage = named(() => import('./pages/StaticPages'), 'RefundPage');
const FaqPage = named(() => import('./pages/StaticPages'), 'FaqPage');
const JournalPage = named(() => import('./pages/StaticPages'), 'JournalPage');
const NotFoundPage = named(() => import('./pages/StaticPages'), 'NotFoundPage');

function OrderAlias() {
  const { id } = useParams();
  return <Navigate to={id ? `/account/orders/${id}` : '/account/orders'} replace />;
}

function AppRoutes() {
  return (
    <StoreShell>
      <Suspense fallback={<p className="px-6 py-16 font-body text-sm text-muted">Loading</p>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ListingPage />} />
        <Route path="/category/:slug" element={<ListingPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage tab="register" />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/account" element={<AccountLayout />}>
          <Route index element={<AccountOverview />} />
          <Route path="profile" element={<AccountProfile />} />
          <Route path="orders" element={<AccountOrders />} />
          <Route path="orders/:id" element={<AccountOrderDetail />} />
          <Route path="addresses" element={<AccountAddresses />} />
          <Route path="password" element={<AccountPassword />} />
        </Route>
        <Route path="/orders" element={<Navigate to="/account/orders" replace />} />
        <Route path="/orders/:id" element={<OrderAlias />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/track-order" element={<TrackOrderPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/about-us" element={<AboutPage />} />
        <Route path="/our-story" element={<StoryPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/contact-us" element={<ContactPage />} />
        <Route path="/about-contact" element={<ContactPage />} />
        <Route path="/privacy-policy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/refund-exchange-policy" element={<RefundPage />} />
        <Route path="/refund-policy" element={<DeliveryPage />} />
        <Route path="/delivery" element={<DeliveryPage />} />
        <Route path="/faqs" element={<FaqPage />} />
        <Route path="/disclaimer" element={<FaqPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/lab-reports" element={<StubPage title="Notes on the work" note="Lab reports are not part of this phase." />} />
        <Route path="/admin" element={<StubPage title="Admin" note="The existing admin screen is copied here in the last phase, without a restyle." />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </Suspense>
    </StoreShell>
  );
}

export default function App() {
  const tree = (
    <BrowserRouter>
      <ShopProvider>
        <Toaster position="top-center" />
        <AppRoutes />
      </ShopProvider>
    </BrowserRouter>
  );

  if (!googleClientId) return tree;
  return <GoogleOAuthProvider clientId={googleClientId}>{tree}</GoogleOAuthProvider>;
}
