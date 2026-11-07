import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';
import { useShop } from '../../hooks/useShop';
import { formatRupee } from '../../utils/money';
import { lineSubtotal, timelineIndex, timelineSteps } from '../../utils/orderStatus';
import StatusChip from '../../components/ui/StatusChip';
import SafeImage from '../../components/SafeImage';
import CancelOrderDialog from './CancelOrderDialog';

function when(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function colorName(color) {
  if (!color) return '';
  return typeof color === 'object' ? color.name : String(color);
}

export default function AccountOrderDetail() {
  const { id } = useParams();
  const { products, storeSettings, cancelUserOrder } = useShop();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('loading');
  const [openCancel, setOpenCancel] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    const gate = { current: false };
    api.get(`/orders/${id}`).then((res) => {
      if (gate.current) return;
      setOrder(res.data?.order || null);
      setStatus(res.data?.order ? 'ready' : 'error');
      if (!res.data?.order) setError('Could not load this order');
    }).catch((err) => {
      if (gate.current) return;
      setError(err?.response?.data?.message || 'Could not load this order');
      setStatus('error');
    });
    return () => {
      gate.current = true;
    };
  }, [id]);

  const cancel = async (reason) => {
    setBusy(true);
    try {
      const updated = await cancelUserOrder(id, reason);
      setOrder(updated || order);
      setNote('The order was cancelled.');
      setOpenCancel(false);
    } catch (err) {
      setNote(err?.message || 'Could not cancel the order.');
    } finally {
      setBusy(false);
    }
  };

  if (status === 'loading') return <p className="font-body text-sm text-muted">Loading order…</p>;
  if (status === 'error' || !order) {
    return (
      <div role="alert">
        <p className="font-body text-sm text-terracotta">{error}</p>
        <Link to="/account/orders" className="mt-3 inline-flex h-11 items-center font-body text-sm underline">Back to orders</Link>
      </div>
    );
  }

  const steps = timelineSteps(order);
  const current = timelineIndex(order);
  const cancelled = order.status === 'Cancelled';
  const flagged = order.status === 'Flagged for Review';
  const subtotal = lineSubtotal(order);
  const gap = subtotal - Number(order.total || 0);
  const phone = storeSettings?.phone;
  const email = storeSettings?.email;
  const whatsapp = storeSettings?.whatsapp || phone;
  const wa = whatsapp ? (String(whatsapp).startsWith('http') ? whatsapp : `https://wa.me/${String(whatsapp).replace(/\D/g, '')}`) : '';

  return (
    <div>
      <Link to="/account/orders" className="font-body text-sm text-ink underline">Back to orders</Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-3xl text-ink">{order.id}</h2>
          <p className="mt-1 font-body text-sm text-muted">{when(order.createdAt)}</p>
        </div>
        <StatusChip status={order.status} />
      </div>
      <p className="sr-only" aria-live="polite">{note || order.status}</p>
      {note ? <p className="mt-3 font-body text-sm text-olive" role="status">{note}</p> : null}

      {cancelled ? (
        <div className="mt-6 border border-terracotta p-4">
          <p className="font-body text-sm text-ink">Cancelled{order.cancellationReason ? `: ${order.cancellationReason}` : ''}</p>
          {order.refundRequired ? <p className="mt-2 font-body text-sm text-muted">A refund will be handled by the store.</p> : null}
        </div>
      ) : null}
      {flagged ? (
        <p className="mt-6 border border-line p-4 font-body text-sm text-muted">This payment needs a look from the workshop before it moves on.</p>
      ) : null}
      {!cancelled && !flagged ? (
        <ol className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
          {steps.map((step, index) => {
            const done = current >= index;
            return (
              <li key={step} className="flex items-center gap-3 md:flex-1">
                <span className={`flex h-3 w-3 shrink-0 rounded-full ${done ? 'bg-terracotta' : 'bg-line'}`} aria-hidden="true" />
                <span className={`font-body text-sm ${done ? 'font-semibold text-ink' : 'text-muted'}`}>{step}</span>
                {index < steps.length - 1 ? <span className="hidden h-px flex-1 bg-line md:block" aria-hidden="true" /> : null}
              </li>
            );
          })}
        </ol>
      ) : null}

      <ul className="mt-8 divide-y divide-line border-y border-line">
        {(order.items || []).map((item, index) => {
          const product = products.find((entry) => entry.id === item.id);
          const name = item.name || product?.name || 'Item';
          return (
            <li key={`${item.id}-${index}`} className="flex gap-3 py-4">
              <SafeImage src={item.image || product?.image} alt="" className="h-16 w-16 shrink-0 bg-white object-contain" />
              <div className="min-w-0 flex-1">
                <p className="font-heading text-lg text-ink">{name}</p>
                <p className="font-body text-xs text-muted">{[colorName(item.color), item.size].filter(Boolean).join(' · ')}</p>
                <p className="font-body text-sm text-ink">Qty {item.quantity} · {item.price ? formatRupee(item.price * item.quantity) : ''}</p>
                {order.status === 'Delivered' && item.id ? (
                  <Link to={`/product/${item.id}#reviews`} className="mt-1 inline-flex min-h-11 items-center font-body text-sm text-ink underline">Write a review</Link>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <section className="border border-line p-4">
          <h3 className="font-heading text-xl text-ink">Delivery address</h3>
          <p className="mt-2 font-body text-sm leading-relaxed text-muted">{order.customerAddress}</p>
        </section>
        <section className="border border-line p-4">
          <h3 className="font-heading text-xl text-ink">Payment method</h3>
          <p className="mt-2 font-body text-sm text-muted">{order.paymentMethod}</p>
        </section>
      </div>

      <section className="mt-6 border border-line p-4">
        <h3 className="font-heading text-xl text-ink">Price</h3>
        <dl className="mt-3 space-y-2 font-body text-sm">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatRupee(subtotal)}</dd></div>
          <div className="flex justify-between"><dt>{gap >= 0 ? 'Discount' : 'Shipping and charges'}</dt><dd>{formatRupee(Math.abs(gap))}</dd></div>
          <div className="flex justify-between"><dt>Shipping</dt><dd>{gap >= 0 ? formatRupee(0) : 'Included above'}</dd></div>
          <div className="flex justify-between font-bold"><dt>Total</dt><dd>{formatRupee(order.total)}</dd></div>
        </dl>
        <p className="mt-2 font-body text-xs text-muted">The total is the amount stored on the order.</p>
      </section>

      <section className="mt-6">
        <h3 className="font-heading text-xl text-ink">Need help?</h3>
        <div className="mt-3 flex flex-wrap gap-3">
          {wa ? <a href={wa} className="inline-flex h-11 items-center border border-ink px-4 font-body text-sm" target="_blank" rel="noreferrer">WhatsApp</a> : null}
          {email ? <a href={`mailto:${email}`} className="inline-flex h-11 items-center border border-ink px-4 font-body text-sm">Email</a> : null}
          {!wa && !email ? <p className="font-body text-sm text-muted">Workshop contact details are not published yet.</p> : null}
        </div>
      </section>

      {order.status === 'Pending' || order.status === 'Processing' ? (
        <button type="button" onClick={() => setOpenCancel(true)} className="mt-6 h-11 border border-ink px-4 font-body text-xs tracking-[0.14em] uppercase">Cancel order</button>
      ) : null}
      {openCancel ? <CancelOrderDialog busy={busy} onClose={() => setOpenCancel(false)} onConfirm={cancel} /> : null}
    </div>
  );
}
