import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { staticCatalog } from '../data/staticCatalog';
import { OFFLINE_DEMO } from '../config/demoMode';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState(staticCatalog.products);
  const [categories, setCategories] = useState(staticCatalog.categories);
  const [heroSlides, setHeroSlides] = useState(staticCatalog.heroSlides);
  const [promoMessages, setPromoMessages] = useState(staticCatalog.promoMessages);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [discountCodes, setDiscountCodes] = useState(staticCatalog.discountCodes);
  const [storeSettings, setStoreSettings] = useState(staticCatalog.storeSettings);
  const [loading, setLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);

  const localMode = OFFLINE_DEMO || !backendOnline;

  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isAgeVerified, setIsAgeVerified] = useState(() => {
    return localStorage.getItem('surangi_age_verified') === 'true';
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadGuestCartAndWishlist = () => {
    const savedCart = localStorage.getItem('surangi_guest_cart');
    const savedWishlist = localStorage.getItem('surangi_guest_wishlist');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        setCart([]);
      }
    }
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch {
        setWishlist([]);
      }
    }
  };

  const persistGuestCart = (updated) => {
    localStorage.setItem('surangi_guest_cart', JSON.stringify(updated));
    return updated;
  };

  const fetchInitialData = async () => {
    if (OFFLINE_DEMO) return;

    try {
      const [prodRes, catRes, heroRes, promoRes, settingsRes, couponRes] = await Promise.allSettled([
        api.get('/products'),
        api.get('/categories'),
        api.get('/hero-slides'),
        api.get('/promo-messages'),
        api.get('/store-settings'),
        api.get('/coupons'),
      ]);

      const anyOk = [prodRes, catRes, heroRes, promoRes, settingsRes, couponRes].some(
        (r) => r.status === 'fulfilled'
      );
      if (anyOk) setBackendOnline(true);

      if (prodRes.status === 'fulfilled' && prodRes.value.data?.products) {
        setProducts(prodRes.value.data.products);
      }
      if (catRes.status === 'fulfilled' && catRes.value.data?.categories) {
        setCategories(catRes.value.data.categories);
      }
      if (heroRes.status === 'fulfilled' && heroRes.value.data?.heroSlides) {
        setHeroSlides(heroRes.value.data.heroSlides);
      }
      if (promoRes.status === 'fulfilled' && promoRes.value.data?.promoMessages) {
        const msgs = promoRes.value.data.promoMessages.map((m) => (typeof m === 'string' ? m : m.message));
        setPromoMessages(msgs);
      }
      if (settingsRes.status === 'fulfilled' && settingsRes.value.data?.settings) {
        setStoreSettings(settingsRes.value.data.settings);
      }
      if (couponRes.status === 'fulfilled' && couponRes.value.data?.discounts) {
        setDiscountCodes(couponRes.value.data.discounts);
      }
    } catch (err) {
      console.error('Error fetching initial public catalog data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGuestCartAndWishlist();
    if (!OFFLINE_DEMO) {
      fetchInitialData();
    }
  }, []);

  useEffect(() => {
    const initUserSession = async () => {
      if (localMode) return;

      const token = localStorage.getItem('surangi_access_token') || sessionStorage.getItem('surangi_access_token');
      if (!token) {
        loadGuestCartAndWishlist();
        return;
      }

      try {
        const [userRes, cartRes, wishRes] = await Promise.allSettled([
          api.get('/users/me'),
          api.get('/cart'),
          api.get('/wishlist'),
        ]);

        if (userRes.status === 'fulfilled' && userRes.value.data?.user) {
          setCurrentUser(userRes.value.data.user);

          if (cartRes.status === 'fulfilled' && cartRes.value.data?.cart) {
            const formattedCart = cartRes.value.data.cart.map((item) => ({
              id: item.id,
              product:
                item.product ||
                products.find((p) => p.id === item.productId) ||
                { id: item.productId, name: 'Product', price: 0, image: '' },
              color: { name: item.colorName, hex: '#C8960C' },
              size: item.size,
              quantity: item.quantity,
            }));
            setCart(formattedCart);
          }

          if (wishRes.status === 'fulfilled' && wishRes.value.data?.wishlist) {
            const wishIds = wishRes.value.data.wishlist.map((p) => (typeof p === 'string' ? p : p.id));
            setWishlist(wishIds);
          }
        } else {
          localStorage.removeItem('surangi_access_token');
          localStorage.removeItem('surangi_refresh_token');
          loadGuestCartAndWishlist();
        }
      } catch (err) {
        console.error('Error initializing user session:', err);
        localStorage.removeItem('surangi_access_token');
        localStorage.removeItem('surangi_refresh_token');
        loadGuestCartAndWishlist();
      }
    };

    initUserSession();
  }, [localMode]);

  const fetchUserCartAndWishlist = async () => {
    if (localMode) {
      loadGuestCartAndWishlist();
      return;
    }
    try {
      const [cartRes, wishRes] = await Promise.all([api.get('/cart'), api.get('/wishlist')]);

      if (cartRes.data?.cart) {
        const formattedCart = cartRes.data.cart.map((item) => ({
          id: item.id,
          product:
            item.product ||
            products.find((p) => p.id === item.productId) ||
            { id: item.productId, name: 'Product', price: 0, image: '' },
          color: { name: item.colorName, hex: '#C8960C' },
          size: item.size,
          quantity: item.quantity,
        }));
        setCart(formattedCart);
      }

      if (wishRes.data?.wishlist) {
        const wishIds = wishRes.data.wishlist.map((p) => (typeof p === 'string' ? p : p.id));
        setWishlist(wishIds);
      }
    } catch (err) {
      console.error('Error fetching user cart/wishlist:', err);
    }
  };

  const fetchUserOrders = async () => {
    if (localMode || !currentUser || currentUser.role === 'admin') return;
    try {
      const res = await api.get('/orders');
      if (res.data?.orders) setOrders(res.data.orders);
    } catch (err) {
      console.error('Error fetching user orders:', err);
    }
  };

  const fetchCustomers = async () => {
    if (localMode) return;
    try {
      const res = await api.get('/admin/customers');
      if (res.data?.customers) setCustomers(res.data.customers);
    } catch (err) {
      console.error('Error fetching admin customers:', err);
    }
  };

  const fetchAdminOrders = async () => {
    if (localMode) return;
    try {
      const res = await api.get('/admin/orders');
      if (res.data?.orders) setOrders(res.data.orders);
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    }
  };

  const fetchDiscountCodes = async () => {
    if (localMode) return discountCodes;
    try {
      const adminToken = sessionStorage.getItem('surangi_admin_token');
      const endpoint = adminToken ? '/admin/discounts' : '/coupons';
      const res = await api.get(endpoint);
      if (res.data?.discounts) {
        setDiscountCodes(res.data.discounts);
        return res.data.discounts;
      }
    } catch (err) {
      console.error('Error fetching discount codes:', err);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin' && !localMode) {
      fetchUserOrders();
    }
  }, [currentUser, localMode]);

  const mergeGuestCart = async () => {
    if (localMode) return;
    const guestCartStr = localStorage.getItem('surangi_guest_cart');
    if (!guestCartStr) return;
    try {
      const guestItems = JSON.parse(guestCartStr);
      await Promise.all(
        guestItems.map((item) => {
          if (item.product?.id) {
            return api.post('/cart', {
              productId: item.product.id,
              colorName: item.color?.name || 'Standard',
              size: item.size || 'Standard',
              quantity: item.quantity || 1,
            });
          }
          return Promise.resolve();
        })
      );
      localStorage.removeItem('surangi_guest_cart');
    } catch (e) {
      console.error('Error merging guest cart:', e);
    }
  };

  const loginWithEmail = async (email, password, rememberMe = true) => {
    if (localMode) {
      toast.info('Demo mode — login disabled. Browse, cart & checkout work without account.');
      throw new Error('Demo mode');
    }
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.token) {
        if (rememberMe) {
          localStorage.setItem('surangi_access_token', res.data.token);
          localStorage.setItem('surangi_refresh_token', res.data.refreshToken);
          localStorage.setItem('surangi_remembered_email', email);
          sessionStorage.removeItem('surangi_access_token');
          sessionStorage.removeItem('surangi_refresh_token');
        } else {
          sessionStorage.setItem('surangi_access_token', res.data.token);
          sessionStorage.setItem('surangi_refresh_token', res.data.refreshToken);
          localStorage.removeItem('surangi_access_token');
          localStorage.removeItem('surangi_refresh_token');
          localStorage.removeItem('surangi_remembered_email');
        }
        setCurrentUser(res.data.user);
        await mergeGuestCart();
        await fetchUserCartAndWishlist();
        closeAuthModal();
        toast.success('Signed in successfully!');
        return res.data.user;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
      throw err;
    }
  };

  const registerWithEmail = async (name, email, phone, password) => {
    if (localMode) {
      toast.info('Demo mode — registration disabled.');
      throw new Error('Demo mode');
    }
    try {
      const res = await api.post('/auth/register', { name, email, phone, password });
      if (res.data?.token) {
        localStorage.setItem('surangi_access_token', res.data.token);
        localStorage.setItem('surangi_refresh_token', res.data.refreshToken);
        setCurrentUser(res.data.user);
        await mergeGuestCart();
        await fetchUserCartAndWishlist();
        closeAuthModal();
        toast.success('Account created successfully!');
        return res.data.user;
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Registration failed.';
      toast.error(errMsg);
      throw err;
    }
  };

  const loginWithGoogle = async (credential) => {
    if (localMode) {
      toast.info('Demo mode — Google login disabled.');
      throw new Error('Demo mode');
    }
    try {
      const res = await api.post('/auth/google', { credential });
      if (res.data?.token) {
        localStorage.setItem('surangi_access_token', res.data.token);
        localStorage.setItem('surangi_refresh_token', res.data.refreshToken);
        setCurrentUser(res.data.user);
        await mergeGuestCart();
        await fetchUserCartAndWishlist();
        closeAuthModal();
        toast.success('Google login successful!');
        return res.data.user;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Google Login failed.';
      toast.error(msg);
      throw err;
    }
  };

  const logoutUser = async () => {
    if (!localMode) {
      try {
        await api.post('/auth/logout');
      } catch {
        /* ignore */
      }
    }
    localStorage.removeItem('surangi_access_token');
    localStorage.removeItem('surangi_refresh_token');
    sessionStorage.removeItem('surangi_access_token');
    sessionStorage.removeItem('surangi_refresh_token');
    setCurrentUser(null);
    setCart([]);
    setWishlist([]);
    setOrders([]);
    closeAccountModal();
    toast.success('Signed out successfully');
  };

  const addToCart = async (product, color = null, size = null, quantity = 1) => {
    const chosenColor =
      color ||
      (product.colorVariants && product.colorVariants[0]) ||
      (product.colors && product.colors[0]) ||
      { name: 'Standard Pack', hex: '#C8960C' };
    const chosenSize = size || (product.sizes && product.sizes[0]) || 'Standard';

    if (localMode) {
      setCart((prev) => {
        const idx = prev.findIndex(
          (i) =>
            i.product?.id === product.id &&
            i.color?.name === chosenColor.name &&
            i.size === chosenSize
        );
        let updated;
        if (idx >= 0) {
          updated = [...prev];
          updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + quantity };
        } else {
          updated = [
            ...prev,
            {
              id: `local-${product.id}-${chosenColor.name}-${chosenSize}`,
              product,
              color: chosenColor,
              size: chosenSize,
              quantity,
            },
          ];
        }
        return persistGuestCart(updated);
      });
      setIsCartOpen(true);
      toast.success('Added to cart!');
      return;
    }

    if (!currentUser) {
      toast.error('Please sign in to add items to your cart');
      openAuthModal('login');
      return;
    }

    try {
      await api.post('/cart', {
        productId: product.id,
        colorName: chosenColor.name,
        size: chosenSize,
        quantity,
      });
      await fetchUserCartAndWishlist();
      setIsCartOpen(true);
      toast.success('Added to cart!');
    } catch (err) {
      console.error('Error adding to server cart:', err);
      toast.error('Failed to add item to cart');
    }
  };

  const removeFromCart = async (indexOrId) => {
    if (!localMode && currentUser) {
      const itemToDelete = cart[indexOrId] || cart.find((c) => c.id === indexOrId);
      if (itemToDelete?.id && !String(itemToDelete.id).startsWith('local-')) {
        try {
          await api.delete(`/cart/${itemToDelete.id}`);
          await fetchUserCartAndWishlist();
          return;
        } catch (err) {
          console.error('Error removing cart item:', err);
        }
      }
    }
    setCart((prev) => {
      const updated = prev.filter((_, i) => i !== indexOrId && prev[i]?.id !== indexOrId);
      if (localMode || !currentUser) persistGuestCart(updated);
      return updated;
    });
  };

  const updateQuantity = async (indexOrId, delta) => {
    const targetItem = cart[indexOrId] || cart.find((c) => c.id === indexOrId);
    if (!targetItem) return;
    const newQty = targetItem.quantity + delta;

    if (!localMode && currentUser && targetItem.id && !String(targetItem.id).startsWith('local-')) {
      try {
        if (newQty <= 0) await api.delete(`/cart/${targetItem.id}`);
        else await api.put(`/cart/${targetItem.id}`, { quantity: newQty });
        await fetchUserCartAndWishlist();
        return;
      } catch (err) {
        console.error('Error updating quantity:', err);
      }
    }

    setCart((prev) => {
      const idx = typeof indexOrId === 'number' ? indexOrId : prev.findIndex((item) => item.id === indexOrId);
      if (idx === -1) return prev;
      if (newQty <= 0) {
        const filtered = prev.filter((_, i) => i !== idx);
        if (localMode || !currentUser) persistGuestCart(filtered);
        return filtered;
      }
      const updated = [...prev];
      updated[idx] = { ...updated[idx], quantity: newQty };
      if (localMode || !currentUser) persistGuestCart(updated);
      return updated;
    });
  };

  const clearCart = async () => {
    if (!localMode && currentUser) {
      try {
        await api.delete('/cart');
      } catch (err) {
        console.error('Error clearing cart:', err);
      }
    }
    setCart([]);
    localStorage.removeItem('surangi_guest_cart');
  };

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1), 0);

  const toggleWishlist = async (productId) => {
    if (localMode) {
      setWishlist((prev) => {
        const next = prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId];
        localStorage.setItem('surangi_guest_wishlist', JSON.stringify(next));
        toast.success(prev.includes(productId) ? 'Removed from wishlist' : 'Added to wishlist!');
        return next;
      });
      return;
    }

    if (!currentUser) {
      toast.error('Please sign in to save items to your wishlist');
      openAuthModal('login');
      return;
    }

    try {
      const res = await api.post('/wishlist', { productId });
      if (res.data?.added) {
        setWishlist((prev) => [...prev, productId]);
        toast.success('Added to wishlist!');
      } else {
        setWishlist((prev) => prev.filter((id) => id !== productId));
        toast.success('Removed from wishlist');
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
      toast.error('Failed to update wishlist');
    }
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  const validateCoupon = useCallback(
    async (code, cartSubtotalAmount) => {
      if (localMode) {
        const normalized = String(code || '').trim().toUpperCase();
        const coupon = discountCodes.find(
          (c) => c.code.toUpperCase() === normalized && c.isActive !== false
        );
        if (!coupon) return { valid: false, message: 'Invalid coupon code' };
        if (coupon.minSpend && cartSubtotalAmount < coupon.minSpend) {
          return { valid: false, message: `Minimum order ₹${coupon.minSpend} required` };
        }
        const discountAmount = Math.round((cartSubtotalAmount * coupon.discountPercent) / 100);
        return {
          valid: true,
          code: coupon.code,
          discountPercent: coupon.discountPercent,
          discountAmount,
          message: coupon.description || 'Coupon applied',
        };
      }

      try {
        const res = await api.post('/coupons/validate', { code, cartSubtotal: cartSubtotalAmount });
        return res.data;
      } catch (err) {
        return { valid: false, message: err.response?.data?.message || 'Invalid coupon code' };
      }
    },
    [localMode, discountCodes]
  );

  const addProduct = async (newProdData) => {
    if (localMode) throw new Error('Admin actions disabled in demo mode');
    try {
      const res = await api.post('/admin/products', newProdData);
      if (res.data?.product) {
        setProducts((prev) => [res.data.product, ...prev]);
        return res.data.product;
      }
    } catch (err) {
      console.error('Error adding product:', err);
      throw err;
    }
  };

  const updateProduct = async (id, updatedFields) => {
    if (localMode) throw new Error('Admin actions disabled in demo mode');
    try {
      const res = await api.put(`/admin/products/${id}`, updatedFields);
      if (res.data?.product) setProducts((prev) => prev.map((p) => (p.id === id ? res.data.product : p)));
    } catch (err) {
      console.error('Error updating product:', err);
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    if (localMode) throw new Error('Admin actions disabled in demo mode');
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      throw err;
    }
  };

  const addCategory = async (catData) => {
    if (localMode) throw new Error('Admin actions disabled in demo mode');
    try {
      const res = await api.post('/admin/categories', catData);
      if (res.data?.category) setCategories((prev) => [...prev, res.data.category]);
    } catch (err) {
      console.error('Error adding category:', err);
      throw err;
    }
  };

  const updateCategory = async (id, updatedFields) => {
    if (localMode) throw new Error('Admin actions disabled in demo mode');
    try {
      const res = await api.put(`/admin/categories/${id}`, updatedFields);
      if (res.data?.category) setCategories((prev) => prev.map((c) => (c.id === id ? res.data.category : c)));
    } catch (err) {
      console.error('Error updating category:', err);
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    if (localMode) throw new Error('Admin actions disabled in demo mode');
    try {
      await api.delete(`/admin/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Error deleting category:', err);
      throw err;
    }
  };

  const updateHeroSlides = async (newSlides) => {
    if (localMode) throw new Error('Admin actions disabled in demo mode');
    try {
      const res = await api.put('/admin/hero-slides', { slides: newSlides });
      if (res.data?.slides) setHeroSlides(res.data.slides);
    } catch (err) {
      console.error('Error updating hero slides:', err);
      throw err;
    }
  };

  const addHeroSlide = async (slideData) => {
    if (localMode) throw new Error('Admin actions disabled in demo mode');
    try {
      const res = await api.post('/admin/hero-slides', slideData);
      if (res.data?.slide) setHeroSlides((prev) => [...prev, res.data.slide]);
    } catch (err) {
      console.error('Error adding hero slide:', err);
      throw err;
    }
  };

  const deleteHeroSlide = async (id) => {
    if (localMode) throw new Error('Admin actions disabled in demo mode');
    try {
      await api.delete(`/admin/hero-slides/${id}`);
      setHeroSlides((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Error deleting hero slide:', err);
      throw err;
    }
  };

  const updatePromoMessages = async (messages) => {
    if (localMode) throw new Error('Admin actions disabled in demo mode');
    try {
      const res = await api.put('/admin/promo-messages', { messages });
      if (res.data?.messages) {
        const msgs = res.data.messages.map((m) => (typeof m === 'string' ? m : m.message));
        setPromoMessages(msgs);
      }
    } catch (err) {
      console.error('Error updating promo messages:', err);
      throw err;
    }
  };

  const addPromoMessage = async (msg) => {
    if (localMode) throw new Error('Admin actions disabled in demo mode');
    try {
      const res = await api.post('/admin/promo-messages', { message: msg });
      if (res.data?.promo) setPromoMessages((prev) => [...prev, res.data.promo.message]);
    } catch (err) {
      console.error('Error adding promo message:', err);
      throw err;
    }
  };

  const deletePromoMessage = async (indexOrId) => {
    if (localMode) throw new Error('Admin actions disabled in demo mode');
    try {
      if (typeof indexOrId === 'number' && promoMessages[indexOrId]) {
        await api.put('/admin/promo-messages', { messages: promoMessages.filter((_, i) => i !== indexOrId) });
        setPromoMessages((prev) => prev.filter((_, i) => i !== indexOrId));
      } else {
        await api.delete(`/admin/promo-messages/${indexOrId}`);
        setPromoMessages((prev) => prev.filter((m) => m.id !== indexOrId));
      }
    } catch (err) {
      console.error('Error deleting promo message:', err);
      throw err;
    }
  };

  const updateOrderStatus = async (orderId, newStatus, extraData = {}) => {
    if (localMode) throw new Error('Admin actions disabled in demo mode');
    try {
      const payload = typeof newStatus === 'object' ? newStatus : { status: newStatus, ...extraData };
      const res = await api.put(`/admin/orders/${orderId}/status`, payload);
      if (res.data?.order) setOrders((prev) => prev.map((o) => (o.id === orderId ? res.data.order : o)));
    } catch (err) {
      console.error('Error updating order status:', err);
      throw err;
    }
  };

  const cancelUserOrder = async (orderId, reason) => {
    if (localMode) throw new Error('Not available in demo mode');
    try {
      const res = await api.put(`/orders/${orderId}/cancel`, { reason });
      if (res.data?.order) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? res.data.order : o)));
        toast.success('Order cancelled successfully');
        return res.data.order;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
      throw err;
    }
  };

  const cancelAdminOrder = async (orderId, reason) => {
    if (localMode) throw new Error('Admin actions disabled in demo mode');
    try {
      const res = await api.put(`/admin/orders/${orderId}/cancel`, { reason });
      if (res.data?.order) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? res.data.order : o)));
        toast.success('Order cancelled by admin');
        return res.data.order;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
      throw err;
    }
  };

  const submitProductReview = async (productId, reviewData) => {
    if (localMode) {
      toast.success('Demo mode — review saved locally for preview only.');
      return { id: `demo-${Date.now()}`, ...reviewData };
    }
    try {
      const res = await api.post(`/products/${productId}/reviews`, reviewData);
      if (res.data?.review) {
        const prodRes = await api.get(`/products/${productId}`);
        if (prodRes.data?.product) {
          setProducts((prev) => prev.map((p) => (p.id === productId ? prodRes.data.product : p)));
        }
        toast.success('Review submitted successfully!');
        return res.data.review;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
      throw err;
    }
  };

  const fetchProductReviews = async (productId, page = 1) => {
    if (localMode) return { reviews: [], pagination: { total: 0, totalPages: 1 } };
    try {
      const res = await api.get(`/products/${productId}/reviews?page=${page}`);
      return res.data;
    } catch (err) {
      console.error('Error fetching product reviews:', err);
      return { reviews: [], pagination: { total: 0, totalPages: 1 } };
    }
  };

  const addOrder = async (orderData) => {
    if (localMode) {
      const demoOrder = {
        id: `DEMO-${Date.now().toString(36).toUpperCase()}`,
        total: orderData.total,
        status: 'Demo Placed',
        paymentMethod: 'Demo (No Payment)',
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        customerAddress: orderData.customerAddress,
        items: orderData.items,
        createdAt: new Date().toISOString(),
      };
      await clearCart();
      toast.success('Demo order placed! Share this UI preview with your client.');
      return demoOrder;
    }

    try {
      const res = await api.post('/orders', orderData);
      if (res.data?.order) {
        const created = res.data.order;
        const methodStr = (orderData.paymentMethod || '').toLowerCase();
        const isCOD = methodStr.includes('cash on delivery') || methodStr.includes('cod');

        if (isCOD) {
          setOrders((prev) => [created, ...prev]);
          clearCart();
          toast.success('Order placed successfully!');
          if (currentUser && currentUser.role !== 'admin') await fetchUserOrders();
        }
        return created;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initialize order.');
      throw err;
    }
  };

  const addDiscountCode = async (codeData) => {
    if (localMode) throw new Error('Admin actions disabled in demo mode');
    try {
      const res = await api.post('/admin/discounts', codeData);
      if (res.data?.discount) {
        setDiscountCodes((prev) => [res.data.discount, ...prev.filter((d) => d.code !== res.data.discount.code)]);
        await fetchDiscountCodes();
        return res.data.discount;
      }
    } catch (err) {
      console.error('Error adding discount code:', err);
      throw err;
    }
  };

  const toggleDiscountCode = async (codeStr) => {
    if (localMode) throw new Error('Admin actions disabled in demo mode');
    try {
      const current = (discountCodes || []).find((d) => d.code === codeStr);
      const res = await api.put(`/admin/discounts/${codeStr}`, { isActive: !current?.isActive });
      if (res.data?.discount) {
        setDiscountCodes((prev) => prev.map((d) => (d.code === codeStr ? res.data.discount : d)));
        await fetchDiscountCodes();
        return res.data.discount;
      }
    } catch (err) {
      console.error('Error toggling discount code:', err);
      throw err;
    }
  };

  const updateDiscountCode = async (codeStr, updatedFields) => {
    if (localMode) throw new Error('Admin actions disabled in demo mode');
    try {
      const res = await api.put(`/admin/discounts/${codeStr}`, updatedFields);
      if (res.data?.discount) {
        setDiscountCodes((prev) => prev.map((d) => (d.code === codeStr ? res.data.discount : d)));
        await fetchDiscountCodes();
        return res.data.discount;
      }
    } catch (err) {
      console.error('Error updating discount code:', err);
      throw err;
    }
  };

  const deleteDiscountCode = async (codeStr) => {
    if (localMode) throw new Error('Admin actions disabled in demo mode');
    try {
      await api.delete(`/admin/discounts/${codeStr}`);
      setDiscountCodes((prev) => prev.filter((d) => d.code !== codeStr));
      await fetchDiscountCodes();
    } catch (err) {
      console.error('Error deleting discount code:', err);
      throw err;
    }
  };

  const updateStoreSettings = async (newSettings) => {
    if (localMode) throw new Error('Admin actions disabled in demo mode');
    try {
      const res = await api.put('/admin/store-settings', newSettings);
      if (res.data?.settings) setStoreSettings(res.data.settings);
    } catch (err) {
      console.error('Error updating store settings:', err);
      throw err;
    }
  };

  const refreshData = async () => {
    await fetchInitialData();
  };

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);
  const openAccountModal = () => setIsAccountModalOpen(true);
  const closeAccountModal = () => setIsAccountModalOpen(false);

  const handleConfirmAge = (is18Plus) => {
    if (is18Plus) {
      localStorage.setItem('surangi_age_verified', 'true');
      setIsAgeVerified(true);
      toast.success('Welcome to Shudh Desi Ghee!');
    } else {
      toast.error('You must be 18 or older to browse this store.');
    }
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        allProducts: products,
        categories,
        heroSlides,
        promoMessages,
        orders,
        setOrders,
        customers,
        setCustomers,
        fetchCustomers,
        fetchAdminOrders,
        fetchDiscountCodes,
        discountCodes,
        setDiscountCodes,
        storeSettings,
        loading,
        backendOnline,
        localMode,

        currentUser,
        setCurrentUser,
        fetchUserOrders,
        isAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        isAccountModalOpen,
        openAuthModal,
        closeAuthModal,
        openAccountModal,
        closeAccountModal,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logoutUser,

        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        quickViewProduct,
        setQuickViewProduct,
        isAgeVerified,
        handleConfirmAge,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        validateCoupon,

        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        updateHeroSlides,
        addHeroSlide,
        deleteHeroSlide,
        updatePromoMessages,
        addPromoMessage,
        deletePromoMessage,
        updateOrderStatus,
        cancelUserOrder,
        cancelAdminOrder,
        submitProductReview,
        fetchProductReviews,
        addOrder,
        addDiscountCode,
        updateDiscountCode,
        toggleDiscountCode,
        deleteDiscountCode,
        updateStoreSettings,
        refreshData,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};
