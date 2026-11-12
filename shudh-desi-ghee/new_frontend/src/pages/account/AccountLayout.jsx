import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useShop } from '../../hooks/useShop';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import Diamond from '../../components/ui/Diamond';
import { MOCK_SIGNIN_MESSAGE } from '../../config/brand';

const LINKS = [
  { to: '/account', label: 'Overview', end: true },
  { to: '/account/profile', label: 'Profile' },
  { to: '/account/orders', label: 'Orders' },
  { to: '/account/addresses', label: 'Addresses' },
  { to: '/wishlist', label: 'Wishlist' },
  { to: '/account/password', label: 'Change password' },
];

export default function AccountLayout() {
  const { currentUser, logoutUser, useMockData } = useShop();
  const location = useLocation();
  const navigate = useNavigate();
  const home = location.pathname === '/account';
  useDocumentTitle('My Account', 'Orders, addresses, and profile.');

  if (!currentUser) {
    const next = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />;
  }

  if (useMockData) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="font-heading text-4xl text-ink">My Account</h1>
        <p className="mt-4 font-body text-sm text-terracotta">{MOCK_SIGNIN_MESSAGE}</p>
        <Link to="/shop" className="mt-6 inline-flex h-11 items-center border border-ink px-5 font-body text-xs tracking-[0.14em] text-ink uppercase">Continue shopping</Link>
      </main>
    );
  }

  const first = String(currentUser.name || '').trim().split(/\s+/)[0] || 'there';

  const signOut = async () => {
    await logoutUser();
    navigate('/');
  };

  return (
    <main className="mx-auto max-w-[1100px] px-gutter py-8 md:py-12">
      <header className={home ? '' : 'hidden md:block'}>
        <p className="font-body text-xs tracking-[0.16em] text-muted uppercase">My Account</p>
        <h1 className="mt-2 font-heading text-4xl text-ink md:text-5xl">Hello, {first}</h1>
        <p className="mt-4 flex items-center gap-3" aria-hidden="true">
          <span className="h-px w-10 bg-line" />
          <Diamond />
          <span className="h-px w-10 bg-line" />
        </p>
      </header>

      {!home ? (
        <div className="sticky top-0 z-20 -mx-gutter mb-4 flex items-center gap-3 border-b border-line bg-paper px-gutter py-3 md:hidden">
          <button type="button" onClick={() => navigate('/account')} className="flex h-11 w-11 items-center justify-center text-ink" aria-label="Back to account">
            ‹
          </button>
          <p className="font-heading text-xl text-ink">{LINKS.find((link) => location.pathname.startsWith(link.to) && link.to !== '/account')?.label || 'Account'}</p>
        </div>
      ) : null}

      <div className="mt-8 md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-8">
        <nav aria-label="Account" className={`${home ? 'block' : 'hidden'} md:sticky md:top-6 md:block md:self-start`}>
          <ul className="overflow-hidden rounded-[4px] bg-white shadow-[0_8px_30px_rgba(43,38,32,0.05)] md:shadow-none">
            {LINKS.map((link) => (
              <li key={link.to} className="border-b border-line last:border-b-0 md:border-0">
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => `flex min-h-11 items-center justify-between px-4 py-3 font-body text-sm md:justify-start md:border-l-2 md:px-3 ${isActive ? 'border-terracotta text-ink' : 'border-transparent text-muted'}`}
                >
                  {link.label}
                  <span className="md:hidden" aria-hidden="true">›</span>
                </NavLink>
              </li>
            ))}
            <li>
              <button type="button" onClick={signOut} className="flex min-h-11 w-full items-center justify-between px-4 py-3 text-left font-body text-sm text-muted md:px-3">
                Sign out
                <span className="md:hidden" aria-hidden="true">›</span>
              </button>
            </li>
          </ul>
        </nav>
        <div className={home ? 'hidden md:block' : 'block'}>
          <div className="rounded-[4px] bg-white p-5 shadow-[0_8px_30px_rgba(43,38,32,0.05)] md:p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </main>
  );
}
