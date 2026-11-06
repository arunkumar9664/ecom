import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../hooks/useShop';
import { formatRupee } from '../utils/money';
import SafeImage from '../components/SafeImage';
import ProductCarousel from '../components/home/ProductCarousel';
import useFocusTrap from '../hooks/useFocusTrap';
import { clearAppliedCoupon, readAppliedCoupon, writeAppliedCoupon } from '../utils/coupon';
import { MAX_LINE_QUANTITY } from '../config/brand';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function CartPage() {
  const {
    cart, cartCount, cartSubtotal, updateQuantity, removeFromCart,
    products, sections, shippingQuote, discountCodes, validateCoupon,
  } = useShop();
  const navigate = useNavigate();
  const [offersOpen, setOffersOpen] = useState(false);
  const [code, setCode] = useState('');
  const [offerError, setOfferError] = useState('');
  const [offerOk, setOfferOk] = useState('');
  const [applying, setApplying] = useState(false);
  const [coupon, setCoupon] = useState(() => readAppliedCoupon(cartSubtotal));
  const [couponNote, setCouponNote] = useState('');
  if (coupon && coupon.subtotal !== cartSubtotal) {
    clearAppliedCoupon();
    setCoupon(null);
    setCouponNote('The bag changed, so the offer was cleared. Apply it again.');
  }
  useDocumentTitle('Shopping cart', 'Review the bag before checkout.');
  const panel = useRef(null);
  useFocusTrap(offersOpen, panel, () => setOffersOpen(false));

  const related = useMemo(
    () => products.filter((product) => !cart.some((line) => line.product?.id === product.id)).slice(0, 8),
    [products, cart]
  );
  const discount = coupon?.discountAmount || 0;
  const shippingLabel = !shippingQuote.known
    ? 'Calculated at checkout'
    : shippingQuote.fee === 0
      ? 'Free'
      : formatRupee(shippingQuote.fee);
  const shippingAmount = shippingQuote.known ? shippingQuote.fee : 0;
  const grand = Math.max(0, cartSubtotal - discount + shippingAmount);
  const threshold = shippingQuote.known ? shippingQuote.threshold : null;
  const remaining = threshold != null ? Math.max(0, threshold - cartSubtotal) : null;
  const progress = threshold ? Math.min(100, (cartSubtotal / threshold) * 100) : 0;

  const apply = async (nextCode) => {
    setOfferError('');
    setOfferOk('');
    setApplying(true);
    try {
      const result = await validateCoupon(nextCode, cartSubtotal);
      if (!result?.valid) {
        setOfferError(result?.message || 'That code could not be applied');
        return;
      }
      const saved = {
        code: result.code,
        discountAmount: result.discountAmount,
        discountPercent: result.discountPercent,
        subtotal: cartSubtotal,
      };
      writeAppliedCoupon(saved);
      setCouponNote('');
      setCoupon(saved);
      setOfferOk(`${saved.code} applied`);
      setCode('');
    } finally {
      setApplying(false);
    }
  };

  return (
    <main className="mx-auto max-w-[1360px] px-4 py-6 pb-28 md:px-8 lg:pb-10">
      <div className="flex items-center gap-3">
        <button type="button" className="font-body text-lg md:hidden" aria-label="Back" onClick={() => navigate(-1)}>←</button>
        <h1 className="font-heading text-3xl text-ink md:text-4xl">Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})</h1>
      </div>

      {cart.length === 0 ? (
        <div className="mt-10 bg-white px-6 py-16 text-center">
          <p className="font-heading text-2xl text-ink">Your bag is empty</p>
          <Link to="/shop" className="mt-6 inline-flex h-11 items-center bg-olive px-6 font-body text-xs tracking-[0.14em] text-paper uppercase">Browse the shop</Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            {remaining != null ? (
              <div className="mb-6">
                <p className="font-body text-sm text-ink">
                  {remaining === 0 ? 'You have free shipping' : `Add ${formatRupee(remaining)} more for free shipping`}
                </p>
                <div className="mt-2 h-1.5 bg-sand" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
                  <div className="h-full bg-olive motion-safe:transition-[width]" style={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : null}
            <ul className="divide-y divide-line border-y border-line">
              {cart.map((line) => (
                <li key={line.id} className="flex gap-4 py-4">
                  <Link to={`/product/${line.product?.id}`} className="h-24 w-20 shrink-0 bg-white">
                    <SafeImage src={line.product?.image} alt="" className="h-full w-full object-contain" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link to={`/product/${line.product?.id}`} className="font-body text-sm font-medium break-words text-ink">{line.product?.name}</Link>
                        <p className="mt-1 font-body text-xs text-muted">{line.color?.name} · {line.size}</p>
                        {line.product?.isSoldOut ? <p className="mt-1 font-body text-xs text-terracotta">Sold out</p> : null}
                      </div>
                      <p className="font-body text-sm font-bold text-ink">{formatRupee((line.product?.price || 0) * line.quantity)}</p>
                    </div>
                    <div className="mt-3 flex items-center gap-4">
                      <div className="inline-flex border border-line">
                        <button type="button" aria-label={`Decrease ${line.product?.name}`} className="h-9 w-9 font-bold" onClick={() => updateQuantity(line.id, -1)}>−</button>
                        <span className="flex h-9 w-8 items-center justify-center font-body text-sm">{line.quantity}</span>
                        <button type="button" aria-label={`Increase ${line.product?.name}`} className="h-9 w-9 font-bold disabled:text-muted" disabled={line.quantity >= MAX_LINE_QUANTITY || line.product?.isSoldOut} onClick={() => updateQuantity(line.id, 1)}>+</button>
                      </div>
                      <button type="button" className="font-body text-sm text-ink underline" onClick={() => removeFromCart(line.id)}>Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {couponNote ? <p className="mt-4 font-body text-sm text-terracotta" role="status">{couponNote}</p> : null}
            <button type="button" onClick={() => setOffersOpen(true)} className="mt-6 h-12 w-full border border-ink font-body text-sm text-ink">
              Apply Offers
            </button>
            <div className="mt-10">
              <ProductCarousel title="You may also like" products={related} href="/shop" status={sections.products} />
            </div>
          </div>
          <aside className="h-fit bg-white p-6 lg:sticky lg:top-40">
            <h2 className="font-heading text-2xl text-ink">Order summary</h2>
            <dl className="mt-4 space-y-2 font-body text-sm text-ink">
              <div className="flex justify-between"><dt>Bag total</dt><dd>{formatRupee(cartSubtotal)}</dd></div>
              <div className="flex justify-between"><dt>Promo applied</dt><dd>{discount ? `−${formatRupee(discount)}` : '—'}</dd></div>
              <div className="flex justify-between"><dt>Shipping</dt><dd>{shippingLabel}</dd></div>
              <div className="flex justify-between border-t border-line pt-3 font-bold"><dt>Grand total</dt><dd>{formatRupee(grand)}</dd></div>
            </dl>
            <ul className="mt-6 grid grid-cols-3 gap-2 text-center">
              {['Handmade', 'Plain packing', 'Secure pay'].map((label) => (
                <li key={label} className="font-body text-[11px] text-muted">{label}</li>
              ))}
            </ul>
            <Link to="/checkout" className="mt-6 hidden h-12 items-center justify-center bg-olive font-body text-xs tracking-[0.14em] text-paper uppercase lg:flex">Checkout</Link>
          </aside>
        </div>
      )}

      {cart.length > 0 ? (
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-line bg-paper px-4 py-3 lg:hidden">
          <p className="font-body text-sm font-bold text-ink">{formatRupee(grand)}</p>
          <Link to="/checkout" className="flex h-11 flex-1 items-center justify-center bg-olive font-body text-xs tracking-[0.14em] text-paper uppercase">Checkout</Link>
        </div>
      ) : null}

      {offersOpen ? (
        <div className="fixed inset-0 z-[80] flex justify-end bg-ink/40" role="dialog" aria-modal="true" aria-label="Apply offers">
          <button type="button" className="absolute inset-0" aria-label="Close offers" onClick={() => setOffersOpen(false)} />
          <div ref={panel} className="relative flex h-full w-full max-w-md flex-col bg-paper p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-3xl text-ink">Apply Offers</h2>
              <button type="button" onClick={() => setOffersOpen(false)} className="font-body text-sm">Close</button>
            </div>
            <form className="mt-6" onSubmit={(event) => { event.preventDefault(); apply(code); }}>
              <label htmlFor="promo-code" className="font-body text-sm font-bold text-ink">Code</label>
              <div className="mt-2 flex gap-2">
                <input id="promo-code" value={code} onChange={(event) => setCode(event.target.value)} className="h-11 flex-1 border border-line bg-white px-3 font-body text-sm" />
                <button type="submit" disabled={applying || !code.trim()} className="h-11 border border-ink px-4 font-body text-sm disabled:border-line disabled:text-muted">Apply</button>
              </div>
            </form>
            {offerError ? <p className="mt-3 font-body text-sm text-terracotta" role="alert">{offerError}</p> : null}
            {offerOk ? <p className="mt-3 font-body text-sm text-olive" role="status">{offerOk}</p> : null}
            <ul className="mt-6 space-y-3 overflow-y-auto">
              {(discountCodes || []).filter((entry) => entry.isActive !== false).map((entry) => (
                <li key={entry.code} className="border border-line p-3">
                  <p className="font-body text-sm font-bold text-ink">{entry.code}</p>
                  <p className="mt-1 font-body text-xs text-muted">{entry.description || `${entry.discountPercent}% off`}</p>
                  <button type="button" className="mt-2 font-body text-sm text-ink underline" disabled={applying} onClick={() => apply(entry.code)}>Apply</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </main>
  );
}
