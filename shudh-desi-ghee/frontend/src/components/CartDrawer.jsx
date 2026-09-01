import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  Tag, 
  FileText,
  Sparkles,
  Gift,
  Check
} from 'lucide-react';
import { getImageUrl } from '../utils/image';

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    cartSubtotal,
    storeSettings,
    validateCoupon
  } = useShop();

  const [orderNote, setOrderNote] = useState('');
  const [isGiftWrap, setIsGiftWrap] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState('');

  React.useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const result = await validateCoupon(couponCode, cartSubtotal);
    if (result?.valid) {
      setDiscountAmount(result.discountAmount);
      setAppliedCoupon(`${result.code} (${result.discountPercent}% OFF)`);
      setCouponError('');
    } else {
      setCouponError(result?.message || 'Invalid coupon code');
      setDiscountAmount(0);
      setAppliedCoupon('');
    }
  };

  const subtotalAfterDiscount = Math.max(0, cartSubtotal - discountAmount);
  const freeShippingThreshold = storeSettings?.freeShippingThreshold ?? 5000;
  const configuredShippingFee = storeSettings?.shippingFee ?? 250;
  const isFreeShipping = subtotalAfterDiscount >= freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : configuredShippingFee;
  const progressToFreeShipping = Math.min(100, (subtotalAfterDiscount / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
        onClick={() => setIsCartOpen(false)} 
      />

      {/* Slide-out Drawer Box */}
      <div 
        className="relative w-full max-w-md bg-[#fcfbfa] h-full shadow-2xl z-10 flex flex-col justify-between animate-in slide-in-from-right duration-300 overscroll-contain"
        data-lenis-prevent
      >
        
        {/* Header */}
        <div className="p-5 border-b border-[#e8e2d9] flex items-center justify-between bg-[#f7f3ee]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#39322f]" />
            <h3 className="font-serif font-bold text-xl text-[#39322f]">
              Shopping Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)})
            </h3>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            aria-label="Close Cart"
            className="p-1.5 text-[#39322f] hover:text-[#d4a373] transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Animated Free Shipping Progress Indicator */}
        <div className="bg-[#f7f3ee]/90 px-5 py-3.5 border-b border-[#e8e2d9] text-xs font-sans shadow-inner">
          {!storeSettings ? (
            <div className="text-center text-gray-400 font-medium animate-pulse">Loading shipping details...</div>
          ) : isFreeShipping ? (
            <div className="flex items-center justify-between text-emerald-800 font-semibold bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 animate-bounce" />
                <span>Unlocked: FREE Express Delivery across India!</span>
              </div>
              <Sparkles className="w-4 h-4 text-emerald-600 fill-emerald-600" />
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex justify-between text-[#39322f]">
                <span className="font-medium">Add ₹{(freeShippingThreshold - subtotalAfterDiscount).toLocaleString('en-IN')} more for <strong className="text-[#d4a373]">FREE Express Shipping</strong></span>
                <span className="font-bold text-[#d4a373]">{Math.round(progressToFreeShipping)}%</span>
              </div>
              <div className="w-full h-2 bg-[#e8e2d9] rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-[#d4a373] to-[#b58349] transition-all duration-700 rounded-full shadow-sm"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Contents Body */}
        <div 
          className="flex-1 overflow-y-auto p-5 space-y-4 overscroll-contain"
          data-lenis-prevent
        >
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-16 h-16 rounded-full bg-[#f7f3ee] flex items-center justify-center text-[#39322f]/40 border border-[#e8e2d9]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-xl font-bold text-[#39322f]">
                Your cart is currently empty
              </h4>
              <p className="text-xs text-[#39322f]/60 font-sans max-w-xs leading-relaxed">
                Explore our handcrafted kurtis, luxury short kurtis, and festive Anarkalis to add to your wardrobe.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 bg-[#39322f] hover:bg-[#d4a373] text-white px-8 py-3 rounded-full text-xs font-sans uppercase tracking-widest font-semibold transition-all cursor-pointer shadow-md"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div 
                key={idx}
                className="flex gap-4 p-3 bg-[#f7f3ee]/50 rounded-xl border border-[#e8e2d9]/80 relative group hover:border-[#d4a373]/40 transition-all"
              >
                {/* Thumbnail */}
                <div className="w-20 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-[#e8e2d9]">
                  <img
                    src={getImageUrl(item.product?.image)}
                    alt={item.product?.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif font-semibold text-sm text-[#39322f] line-clamp-1 pr-6">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(idx)}
                        className="text-[#39322f]/40 hover:text-red-600 transition-colors p-1 cursor-pointer absolute top-2 right-2"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-[#39322f]/60 font-sans mt-1">
                      {item.color && (
                        <span className="flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full border" style={{ backgroundColor: item.color.hex }} />
                          {item.color.name}
                        </span>
                      )}
                      <span>Size: {item.size}</span>
                    </div>
                  </div>

                  {/* Quantity & Price Row */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#e8e2d9]/40">
                    <div className="flex items-center border border-[#e8e2d9] rounded-md bg-white">
                      <button
                        onClick={() => updateQuantity(idx, -1)}
                        className="p-1 hover:bg-gray-100 text-[#39322f] transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-semibold font-sans text-[#39322f]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(idx, 1)}
                        className="p-1 hover:bg-gray-100 text-[#39322f] transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-serif font-bold text-sm text-[#39322f]">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Complimentary Luxury Gift Packaging Options */}
          {cart.length > 0 && (
            <div className="p-3.5 bg-[#f7f3ee]/70 rounded-xl border border-[#d4a373]/30 space-y-2.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-[#39322f] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isGiftWrap}
                  onChange={(e) => setIsGiftWrap(e.target.checked)}
                  className="w-4 h-4 accent-[#d4a373] rounded cursor-pointer"
                />
                <Gift className="w-4 h-4 text-[#d4a373]" />
                <span>Add Signature Luxury Gift Packaging (Free)</span>
              </label>
              
              {isGiftWrap && (
                <div className="pl-6 space-y-2 animate-in fade-in duration-200">
                  <textarea
                    rows={2}
                    placeholder="Write a custom handwritten gift message..."
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#e8e2d9] rounded-lg text-xs font-sans text-[#39322f] placeholder-gray-400 focus:outline-none focus:border-[#d4a373]"
                  />
                  <p className="text-[10px] text-[#39322f]/60 italic">
                    Includes satin ribbon bow and gold-embossed greeting card.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Coupon Code Section */}
          {cart.length > 0 && (
            <div className="pt-3 border-t border-[#e8e2d9]">
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#39322f] uppercase tracking-wider">
                  <Tag className="w-3.5 h-3.5 text-[#d4a373]" />
                  <span>Promo Code</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Try HAPPY5 or LAH10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={!!appliedCoupon}
                    className="flex-1 px-3 py-2 bg-white border border-[#e8e2d9] rounded-md text-xs uppercase font-sans text-[#39322f] placeholder-gray-400 focus:outline-none focus:border-[#d4a373] disabled:bg-gray-100 disabled:text-gray-500"
                  />
                  {appliedCoupon ? (
                    <button
                      type="button"
                      disabled
                      className="bg-emerald-700 text-white px-3 py-2 rounded-md text-xs font-sans uppercase font-semibold flex items-center gap-1 cursor-default shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Applied</span>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="bg-[#39322f] hover:bg-[#d4a373] text-white px-4 py-2 rounded-md text-xs font-sans uppercase font-semibold transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {appliedCoupon && (
                  <div className="flex items-center justify-between text-[11px] text-emerald-600 font-semibold pt-1">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Coupon applied: {appliedCoupon}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedCoupon('');
                        setDiscountAmount(0);
                        setCouponCode('');
                        setCouponError('');
                      }}
                      className="text-[11px] text-rose-600 hover:underline flex items-center gap-0.5 font-sans cursor-pointer ml-2"
                    >
                      <X className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="text-[11px] text-red-500">{couponError}</p>
                )}
              </form>
            </div>
          )}

          {/* Special Order Note Field */}
          {cart.length > 0 && (
            <div className="pt-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#39322f] uppercase tracking-wider mb-1.5">
                <FileText className="w-3.5 h-3.5 text-[#d4a373]" />
                <span>Custom Sizing / Fitting Note</span>
              </label>
              <textarea
                rows={2}
                placeholder="Add special instructions or custom sizing requirements..."
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#e8e2d9] rounded-md text-xs font-sans text-[#39322f] placeholder-gray-400 focus:outline-none focus:border-[#d4a373]"
              />
            </div>
          )}
        </div>

        {/* Footer Subtotal & Checkout Action */}
        {cart.length > 0 && (
          <div className="p-5 bg-[#f7f3ee] border-t border-[#e8e2d9] space-y-3">
            <div className="space-y-1 text-xs font-sans text-[#39322f]">
              <div className="flex justify-between">
                <span className="text-[#39322f]/70">Subtotal</span>
                <span className="font-semibold">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-[#39322f]/70">
                <span>Estimated Shipping</span>
                <span>
                  {!storeSettings ? (
                    <span className="text-gray-400 text-xs font-sans animate-pulse">Loading...</span>
                  ) : isFreeShipping ? (
                    'FREE'
                  ) : (
                    `₹${configuredShippingFee.toLocaleString('en-IN')}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-serif font-bold text-[#39322f] pt-2 border-t border-[#e8e2d9]">
                <span>Total</span>
                <span>
                  {!storeSettings ? (
                    <span className="text-gray-400 text-xs font-sans animate-pulse">Calculating...</span>
                  ) : (
                    `₹${(subtotalAfterDiscount + shippingFee).toLocaleString('en-IN')}`
                  )}
                </span>
              </div>
            </div>

            <Link
              to="/cart"
              onClick={() => setIsCartOpen(false)}
              className="w-full bg-[#39322f] hover:bg-[#d4a373] text-white py-3.5 rounded-full text-xs font-sans uppercase tracking-widest font-semibold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-[10px] text-center text-[#39322f]/50 font-sans">
              Taxes and duties calculated at checkout.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
