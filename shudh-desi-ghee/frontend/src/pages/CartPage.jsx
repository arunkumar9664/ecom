import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useShop } from '../context/ShopContext';
import { getImageUrl } from '../utils/image';
import api from '../services/api';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  ChevronRight,
  FileText,
  Check,
  X
} from 'lucide-react';


export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartSubtotal, clearCart, discountCodes, addOrder, currentUser, openAuthModal, storeSettings, localMode, validateCoupon } = useShop();

  const [orderNote, setOrderNote] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);
  const [idempotencyKey, setIdempotencyKey] = useState(() => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `ik_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  });

  const freeShippingThreshold = storeSettings?.freeShippingThreshold ?? 5000;
  const configuredShippingFee = storeSettings?.shippingFee ?? 250;
  const subtotalAfterDiscount = Math.max(0, cartSubtotal - discountAmount);
  const isFreeShipping = subtotalAfterDiscount >= freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : configuredShippingFee;
  const finalTotal = Math.max(0, subtotalAfterDiscount + shippingFee);

  // Shipping Address Form State
  const [address, setAddress] = useState({
    fullName: currentUser ? currentUser.name : '',
    phone: currentUser ? (currentUser.phone || '') : '',
    email: currentUser ? currentUser.email : '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');

  // Fetch & populate saved addresses for logged-in user
  React.useEffect(() => {
    if (currentUser) {
      api.get('/addresses').then(res => {
        if (res.data?.addresses && res.data.addresses.length > 0) {
          setSavedAddresses(res.data.addresses);
          const defaultAddr = res.data.addresses.find(a => a.isDefault) || res.data.addresses[0];
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
            setAddress(prev => ({
              ...prev,
              fullName: defaultAddr.fullName,
              phone: defaultAddr.phone,
              email: currentUser.email || prev.email,
              street: defaultAddr.street,
              city: defaultAddr.city,
              state: defaultAddr.state,
              pincode: defaultAddr.pincode
            }));
          }
        }
      }).catch(err => console.error('Error fetching saved addresses:', err));
    }
  }, [currentUser]);

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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

  const loadRazorpayScript = () => {
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
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser && !localMode) {
      openAuthModal('login');
      return;
    }

    if (!address.fullName || !address.phone) {
      toast.error("Please fill in your full name and contact phone number.");
      return;
    }

    const cleanPhone = (address.phone || '').toString().trim().replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setPhoneError('Enter a valid 10-digit mobile number');
      toast.error('Enter a valid 10-digit mobile number');
      return;
    } else {
      setPhoneError('');
    }

    setIsProcessingPayment(true);

    try {
      const orderPayload = {
        customerName: address.fullName,
        customerEmail: address.email || currentUser.email || 'customer@example.com',
        customerPhone: address.phone,
        customerAddress: `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`,
        items: cart.map(item => ({
          id: item.product.id,
          name: item.product.name,
          size: item.size || 'Free Size',
          color: item.color?.name || 'Standard',
          quantity: item.quantity,
          price: item.product.price,
        })),
        total: finalTotal, // Informational only; backend computes true total server-side
        discountCode: couponCode || undefined,
        idempotencyKey,
        paymentMethod: 'Prepaid (Razorpay)',
      };

      // 1. Create Order in Database (or demo order when backend offline)
      const createdOrder = await addOrder(orderPayload);

      if (localMode) {
        setPlacedOrder(createdOrder);
        setIsProcessingPayment(false);
        return;
      }

      // If Cash on Delivery, order is immediately confirmed
      const isCOD = (orderPayload.paymentMethod || '').toLowerCase().includes('cash on delivery') || (orderPayload.paymentMethod || '').toLowerCase().includes('cod');
      if (isCOD) {
        setPlacedOrder(createdOrder);
        clearCart();
        setIsProcessingPayment(false);
        return;
      }

      // 2. Create Razorpay Order for Prepaid payment (no amount sent; backend fetches real total from created order)
      const rzpRes = await api.post('/payments/create-order', {
        orderId: createdOrder.id,
        idempotencyKey,
      });

      const rzpOrderData = rzpRes.data;

      // 3. Load Razorpay JS SDK
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Razorpay SDK failed to load. Please check your internet connection.');
        setIsProcessingPayment(false);
        return;
      }

      // 4. Open Razorpay Modal using server-returned order total
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TRxuLFtnW8n6gu';
      const options = {
        key: razorpayKey,
        amount: rzpOrderData.amount || createdOrder.total * 100,
        currency: rzpOrderData.currency || 'INR',
        name: 'Suranghi Naar Atelier',
        description: 'Luxury Ethnic Fashion Order',
        order_id: rzpOrderData.id,
        handler: async (response) => {
          try {
            const verifyRes = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: createdOrder.id,
            });

            if (verifyRes.data?.success) {
              const verifiedOrder = verifyRes.data.order || createdOrder;
              setPlacedOrder(verifiedOrder);
              clearCart();
              toast.success('Payment verified! Order placed successfully.');
              if (typeof crypto !== 'undefined' && crypto.randomUUID) {
                setIdempotencyKey(crypto.randomUUID());
              } else {
                setIdempotencyKey(`ik_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);
              }
            } else {
              toast.error('Payment verification failed. Please contact support if money was debited.');
            }
          } catch (err) {
            console.error('Payment Verification Error:', err);
            toast.error(err.response?.data?.message || 'Payment verification failed. Please try again.');
          } finally {
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: address.fullName,
          email: address.email || currentUser.email,
          contact: address.phone,
        },
        theme: {
          color: '#39322f',
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
            toast.info('Payment window closed. Order was not placed.');
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', function (response) {
        console.error('Payment Failed:', response.error);
        toast.error(`Payment Failed: ${response.error?.description || 'Transaction declined.'}`);
        setIsProcessingPayment(false);
      });
      razorpayInstance.open();

    } catch (err) {
      console.error('Checkout error:', err);
      toast.error(err.response?.data?.message || 'Error processing checkout. Please try again.');
      setIsProcessingPayment(false);
    }
  };


  return (
    <div className="bg-[#f7f3ee] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-sans text-[#39322f]/60 mb-6 uppercase tracking-wider">
          <Link to="/" className="hover:text-[#d4a373] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#39322f] font-semibold">Shopping Cart & Checkout</span>
        </nav>

        {/* Page Header */}
        <div className="mb-10 text-center sm:text-left">
          <span className="text-xs uppercase font-sans tracking-[0.25em] text-[#d4a373] font-semibold">
            Studio Checkout
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#39322f] mt-1">
            Shopping Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)})
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="bg-[#fcfbfa] rounded-3xl border border-[#e8e2d9] p-12 text-center space-y-6 max-w-lg mx-auto my-12 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-[#f7f3ee] flex items-center justify-center text-[#39322f]/40 mx-auto">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#39322f]">
              Your cart is currently empty
            </h2>
            <p className="text-xs text-[#39322f]/60 font-sans leading-relaxed">
              Explore our handcrafted kurtis, designer short kurtis, and festive Anarkali suit ensembles.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#39322f] hover:bg-[#d4a373] text-white px-8 py-3.5 rounded-full text-xs font-sans uppercase tracking-widest font-semibold transition-all shadow-md"
            >
              <span>Explore Collections</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Column: Cart Items & Delivery Address Form */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Items List */}
              <div className="bg-[#fcfbfa] rounded-3xl p-6 sm:p-8 border border-[#e8e2d9] shadow-xs space-y-6">
                <h3 className="font-serif font-bold text-xl text-[#39322f] border-b border-[#e8e2d9] pb-4">
                  Review Your Selected Styles
                </h3>

                <div className="space-y-4">
                  {cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row gap-4 p-4 bg-[#f7f3ee]/60 rounded-2xl border border-[#e8e2d9]/60 items-center justify-between"
                    >
                      <div className="flex gap-4 items-center w-full sm:w-auto">
                        <Link to={`/product/${item.product.id}`} className="w-20 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-[#e8e2d9]">
                          <img src={getImageUrl(item.product?.image)} alt={item.product?.name} loading="lazy" className="w-full h-full object-cover" />
                        </Link>
                        <div>
                          <Link to={`/product/${item.product.id}`} className="font-serif font-semibold text-base text-[#39322f] hover:text-[#d4a373] line-clamp-1">
                            {item.product.name}
                          </Link>
                          <div className="text-xs text-[#39322f]/60 font-sans mt-1">
                            <span>Color: {item.color?.name || 'Standard'}</span> • <span>Size: {item.size}</span>
                          </div>
                          <span className="font-serif font-bold text-sm text-[#39322f] mt-1 block">
                            ₹{item.product.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls & Remove */}
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[#e8e2d9]">
                        <div className="flex items-center border border-[#e8e2d9] rounded-lg bg-white">
                          <button onClick={() => updateQuantity(idx, -1)} className="p-1.5 hover:bg-gray-100 text-[#39322f]">
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-semibold font-sans text-[#39322f]">{item.quantity}</span>
                          <button onClick={() => updateQuantity(idx, 1)} className="p-1.5 hover:bg-gray-100 text-[#39322f]">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="font-serif font-bold text-base text-[#39322f]">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>

                        <button onClick={() => removeFromCart(idx)} className="text-[#39322f]/40 hover:text-red-600 p-1 cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address Form Mockup */}
              <form onSubmit={handleCheckoutSubmit} className="bg-[#fcfbfa] rounded-3xl p-6 sm:p-8 border border-[#e8e2d9] shadow-xs space-y-6">
                <h3 className="font-serif font-bold text-xl text-[#39322f] border-b border-[#e8e2d9] pb-4">
                  Shipping Address
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  {savedAddresses.length > 0 && (
                    <div className="sm:col-span-2 p-4 bg-[#f8f4ee] border border-[#d4a373]/40 rounded-2xl space-y-2 mb-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#b58349]">
                        Select Saved Address
                      </label>
                      <select
                        value={selectedAddressId}
                        onChange={(e) => {
                          const id = e.target.value;
                          setSelectedAddressId(id);
                          if (id === 'new') {
                            setAddress({
                              fullName: currentUser?.name || '',
                              phone: currentUser?.phone || '',
                              email: currentUser?.email || '',
                              street: '',
                              city: '',
                              state: '',
                              pincode: ''
                            });
                          } else {
                            const chosen = savedAddresses.find(a => a.id === id);
                            if (chosen) {
                              setAddress({
                                fullName: chosen.fullName,
                                phone: chosen.phone,
                                email: currentUser?.email || '',
                                street: chosen.street,
                                city: chosen.city,
                                state: chosen.state,
                                pincode: chosen.pincode
                              });
                            }
                          }
                        }}
                        className="w-full bg-white border border-[#e8e2d9] rounded-xl p-2.5 text-xs text-[#39322f] font-semibold focus:outline-none focus:border-[#d4a373]"
                      >
                        {savedAddresses.map(addr => (
                          <option key={addr.id} value={addr.id}>
                            {addr.isDefault ? '[DEFAULT] ' : ''}{addr.fullName} — {addr.street}, {addr.city} ({addr.pincode})
                          </option>
                        ))}
                        <option value="new">+ Enter New Custom Address</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-[#39322f] font-semibold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Sharma"
                      value={address.fullName}
                      onChange={(e) => setAddress({...address, fullName: e.target.value})}
                      className="w-full p-3 bg-white border border-[#e8e2d9] rounded-xl text-xs focus:outline-none focus:border-[#d4a373]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#39322f] font-semibold mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="98765 43210"
                      value={address.phone}
                      onChange={(e) => {
                        const val = e.target.value;
                        setAddress({...address, phone: val});
                        const clean = val.trim().replace(/\D/g, '');
                        if (clean && !/^[6-9]\d{9}$/.test(clean)) {
                          setPhoneError('Enter a valid 10-digit mobile number');
                        } else {
                          setPhoneError('');
                        }
                      }}
                      className={`w-full p-3 bg-white border rounded-xl text-xs focus:outline-none ${
                        phoneError ? 'border-rose-500' : 'border-[#e8e2d9] focus:border-[#d4a373]'
                      }`}
                    />
                    {phoneError && (
                      <p className="text-[11px] text-rose-600 font-semibold mt-1">
                        {phoneError}
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[#39322f] font-semibold mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="your.email@domain.com"
                      value={address.email}
                      onChange={(e) => setAddress({...address, email: e.target.value})}
                      className="w-full p-3 bg-white border border-[#e8e2d9] rounded-xl text-xs focus:outline-none focus:border-[#d4a373]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[#39322f] font-semibold mb-1">Street Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="House/Flat No., Building, Street Name"
                      value={address.street}
                      onChange={(e) => setAddress({...address, street: e.target.value})}
                      className="w-full p-3 bg-white border border-[#e8e2d9] rounded-xl text-xs focus:outline-none focus:border-[#d4a373]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#39322f] font-semibold mb-1">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="Jaipur / Mumbai / Delhi"
                      value={address.city}
                      onChange={(e) => setAddress({...address, city: e.target.value})}
                      className="w-full p-3 bg-white border border-[#e8e2d9] rounded-xl text-xs focus:outline-none focus:border-[#d4a373]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#39322f] font-semibold mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      placeholder="302001"
                      value={address.pincode}
                      onChange={(e) => setAddress({...address, pincode: e.target.value})}
                      className="w-full p-3 bg-white border border-[#e8e2d9] rounded-xl text-xs focus:outline-none focus:border-[#d4a373]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#e8e2d9]">
                  <button
                    type="submit"
                    className="w-full bg-[#39322f] hover:bg-[#d4a373] text-white py-4 rounded-full text-xs font-sans uppercase tracking-widest font-semibold transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Complete Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

            </div>

            {/* Right Column: Order Summary & Promo Code */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-[#fcfbfa] rounded-3xl p-6 sm:p-8 border border-[#e8e2d9] shadow-xs space-y-6 sticky top-28">
                <h3 className="font-serif font-bold text-xl text-[#39322f] border-b border-[#e8e2d9] pb-4">
                  Order Summary
                </h3>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-[#39322f] uppercase tracking-wider">
                    <Tag className="w-3.5 h-3.5 text-[#d4a373]" />
                    <span>Apply Discount Coupon</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Try HAPPY5 or LAH10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={!!appliedCoupon}
                      className="flex-1 px-3.5 py-2.5 bg-white border border-[#e8e2d9] rounded-lg text-xs uppercase font-sans text-[#39322f] focus:outline-none focus:border-[#d4a373] disabled:bg-gray-100 disabled:text-gray-500"
                    />
                    {appliedCoupon ? (
                      <button
                        type="button"
                        disabled
                        className="bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-xs font-sans uppercase font-semibold flex items-center gap-1 cursor-default shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Applied</span>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="bg-[#39322f] hover:bg-[#d4a373] text-white px-5 py-2.5 rounded-lg text-xs font-sans uppercase font-semibold transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                  {appliedCoupon && (
                    <div className="flex items-center justify-between text-xs text-emerald-600 font-semibold pt-1">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> Coupon Applied: {appliedCoupon}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setAppliedCoupon('');
                          setDiscountAmount(0);
                          setCouponCode('');
                          setCouponError('');
                        }}
                        className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-sans cursor-pointer ml-2"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  )}
                  {couponError && (
                    <p className="text-xs text-red-500">{couponError}</p>
                  )}
                </form>

                {/* Custom Note */}
                <div className="space-y-2 pt-4 border-t border-[#e8e2d9]">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-[#39322f] uppercase tracking-wider">
                    <FileText className="w-3.5 h-3.5 text-[#d4a373]" />
                    <span>Custom Note / Sizing Instructions</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Add special instructions or fitting preferences..."
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    className="w-full p-3 bg-white border border-[#e8e2d9] rounded-xl text-xs font-sans text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  />
                </div>

                {/* Calculations Breakdown */}
                <div className="space-y-3 pt-4 border-t border-[#e8e2d9] text-xs font-sans text-[#39322f]">
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

                  <div className="flex justify-between">
                    <span className="text-[#39322f]/70">Estimated Shipping</span>
                    <span className="font-semibold">
                      {!storeSettings ? (
                        <span className="text-gray-400 text-xs font-sans animate-pulse">Loading...</span>
                      ) : isFreeShipping ? (
                        'FREE'
                      ) : (
                        `₹${configuredShippingFee.toLocaleString('en-IN')}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between font-serif font-bold text-lg text-[#39322f] pt-3 border-t border-[#e8e2d9]">
                    <span>Total Amount</span>
                    <span>
                      {!storeSettings ? (
                        <span className="text-gray-400 text-sm font-sans animate-pulse">Calculating...</span>
                      ) : (
                        `₹${finalTotal.toLocaleString('en-IN')}`
                      )}
                    </span>
                  </div>
                </div>

                <div className="bg-[#f7f3ee] p-4 rounded-xl text-[11px] text-[#39322f]/70 font-sans space-y-2">
                  <div className="flex items-center gap-2 text-[#39322f] font-semibold">
                    <ShieldCheck className="w-4 h-4 text-[#d4a373]" />
                    <span>100% Encrypted & Secure Checkout</span>
                  </div>
                  <p>Guaranteed authentic silk and handcrafted embroidery directly from Suranghi Naar Atelier, Jaipur.</p>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* Order Confirmation Modal */}
      {placedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#d4a373]/30 rounded-3xl max-w-md w-full p-8 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-[#d4a373]/15 text-[#b58349] rounded-full flex items-center justify-center mx-auto border border-[#d4a373]/40">
              <Sparkles className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#b58349]">Order Confirmed</span>
              <h3 className="font-cinzel text-2xl font-bold text-[#2d2624] mt-1">Thank You for Shopping!</h3>
              <p className="text-xs text-gray-600 font-sans mt-2">
                Your order <span className="font-mono font-bold text-[#39322f]">{placedOrder.id}</span> has been successfully placed.
              </p>
            </div>

            <div className="bg-[#f8f4ee] border border-[#e8e2d9] rounded-2xl p-4 text-xs font-sans text-[#39322f] space-y-1.5 text-left">
              <p className="flex justify-between">
                <span className="text-gray-500">Total Amount:</span>
                <span className="font-bold text-[#b58349]">₹{placedOrder.total?.toLocaleString()}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="font-bold text-emerald-700">● {placedOrder.status}</span>
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Link
                to="/shop"
                onClick={() => setPlacedOrder(null)}
                className="flex-1 bg-[#39322f] hover:bg-[#d4a373] text-[#f7f3ee] hover:text-[#39322f] font-semibold py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-all"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

