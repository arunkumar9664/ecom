import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { brand } from '../../config/brand';
import { useShop } from '../../hooks/useShop';
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
    <header className="relative z-20 border-b border-line bg-paper">
      <div className="mx-auto grid h-[72px] max-w-[1360px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:h-[148px] lg:px-8">
        <div className="flex items-center gap-1">
          <button type="button" className="p-2 text-ink" aria-label="Open menu" aria-expanded={menuOpen} onClick={onMenu}>
            <IconMenu className="h-7 w-7 lg:h-11 lg:w-11" />
          </button>
          <button type="button" className="p-2 text-ink" aria-label="Search" onClick={() => setIsSearchOpen(true)}>
            <IconSearch className="h-7 w-7 lg:h-11 lg:w-11" />
          </button>
        </div>
        <Link to="/" className="text-center font-heading leading-none text-ink" aria-label={brand.name}>
          <span className="block text-[18px] tracking-[0.22em] lg:text-[28px]">FIELD &</span>
          <span className="mt-1 flex items-center justify-center gap-2 text-[12px] tracking-[0.34em] lg:mt-2 lg:text-[16px]">
            <span className="inline-block h-1.5 w-1.5 rotate-45 bg-gold lg:h-2 lg:w-2" aria-hidden="true" />
            HEARTH
            <span className="inline-block h-1.5 w-1.5 rotate-45 bg-gold lg:h-2 lg:w-2" aria-hidden="true" />
          </span>
        </Link>
        <div className="flex items-center justify-end">
          <div className="relative" ref={accountRef}>
            <button type="button" className="p-2 text-ink" aria-label="Account" aria-expanded={accountOpen} onClick={onAccount}>
              <IconUser className="h-7 w-7 lg:h-11 lg:w-11" />
            </button>
            <AccountDropdown open={accountOpen} onClose={onAccount} />
          </div>
          <Link to="/cart" className="relative p-2 text-ink" aria-label={`Bag, ${cartCount} items`}>
            <IconBag className="h-7 w-7 lg:h-11 lg:w-11" />
            <span className="absolute top-1 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta px-1 font-body text-[10px] font-semibold text-paper lg:top-2">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
