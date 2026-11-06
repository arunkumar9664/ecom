import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { brand } from '../../config/brand';
import { useShop } from '../../context/ShopContext';
import AccountDropdown from './AccountDropdown';
import { IconBag, IconMenu, IconSearch, IconUser } from './icons';

export default function Header({ menuOpen, onMenu, accountOpen, onAccount }) {
  const { cartCount, setIsSearchOpen } = useShop();
  const accountRef = useRef(null);

  useEffect(() => {
    if (!accountOpen) return undefined;
    const onPointer = (event) => {
      if (!accountRef.current?.contains(event.target)) onAccount();
    };
    const onKey = (event) => {
      if (event.key === 'Escape') onAccount();
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [accountOpen, onAccount]);

  return (
    <header className="relative z-20 border-b border-line bg-paper lg:border-b-0">
      <div className="grid h-[64px] grid-cols-[1fr_auto_1fr] items-center px-3 sm:h-[76px] sm:px-6">
        <div className="flex items-center">
          <button type="button" className="p-2 text-ink lg:hidden" aria-label="Open menu" aria-expanded={menuOpen} onClick={onMenu}>
            <IconMenu className="h-6 w-6" />
          </button>
          <button type="button" className="hidden p-2 text-ink lg:inline-flex" aria-label="Open menu" onClick={onMenu}>
            <IconMenu className="h-6 w-6" />
          </button>
          <button type="button" className="p-2 text-ink" aria-label="Search" onClick={() => setIsSearchOpen(true)}>
            <IconSearch className="h-6 w-6" />
          </button>
        </div>
        <Link to="/" className="text-center font-heading leading-none text-ink" aria-label={brand.name}>
          <span className="block text-[15px] tracking-[0.2em] sm:text-[18px]">FIELD &</span>
          <span className="mt-1 flex items-center justify-center gap-2 text-[11px] tracking-[0.32em] sm:text-[12px]">
            <span className="inline-block h-1.5 w-1.5 rotate-45 bg-gold" aria-hidden="true" />
            HEARTH
            <span className="inline-block h-1.5 w-1.5 rotate-45 bg-gold" aria-hidden="true" />
          </span>
        </Link>
        <div className="flex items-center justify-end">
          <div className="relative" ref={accountRef}>
            <button type="button" className="p-2 text-ink" aria-label="Account" aria-expanded={accountOpen} onClick={onAccount}>
              <IconUser className="h-6 w-6" />
            </button>
            <AccountDropdown open={accountOpen} onClose={onAccount} />
          </div>
          <Link to="/cart" className="relative p-2 text-ink" aria-label={`Bag, ${cartCount} items`}>
            <IconBag className="h-6 w-6" />
            {cartCount > 0 ? (
              <span className="absolute top-1 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta px-1 font-body text-[10px] font-semibold text-paper">
                {cartCount}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}
