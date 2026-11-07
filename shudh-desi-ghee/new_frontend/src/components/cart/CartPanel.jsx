import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../../hooks/useShop';
import { formatRupee } from '../../utils/money';
import SafeImage from '../SafeImage';
import useFocusTrap from '../../hooks/useFocusTrap';
import { clearAppliedCoupon, readAppliedCoupon, writeAppliedCoupon } from '../../utils/coupon';
import { MAX_LINE_QUANTITY } from '../../config/brand';
import { variantChoices } from '../../utils/collections';
import { IconChevron, IconClose } from '../shell/icons';

export default function CartPanel({ onClose, page = false }) {
  const {
    cart, cartCount, cartSubtotal, updateQuantity, removeFromCart,
    products, shippingQuote, discountCodes, validateCoupon, addToCart,
  } = useShop();
  const [offersOpen, setOffersOpen] = useState(false);
  const [code, setCode] = useState('');
  const [offerError, setOfferError] = useState('');
  const [offerOk, setOfferOk] = useState('');
  const [applying, setApplying] = useState(false);
  const [coupon, setCoupon] = useState(() => readAppliedCoupon(cartSubtotal));
  const [couponNote, setCouponNote] = useState('');
  const offers = useRef(null);
  const scroller = useRef(null);
  useFocusTrap(offersOpen, offers, () => setOffersOpen(false));

  if (coupon && coupon.subtotal !== cartSubtotal) {
    clearAppliedCoupon();
    setCoupon(null);
    setCouponNote('The bag changed, so the offer was cleared. Apply it again.');
  }

  const related = useMemo(
    () => products.filter((product) => !cart.some((line) => line.product?.id === product.id) && !product.isSoldOut).slice(0, 8),
    [products, cart],
  );
  const discount = coupon?.discountAmount || 0;
  const shippingLabel = !shippingQuote.known
    ? 'Shipping calculated at checkout'
    : shippingQuote.fee === 0
      ? 'Free'
      : formatRupee(shippingQuote.fee);
  const shippingAmount = shippingQuote.known ? shippingQuote.fee : 0;
  const grand = Math.max(0, cartSubtotal - discount + (shippingQuote.known ? shippingAmount : 0));
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

  const quickAdd = (product) => {
    const choices = variantChoices(product);
    const color = choices.colors[0];
    const size = choices.sizes[0];
    if (!color?.name || !size) return;
    addToCart(product, { name: color.name, hex: color.hex }, size, 1);
  };

  return (
    <div className={`flex h-full flex-col bg-white ${page ? 'min-h-[70vh]' : ''}`}>
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <h1 className="font-heading text-2xl text-ink">Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})</h1>
        {onClose ? (
          <button type="button" onClick={onClose} aria-label="Close cart" className="p-1 text-ink">
            <IconClose className="h-5 w-5" />
          </button>
        ) : null}
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-28">
        {cart.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-heading text-2xl text-ink">Your bag is empty</p>
            <Link to="/shop" onClick={onClose} className="mt-6 inline-flex h-11 items-center bg-olive px-6 font-body text-sm text-paper">Browse the shop</Link>
          </div>
        ) : (
          <>
            {remaining != null ? (
              <div className="mb-5">
                <p className="font-body text-sm text-ink">
                  {remaining === 0 ? 'You have free shipping' : `Add ${formatRupee(remaining)} more for free shipping`}
                </p>
                <div className="mt-2 h-1 bg-sand" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
                  <div className="h-full bg-olive" style={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : null}
            <ul className="divide-y divide-line">
              {cart.map((line) => (
                <li key={line.id} className="flex gap-3 py-4">
                  <Link to={`/product/${line.product?.id}`} onClick={onClose} className="h-20 w-16 shrink-0 bg-sand">
                    <SafeImage src={line.product?.image} alt="" className="h-full w-full object-contain" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link to={`/product/${line.product?.id}`} onClick={onClose} className="font-heading text-lg leading-tight break-words text-ink">{line.product?.name}</Link>
                        <p className="mt-1 font-body text-xs text-muted">{line.color?.name} · {line.size}</p>
                      </div>
                      <div className="inline-flex border border-line">
                        <button type="button" aria-label={`Decrease ${line.product?.name}`} className="h-8 w-8" onClick={() => updateQuantity(line.id, -1)}>−</button>
                        <span className="flex h-8 min-w-6 items-center justify-center border-x border-line font-body text-sm">{line.quantity}</span>
                        <button type="button" aria-label={`Increase ${line.product?.name}`} className="h-8 w-8 disabled:text-muted" disabled={line.quantity >= MAX_LINE_QUANTITY || line.product?.isSoldOut} onClick={() => updateQuantity(line.id, 1)}>+</button>
                      </div>
                    </div>
                    <p className="mt-2 font-body text-sm font-bold text-ink">{formatRupee((line.product?.price || 0) * line.quantity)}</p>
                    <button type="button" className="mt-1 font-body text-sm text-ink underline" onClick={() => removeFromCart(line.id)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-3 flex justify-between border-t border-line pt-3 font-body text-sm font-bold text-ink">
              <span>Subtotal:</span>
              <span>{formatRupee(cartSubtotal)}</span>
            </p>
            {couponNote ? <p className="mt-3 font-body text-sm text-terracotta" role="status">{couponNote}</p> : null}
            <button type="button" onClick={() => setOffersOpen(true)} className="mt-4 h-12 w-full border border-ink font-body text-sm text-ink">
              Apply Offers
            </button>
            <h2 className="mt-8 font-heading text-2xl text-ink">Order Summary</h2>
            <dl className="mt-3 space-y-2 font-body text-sm text-ink">
              <div className="flex justify-between"><dt>Bag Total</dt><dd>{formatRupee(cartSubtotal)}</dd></div>
              <div className="flex justify-between"><dt>Promo Applied</dt><dd>{discount ? `−${formatRupee(discount)}` : '−₹0.00'}</dd></div>
              <div className="flex justify-between"><dt>Shipping</dt><dd>{shippingLabel}</dd></div>
              <div className="flex justify-between border-t border-line pt-2 font-bold"><dt>Grand Total</dt><dd>{formatRupee(grand)}</dd></div>
            </dl>
            {related.length ? (
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-2xl text-ink">Recommendations</h2>
                  <div className="hidden gap-2 md:flex">
                    <button type="button" aria-label="Previous recommendations" onClick={() => scroller.current?.scrollBy({ left: -180, behavior: 'smooth' })} className="flex h-8 w-8 items-center justify-center rounded-full border border-line">
                      <IconChevron className="h-4 w-4 rotate-180" />
                    </button>
                    <button type="button" aria-label="Next recommendations" onClick={() => scroller.current?.scrollBy({ left: 180, behavior: 'smooth' })} className="flex h-8 w-8 items-center justify-center rounded-full border border-line">
                      <IconChevron className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div ref={scroller} className="no-scrollbar mt-3 flex gap-3 overflow-x-auto">
                  {related.map((product) => (
                    <article key={product.id} className="w-28 shrink-0">
                      <Link to={`/product/${product.id}`} onClick={onClose}>
                        <SafeImage src={product.image} alt={product.name} className="aspect-square w-full bg-sand object-contain" />
                      </Link>
                      <p className="mt-2 line-clamp-2 font-body text-xs text-ink">{product.name}</p>
                      <p className="font-body text-xs font-bold">{formatRupee(product.price)}</p>
                      <button type="button" onClick={() => quickAdd(product)} className="mt-1 font-body text-xs text-olive underline">Add to Bag</button>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
      {cart.length ? (
        <div className="grid grid-cols-2 border-t border-line">
          <div className="flex flex-col justify-center bg-white px-4 py-3">
            <p className="font-body text-xs text-muted">Grand Total</p>
            <p className="font-body text-base font-bold text-ink">{formatRupee(grand)}</p>
          </div>
          <Link to="/checkout" onClick={onClose} className="flex items-center justify-center bg-olive font-body text-sm font-semibold text-paper">
            Checkout
          </Link>
        </div>
      ) : null}
      {offersOpen ? (
        <div className="fixed inset-0 z-[90] flex justify-end bg-ink/40">
          <button type="button" className="absolute inset-0" aria-label="Close offers" onClick={() => setOffersOpen(false)} />
          <div ref={offers} role="dialog" aria-modal="true" aria-label="Apply offers" className="relative flex h-full w-full max-w-md flex-col bg-paper p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-3xl text-ink">Apply Offers</h2>
              <button type="button" onClick={() => setOffersOpen(false)} aria-label="Close" className="p-1"><IconClose className="h-5 w-5" /></button>
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
    </div>
  );
}
