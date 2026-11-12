import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { brand } from '../../config/brand';
import { useShop } from '../../hooks/useShop';
import AccountDropdown from './AccountDropdown';
import { IconBag, IconLeaf, IconMenu, IconSearch, IconUser } from './icons';

export default function Header({ menuOpen, onMenu, accountOpen, onAccount }) {
  const { cartCount, setIsSearchOpen, setIsCartOpen } = useShop();
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
    <header className="relative z-20 border-b border-line bg-paper min-[1000px]:border-b-0">
      <div className="mx-auto grid h-[58px] max-w-[1360px] grid-cols-[auto_minmax(0,1fr)_auto] items-center px-gutter min-[1000px]:h-[112px]">
        <div className="flex shrink-0 items-center">
          <button type="button" className="flex h-11 w-11 items-center justify-center text-ink min-[1000px]:h-10 min-[1000px]:w-10 min-[1000px]:rounded-full min-[1000px]:border min-[1000px]:border-line" aria-label="Open menu" aria-expanded={menuOpen} onClick={onMenu}>
            <IconMenu className="h-6 w-6" />
          </button>
          <button type="button" className="flex h-11 w-11 items-center justify-center text-ink min-[1000px]:h-10 min-[1000px]:w-10 min-[1000px]:rounded-full min-[1000px]:border min-[1000px]:border-line" aria-label="Search" onClick={() => setIsSearchOpen(true)}>
            <IconSearch className="h-6 w-6" />
          </button>
        </div>
        <Link to="/" className="flex min-w-0 max-w-[150px] flex-col items-center justify-center text-center text-ink min-[1000px]:max-w-none" aria-label={brand.name}>
          <span className="flex items-center justify-center gap-1.5 font-heading text-[17px] leading-none whitespace-nowrap min-[1000px]:gap-2.5 min-[1000px]:text-[32px]">
            Field
            <IconLeaf className="h-3 w-3 shrink-0 text-olive min-[1000px]:h-4 min-[1000px]:w-4" />
            <span className="font-heading text-gold italic">&</span>
            Hearth
          </span>
          <span className="mt-1 flex items-center justify-center gap-1.5 font-body text-[8px] tracking-[0.24em] text-muted uppercase min-[1000px]:mt-1.5 min-[1000px]:gap-2 min-[1000px]:text-[10px] min-[1000px]:tracking-[0.32em]">
            <span className="h-px w-3 bg-gold min-[1000px]:w-6" aria-hidden="true" />
            {brand.origin.label}
            <span className="h-px w-3 bg-gold min-[1000px]:w-6" aria-hidden="true" />
          </span>
        </Link>
        <div className="flex shrink-0 items-center justify-end">
            <button type="button" onClick={() => setIsCartOpen(true)} className="relative order-1 flex h-11 w-11 items-center justify-center text-ink min-[1000px]:order-2 min-[1000px]:h-10 min-[1000px]:w-10 min-[1000px]:rounded-full min-[1000px]:border min-[1000px]:border-line" aria-label={`Bag, ${cartCount} items`}>
            <IconBag className="h-6 w-6" />
            <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta px-1 font-body text-[10px] font-semibold text-paper">
              {cartCount}
            </span>
          </button>
          <div className="relative order-2 min-[1000px]:order-1" ref={accountRef}>
            <button type="button" className="flex h-11 w-11 items-center justify-center text-ink min-[1000px]:h-10 min-[1000px]:w-10 min-[1000px]:rounded-full min-[1000px]:border min-[1000px]:border-line" aria-label="Account" aria-expanded={accountOpen} onClick={onAccount}>
              <IconUser className="h-6 w-6" />
            </button>
            <AccountDropdown open={accountOpen} onClose={onAccount} />
          </div>
        </div>
      </div>
    </header>
  );
}
