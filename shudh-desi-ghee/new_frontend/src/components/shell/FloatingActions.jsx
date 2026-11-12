import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useShop } from '../../hooks/useShop';
import { IconPhone, IconUp } from './icons';
import useScrollHysteresis from '../../hooks/useScrollHysteresis';

export default function FloatingActions() {
  const { storeSettings, sections, cartCount, isCartOpen, isSearchOpen, isAuthModalOpen, isAccountModalOpen } = useShop();
  const { pathname } = useLocation();
  const { shown, scrollY } = useScrollHysteresis({ topThreshold: 80, downThreshold: 24, upThreshold: 12 });
  const [blocked, setBlocked] = useState(false);
  const [lift, setLift] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const past = scrollY > 600;

  useEffect(() => {
    const read = () => {
      setBlocked(document.body.dataset.menu === 'open' || document.body.dataset.viewer === 'open' || document.body.dataset.modal === 'open');
      setLift(document.body.dataset.purchaseBar === '1');
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-menu', 'data-viewer', 'data-modal', 'data-purchase-bar'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return undefined;
    const check = () => setKeyboard(viewport.height < window.innerHeight * 0.75);
    check();
    viewport.addEventListener('resize', check);
    return () => viewport.removeEventListener('resize', check);
  }, []);

  if (pathname === '/cart' || pathname === '/checkout') return null;
  const phone = sections.settings.status === 'ready' ? storeSettings?.phone : '';
  const whatsapp = sections.settings.status === 'ready' ? storeSettings?.whatsapp : '';
  const covered = blocked || isCartOpen || isSearchOpen || isAuthModalOpen || isAccountModalOpen || keyboard || !shown;
  const bottom = lift
    ? 'bottom-[calc(4.75rem+12px+env(safe-area-inset-bottom))]'
    : cartCount
      ? 'bottom-[calc(4.5rem+12px+env(safe-area-inset-bottom))]'
      : 'bottom-[calc(12px+env(safe-area-inset-bottom))]';

  return (
    <div className={`fixed right-3 z-30 flex flex-col gap-2.5 transition-[opacity,bottom] duration-200 ease-out md:right-4 ${bottom} ${covered ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
      {past ? (
        <button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper text-ink shadow-sm"
        >
          <IconUp className="h-5 w-5" />
        </button>
      ) : null}
      {whatsapp ? (
        <a href={whatsapp} aria-label="WhatsApp" className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper text-ink">
          <span className="font-body text-[10px] font-semibold tracking-wide">WA</span>
        </a>
      ) : null}
      {phone ? (
        <a href={`tel:${phone}`} aria-label="Call the workshop" className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-paper md:hidden">
          <IconPhone className="h-5 w-5" />
        </a>
      ) : null}
    </div>
  );
}
