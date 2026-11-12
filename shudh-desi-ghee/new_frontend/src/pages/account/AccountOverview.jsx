import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useShop } from '../../hooks/useShop';
import { formatRupee } from '../../utils/money';
import StatusChip from '../../components/ui/StatusChip';

export default function AccountOverview() {
  const { orders, ordersStatus, ordersError, fetchUserOrders, wishlist } = useShop();
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const gate = { current: false };
    api.get('/addresses').then((res) => {
      if (!gate.current) setAddresses(res.data?.addresses || []);
    }).catch(() => {
      if (!gate.current) setAddresses([]);
    });
    return () => {
      gate.current = true;
    };
  }, []);

  const recent = [...orders].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))[0];
  const stats = [
    { label: 'Orders', value: ordersStatus === 'ready' ? orders.length : '—' },
    { label: 'Saved addresses', value: addresses.length },
    { label: 'Wishlist items', value: wishlist.length },
  ];

  return (
    <div>
      <h2 className="font-heading text-3xl text-ink">Overview</h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <li key={stat.label} className="rounded-[4px] border border-line px-4 py-4">
            <p className="font-body text-[11px] tracking-[0.14em] text-muted uppercase">{stat.label}</p>
            <p className="mt-2 font-heading text-3xl text-ink">{stat.value}</p>
          </li>
        ))}
      </ul>
      {ordersError ? <p className="mt-4 font-body text-sm text-terracotta" role="alert">{ordersError}</p> : null}
      <h3 className="mt-8 font-heading text-2xl text-ink">Most recent order</h3>
      {recent ? (
        <article className="mt-4 flex flex-wrap items-center justify-between gap-3 border border-line p-4">
          <div>
            <p className="font-body text-sm text-ink">{recent.id}</p>
            <p className="mt-1 font-body text-sm text-muted">{formatRupee(recent.total)}</p>
            <div className="mt-2"><StatusChip status={recent.status} /></div>
          </div>
          <Link to={`/account/orders/${recent.id}`} className="inline-flex h-11 items-center border border-ink px-4 font-body text-xs tracking-[0.14em] text-ink uppercase">Track</Link>
        </article>
      ) : (
        <p className="mt-3 font-body text-sm text-muted">{ordersStatus === 'loading' ? 'Loading orders…' : 'No orders yet.'}</p>
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/shop" className="inline-flex h-11 items-center bg-olive px-5 font-body text-xs tracking-[0.14em] text-paper uppercase">Continue shopping</Link>
        <Link to="/contact" className="inline-flex h-11 items-center border border-ink px-5 font-body text-xs tracking-[0.14em] text-ink uppercase">Contact us</Link>
      </div>
      {ordersStatus === 'error' ? (
        <button type="button" onClick={fetchUserOrders} className="mt-4 font-body text-sm text-olive underline">Retry</button>
      ) : null}
    </div>
  );
}
