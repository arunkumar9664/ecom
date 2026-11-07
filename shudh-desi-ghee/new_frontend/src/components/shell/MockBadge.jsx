import { useLocation } from 'react-router-dom';
import { useShop } from '../../hooks/useShop';

export default function MockBadge() {
  const { cartCount } = useShop();
  const { pathname } = useLocation();
  const overBar = cartCount > 0 && pathname !== '/cart' && pathname !== '/checkout';

  return (
    <div className={`pointer-events-none fixed left-1/2 z-[60] -translate-x-1/2 bg-terracotta px-2 py-1 font-body text-[10px] font-semibold tracking-[0.14em] text-paper uppercase ${overBar ? 'bottom-24 md:bottom-4' : 'bottom-4'}`}>
      Mock data
    </div>
  );
}
