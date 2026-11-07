import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useShop } from '../hooks/useShop';
import { brand, MOCK_DISABLED_MESSAGE, paymentMethods, razorpayKeyId } from '../config/brand';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { formatRupee } from '../utils/money';
import SafeImage from '../components/SafeImage';
import { clearAppliedCoupon, readAppliedCoupon } from '../utils/coupon';

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
  const { cart, cartSubtotal, currentUser, useMockData, shippingQuote, addOrder, clearCart, paymentMethods: methods } = useShop();
  const nameParts = String(currentUser?.name || '').trim().split(/\s+/);
  const [step, setStep] = useState('shipping');
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [contact, setContact] = useState({
    firstName: nameParts[0] || '',
    lastName: nameParts.slice(1).join(' '),
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
  const coupon = readAppliedCoupon(cartSubtotal);
  useDocumentTitle('Checkout', 'Contact, address, and payment for your Field & Hearth order.');
  const prepaidDisabled = !razorpayKeyId;

  useEffect(() => {
    if (!currentUser || useMockData) return undefined;
    const gate = { current: false };
    api.get('/addresses').then((res) => {
      if (gate.current) return;
      const list = res.data?.addresses || [];
      setSaved(list);
      if (list.length) {
        setAddressMode('saved');
        setSelectedAddress(list.find((entry) => entry.isDefault)?.id || list[0].id);
      }
    }).catch(() => {
      if (!gate.current) setSaved([]);
    });
    return () => {
      gate.current = true;
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
    if (!contact.firstName.trim()) next.firstName = 'Enter your first name.';
    if (!contact.lastName.trim()) next.lastName = 'Enter your last name.';
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
    clearAppliedCoupon();
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
        prefill: { name: `${contact.firstName} ${contact.lastName}`.trim(), email: contact.email, contact: contact.phone },
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
          customerName: `${contact.firstName} ${contact.lastName}`.trim(),
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

  const placeAddress = chosenAddress();
  const addressLine = placeAddress
    ? `${placeAddress.street}, ${placeAddress.city}, ${placeAddress.state} - ${placeAddress.pincode}`
    : '';
  const goBack = () => {
    if (step === 'payment') setStep('shipping');
    else window.history.back();
  };

  return (
    <main className="mx-auto flex w-full max-w-[1100px] flex-col gap-5 px-4 py-8 lg:flex-row lg:items-start lg:justify-center">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (step === 'shipping') {
            if (validate()) setStep('payment');
            return;
          }
          place(event);
        }}
        className="order-2 w-full bg-white p-5 shadow-sm lg:order-1 lg:w-[min(50vw,640px)] lg:p-8"
        noValidate
      >
        <div className="mb-6 flex items-center gap-3 border-b border-line pb-4">
          <button type="button" onClick={goBack} className="font-body text-xs tracking-[0.12em] text-ink uppercase">‹ Back</button>
          <ol className="flex flex-1 items-center justify-between gap-2 font-body text-xs">
            {[
              ['bag', 'Bag'],
              ['shipping', 'Shipping Information'],
              ['payment', 'Payment'],
            ].map(([id, label], index) => {
              const done = (id === 'bag') || (id === 'shipping' && step === 'payment');
              const current = (id === 'shipping' && step === 'shipping') || (id === 'payment' && step === 'payment');
              return (
                <li key={id} className="flex flex-1 items-center gap-2">
                  {index > 0 ? <span className="h-px flex-1 bg-line" aria-hidden="true" /> : null}
                  <span className={`inline-flex items-center gap-1 ${current ? 'font-bold text-ink' : done ? 'text-terracotta' : 'text-muted'}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${done || current ? 'bg-terracotta' : 'bg-line'}`} aria-hidden="true" />
                    {label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
        {useMockData ? <p className="mb-4 font-body text-sm text-terracotta" role="status">{MOCK_DISABLED_MESSAGE}</p> : null}
        {step === 'shipping' ? (
          <>
            {!currentUser ? (
              <div className="mb-5 flex items-center justify-between gap-3 border border-line px-3 py-3">
                <p className="font-body text-sm text-ink">Have an account? Sign in to use your saved addresses</p>
                <Link to="/login" className="shrink-0 bg-ink px-4 py-2 font-body text-xs tracking-[0.12em] text-paper uppercase">Login</Link>
              </div>
            ) : null}
            <h2 className="font-heading text-3xl text-ink">{currentUser ? 'Shipping Information' : 'Sign in or Checkout as guest'}</h2>
            {!currentUser ? <p className="mt-2 font-body text-sm text-muted">{brand.guestCheckoutNote}</p> : null}
            {currentUser && saved.length ? (
              <div className="mt-4 space-y-2">
                {saved.map((entry) => (
                  <label key={entry.id} className="flex gap-3 border border-line p-3 font-body text-sm">
                    <input type="radio" name="saved-address" checked={addressMode === 'saved' && selectedAddress === entry.id} onChange={() => { setAddressMode('saved'); setSelectedAddress(entry.id); }} />
                    <span>{entry.fullName}, {entry.street}, {entry.city}, {entry.state} {entry.pincode}</span>
                  </label>
                ))}
                <button type="button" className="font-body text-sm underline" onClick={() => setAddressMode('new')}>Add a new address</button>
              </div>
            ) : null}
            {addressMode === 'new' || !saved.length ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Mobile Number*" value={contact.phone} error={errors.phone} inputMode="numeric" onChange={(value) => setContact((c) => ({ ...c, phone: value }))} />
                <Field label="Email*" type="email" value={contact.email} error={errors.email} onChange={(value) => setContact((c) => ({ ...c, email: value }))} />
                <Field label="First Name*" value={contact.firstName} error={errors.firstName} onChange={(value) => setContact((c) => ({ ...c, firstName: value }))} />
                <Field label="Last Name*" value={contact.lastName} error={errors.lastName} onChange={(value) => setContact((c) => ({ ...c, lastName: value }))} />
                <Field label="Pincode*" value={address.pincode} error={errors.address} onChange={(value) => setAddress((c) => ({ ...c, pincode: value }))} />
                <Field label="City" value={address.city} onChange={(value) => setAddress((c) => ({ ...c, city: value }))} />
                <Field label="Country" value="India" readOnly />
                <Field label="State" value={address.state} onChange={(value) => setAddress((c) => ({ ...c, state: value }))} />
                <label className="block font-body text-xs text-muted sm:col-span-2">
                  Address*
                  <textarea value={address.street} onChange={(event) => setAddress((c) => ({ ...c, street: event.target.value }))} className="mt-1 h-24 w-full border border-line bg-white px-3 py-2 font-body text-sm text-ink" />
                </label>
              </div>
            ) : null}
            {errors.address ? <p className="mt-2 font-body text-sm text-terracotta" role="alert">{errors.address}</p> : null}
            <button type="submit" className="mt-6 h-12 w-full bg-ink font-body text-sm text-paper">Proceed to Payment</button>
          </>
        ) : (
          <>
            <h2 className="font-heading text-3xl text-ink">Payment</h2>
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
            <p className="mt-5 font-body text-sm text-ink">{addressLine} <button type="button" className="underline" onClick={() => setStep('shipping')}>Edit</button></p>
            {failure ? <p className="mt-3 font-body text-sm text-terracotta" role="alert">{failure}</p> : null}
            {useMockData ? <p className="mt-3 font-body text-sm text-terracotta">{MOCK_DISABLED_MESSAGE}</p> : null}
            <button type="submit" disabled={busy || useMockData || !cart.length} className="mt-6 h-12 w-full bg-ink font-body text-sm text-paper disabled:bg-line">
              {busy ? 'Please wait' : 'Place Order'}
            </button>
            <p className="mt-2 font-body text-xs text-muted">The amount charged is the total returned by the server.</p>
          </>
        )}
      </form>
      <aside className="order-1 bg-sand p-5 lg:order-2 lg:w-[300px]">
        <button type="button" className="flex w-full items-center justify-between text-left lg:hidden" aria-expanded={summaryOpen} onClick={() => setSummaryOpen((open) => !open)}>
          <span className="font-heading text-xl text-ink">{cart.length} Items in your Bag</span>
          <span className="font-body text-sm">{summaryOpen ? 'Hide' : 'Show'}</span>
        </button>
        <div className={`${summaryOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="hidden items-center justify-between lg:flex">
            <h2 className="font-heading text-xl text-ink">{cart.length} Items in your Bag</h2>
            <Link to="/cart" className="font-body text-sm underline">Edit Bag</Link>
          </div>
          <ul className="thin-scroll mt-3 max-h-64 space-y-3 overflow-y-auto pr-1">
            {cart.map((line) => (
              <li key={line.id} className="flex gap-3 border border-line bg-white p-2">
                <SafeImage src={line.product?.image} alt="" className="h-14 w-12 object-contain" />
                <div>
                  <p className="font-heading text-sm text-ink">{line.product?.name}</p>
                  <p className="font-body text-xs text-muted">Quantity: {line.quantity}</p>
                </div>
              </li>
            ))}
          </ul>
          <h3 className="mt-4 font-heading text-xl text-ink">Order Summary</h3>
          <dl className="mt-2 space-y-1 font-body text-sm text-ink">
            <div className="flex justify-between"><dt>Bag Total</dt><dd>{formatRupee(cartSubtotal)}</dd></div>
            <div className="flex justify-between"><dt>Promo Applied</dt><dd>{discount ? `−${formatRupee(discount)}` : '−₹0.00'}</dd></div>
            <div className="flex justify-between"><dt>Shipping</dt><dd>{shippingQuote.known ? formatRupee(shippingAmount) : shippingQuote.message}</dd></div>
            <div className="flex justify-between font-bold"><dt>Grand Total</dt><dd>{formatRupee(estimate)}</dd></div>
          </dl>
        </div>
      </aside>
    </main>
  );
}

function Field({ label, error, onChange, value, ...props }) {
  const id = `checkout-${label.toLowerCase().replace(/[^a-z]/g, '')}`;
  return (
    <label htmlFor={id} className="block font-body text-xs text-muted">
      {label}
      <span className="relative mt-1 block">
        <input id={id} value={value} onChange={onChange ? (event) => onChange(event.target.value) : undefined} {...props} className="h-11 w-full border border-line bg-white px-3 font-body text-sm text-ink" />
        {error ? <span className="absolute top-1/2 right-2 -translate-y-1/2 font-body text-sm text-terracotta" aria-hidden="true">×</span> : null}
      </span>
      {error ? <span className="mt-1 block text-xs text-terracotta" role="alert">{error}</span> : null}
    </label>
  );
}
