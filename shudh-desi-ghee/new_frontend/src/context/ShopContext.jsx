import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ShopContext } from './shop-context';
import toast from 'react-hot-toast';
import api from '../services/api';
import { brand, MAX_LINE_QUANTITY, MOCK_DISABLED_MESSAGE, offlineDemo, paymentMethods, storageKeys, useMockData } from '../config/brand';
import { mockGet } from '../mocks/catalog';
import { defaultSwatch, swatchFor } from '../utils/swatch';

const SECTION_KEYS = ['products', 'categories', 'hero', 'promo', 'settings', 'coupons'];

function sectionState(status, error = null) {
  return Object.fromEntries(SECTION_KEYS.map((key) => [key, { status, error }]));
}

function errorMessage(err, fallback) {
  return err?.response?.data?.message || err?.message || fallback;
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [promoMessages, setPromoMessages] = useState([]);
  const [discountCodes, setDiscountCodes] = useState([]);
  const [storeSettings, setStoreSettings] = useState(null);
  const [sections, setSections] = useState(() => sectionState('loading'));
  const [orders, setOrders] = useState([]);
  const [ordersStatus, setOrdersStatus] = useState('idle');
  const [ordersError, setOrdersError] = useState(null);
  const [lastServerOrder, setLastServerOrder] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const [cart, setCart] = useState(() => readJson(storageKeys.guestCart, []));
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState(() => readJson(storageKeys.guestWishlist, []));
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const productsRef = useRef([]);
  useEffect(() => {
    productsRef.current = products;
  }, [products]);

  const usesServerCart = Boolean(currentUser) && !offlineDemo && !useMockData;

  const markSection = (key, status, error = null) => {
    setSections((prev) => ({ ...prev, [key]: { status, error } }));
  };

  const formatServerCart = (rows) =>
    rows.map((item) => {
      const product =
        item.product ||
        productsRef.current.find((entry) => entry.id === item.productId) ||
        { id: item.productId, name: 'Product', price: 0, image: '' };
      return {
        id: item.id,
        product,
        color: swatchFor(product, item.colorName),
        size: item.size,
        quantity: item.quantity,
      };
    });

  const loadGuestCart = () => setCart(readJson(storageKeys.guestCart, []));
  const loadGuestWishlist = () => setWishlist(readJson(storageKeys.guestWishlist, []));

  const persistGuestCart = (updated) => {
    localStorage.setItem(storageKeys.guestCart, JSON.stringify(updated));
    return updated;
  };

  const loadCatalog = useCallback(async (options) => {
    if (!useMockData && offlineDemo) {
      const message = 'Offline demo is on. Live catalog is not loaded.';
      setProducts([]);
      setCategories([]);
      setHeroSlides([]);
      setPromoMessages([]);
      setStoreSettings(null);
      setDiscountCodes([]);
      setSections(sectionState('error', message));
      return;
    }

    if (!options?.quiet) setSections(sectionState('loading'));

    const get = useMockData ? mockGet : (path) => api.get(path);
    const jobs = [
      ['products', () => get('/products'), (res) => setProducts(res.data?.products || [])],
      ['categories', () => get('/categories'), (res) => setCategories(res.data?.categories || [])],
      ['hero', () => get('/hero-slides'), (res) => setHeroSlides(res.data?.heroSlides || [])],
      ['promo', () => get('/promo-messages'), (res) => {
        const rows = res.data?.promoMessages || [];
        setPromoMessages(rows.map((row) => (typeof row === 'string' ? row : row.message)));
      }],
      ['settings', () => get('/store-settings'), (res) => setStoreSettings(res.data?.settings || null)],
      ['coupons', () => get('/coupons'), (res) => setDiscountCodes(res.data?.discounts || [])],
    ];

    await Promise.all(
      jobs.map(async ([key, request, apply]) => {
        try {
          const res = await request();
          apply(res);
          markSection(key, 'ready');
        } catch (err) {
          if (key === 'products') setProducts([]);
          if (key === 'categories') setCategories([]);
          if (key === 'hero') setHeroSlides([]);
          if (key === 'promo') setPromoMessages([]);
          if (key === 'settings') setStoreSettings(null);
          if (key === 'coupons') setDiscountCodes([]);
          markSection(key, 'error', errorMessage(err, `Could not load ${key}`));
        }
      })
    );
  }, []);

  const fetchUserCartAndWishlist = useCallback(async () => {
    if (!usesServerCart) {
      loadGuestCart();
      loadGuestWishlist();
      return;
    }
    try {
      const [cartRes, wishRes] = await Promise.all([api.get('/cart'), api.get('/wishlist')]);
      if (cartRes.data?.cart) setCart(formatServerCart(cartRes.data.cart));
      if (wishRes.data?.wishlist) {
        setWishlist(wishRes.data.wishlist.map((entry) => (typeof entry === 'string' ? entry : entry.id)));
      }
    } catch (err) {
      toast.error(errorMessage(err, 'Could not load your bag'));
    }
  }, [usesServerCart]);

  const catalogStamp = products.map((item) => item.id).join('|');
  const [hydratedStamp, setHydratedStamp] = useState('');
  if (catalogStamp && catalogStamp !== hydratedStamp) {
    setHydratedStamp(catalogStamp);
    setCart((prev) => prev.map((item) => {
      const product = products.find((entry) => entry.id === item.product?.id) || item.product;
      return { ...item, product, color: swatchFor(product, item.color?.name) };
    }));
  }

  useEffect(() => {
    // Mount-time catalog read. State updates run after the request, not as a render cascade.
    // eslint-disable-next-line react/set-state-in-effect
    loadCatalog({ quiet: true });
  }, [loadCatalog]);

  useEffect(() => {
    const initUserSession = async () => {
      if (offlineDemo || useMockData) return;
      const token = localStorage.getItem(storageKeys.accessToken) || sessionStorage.getItem(storageKeys.accessToken);
      if (!token) return;

      try {
        const userRes = await api.get('/users/me');
        if (userRes.data?.user) {
          setCurrentUser(userRes.data.user);
        }
      } catch (err) {
        localStorage.removeItem(storageKeys.accessToken);
        localStorage.removeItem(storageKeys.refreshToken);
        sessionStorage.removeItem(storageKeys.accessToken);
        sessionStorage.removeItem(storageKeys.refreshToken);
        toast.error(errorMessage(err, 'Session expired. Please sign in again.'));
      }
    };
    initUserSession();
  }, []);

  useEffect(() => {
    if (currentUser && !offlineDemo) {
      // eslint-disable-next-line react/set-state-in-effect
      fetchUserCartAndWishlist();
    }
  }, [currentUser, fetchUserCartAndWishlist]);

  const fetchUserOrders = useCallback(async () => {
    if (offlineDemo || useMockData || !currentUser || currentUser.role === 'admin') {
      setOrdersStatus('ready');
      return;
    }
    setOrdersStatus('loading');
    try {
      const res = await api.get('/orders');
      setOrders(res.data?.orders || []);
      setOrdersError(null);
      setOrdersStatus('ready');
    } catch (err) {
      const message = errorMessage(err, 'Could not load orders');
      setOrdersError(message);
      setOrdersStatus('error');
      toast.error(message);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin' && !offlineDemo) {
      // eslint-disable-next-line react/set-state-in-effect
      fetchUserOrders();
    }
  }, [currentUser, fetchUserOrders]);

  const mergeGuestCart = async () => {
    const guestItems = readJson(storageKeys.guestCart, []);
    if (!guestItems.length) return;
    try {
      await Promise.all(
        guestItems.map((item) => {
          if (!item.product?.id) return Promise.resolve();
          return api.post('/cart', {
            productId: item.product.id,
            colorName: item.color?.name || 'Standard',
            size: item.size || 'Standard',
            quantity: item.quantity || 1,
          });
        })
      );
      localStorage.removeItem(storageKeys.guestCart);
    } catch (err) {
      toast.error(errorMessage(err, 'Could not move your bag to this account'));
    }
  };

  const storeSession = (res, { rememberMe, email }) => {
    const target = rememberMe ? localStorage : sessionStorage;
    const other = rememberMe ? sessionStorage : localStorage;
    target.setItem(storageKeys.accessToken, res.data.token);
    target.setItem(storageKeys.refreshToken, res.data.refreshToken);
    other.removeItem(storageKeys.accessToken);
    other.removeItem(storageKeys.refreshToken);
    if (rememberMe && email) localStorage.setItem(storageKeys.rememberedEmail, email);
    if (!rememberMe) localStorage.removeItem(storageKeys.rememberedEmail);
    setCurrentUser(res.data.user);
  };

  const refuseMock = () => {
    toast.error(MOCK_DISABLED_MESSAGE);
    throw new Error(MOCK_DISABLED_MESSAGE);
  };

  const loginWithEmail = async (email, password, rememberMe = true) => {
    if (useMockData) return refuseMock();
    if (offlineDemo) {
      const message = 'Offline demo is on. Sign-in is disabled.';
      toast.error(message);
      throw new Error(message);
    }
    try {
      const res = await api.post('/auth/login', { email, password });
      if (!res.data?.token) throw new Error('Login did not return a token');
      storeSession(res, { rememberMe, email });
      await mergeGuestCart();
      closeAuthModal();
      toast.success('Signed in successfully');
      return res.data.user;
    } catch (err) {
      const message = errorMessage(err, 'Login failed. Check your email and password.');
      toast.error(message);
      throw err;
    }
  };

  const registerWithEmail = async (name, email, phone, password) => {
    if (useMockData) return refuseMock();
    if (offlineDemo) {
      const message = 'Offline demo is on. Registration is disabled.';
      toast.error(message);
      throw new Error(message);
    }
    try {
      const res = await api.post('/auth/register', { name, email, phone, password });
      if (!res.data?.token) throw new Error('Registration did not return a token');
      storeSession(res, { rememberMe: true, email });
      await mergeGuestCart();
      closeAuthModal();
      toast.success('Account created');
      return res.data.user;
    } catch (err) {
      const message = err.response?.data?.errors?.[0]?.message || errorMessage(err, 'Registration failed.');
      toast.error(message);
      throw err;
    }
  };

  const loginWithGoogle = async (credential) => {
    if (useMockData) return refuseMock();
    if (offlineDemo) {
      const message = 'Offline demo is on. Google sign-in is disabled.';
      toast.error(message);
      throw new Error(message);
    }
    try {
      const res = await api.post('/auth/google', { credential });
      if (!res.data?.token) throw new Error('Google sign-in did not return a token');
      storeSession(res, { rememberMe: true, email: res.data.user?.email });
      await mergeGuestCart();
      closeAuthModal();
      toast.success('Signed in with Google');
      return res.data.user;
    } catch (err) {
      const message = errorMessage(err, 'Google sign-in failed.');
      toast.error(message);
      throw err;
    }
  };

  const logoutUser = async () => {
    if (!offlineDemo && !useMockData) {
      try {
        await api.post('/auth/logout');
      } catch {
        /* server logout is a no-op today */
      }
    }
    localStorage.removeItem(storageKeys.accessToken);
    localStorage.removeItem(storageKeys.refreshToken);
    sessionStorage.removeItem(storageKeys.accessToken);
    sessionStorage.removeItem(storageKeys.refreshToken);
    setCurrentUser(null);
    setOrders([]);
    loadGuestCart();
    loadGuestWishlist();
    closeAccountModal();
    toast.success('Signed out');
  };

  const addToCart = async (product, color = null, size = null, quantity = 1) => {
    const chosenColor = color?.name ? swatchFor(product, color.name) : defaultSwatch(product);
    const chosenSize = size || product?.sizes?.[0] || 'Standard';

    if (!usesServerCart) {
      setCart((prev) => {
        const idx = prev.findIndex(
          (item) => item.product?.id === product.id && item.color?.name === chosenColor.name && item.size === chosenSize
        );
        const updated = [...prev];
        if (idx >= 0) {
          updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + quantity };
        } else {
          updated.push({
            id: `local-${product.id}-${chosenColor.name}-${chosenSize}`,
            product,
            color: chosenColor,
            size: chosenSize,
            quantity,
          });
        }
        return persistGuestCart(updated);
      });
      setIsCartOpen(true);
      toast.success('Added to bag');
      return true;
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
      toast.success('Added to bag');
      return true;
    } catch (err) {
      toast.error(errorMessage(err, 'Could not add this to your bag'));
      return false;
    }
  };

  const removeFromCart = async (indexOrId) => {
    const itemToDelete = cart[indexOrId] || cart.find((item) => item.id === indexOrId);
    if (usesServerCart && itemToDelete?.id && !String(itemToDelete.id).startsWith('local-')) {
      try {
        await api.delete(`/cart/${itemToDelete.id}`);
        await fetchUserCartAndWishlist();
        return;
      } catch (err) {
        toast.error(errorMessage(err, 'Could not remove that item'));
        return;
      }
    }
    setCart((prev) => {
      const updated = prev.filter((item, index) => index !== indexOrId && item.id !== indexOrId);
      if (!usesServerCart) persistGuestCart(updated);
      return updated;
    });
  };

  const updateQuantity = async (indexOrId, delta) => {
    const targetItem = cart[indexOrId] || cart.find((item) => item.id === indexOrId);
    if (!targetItem) return;
    if (delta > 0 && targetItem.quantity >= MAX_LINE_QUANTITY) return;
    const newQty = Math.min(MAX_LINE_QUANTITY, targetItem.quantity + delta);

    if (usesServerCart && targetItem.id && !String(targetItem.id).startsWith('local-')) {
      try {
        if (newQty <= 0) await api.delete(`/cart/${targetItem.id}`);
        else await api.put(`/cart/${targetItem.id}`, { quantity: newQty });
        await fetchUserCartAndWishlist();
      } catch (err) {
        toast.error(errorMessage(err, 'Could not update quantity'));
      }
      return;
    }

    setCart((prev) => {
      const idx = typeof indexOrId === 'number' ? indexOrId : prev.findIndex((item) => item.id === indexOrId);
      if (idx === -1) return prev;
      if (newQty <= 0) {
        const filtered = prev.filter((_, index) => index !== idx);
        if (!usesServerCart) persistGuestCart(filtered);
        return filtered;
      }
      const updated = [...prev];
      updated[idx] = { ...updated[idx], quantity: newQty };
      if (!usesServerCart) persistGuestCart(updated);
      return updated;
    });
  };

  const clearCart = async () => {
    if (usesServerCart) {
      try {
        await api.delete('/cart');
      } catch (err) {
        toast.error(errorMessage(err, 'Could not clear the bag'));
      }
    }
    setCart([]);
    localStorage.removeItem(storageKeys.guestCart);
  };

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1), 0);

  const shippingQuote = (() => {
    if (sections.settings.status !== 'ready' || !storeSettings) {
      return { known: false, message: 'Shipping calculated at checkout' };
    }
    const threshold = Number(storeSettings.freeShippingThreshold);
    const fee = Number(storeSettings.shippingFee);
    const qualifies = cartSubtotal >= threshold;
    return { known: true, fee: qualifies ? 0 : fee, threshold, qualifies };
  })();

  const toggleWishlist = async (productId) => {
    if (!usesServerCart) {
      setWishlist((prev) => {
        const next = prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId];
        localStorage.setItem(storageKeys.guestWishlist, JSON.stringify(next));
        toast.success(prev.includes(productId) ? 'Removed from wishlist' : 'Saved to wishlist');
        return next;
      });
      return;
    }

    try {
      const res = await api.post('/wishlist', { productId });
      if (res.data?.added) {
        setWishlist((prev) => [...prev, productId]);
        toast.success('Saved to wishlist');
      } else {
        setWishlist((prev) => prev.filter((id) => id !== productId));
        toast.success('Removed from wishlist');
      }
    } catch (err) {
      toast.error(errorMessage(err, 'Could not update the wishlist'));
    }
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  const validateCoupon = useCallback(
    async (code, cartSubtotalAmount) => {
      if (useMockData) {
        const normalized = String(code || '').trim().toUpperCase();
        const coupon = discountCodes.find((entry) => entry.code.toUpperCase() === normalized && entry.isActive !== false);
        if (!coupon) return { valid: false, message: 'Invalid or inactive promo code' };
        const subtotal = Number(cartSubtotalAmount) || 0;
        if (subtotal < coupon.minSpend) {
          return { valid: false, message: `Code ${coupon.code} requires a minimum order value of ₹${coupon.minSpend}` };
        }
        return {
          valid: true,
          code: coupon.code,
          discountPercent: coupon.discountPercent,
          discountAmount: Math.round((subtotal * coupon.discountPercent) / 100),
          description: coupon.description,
        };
      }
      if (offlineDemo || sections.coupons.status === 'error') {
        return { valid: false, message: sections.coupons.error || 'Offers are unavailable right now' };
      }
      try {
        const res = await api.post('/coupons/validate', { code, cartSubtotal: cartSubtotalAmount });
        return res.data;
      } catch (err) {
        return { valid: false, message: errorMessage(err, 'That code could not be applied') };
      }
    },
    [sections.coupons, discountCodes]
  );

  const submitProductReview = async (productId, reviewData) => {
    if (useMockData) return refuseMock();
    if (offlineDemo) {
      const message = 'Offline demo is on. Reviews are not saved.';
      toast.error(message);
      throw new Error(message);
    }
    try {
      const res = await api.post(`/products/${productId}/reviews`, reviewData);
      const prodRes = await api.get(`/products/${productId}`);
      if (prodRes.data?.product) {
        setProducts((prev) => prev.map((product) => (product.id === productId ? prodRes.data.product : product)));
      }
      toast.success('Review submitted');
      return res.data?.review;
    } catch (err) {
      const message = errorMessage(err, 'Could not submit the review');
      toast.error(message);
      throw err;
    }
  };

  const catalogGet = useCallback((path) => {
    if (useMockData) return mockGet(path);
    if (offlineDemo) return Promise.reject(new Error('Offline demo is on. Live catalog is not loaded.'));
    return api.get(path);
  }, []);

  const queryProducts = useCallback(async (params = {}) => {
    const search = new URLSearchParams();
    search.set('limit', '100');
    search.set('page', '1');
    ['categorySlug', 'search', 'minPrice', 'maxPrice', 'size'].forEach((key) => {
      if (params[key]) search.set(key, params[key]);
    });
    try {
      const res = await catalogGet(`/products?${search.toString()}`);
      return { products: res.data?.products || [], pagination: res.data?.pagination || null, error: null };
    } catch (err) {
      return { products: [], pagination: null, error: errorMessage(err, 'Could not load products') };
    }
  }, [catalogGet]);

  const fetchProduct = useCallback(async (id) => {
    try {
      const res = await catalogGet(`/products/${id}`);
      return { product: res.data?.product || null, missing: !res.data?.product, error: null };
    } catch (err) {
      if (err?.response?.status === 404) return { product: null, missing: true, error: null };
      return { product: null, missing: false, error: errorMessage(err, 'Could not load this product') };
    }
  }, [catalogGet]);

  const fetchProductReviews = useCallback(async (productId, page = 1, limit = 4) => {
    if (!useMockData && offlineDemo) {
      return { reviews: [], error: 'Offline demo is on. Reviews are not loaded.' };
    }
    try {
      const res = await catalogGet(`/products/${productId}/reviews?page=${page}&limit=${limit}`);
      return res.data;
    } catch (err) {
      return { reviews: [], error: errorMessage(err, 'Could not load reviews') };
    }
  }, [catalogGet]);

  const addOrder = async (orderData) => {
    if (useMockData) return refuseMock();
    if (offlineDemo) {
      const message = 'Offline demo is on. Orders are not placed.';
      toast.error(message);
      throw new Error(message);
    }
    if (orderData.paymentMethod !== paymentMethods.razorpay && orderData.paymentMethod !== paymentMethods.cod) {
      const message = 'Choose Prepaid (Razorpay) or Cash on Delivery (COD).';
      toast.error(message);
      throw new Error(message);
    }

    try {
      const res = await api.post('/orders', orderData);
      const created = res.data?.order;
      if (!created) throw new Error('The server did not return an order');
      setLastServerOrder(created);
      if (orderData.paymentMethod === paymentMethods.cod) {
        setOrders((prev) => [created, ...prev]);
        await clearCart();
        toast.success('Order placed');
        if (currentUser && currentUser.role !== 'admin') await fetchUserOrders();
      }
      return created;
    } catch (err) {
      const message = errorMessage(err, 'Could not place the order');
      toast.error(message);
      throw err;
    }
  };

  const cancelUserOrder = async (orderId, reason) => {
    if (offlineDemo) throw new Error('Offline demo is on.');
    try {
      const res = await api.put(`/orders/${orderId}/cancel`, { reason });
      if (res.data?.order) {
        setOrders((prev) => prev.map((order) => (order.id === orderId ? res.data.order : order)));
        toast.success('Order cancelled');
        return res.data.order;
      }
    } catch (err) {
      const message = errorMessage(err, 'Could not cancel the order');
      toast.error(message);
      throw err;
    }
  };

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };
  const closeAuthModal = () => setIsAuthModalOpen(false);
  const openAccountModal = () => setIsAccountModalOpen(true);
  const closeAccountModal = () => setIsAccountModalOpen(false);

  return (
    <ShopContext.Provider
      value={{
        products,
        categories,
        heroSlides,
        promoMessages,
        discountCodes,
        storeSettings,
        sections,
        shippingQuote,
        orders,
        ordersStatus,
        ordersError,
        lastServerOrder,
        loadCatalog,
        offlineDemo,
        useMockData,
        usesServerCart,
        guestCheckoutNote: brand.guestCheckoutNote,
        paymentMethods,

        currentUser,
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
        fetchUserOrders,
        replaceUser: (user) => {
          if (user) setCurrentUser(user);
        },

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
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        validateCoupon,
        queryProducts,
        fetchProduct,
        submitProductReview,
        fetchProductReviews,
        addOrder,
        cancelUserOrder,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

