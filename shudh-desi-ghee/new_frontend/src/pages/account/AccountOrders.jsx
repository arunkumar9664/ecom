import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../../hooks/useShop';
import { formatRupee } from '../../utils/money';
import { statusGroup } from '../../utils/orderStatus';
import StatusChip from '../../components/ui/StatusChip';
import SafeImage from '../../components/SafeImage';
import { EmptyBagArt } from '../../components/ui/illustrations';
import CancelOrderDialog from './CancelOrderDialog';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
];

function when(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AccountOrders() {
  const { orders, ordersStatus, ordersError, fetchUserOrders, cancelUserOrder, products } = useShop();
  const [tab, setTab] = useState('all');
  const [cancelId, setCancelId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');

  const counts = {
    all: orders.length,
    active: orders.filter((order) => statusGroup(order.status) === 'active').length,
    delivered: orders.filter((order) => statusGroup(order.status) === 'delivered').length,
    cancelled: orders.filter((order) => statusGroup(order.status) === 'cancelled').length,
  };
  const visible = orders.filter((order) => tab === 'all' || statusGroup(order.status) === tab);

  const cancel = async (reason) => {
    setBusy(true);
    setNote('');
    try {
      await cancelUserOrder(cancelId, reason);
      setNote('The order was cancelled.');
      setCancelId(null);
    } catch (err) {
      setNote(err?.message || 'Could not cancel the order.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h2 className="font-heading text-3xl text-ink">Orders</h2>
      <div className="mt-4 flex gap-2 overflow-x-auto" role="tablist" aria-label="Filter orders">
        {TABS.map((entry) => (
          <button
            key={entry.id}
            type="button"
            role="tab"
            aria-selected={tab === entry.id}
            onClick={() => setTab(entry.id)}
            className={`h-11 shrink-0 px-3 font-body text-sm ${tab === entry.id ? 'border-b-2 border-terracotta text-ink' : 'text-muted'}`}
          >
            {entry.label} ({counts[entry.id]})
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">{note}</p>
      {note ? <p className="mt-3 font-body text-sm text-ink" role="status">{note}</p> : null}
      {ordersStatus === 'loading' || ordersStatus === 'idle' ? (
        <ul className="mt-6 space-y-3">
          {[0, 1].map((key) => <li key={key} className="h-28 animate-pulse bg-sand motion-reduce:animate-none" />)}
        </ul>
      ) : null}
      {ordersStatus === 'error' ? (
        <div className="mt-6" role="alert">
          <p className="font-body text-sm text-terracotta">{ordersError}</p>
          <button type="button" onClick={fetchUserOrders} className="mt-3 h-11 border border-olive px-4 font-body text-sm text-olive">Retry</button>
        </div>
      ) : null}
      {ordersStatus === 'ready' && !visible.length ? (
        <div className="mt-8 text-center text-olive">
          <EmptyBagArt className="mx-auto h-20 w-20" />
          <p className="mt-3 font-body text-sm text-muted">No orders in this list yet.</p>
          <Link to="/shop" className="mt-4 inline-flex h-11 items-center bg-olive px-5 font-body text-xs tracking-[0.14em] text-paper uppercase">Start shopping</Link>
        </div>
      ) : null}
      {ordersStatus === 'ready' && visible.length ? (
        <ul className="mt-6 space-y-4">
          {visible.map((order) => {
            const items = order.items || [];
            const thumbs = items.slice(0, 3);
            const extra = Math.max(0, items.length - 3);
            const count = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
            return (
              <li key={order.id} className="border border-line p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-body text-sm text-ink">{order.id}</p>
                    <p className="mt-1 font-body text-xs text-muted">{when(order.createdAt)}</p>
                  </div>
                  <StatusChip status={order.status} />
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex">
                    {thumbs.map((item, index) => {
                      const product = products.find((entry) => entry.id === item.id);
                      return (
                        <SafeImage
                          key={`${item.id}-${index}`}
                          src={item.image || product?.image}
                          alt=""
                          className={`h-12 w-12 border border-paper bg-white object-contain ${index ? '-ml-3' : ''}`}
                        />
                      );
                    })}
                    {extra ? <span className="-ml-3 flex h-12 items-center bg-sand px-2 font-body text-xs text-ink">+{extra} more</span> : null}
                  </div>
                  <p className="font-body text-sm text-muted">{count} {count === 1 ? 'item' : 'items'} · {formatRupee(order.total)}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link to={`/account/orders/${order.id}`} className="inline-flex h-11 items-center border border-ink px-4 font-body text-xs tracking-[0.14em] uppercase">View details</Link>
                  {order.status === 'Pending' || order.status === 'Processing' ? (
                    <button type="button" onClick={() => setCancelId(order.id)} className="h-11 border border-line px-4 font-body text-xs tracking-[0.14em] uppercase">Cancel order</button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
      {cancelId ? <CancelOrderDialog busy={busy} onClose={() => setCancelId(null)} onConfirm={cancel} /> : null}
    </div>
  );
}
