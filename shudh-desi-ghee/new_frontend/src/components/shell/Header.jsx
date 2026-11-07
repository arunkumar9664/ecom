import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { brand } from '../../config/brand';
import { useShop } from '../../hooks/useShop';
import AccountDropdown from './AccountDropdown';
import { IconBag, IconLeaf, IconMenu, IconSearch, IconUser } from './icons';

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
    <header className="relative z-20 border-b border-line bg-paper min-[1000px]:border-b-0">
      <div className="mx-auto grid h-[76px] max-w-[1360px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 min-[1000px]:h-[112px] min-[1000px]:px-8">
        <div className="flex items-center gap-2">
          <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink hover:border-olive hover:text-olive min-[1000px]:h-10 min-[1000px]:w-10" aria-label="Open menu" aria-expanded={menuOpen} onClick={onMenu}>
            <IconMenu className="h-5 w-5" />
          </button>
          <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink hover:border-olive hover:text-olive min-[1000px]:h-10 min-[1000px]:w-10" aria-label="Search" onClick={() => setIsSearchOpen(true)}>
            <IconSearch className="h-5 w-5" />
          </button>
        </div>
        <Link to="/" className="flex flex-col items-center text-ink" aria-label={brand.name}>
          <span className="flex items-center gap-1.5 font-heading text-[20px] leading-none min-[1000px]:gap-2.5 min-[1000px]:text-[34px]">
            Field
            <IconLeaf className="h-3.5 w-3.5 text-olive min-[1000px]:h-4 min-[1000px]:w-4" />
            <span className="font-heading text-gold italic">&</span>
            Hearth
          </span>
          <span className="mt-1.5 hidden items-center gap-2 font-body text-[10px] tracking-[0.32em] text-muted uppercase min-[1000px]:flex">
            <span className="h-px w-6 bg-gold" aria-hidden="true" />
            {brand.origin.label}
            <span className="h-px w-6 bg-gold" aria-hidden="true" />
          </span>
        </Link>
        <div className="flex items-center justify-end gap-2">
          <div className="relative order-2 min-[1000px]:order-1" ref={accountRef}>
            <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink hover:border-olive hover:text-olive min-[1000px]:h-10 min-[1000px]:w-10" aria-label="Account" aria-expanded={accountOpen} onClick={onAccount}>
              <IconUser className="h-5 w-5" />
            </button>
            <AccountDropdown open={accountOpen} onClose={onAccount} />
          </div>
          <Link to="/cart" className="relative order-1 flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink hover:border-olive hover:text-olive min-[1000px]:order-2 min-[1000px]:h-10 min-[1000px]:w-10" aria-label={`Bag, ${cartCount} items`}>
            <IconBag className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta px-1 font-body text-[10px] font-semibold text-paper">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
