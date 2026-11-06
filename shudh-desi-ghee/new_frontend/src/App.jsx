import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import { ShopProvider } from './context/ShopContext';
import { brand, googleClientId } from './config/brand';
import HomePage from './pages/HomePage';
import StubPage from './pages/StubPage';
import CheckoutPage, { ShopLinks } from './pages/CheckoutPage';

function Frame({ children }) {
  return (
    <>
      <header className="border-b border-line bg-paper/90 px-6 py-4">
        <Link to="/" className="font-heading text-lg tracking-[0.08em] text-ink">
          {brand.name}
        </Link>
      </header>
      {children}
      <ShopLinks />
    </>
  );
}

function AppRoutes() {
  return (
    <Frame>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<StubPage title="Shop" note="Listing, sort, and filters arrive in Phase 4." />} />
        <Route path="/category/:slug" element={<StubPage title="Category" note="This route only opens for a slug returned by GET /categories." />} />
        <Route path="/product/:id" element={<StubPage title="Product" note="Gallery, variants, and reviews arrive in Phase 4." />} />
        <Route path="/cart" element={<StubPage title="Bag" note="Guests keep this bag in the browser. Signed-in customers use the server cart." />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<StubPage title="Sign in" note="Email and Google sign-in arrive in Phase 5." />} />
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
        <Route path="/journal" element={<StubPage title="Journal" note="Static teaser. There is no blog endpoint." />} />
        <Route path="/admin" element={<StubPage title="Admin" note="The existing admin screen is copied here in the last phase, without a restyle." />} />
        <Route path="*" element={<StubPage title="Page not found" />} />
      </Routes>
    </Frame>
  );
}

export default function App() {
  const tree = (
    <BrowserRouter>
      <ShopProvider>
        <Toaster position="top-right" />
        <AppRoutes />
      </ShopProvider>
    </BrowserRouter>
  );

  if (!googleClientId) return tree;
  return <GoogleOAuthProvider clientId={googleClientId}>{tree}</GoogleOAuthProvider>;
}
