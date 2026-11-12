import { Link, Navigate } from 'react-router-dom';
import { useShop } from '../hooks/useShop';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { TrackArt } from '../components/ui/illustrations';

export default function TrackOrderPage() {
  const { currentUser } = useShop();
  useDocumentTitle('Track an order', 'Sign in to see orders on your account.');
  if (currentUser) return <Navigate to="/account/orders" replace />;
  return (
    <main className="mx-auto max-w-xl px-4 py-16 text-center">
      <TrackArt className="mx-auto h-28 w-28 text-olive" />
      <h1 className="mt-6 font-heading text-4xl text-ink">Track an order</h1>
      <p className="mt-3 font-body text-sm leading-relaxed text-muted">
        Tracking needs an account. Guest orders are confirmed by email and cannot be looked up from this page.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/login?next=%2Faccount%2Forders" className="inline-flex h-11 items-center bg-olive px-5 font-body text-xs tracking-[0.14em] text-paper uppercase">Login</Link>
        <Link to="/register?next=%2Faccount%2Forders" className="inline-flex h-11 items-center border border-ink px-5 font-body text-xs tracking-[0.14em] text-ink uppercase">Register</Link>
      </div>
    </main>
  );
}
