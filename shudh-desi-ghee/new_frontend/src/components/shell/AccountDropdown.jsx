import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../../hooks/useShop';
import { brand } from '../../config/brand';
import { IconBag, IconHeart, IconOut, IconTruck, IconUser } from './icons';

export default function AccountDropdown({ open, onClose }) {
  const { currentUser, logoutUser } = useShop();
  const navigate = useNavigate();
  if (!open) return null;

  const goAuth = (path) => {
    onClose();
    navigate(path);
  };

  const items = currentUser
    ? [
        { label: 'My Cart', to: '/cart', icon: IconBag },
        { label: 'My Account', to: '/account', icon: IconUser },
        { label: 'My Orders', to: '/orders', icon: IconBag },
        { label: 'My Wishlist', to: '/wishlist', icon: IconHeart },
        { label: 'Track your order', to: '/track-order', icon: IconTruck },
      ]
    : [
        { label: 'Sign in', action: () => goAuth('/login'), icon: IconUser },
        { label: 'Register', action: () => goAuth('/register'), icon: IconUser },
        { label: 'My Cart', to: '/cart', icon: IconBag },
        { label: 'My Account', to: '/account', icon: IconUser },
        { label: 'My Wishlist', to: '/wishlist', icon: IconHeart },
        { label: 'Track your order', to: '/track-order', icon: IconTruck },
      ];

  return (
    <div className="absolute top-full right-0 z-50 mt-2 w-56 border border-line bg-paper py-1 shadow-[0_12px_30px_rgba(43,38,32,0.12)]">
      {items.map((item) => {
        const Icon = item.icon;
        const className = 'flex w-full items-center gap-3 px-4 py-2.5 text-left font-body text-sm text-terracotta hover:bg-sand';
        if (item.action) {
          return (
            <button key={item.label} type="button" className={className} onClick={item.action}>
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        }
        return (
          <Link key={item.label} to={item.to} className={className} onClick={onClose}>
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
      {currentUser ? (
        <button
          type="button"
          className="flex w-full items-center gap-3 border-t border-line px-4 py-2.5 text-left font-body text-sm text-terracotta hover:bg-sand"
          onClick={() => {
            onClose();
            logoutUser();
          }}
        >
          <IconOut className="h-4 w-4" />
          Sign out
        </button>
      ) : null}
      <p className="sr-only">{brand.name}</p>
    </div>
  );
}
