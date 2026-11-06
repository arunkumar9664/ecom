import { Link, useLocation } from 'react-router-dom';
import { useShop } from '../../hooks/useShop';
import { IconBag } from './icons';
import { formatRupee } from '../../utils/money';

export default function MiniCartBar() {
  const { cartCount, cartSubtotal, shippingQuote } = useShop();
  const { pathname } = useLocation();
  if (!cartCount || pathname === '/cart' || pathname === '/checkout') return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-line bg-paper px-4 py-3 md:hidden">
      <div className="flex items-center gap-3 text-ink">
        <IconBag className="h-5 w-5" />
        <div className="font-body text-sm leading-tight">
          <p>{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
          <p className="font-semibold">{formatRupee(shippingQuote.known ? cartSubtotal + shippingQuote.fee : cartSubtotal)}</p>
        </div>
      </div>
      <Link to="/cart" className="bg-ink px-5 py-3 font-body text-xs font-semibold tracking-[0.16em] text-paper uppercase">
        View cart
      </Link>
    </div>
  );
}
