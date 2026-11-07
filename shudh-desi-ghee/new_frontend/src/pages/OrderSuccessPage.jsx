import { Link, useLocation } from 'react-router-dom';
import { brand, storageKeys } from '../config/brand';
import { useShop } from '../hooks/useShop';
import { formatRupee } from '../utils/money';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { CheckMark } from '../components/ui/illustrations';

function readStored() {
  try {
    return JSON.parse(sessionStorage.getItem(storageKeys.lastOrder) || 'null');
  } catch {
    return null;
  }
}

const NEXT = [
  { title: 'Confirmation email', text: 'A note goes to the address you gave us.' },
  { title: 'We pack by hand', text: 'The piece is wrapped when the bench is ready.' },
  { title: 'On its way', text: 'You will see the status in your account if you were signed in.' },
];

export default function OrderSuccessPage() {
  const { currentUser } = useShop();
  const location = useLocation();
  const reduce = usePrefersReducedMotion();
  const order = location.state?.order || readStored();
  useDocumentTitle('Thank you', 'Your order confirmation.');
  const first = String(order?.customerName || currentUser?.name || '').trim().split(/\s+/)[0];

  if (!order) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="font-heading text-4xl text-ink">No confirmation on this screen</h1>
        <p className="mt-3 font-body text-sm text-muted">If you just placed an order, it is in your email. Signed-in orders are also under My Account.</p>
        <Link to="/shop" className="mt-6 inline-flex h-11 items-center bg-olive px-5 font-body text-xs tracking-[0.14em] text-paper uppercase">Continue shopping</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-14 text-center md:px-8">
      <CheckMark className="mx-auto h-16 w-16 text-olive" animate={!reduce} />
      <h1 className="mt-6 font-heading text-4xl text-ink">Thank you{first ? `, ${first}` : ''}</h1>
      <p className="mt-2 font-body text-sm text-muted">Order {order.id}</p>
      <article className="mt-8 rounded-[4px] bg-white p-6 text-left shadow-[0_8px_30px_rgba(43,38,32,0.05)]">
        <ul className="divide-y divide-line">
          {(order.items || []).map((item, index) => (
            <li key={`${item.id}-${index}`} className="flex justify-between gap-3 py-3 font-body text-sm">
              <span>{item.name || 'Item'} × {item.quantity}</span>
              <span>{item.price ? formatRupee(Number(item.price) * Number(item.quantity || 1)) : ''}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 font-body text-sm font-bold text-ink">Total {formatRupee(order.total)}</p>
        <p className="mt-1 font-body text-sm text-muted">{order.paymentMethod}</p>
        <p className="mt-1 font-body text-sm text-muted">{order.customerAddress}</p>
      </article>
      <ol className="mt-8 grid gap-4 text-left sm:grid-cols-3">
        {NEXT.map((step, index) => (
          <li key={step.title} className="border-t border-line pt-3">
            <p className="font-body text-[11px] tracking-[0.14em] text-terracotta uppercase">{index + 1}</p>
            <p className="mt-1 font-heading text-lg text-ink">{step.title}</p>
            <p className="mt-1 font-body text-sm text-muted">{step.text}</p>
          </li>
        ))}
      </ol>
      {!currentUser ? <p className="mt-8 font-body text-sm text-muted">{brand.guestCheckoutNote}</p> : null}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/shop" className="inline-flex h-11 items-center border border-ink px-5 font-body text-xs tracking-[0.14em] text-ink uppercase">Continue shopping</Link>
        {currentUser ? (
          <Link to={`/account/orders/${order.id}`} className="inline-flex h-11 items-center bg-olive px-5 font-body text-xs tracking-[0.14em] text-paper uppercase">View the order</Link>
        ) : null}
      </div>
    </main>
  );
}
