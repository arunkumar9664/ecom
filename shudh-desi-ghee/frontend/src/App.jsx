import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import { ShopProvider } from './context/ShopContext';

import PromoBar from './components/PromoBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import CartDrawer from './components/CartDrawer';
import QuickViewModal from './components/QuickViewModal';
import WishlistDrawer from './components/WishlistDrawer';
import AuthModal from './components/AuthModal';
import AccountModal from './components/AccountModal';
import SmoothScroll from './components/SmoothScroll';
import HomePage from './pages/HomePage';

const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const RefundExchangePolicyPage = lazy(() => import('./pages/RefundExchangePolicyPage'));
const DisclaimerPage = lazy(() => import('./pages/DisclaimerPage'));
const AboutContactPage = lazy(() => import('./pages/AboutContactPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const LabReportsPage = lazy(() => import('./pages/LabReportsPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function PageLoadingFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#FFF8E7]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-[#C8960C]/30 border-t-[#C8960C] rounded-full animate-spin" />
        <span className="text-xs text-[#3E2723] tracking-widest uppercase font-semibold">Shudh Desi Ghee</span>
      </div>
    </div>
  );
}

function MainLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#FFF8E7] text-[#3E2723] font-sans antialiased flex flex-col selection:bg-[#C8960C]/30">
      {!isAdmin && <PromoBar />}
      {!isAdmin && <Navbar />}

      <main className="flex-1">
        <Suspense fallback={<PageLoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<CategoryPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/about-us" element={<AboutPage />} />
            <Route path="/our-story" element={<AboutPage />} />
            <Route path="/lab-reports" element={<LabReportsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/contact-us" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/refund-exchange-policy" element={<RefundExchangePolicyPage />} />
            <Route path="/refund-policy" element={<RefundExchangePolicyPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/about-contact" element={<AboutContactPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      {!isAdmin && <Footer />}
      {!isAdmin && <CartDrawer />}
      {!isAdmin && <QuickViewModal />}
      {!isAdmin && <WishlistDrawer />}
      <AuthModal />
      <AccountModal />
    </div>
  );
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <SmoothScroll>
          <ShopProvider>
            <ScrollToTop />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#FFF8E7',
                  color: '#3E2723',
                  border: '1px solid #C8960C',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '13px',
                  fontWeight: '600',
                },
                success: { iconTheme: { primary: '#C8960C', secondary: '#FFF8E7' } },
                error: { iconTheme: { primary: '#e11d48', secondary: '#FFF8E7' } },
              }}
            />
            <MainLayout />
          </ShopProvider>
        </SmoothScroll>
      </Router>
    </GoogleOAuthProvider>
  );
}
