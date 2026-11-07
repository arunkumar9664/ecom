import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useShop } from '../../hooks/useShop';
import useFocusTrap from '../../hooks/useFocusTrap';
import CartPanel from '../cart/CartPanel';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen } = useShop();
  const { pathname } = useLocation();
  const panel = useRef(null);
  const open = isCartOpen && pathname !== '/checkout' && pathname !== '/cart';
  useFocusTrap(open, panel, () => setIsCartOpen(false));
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[75]">
      <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Close cart" onClick={() => setIsCartOpen(false)} />
      <div ref={panel} role="dialog" aria-modal="true" aria-label="Shopping cart" className="absolute inset-y-0 right-0 w-full shadow-xl md:w-[clamp(340px,28vw,420px)]">
        <CartPanel onClose={() => setIsCartOpen(false)} />
      </div>
    </div>
  );
}
