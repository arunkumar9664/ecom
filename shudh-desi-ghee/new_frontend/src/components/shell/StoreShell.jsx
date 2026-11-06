import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import AnnouncementBar from './AnnouncementBar';
import Header from './Header';
import NavBar from './NavBar';
import MobileDrawer from './MobileDrawer';
import SearchOverlay from './SearchOverlay';
import Footer from './Footer';
import FloatingActions from './FloatingActions';
import MiniCartBar from './MiniCartBar';
import WelcomePopup from './WelcomePopup';
import MockBadge from './MockBadge';

export default function StoreShell({ children }) {
  const { pathname } = useLocation();
  const { useMockData, cartCount, setIsSearchOpen } = useShop();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const isAdmin = pathname.startsWith('/admin');

  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
    setIsSearchOpen(false);
  }, [pathname, setIsSearchOpen]);

  useEffect(() => {
    const locked = menuOpen || accountOpen;
    document.body.style.overflow = locked ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen, accountOpen]);

  if (isAdmin) {
    return (
      <>
        {useMockData ? <MockBadge /> : null}
        {children}
      </>
    );
  }

  return (
    <div className={cartCount ? 'pb-20 md:pb-0' : ''}>
      {useMockData ? <MockBadge /> : null}
      <div className="sticky top-0 z-40 bg-paper">
        <AnnouncementBar />
        <Header
          menuOpen={menuOpen}
          onMenu={() => {
            setAccountOpen(false);
            setMenuOpen((open) => !open);
          }}
          accountOpen={accountOpen}
          onAccount={() => {
            setMenuOpen(false);
            setAccountOpen((open) => !open);
          }}
        />
        <NavBar />
      </div>
      <MobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay />
      {children}
      <Footer />
      <FloatingActions />
      <MiniCartBar />
      <WelcomePopup />
    </div>
  );
}
