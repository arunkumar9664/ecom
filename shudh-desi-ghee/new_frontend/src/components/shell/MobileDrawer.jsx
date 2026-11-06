import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useShop } from '../../context/ShopContext';
import { MOCK_DISABLED_MESSAGE } from '../../config/brand';
import { shellNav } from '../../config/nav';
import { brand } from '../../config/brand';
import { IconChevron, IconClose, IconHome } from './icons';

export default function MobileDrawer({ open, onClose }) {
  const { categories, currentUser, useMockData, logoutUser } = useShop();
  const items = shellNav(categories);
  const navigate = useNavigate();

  const goAuth = (tab) => {
    onClose();
    if (useMockData) {
      toast.error(MOCK_DISABLED_MESSAGE);
      return;
    }
    navigate(tab === 'register' ? '/login?tab=register' : '/login');
  };

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <button type="button" className={`absolute inset-0 bg-ink/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} aria-label="Close menu" onClick={onClose} />
      <div className={`absolute inset-y-0 left-0 flex w-[78%] max-w-sm flex-col bg-paper shadow-xl transition-transform ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-start justify-between px-5 pt-5 pb-3">
          <Wordmark />
          <button type="button" onClick={onClose} aria-label="Close" className="p-2 text-ink">
            <IconClose className="h-5 w-5" />
          </button>
        </div>
        <div className="grid grid-cols-2 border-y border-line">
          <button type="button" onClick={() => goAuth('login')} className="py-3 font-heading text-sm tracking-[0.08em] underline decoration-ink/40 underline-offset-4">
            Sign in
          </button>
          <button type="button" onClick={() => goAuth('register')} className="border-l border-line py-3 font-heading text-sm tracking-[0.08em] underline decoration-ink/40 underline-offset-4">
            Register
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto">
          <li className="border-b border-line">
            <Link to="/" onClick={onClose} className="flex items-center justify-between px-5 py-3.5 font-heading text-[17px]">
              Home
              <IconHome className="h-4 w-4" />
            </Link>
          </li>
          {items.map((item) => (
            <li key={item.to} className="border-b border-line">
              <Link to={item.to} onClick={onClose} className="flex items-center justify-between px-5 py-3.5 font-heading text-[17px]">
                <span className="inline-flex items-center gap-2">
                  {item.label}
                  {item.badge ? <span className="bg-terracotta px-1.5 py-0.5 font-body text-[9px] font-semibold tracking-wide text-paper uppercase">{item.badge}</span> : null}
                </span>
                {item.slug ? <IconChevron className="h-4 w-4 text-muted" /> : null}
              </Link>
            </li>
          ))}
          <li className="border-b border-line">
            <Link to="/journal" onClick={onClose} className="flex items-center justify-between px-5 py-3.5 font-heading text-[17px]">
              Journal
              <IconChevron className="h-4 w-4 text-muted" />
            </Link>
          </li>
        </ul>
        {currentUser ? (
          <button
            type="button"
            className="border-t border-line px-5 py-4 text-left font-body text-sm"
            onClick={() => {
              onClose();
              logoutUser();
            }}
          >
            Sign out
          </button>
        ) : null}
      </div>
    </div>
  );
}

function Wordmark() {
  return (
    <span className="font-heading leading-none tracking-[0.18em] text-ink">
      <span className="block text-[15px]">FIELD &</span>
      <span className="mt-1 block text-[11px] tracking-[0.28em]">{brand.name.split(' ').slice(-1)[0].toUpperCase()}</span>
    </span>
  );
}
