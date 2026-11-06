import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import { ShopProvider, useShop } from './context/ShopContext';
import { googleClientId, MOCK_DISABLED_MESSAGE } from './config/brand';
import StoreShell from './components/shell/StoreShell';
import HomePage from './pages/HomePage';
import StubPage from './pages/StubPage';
import CheckoutPage from './pages/CheckoutPage';

function LoginPage() {
  const { useMockData } = useShop();
  return (
    <StubPage
      title="Sign in"
      note={useMockData ? MOCK_DISABLED_MESSAGE : 'Email and Google sign-in arrive in Phase 5.'}
    />
  );
}

function AppRoutes() {
  return (
    <StoreShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<StubPage title="Shop" note="Listing, sort, and filters arrive in Phase 4." />} />
        <Route path="/category/:slug" element={<StubPage title="Category" note="This route only opens for a slug returned by the catalog." />} />
        <Route path="/product/:id" element={<StubPage title="Product" note="Gallery, variants, and reviews arrive in Phase 4." />} />
        <Route path="/cart" element={<StubPage title="Bag" note="Guests keep this bag in the browser. Signed-in customers use the server cart." />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<StubPage title="Reset password" note="Uses POST /auth/reset-password." />} />
        <Route path="/account" element={<StubPage title="Account" note="Profile, addresses, and orders arrive in Phase 5." />} />
        <Route path="/orders" element={<StubPage title="Orders" note="Requires a signed-in customer. Guest orders are not listed here." />} />
        <Route path="/wishlist" element={<StubPage title="Wishlist" note="Guests save locally. Signed-in customers use the server wishlist." />} />
        <Route path="/track-order" element={<StubPage title="Track an order" note="Sign in to see orders on your account. Guest orders cannot be looked up later." />} />
        <Route path="/about" element={<StubPage title="About" />} />
        <Route path="/about-us" element={<StubPage title="About" />} />
        <Route path="/our-story" element={<StubPage title="Our story" />} />
        <Route path="/contact" element={<StubPage title="Contact" />} />
        <Route path="/contact-us" element={<StubPage title="Contact" />} />
        <Route path="/about-contact" element={<StubPage title="Visit" />} />
        <Route path="/privacy-policy" element={<StubPage title="Privacy" />} />
        <Route path="/refund-exchange-policy" element={<StubPage title="Returns" />} />
        <Route path="/refund-policy" element={<StubPage title="Returns" />} />
        <Route path="/disclaimer" element={<StubPage title="Disclaimer" />} />
        <Route path="/lab-reports" element={<StubPage title="Notes on the work" note="Static page. There is no lab-report endpoint." />} />
        <Route path="/journal" element={<StubPage title="Journal" note="Static page. There is no blog endpoint." />} />
        <Route path="/admin" element={<StubPage title="Admin" note="The existing admin screen is copied here in the last phase, without a restyle." />} />
        <Route path="*" element={<StubPage title="Page not found" />} />
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
