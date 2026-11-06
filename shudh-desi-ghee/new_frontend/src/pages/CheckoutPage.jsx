import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useShop } from '../context/ShopContext';
import { brand, MOCK_DISABLED_MESSAGE, paymentMethods, razorpayKeyId } from '../config/brand';
import { formatRupee } from '../components/shell/icons';
import { readAppliedCoupon } from './CartPage';

const phoneOk = (value) => /^[6-9]\d{9}$/.test(String(value || '').replace(/\D/g, ''));
const emailOk = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

function newKey() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `ik_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const emptyAddress = { fullName: '', phone: '', street: '', city: '', state: '', pincode: '' };

export default function CheckoutPage() {
  const { cart, cartSubtotal, currentUser, useMockData, shippingQuote, addOrder, clearCart, openAuthModal, paymentMethods: methods } = useShop();
  const [contact, setContact] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
  });
  const [address, setAddress] = useState(emptyAddress);
  const [saved, setSaved] = useState([]);
  const [addressMode, setAddressMode] = useState('new');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [method, setMethod] = useState(razorpayKeyId ? methods.razorpay : methods.cod);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState('');
  const [placed, setPlaced] = useState(null);
  const [pending, setPending] = useState(null);
  const coupon = readAppliedCoupon();
  const prepaidDisabled = !razorpayKeyId;

  useEffect(() => {
    if (!currentUser || useMockData) return undefined;
    let cancelled = false;
    api.get('/addresses').then((res) => {
      if (cancelled) return;
      const list = res.data?.addresses || [];
      setSaved(list);
      if (list.length) {
        setAddressMode('saved');
        setSelectedAddress(list.find((entry) => entry.isDefault)?.id || list[0].id);
      }
    }).catch(() => {
      if (!cancelled) setSaved([]);
    });
    return () => {
      cancelled = true;
    };
  }, [currentUser, useMockData]);

  const discount = coupon?.discountAmount || 0;
  const shippingAmount = shippingQuote.known ? shippingQuote.fee : 0;
  const estimate = Math.max(0, cartSubtotal - discount + shippingAmount);

  const chosenAddress = () => {
    if (addressMode === 'saved') {
      const found = saved.find((entry) => entry.id === selectedAddress);
      if (!found) return null;
      return {
        fullName: found.fullName,
        phone: found.phone,
        street: found.street,
        city: found.city,
        state: found.state,
        pincode: found.pincode,
      };
    }
    return address;
  };

  const validate = () => {
    const next = {};
    if (!contact.name.trim()) next.name = 'Enter your name.';
    if (!emailOk(contact.email.trim())) next.email = 'Enter a valid email.';
    if (!phoneOk(contact.phone)) next.phone = 'Enter a 10-digit mobile number starting with 6, 7, 8, or 9.';
    const place = chosenAddress();
    if (!place || !place.street?.trim() || !place.city?.trim() || !place.state?.trim() || !place.pincode?.trim()) {
      next.address = 'Enter a complete address.';
    }
    if (method === methods.razorpay && prepaidDisabled) next.method = 'Prepaid is unavailable until a Razorpay key is configured.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const finish = async (order) => {
    setPlaced(order);
    setPending(null);
    sessionStorage.removeItem('fieldhearth_applied_coupon');
    await clearCart();
  };

  const payPrepaid = async (created, key) => {
    const rzpRes = await api.post('/payments/create-order', { orderId: created.id, idempotencyKey: key });
    const loaded = await loadRazorpay();
    if (!loaded || !window.Razorpay) throw new Error('Razorpay could not be loaded. Check your connection and try again.');
    const data = rzpRes.data || {};
    await new Promise((resolve, reject) => {
      const checkout = new window.Razorpay({
        key: razorpayKeyId,
        amount: data.amount,
        currency: data.currency || 'INR',
        name: brand.name,
        description: `Order ${created.id}`,
        order_id: data.id,
        prefill: { name: contact.name, email: contact.email, contact: contact.phone },
        theme: { color: '#3B4A32' },
        handler: async (response) => {
          try {
            const verifyRes = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: created.id,
            });
            if (!verifyRes.data?.success && !verifyRes.data?.order) {
              reject(new Error('Payment verification failed.'));
              return;
            }
            await finish(verifyRes.data.order || created);
            resolve();
          } catch (err) {
            reject(err);
          }
        },
        modal: { ondismiss: () => reject(new Error('Payment window closed. Your order is saved and can be paid again without a duplicate.')) },
      });
      checkout.on('payment.failed', (response) => {
        reject(new Error(response?.error?.description || 'Payment failed.'));
      });
      checkout.open();
    });
  };

  const place = async (event) => {
    event.preventDefault();
    setFailure('');
    if (useMockData) return;
    if (!cart.length) {
      setFailure('Your bag is empty.');
      return;
    }
    if (!validate()) return;
    setBusy(true);
    try {
      const placeAddress = chosenAddress();
      const customerAddress = `${placeAddress.street}, ${placeAddress.city}, ${placeAddress.state} - ${placeAddress.pincode}`;
      let created = pending?.order || null;
      let key = pending?.key || null;
      if (!created) {
        key = newKey();
        created = await addOrder({
          customerName: contact.name.trim(),
          customerEmail: contact.email.trim(),
          customerPhone: String(contact.phone).replace(/\D/g, ''),
          customerAddress,
          items: cart.map((line) => ({
            id: line.product.id,
            quantity: line.quantity,
            color: line.color?.name,
            size: line.size,
          })),
          discountCode: coupon?.code || undefined,
          idempotencyKey: key,
          paymentMethod: method,
        });
        setPending({ order: created, key });
      }
      if (method === methods.cod) {
        await finish(created);
        return;
      }
      await payPrepaid(created, key);
    } catch (err) {
      setFailure(err?.response?.data?.message || err?.message || 'Checkout could not be completed.');
    } finally {
      setBusy(false);
    }
  };

  if (placed) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12 md:px-8">
        <h1 className="font-heading text-4xl text-ink">Order placed</h1>
        <p className="mt-3 font-body text-sm text-muted">Order {placed.id}</p>
        <p className="mt-2 font-body text-sm text-ink">Total {formatRupee(placed.total)}</p>
        <p className="mt-1 font-body text-sm text-ink">{placed.paymentMethod}</p>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {(placed.items || []).map((item, index) => (
            <li key={`${item.id || item.productId}-${index}`} className="flex justify-between py-3 font-body text-sm">
              <span>{item.name || item.productName || 'Item'} × {item.quantity}</span>
              <span>{item.price ? formatRupee(item.price * item.quantity) : ''}</span>
            </li>
          ))}
        </ul>
        {currentUser ? (
          <Link to="/orders" className="mt-8 inline-flex h-11 items-center bg-olive px-5 font-body text-xs tracking-[0.14em] text-paper uppercase">View orders</Link>
        ) : (
          <Link to="/shop" className="mt-8 inline-flex h-11 items-center bg-olive px-5 font-body text-xs tracking-[0.14em] text-paper uppercase">Continue shopping</Link>
        )}
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1100px] px-4 py-8 md:px-8">
      <h1 className="font-heading text-4xl text-ink">Checkout</h1>
      {useMockData ? <p className="mt-4 font-body text-sm text-terracotta" role="status">{MOCK_DISABLED_MESSAGE}</p> : null}
      {!currentUser ? (
        <p className="mt-4 font-body text-sm text-ink">
          You will get an email confirmation. Guest orders cannot be tracked later; sign in to track orders.{' '}
          <button type="button" className="underline" onClick={() => openAuthModal('login')}>Sign in</button>
        </p>
      ) : null}
      <form onSubmit={place} className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]" noValidate>
        <div className="space-y-8">
          <section className="bg-white p-6 md:p-8">
            <h2 className="font-heading text-2xl text-ink">Contact</h2>
            <div className="mt-4 grid gap-3">
              <Field label="Name" value={contact.name} error={errors.name} onChange={(value) => setContact((c) => ({ ...c, name: value }))} />
              <Field label="Email" type="email" value={contact.email} error={errors.email} onChange={(value) => setContact((c) => ({ ...c, email: value }))} />
              <Field label="Phone" inputMode="numeric" value={contact.phone} error={errors.phone} onChange={(value) => setContact((c) => ({ ...c, phone: value }))} />
            </div>
          </section>
          <section className="bg-white p-6 md:p-8">
            <h2 className="font-heading text-2xl text-ink">Address</h2>
            {currentUser && saved.length ? (
              <div className="mt-4 space-y-2">
                {saved.map((entry) => (
                  <label key={entry.id} className="flex gap-3 border border-line p-3 font-body text-sm">
                    <input type="radio" name="saved-address" checked={addressMode === 'saved' && selectedAddress === entry.id} onChange={() => { setAddressMode('saved'); setSelectedAddress(entry.id); }} />
                    <span>{entry.fullName}, {entry.street}, {entry.city}, {entry.state} {entry.pincode}</span>
                  </label>
                ))}
                <button type="button" className="font-body text-sm underline" onClick={() => setAddressMode('new')}>Add new</button>
              </div>
            ) : null}
            {addressMode === 'new' || !saved.length ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Field label="Street" value={address.street} onChange={(value) => setAddress((c) => ({ ...c, street: value }))} />
                <Field label="City" value={address.city} onChange={(value) => setAddress((c) => ({ ...c, city: value }))} />
                <Field label="State" value={address.state} onChange={(value) => setAddress((c) => ({ ...c, state: value }))} />
                <Field label="Pincode" value={address.pincode} onChange={(value) => setAddress((c) => ({ ...c, pincode: value }))} />
              </div>
            ) : null}
            {errors.address ? <p className="mt-2 font-body text-sm text-terracotta" role="alert">{errors.address}</p> : null}
          </section>
          <section className="bg-white p-6 md:p-8">
            <h2 className="font-heading text-2xl text-ink">Payment method</h2>
            <label className="mt-4 flex gap-3 font-body text-sm">
              <input type="radio" name="pay" checked={method === methods.razorpay} disabled={prepaidDisabled} onChange={() => setMethod(methods.razorpay)} />
              {paymentMethods.razorpay}
            </label>
            {prepaidDisabled ? <p className="mt-1 font-body text-xs text-terracotta">Prepaid is unavailable. Set VITE_RAZORPAY_KEY_ID to enable it.</p> : null}
            <label className="mt-3 flex gap-3 font-body text-sm">
              <input type="radio" name="pay" checked={method === methods.cod} onChange={() => setMethod(methods.cod)} />
              {paymentMethods.cod}
            </label>
            {errors.method ? <p className="mt-2 font-body text-sm text-terracotta" role="alert">{errors.method}</p> : null}
          </section>
        </div>
        <aside className="h-fit bg-white p-6">
          <h2 className="font-heading text-2xl text-ink">Order summary</h2>
          <p className="mt-3 font-body text-sm text-ink">Bag {formatRupee(cartSubtotal)}</p>
          <p className="font-body text-sm text-ink">Promo {discount ? `−${formatRupee(discount)} (${coupon.code})` : '—'}</p>
          <p className="font-body text-sm text-ink">Shipping {shippingQuote.known ? formatRupee(shippingAmount) : shippingQuote.message}</p>
          <p className="mt-3 font-body text-sm font-bold text-ink">Estimated {formatRupee(estimate)}</p>
          <p className="mt-2 font-body text-xs text-muted">The amount charged is the total returned by the server.</p>
          {failure ? <p className="mt-3 font-body text-sm text-terracotta" role="alert">{failure}</p> : null}
          <button type="submit" disabled={busy || useMockData || !cart.length} className="mt-5 h-12 w-full bg-olive font-body text-xs tracking-[0.14em] text-paper uppercase disabled:bg-line">
            {busy ? 'Please wait' : 'Place order'}
          </button>
        </aside>
      </form>
    </main>
  );
}

function Field({ label, error, onChange, value, ...props }) {
  const id = `checkout-${label.toLowerCase()}`;
  return (
    <label htmlFor={id} className="block font-body text-sm text-ink">
      {label}
      <input id={id} value={value} onChange={(event) => onChange(event.target.value)} {...props} className="mt-1 h-11 w-full border border-line bg-paper px-3 font-body text-sm" />
      {error ? <span className="mt-1 block text-xs text-terracotta" role="alert">{error}</span> : null}
    </label>
  );
}
