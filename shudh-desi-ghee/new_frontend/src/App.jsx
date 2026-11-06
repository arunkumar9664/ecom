import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import { ShopProvider, useShop } from './context/ShopContext';
import { googleClientId } from './config/brand';
import StoreShell from './components/shell/StoreShell';
import HomePage from './pages/HomePage';
import ListingPage from './pages/ListingPage';
import ProductPage from './pages/ProductPage';
import StubPage from './pages/StubPage';
import CheckoutPage from './pages/CheckoutPage';
import CartPage from './pages/CartPage';
import AccountPage from './pages/AccountPage';
import WishlistPage from './pages/WishlistPage';
import TrackOrderPage from './pages/TrackOrderPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AuthForm from './components/auth/AuthForm';
import {
  AboutPage, StoryPage, ContactPage, DeliveryPage, PrivacyPage, TermsPage, RefundPage, FaqPage, JournalPage, NotFoundPage,
} from './pages/StaticPages';

function LoginPage({ tab = 'login' }) {
  const { currentUser } = useShop();
  if (currentUser) return <Navigate to="/account" replace />;
  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="font-heading text-4xl text-ink">{tab === 'register' ? 'Register' : 'Sign in'}</h1>
      <div className="mt-6 bg-white p-6">
        <AuthForm initialTab={tab} />
      </div>
    </main>
  );
}

function AppRoutes() {
  return (
    <StoreShell>
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
        <Route path="/account" element={<AccountPage />} />
        <Route path="/orders" element={<AccountPage initialTab="orders" />} />
        <Route path="/orders/:id" element={<AccountPage initialTab="orders" />} />
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
