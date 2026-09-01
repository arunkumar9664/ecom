import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useShop } from '../context/ShopContext';
import api from '../services/api';
import { getImageUrl } from '../utils/image';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Grid,
  Image as ImageIcon,
  Tag,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  Search,
  XCircle,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Save,
  Truck,
  Users,
  AlertTriangle
} from 'lucide-react';

export default function AdminPage() {
  const {
    products,
    categories,
    heroSlides,
    promoMessages,
    orders,
    customers,
    fetchCustomers,
    fetchAdminOrders,
    fetchDiscountCodes,
    discountCodes,
    storeSettings,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    addHeroSlide,
    deleteHeroSlide,
    updateHeroSlides,
    addPromoMessage,
    deletePromoMessage,
    updatePromoMessages,
    updateOrderStatus,
    cancelAdminOrder,
    addDiscountCode,
    updateDiscountCode,
    toggleDiscountCode,
    deleteDiscountCode,
    updateStoreSettings,
    refreshData
  } = useShop();

  // Authentication & Verification State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(true);

  // Verify Admin Token on Mount (Session-based)
  React.useEffect(() => {
    // Purge legacy persistent localStorage admin token if present
    localStorage.removeItem('surangi_admin_token');

    const verifyAdminSession = async () => {
      const token = sessionStorage.getItem('surangi_admin_token');
      if (!token) {
        setIsAuthenticated(false);
        setIsVerifyingAuth(false);
        return;
      }

      try {
        const res = await api.get('/admin/verify');
        if (res.data?.success) {
          setIsAuthenticated(true);
        } else {
          sessionStorage.removeItem('surangi_admin_token');
          sessionStorage.removeItem('surangi_admin_auth');
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Admin token verification failed:', err);
        sessionStorage.removeItem('surangi_admin_token');
        sessionStorage.removeItem('surangi_admin_auth');
        setIsAuthenticated(false);
      } finally {
        setIsVerifyingAuth(false);
      }
    };

    verifyAdminSession();
  }, []);

  const [adminEmailInput, setAdminEmailInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Active Tab State
  const [activeTab, setActiveTab] = useState('dashboard');

  // Customer Search State
  const [customerSearch, setCustomerSearch] = useState('');

  // Table Pagination States (10 items per page)
  const [productsPage, setProductsPage] = useState(1);
  const [ordersPage, setOrdersPage] = useState(1);
  const [categoriesPage, setCategoriesPage] = useState(1);
  const [customersPage, setCustomersPage] = useState(1);

  // Fetch registered customers, admin orders, and discount codes on auth or tab change
  React.useEffect(() => {
    if (isAuthenticated) {
      if (typeof fetchCustomers === 'function') fetchCustomers();
      if (typeof fetchAdminOrders === 'function') fetchAdminOrders();
      if (typeof fetchDiscountCodes === 'function') fetchDiscountCodes();
    }
  }, [isAuthenticated, activeTab]);

  // Product Filter & Modal States
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Kurtis',
    categorySlug: 'kurtis',
    price: '',
    originalPrice: '',
    image: '/images/products/real_product_1.jpg',
    secondaryImage: '',
    badge: 'New Arrival',
    sizes: ['M', 'L', 'XL', 'XXL'],
    stockQuantity: 10,
    isSoldOut: false,
    description: '',
    fabric: '',
    care: 'Dry Clean Only. Store in cotton wrapping.',
    craftsmanship: '',
    shipping: 'Complimentary express delivery across India. 7-day hassle-free exchange.',
    colorVariants: [
      { name: 'Royal Purple', hex: '#5a2d82', image: '/images/products/real_product_1.jpg', secondaryImage: '' }
    ]
  });

  // Store Settings Form State
  const [settingsForm, setSettingsForm] = useState(null);

  React.useEffect(() => {
    if (storeSettings) {
      setSettingsForm(storeSettings);
    }
  }, [storeSettings]);

  // Category Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [catForm, setCatForm] = useState({
    name: '',
    slug: '',
    tagline: '',
    count: '',
    image: '/images/products/real_product_1.jpg'
  });

  // Hero Slide Modal State
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [slideForm, setSlideForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    cta: 'Explore Collection',
    categorySlug: 'kurtis',
    image: '/images/products/real_product_1.jpg',
    order: 0
  });

  // Promo Message Input State
  const [newPromoText, setNewPromoText] = useState('');
  const [newPromoOrder, setNewPromoOrder] = useState('');

  // Discount Form State
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [discountForm, setDiscountForm] = useState({
    code: '',
    discountPercent: 10,
    minSpend: 0,
    description: ''
  });

  // Shipment & Tracking Modal State
  const [isShipmentModalOpen, setIsShipmentModalOpen] = useState(false);
  const [selectedOrderForShipment, setSelectedOrderForShipment] = useState(null);
  const [shipmentForm, setShipmentForm] = useState({
    status: 'Shipped',
    trackingNumber: '',
    carrier: 'Delhivery'
  });

  const handleSaveShipment = async (e) => {
    e.preventDefault();
    if (!selectedOrderForShipment) return;
    try {
      await updateOrderStatus(selectedOrderForShipment.id, {
        status: shipmentForm.status,
        trackingNumber: shipmentForm.trackingNumber.trim(),
        carrier: shipmentForm.carrier.trim()
      });
      showToast(`Updated shipment & status for ${selectedOrderForShipment.id}`);
      setIsShipmentModalOpen(false);
    } catch (err) {
      showToast('Failed to update shipment status');
    }
  };

  // Notifications / Toast
  const [toastMessage, setToastMessage] = useState('');
  const [uploadingField, setUploadingField] = useState(null);

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingField(field);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || '';
      const adminToken = sessionStorage.getItem('surangi_admin_token') || '';
      const res = await fetch(`${apiBase}/api/admin/upload`, {
        method: 'POST',
        headers: {
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
        },
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (field === 'product') {
          setProductForm(prev => ({ ...prev, image: data.url }));
        } else if (field === 'cat') {
          setCatForm(prev => ({ ...prev, image: data.url }));
        } else if (field === 'slide') {
          setSlideForm(prev => ({ ...prev, image: data.url }));
        }
        showToast('Image uploaded successfully!');
      } else {
        showToast(data.message || 'Image upload failed');
      }
    } catch (err) {
      console.error('File upload error:', err);
      showToast('Failed to upload image');
    } finally {
      setUploadingField(null);
    }
  };

  // Lock body scroll when any admin modal is open
  React.useEffect(() => {
    const isAnyModalOpen = isProductModalOpen || isCatModalOpen || isSlideModalOpen || isDiscountModalOpen;
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isProductModalOpen, isCatModalOpen, isSlideModalOpen, isDiscountModalOpen]);

  const showToast = (msg, isError = false) => {
    if (isError) {
      toast.error(msg);
    } else {
      toast.success(msg);
    }
  };

  const confirmAction = (message, onConfirm, confirmText = 'Confirm') => {
    toast((t) => (
      <div className="space-y-2.5 p-1 text-left min-w-[260px]">
        <div className="flex items-center gap-2 text-[#39322f] font-bold text-xs">
          <Sparkles className="w-4 h-4 text-[#d4a373] shrink-0" />
          <span>Confirm Action</span>
        </div>
        <p className="text-[11px] text-[#39322f]/80 leading-relaxed font-sans">
          {message}
        </p>
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 rounded-xl bg-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-300 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-[#39322f] text-white text-xs font-semibold hover:bg-[#d4a373] hover:text-[#39322f] transition-colors cursor-pointer shadow-xs"
          >
            {confirmText}
          </button>
        </div>
      </div>
    ), {
      duration: 8000,
      position: 'top-center',
      style: {
        background: '#f7f3ee',
        border: '1.5px solid #d4a373',
        borderRadius: '20px',
        padding: '14px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
      },
    });
  };

  // Auth Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/login', {
        email: adminEmailInput,
        password: adminPasswordInput,
      });

      if (res.data?.token) {
        sessionStorage.setItem('surangi_admin_token', res.data.token);
        localStorage.removeItem('surangi_admin_token');
        setIsAuthenticated(true);
        setLoginError(false);
        setAdminEmailInput('');
        setAdminPasswordInput('');
        toast.success('Welcome back, Admin!');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setLoginError(true);
      toast.error(err.response?.data?.message || 'Invalid Admin Credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('surangi_admin_token');
    sessionStorage.removeItem('surangi_admin_auth');
    localStorage.removeItem('surangi_admin_token');
    setAdminEmailInput('');
    setAdminPasswordInput('');
    toast.success('Logged out of Admin Panel');
  };

  // Product Handlers
  const handleOpenNewProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'Kurtis',
      categorySlug: 'kurtis',
      price: '',
      originalPrice: '',
      image: '',
      secondaryImage: '',
      badge: 'Bestseller',
      sizes: ['M', 'L', 'XL', 'XXL'],
      stockQuantity: 10,
      isSoldOut: false,
      description: '',
      fabric: '',
      care: 'Dry Clean Only.',
      craftsmanship: '',
      shipping: 'Complimentary express delivery across India. 7-day hassle-free exchange.',
      colorVariants: [
        { name: 'Royal Purple', hex: '#5a2d82', images: ['/images/products/real_product_1.jpg'] }
      ]
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProductModal = (product) => {
    setEditingProduct(product);
    let variants = [];
    if (product.colorVariants && Array.isArray(product.colorVariants) && product.colorVariants.length > 0) {
      variants = product.colorVariants.map(v => ({
        name: v.name,
        hex: v.hex,
        images: Array.isArray(v.images) && v.images.length > 0
          ? v.images
          : [v.image || product.image || '/images/products/real_product_1.jpg', ...(v.secondaryImage ? [v.secondaryImage] : [])]
      }));
    } else if (product.colors && Array.isArray(product.colors) && product.colors.length > 0) {
      variants = product.colors.map(c => ({
        name: typeof c === 'object' ? c.name : c,
        hex: typeof c === 'object' ? c.hex : '#5a2d82',
        images: [product.image || '/images/products/real_product_1.jpg', ...(product.secondaryImage ? [product.secondaryImage] : [])]
      }));
    } else {
      variants = [{ name: 'Royal Purple', hex: '#5a2d82', images: [product.image || '/images/products/real_product_1.jpg', ...(product.secondaryImage ? [product.secondaryImage] : [])] }];
    }

    setProductForm({
      name: product.name,
      category: product.category,
      categorySlug: product.categorySlug || 'kurtis',
      price: product.price,
      originalPrice: product.originalPrice || '',
      image: product.image,
      secondaryImage: product.secondaryImage || '',
      badge: product.badge || 'Featured',
      sizes: (() => {
        const filtered = (product.sizes || []).filter(s => ['S', 'M', 'L', 'XL', 'XXL'].includes(s));
        return filtered.length > 0 ? filtered : ['M', 'L', 'XL', 'XXL'];
      })(),
      stockQuantity: typeof product.stockQuantity === 'number' ? product.stockQuantity : 10,
      isSoldOut: product.isSoldOut || false,
      description: product.description || '',
      fabric: product.fabric || '',
      care: product.care || 'Dry Clean Only.',
      craftsmanship: product.craftsmanship || '',
      shipping: product.shipping || 'Complimentary express delivery across India. 7-day hassle-free exchange.',
      colorVariants: variants
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      toast.error('Please provide product name and price.');
      return;
    }

    if (!productForm.colorVariants || productForm.colorVariants.length === 0) {
      toast.error('Please add at least one color variant.');
      return;
    }

    const invalidVar = productForm.colorVariants.find(v => !v.name?.trim() || !v.hex || !v.images || v.images.length === 0);
    if (invalidVar) {
      toast.error('Each color variant must have a name, hex code, and at least 1 image.');
      return;
    }

    const priceNum = Number(productForm.price);
    const origPriceNum = (productForm.originalPrice !== '' && productForm.originalPrice !== null && productForm.originalPrice !== undefined)
      ? Number(productForm.originalPrice)
      : Math.round(priceNum * 1.25);

    const firstVarImages = productForm.colorVariants[0].images || [];

    const payload = {
      name: productForm.name,
      category: productForm.category,
      categorySlug: productForm.categorySlug,
      price: priceNum,
      originalPrice: origPriceNum,
      badge: productForm.badge,
      sizes: productForm.sizes,
      stockQuantity: productForm.stockQuantity,
      isSoldOut: productForm.isSoldOut,
      description: productForm.description,
      fabric: productForm.fabric,
      care: productForm.care,
      craftsmanship: productForm.craftsmanship,
      shipping: productForm.shipping,
      colorVariants: productForm.colorVariants.map(v => ({
        name: v.name,
        hex: v.hex,
        images: v.images,
      })),
      image: firstVarImages[0] || productForm.image,
      secondaryImage: firstVarImages[1] || firstVarImages[0] || null
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
      showToast(`Updated product "${productForm.name}"`);
    } else {
      addProduct(payload);
      showToast(`Added new product "${productForm.name}"`);
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id, name) => {
    confirmAction(
      `Are you sure you want to delete "${name}"?`,
      () => {
        deleteProduct(id);
        showToast(`Product deleted`);
      },
      'Delete Product'
    );
  };

  // Category Handlers
  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!catForm.name) return;
    const slug = catForm.slug ? catForm.slug.trim().toLowerCase() : catForm.name.toLowerCase().replace(/\s+/g, '-');
    const payload = { ...catForm, slug };
    if (editingCat) {
      updateCategory(editingCat.id, payload);
      showToast(`Category updated`);
    } else {
      addCategory({ id: slug, ...payload });
      showToast(`New category added`);
    }
    setIsCatModalOpen(false);
  };

  // Hero Slide Handlers
  const handleSaveHeroSlide = async (e) => {
    e.preventDefault();
    if (!slideForm.title) return;
    try {
      const payload = {
        title: slideForm.title.trim(),
        subtitle: (slideForm.subtitle || '').trim(),
        description: (slideForm.description || '').trim(),
        cta: (slideForm.cta || 'Explore Collection').trim(),
        categorySlug: slideForm.categorySlug || 'kurtis',
        image: slideForm.image,
        order: Number(slideForm.order || 0)
      };

      if (editingSlide) {
        const updatedSlides = heroSlides.map(s => s.id === editingSlide.id ? { ...s, ...payload } : s);
        await updateHeroSlides(updatedSlides);
        showToast(`Updated hero banner slide`);
      } else {
        await addHeroSlide(payload);
        showToast(`Added new hero carousel slide`);
      }
      setIsSlideModalOpen(false);
      setEditingSlide(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save hero slide');
    }
  };

  // Promo Bar Handlers
  const handleAddPromo = async (e) => {
    e.preventDefault();
    if (newPromoText.trim()) {
      try {
        await addPromoMessage(newPromoText.trim());
        setNewPromoText('');
        setNewPromoOrder('');
        showToast('Added announcement banner text');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to add promo message');
      }
    }
  };

  // Discount Handlers
  const handleSaveDiscount = async (e) => {
    e.preventDefault();
    if (!discountForm.code) return;
    try {
      const payload = {
        code: discountForm.code.toUpperCase().trim(),
        discountPercent: Number(discountForm.discountPercent),
        minSpend: Number(discountForm.minSpend || 0),
        description: discountForm.description || `${discountForm.discountPercent}% OFF coupon`
      };

      if (editingDiscount) {
        await updateDiscountCode(editingDiscount.code, payload);
        showToast(`Updated discount code ${payload.code}`);
      } else {
        await addDiscountCode(payload);
        showToast(`Created discount code ${payload.code}`);
      }
      setIsDiscountModalOpen(false);
      setEditingDiscount(null);
      setDiscountForm({ code: '', discountPercent: 10, minSpend: 0, description: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save discount code');
    }
  };

  // Filtered Products List
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                          p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = productCategoryFilter === 'all' || p.categorySlug === productCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // Calculate Metrics
  const totalSalesRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const activeProductsCount = products.filter(p => !p.isSoldOut).length;
  const soldOutCount = products.filter(p => p.isSoldOut).length;

  // Render Loading Screen while verifying admin session
  if (isVerifyingAuth) {
    return (
      <div className="min-h-screen bg-[#f8f4ee] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-[#d4a373] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-[#39322f] font-semibold">
            Verifying Admin Session...
          </p>
        </div>
      </div>
    );
  }

  // Render PIN Auth Screen if not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f8f4ee] text-[#39322f] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#d4a373]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-white border border-[#d4a373]/30 rounded-3xl p-8 shadow-xl relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f7f3ee] text-[#b58349] mb-4 border border-[#d4a373]/40 shadow-sm">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-cinzel font-bold tracking-wide text-[#2d2624]">Suranghi Naar Studio</h1>
            <p className="text-xs text-[#b58349] tracking-widest uppercase font-semibold mt-1">Light Admin Control Panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#b58349] mb-1 font-bold">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={adminEmailInput}
                onChange={(e) => setAdminEmailInput(e.target.value)}
                placeholder="Enter admin email"
                className={`w-full bg-[#f8f4ee] border ${loginError ? 'border-rose-500' : 'border-[#d4a373]/40'} rounded-2xl px-4 py-2.5 text-sm text-[#39322f] focus:outline-none focus:border-[#d4a373] transition-colors`}
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#b58349] mb-1 font-bold">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                placeholder="Enter password"
                className={`w-full bg-[#f8f4ee] border ${loginError ? 'border-rose-500' : 'border-[#d4a373]/40'} rounded-2xl px-4 py-2.5 text-sm text-[#39322f] focus:outline-none focus:border-[#d4a373] transition-colors`}
              />
              {loginError && (
                <p className="text-rose-600 text-xs mt-2 text-center font-medium">
                  Invalid admin email or password.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#39322f] hover:bg-[#d4a373] text-[#f7f3ee] hover:text-[#39322f] font-semibold py-3.5 px-6 rounded-2xl transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 text-xs uppercase tracking-widest mt-2"
            >
              <Unlock className="w-4 h-4" />
              Authenticate Admin Access
            </button>
          </form>


        </div>
      </div>
    );
  }

  const ITEMS_PER_PAGE = 10;

  function PaginationBar({ currentPage, totalItems, onPageChange }) {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#e8e2d9] text-xs font-sans">
        <span className="text-[#39322f]/60">
          Showing <strong className="text-[#39322f] font-bold">{startItem}</strong> to <strong className="text-[#39322f] font-bold">{endItem}</strong> of <strong className="text-[#39322f] font-bold">{totalItems}</strong> entries
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-xl bg-white border border-[#e8e2d9] text-[#39322f] hover:bg-[#f8f4ee] disabled:opacity-40 disabled:cursor-not-allowed font-semibold cursor-pointer"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
            <button
              key={pg}
              onClick={() => onPageChange(pg)}
              className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentPage === pg
                  ? 'bg-[#39322f] text-white shadow-xs'
                  : 'bg-white text-[#39322f] border border-[#e8e2d9] hover:bg-[#f8f4ee]'
              }`}
            >
              {pg}
            </button>
          ))}
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-xl bg-white border border-[#e8e2d9] text-[#39322f] hover:bg-[#f8f4ee] disabled:opacity-40 disabled:cursor-not-allowed font-semibold cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  const paginatedProducts = filteredProducts.slice((productsPage - 1) * ITEMS_PER_PAGE, productsPage * ITEMS_PER_PAGE);
  const paginatedOrders = orders.slice((ordersPage - 1) * ITEMS_PER_PAGE, ordersPage * ITEMS_PER_PAGE);
  const paginatedCategories = categories.slice((categoriesPage - 1) * ITEMS_PER_PAGE, categoriesPage * ITEMS_PER_PAGE);

  const filteredCustomers = (customers || []).filter(c => 
    (c.name || '').toLowerCase().includes(customerSearch.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(customerSearch.toLowerCase()) ||
    (c.phone || '').toLowerCase().includes(customerSearch.toLowerCase())
  );
  const paginatedCustomers = filteredCustomers.slice((customersPage - 1) * ITEMS_PER_PAGE, customersPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-[#f8f4ee] text-[#39322f] font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#39322f] text-[#f7f3ee] border border-[#d4a373]/40 px-5 py-3.5 rounded-2xl shadow-2xl font-medium flex items-center gap-2.5 animate-bounce text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-[#d4a373] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Navigation */}
      <header className="bg-white border-b border-[#d4a373]/25 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#f7f3ee] border border-[#d4a373]/40 flex items-center justify-center text-[#b58349] shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-cinzel text-lg font-bold text-[#2d2624] tracking-wide">SURANGHI NAAR</span>
              <span className="ml-2 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-md bg-[#d4a373]/15 text-[#b58349] font-bold border border-[#d4a373]/30">
                Studio Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#f8f4ee] text-xs font-semibold text-[#2d2624] border border-[#e8e2d9] hover:border-[#d4a373] hover:text-[#b58349] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live Storefront
            </Link>

            <button
              onClick={async () => {
                if (typeof refreshData === 'function') await refreshData();
                if (typeof fetchAdminOrders === 'function') await fetchAdminOrders();
                if (typeof fetchCustomers === 'function') await fetchCustomers();
                showToast('Refreshed store data');
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#f8f4ee] text-xs font-semibold text-[#2d2624] border border-[#e8e2d9] hover:border-[#d4a373] hover:text-[#b58349] transition-colors cursor-pointer"
              title="Refresh current data from backend"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Refresh Data</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#39322f] text-xs text-[#f7f3ee] hover:bg-[#d4a373] hover:text-[#39322f] transition-all cursor-pointer shadow-xs font-semibold"
            >
              <Lock className="w-3.5 h-3.5" />
              Exit Admin
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-[#e8e2d9] no-scrollbar">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'customers', label: `Customers (${(customers || []).length})`, icon: Users },
            { id: 'categories', label: `Categories (${categories.length})`, icon: Grid },
            { id: 'banners', label: 'Hero & Banners', icon: ImageIcon },
            { id: 'discounts', label: `Discounts (${(discountCodes || []).length})`, icon: Tag },
            { id: 'settings', label: 'Store Contact & Info', icon: Settings },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#39322f] text-[#f7f3ee] shadow-md'
                    : 'bg-white text-[#39322f]/70 hover:text-[#2d2624] hover:bg-[#f8f4ee] border border-[#e8e2d9]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#d4a373]' : 'text-[#b58349]'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white border border-[#e8e2d9] rounded-2xl p-5 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-wider text-[#b58349] font-bold">Total Revenue</span>
                  <div className="w-10 h-10 rounded-xl bg-[#f7f3ee] flex items-center justify-center text-[#b58349] border border-[#d4a373]/30">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-cinzel font-bold text-[#2d2624]">
                  ₹{totalSalesRevenue.toLocaleString()}
                </div>
                <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+18.4% monthly growth</span>
                </div>
              </div>

              <div className="bg-white border border-[#e8e2d9] rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-wider text-[#b58349] font-bold">Total Orders</span>
                  <div className="w-10 h-10 rounded-xl bg-[#f7f3ee] flex items-center justify-center text-[#b58349] border border-[#d4a373]/30">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-cinzel font-bold text-[#2d2624]">
                  {totalOrdersCount}
                </div>
                <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{orders.filter(o => o.status === 'Processing' || o.status === 'Pending').length} pending dispatch</span>
                </div>
              </div>

              <div className="bg-white border border-[#e8e2d9] rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-wider text-[#b58349] font-bold">Active Products</span>
                  <div className="w-10 h-10 rounded-xl bg-[#f7f3ee] flex items-center justify-center text-[#b58349] border border-[#d4a373]/30">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-cinzel font-bold text-[#2d2624]">
                  {activeProductsCount}
                </div>
                <div className="text-xs text-[#39322f]/60 font-medium mt-2">
                  Across {categories.length} core categories
                </div>
              </div>

              <div className="bg-white border border-[#e8e2d9] rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-wider text-[#b58349] font-bold">Out of Stock</span>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 border border-amber-200">
                    <XCircle className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-cinzel font-bold text-amber-700">
                  {soldOutCount}
                </div>
                <div className="text-xs text-amber-700 font-semibold mt-2">
                  {soldOutCount > 0 ? 'Requires stock update' : 'All catalog items available'}
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Orders Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Orders List */}
              <div className="lg:col-span-2 bg-white border border-[#e8e2d9] rounded-2xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-cinzel font-bold text-[#2d2624]">Recent Customer Orders</h2>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#b58349] hover:underline flex items-center gap-1 cursor-pointer font-bold uppercase tracking-wider"
                  >
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f8f4ee] text-[#b58349] uppercase tracking-wider font-bold border-b border-[#e8e2d9]">
                      <tr>
                        <th className="py-3 px-3">Order ID</th>
                        <th className="py-3 px-3">Customer</th>
                        <th className="py-3 px-3">Total</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e8e2d9]">
                      {orders.slice(0, 5).map(order => (
                        <tr key={order.id} className="hover:bg-[#f8f4ee]/60 transition-colors">
                          <td className="py-3.5 px-3 font-mono font-bold text-[#39322f]">{order.id}</td>
                          <td className="py-3.5 px-3 font-semibold text-[#2d2624]">{order.customerName || order.customer?.name || 'Guest Customer'}</td>
                          <td className="py-3.5 px-3 font-bold text-[#b58349]">₹{(order.total || 0).toLocaleString()}</td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                              order.status === 'Processing' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                              order.status === 'Shipped' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                              'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <button
                              onClick={() => { setActiveTab('orders'); }}
                              className="text-xs text-[#b58349] hover:underline cursor-pointer font-bold"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Management Panel */}
              <div className="bg-white border border-[#e8e2d9] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-cinzel font-bold text-[#2d2624] mb-4">Quick Studio Actions</h2>
                  <div className="space-y-3">
                    <button
                      onClick={handleOpenNewProductModal}
                      className="w-full bg-[#39322f] hover:bg-[#d4a373] text-[#f7f3ee] hover:text-[#39322f] font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer shadow-sm"
                    >
                      <Plus className="w-4 h-4 text-[#d4a373]" /> Add New Product
                    </button>

                    <button
                      onClick={() => setActiveTab('banners')}
                      className="w-full bg-[#f8f4ee] text-[#39322f] border border-[#e8e2d9] hover:border-[#d4a373] py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-semibold cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4 text-[#b58349]" /> Edit Banners & Promos
                    </button>

                    <button
                      onClick={() => setActiveTab('discounts')}
                      className="w-full bg-[#f8f4ee] text-[#39322f] border border-[#e8e2d9] hover:border-[#d4a373] py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-semibold cursor-pointer"
                    >
                      <Tag className="w-4 h-4 text-[#b58349]" /> Create Discount Coupon
                    </button>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#e8e2d9] text-xs text-[#39322f]/70 space-y-1.5 font-sans">
                  <p>Store Name: <span className="text-[#2d2624] font-semibold">Suranghi Naar Fashion Studio</span></p>
                  <p>Location: <span className="text-[#2d2624] font-semibold">Jaipur, Rajasthan, India</span></p>
                  <p>Status: <span className="text-emerald-700 font-bold">● Active Storefront</span></p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGER */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Header Control Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white border border-[#e8e2d9] rounded-2xl p-4 shadow-xs">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search product name..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-3 py-2.5 text-xs text-[#39322f] font-semibold focus:outline-none focus:border-[#d4a373]"
                >
                  <option value="all">All Categories</option>
                  <option value="kurtis">Kurtis</option>
                  <option value="short-kurtis">Short Kurtis</option>
                  <option value="festive-wear">Festive Wear</option>
                </select>
              </div>

              <button
                onClick={handleOpenNewProductModal}
                className="bg-[#39322f] hover:bg-[#d4a373] text-[#f7f3ee] hover:text-[#39322f] font-semibold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-sm"
              >
                <Plus className="w-4 h-4 text-[#d4a373]" /> Add Product
              </button>
            </div>

            {/* Product Data Table */}
            <div className="bg-white border border-[#e8e2d9] rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8f4ee] text-[#b58349] uppercase tracking-wider font-bold border-b border-[#e8e2d9]">
                    <tr>
                      <th className="py-3.5 px-4">Item</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Sizes</th>
                      <th className="py-3.5 px-4">Badge</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8e2d9]">
                    {paginatedProducts.map(product => (
                      <tr key={product.id} className="hover:bg-[#f8f4ee]/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={getImageUrl(product.image)}
                              alt={product.name}
                              loading="lazy"
                              className="w-12 h-14 object-cover rounded-lg border border-[#e8e2d9]"
                            />
                            <div>
                              <span className="font-bold text-[#2d2624] block line-clamp-1">{product.name}</span>
                              <span className="text-[10px] text-gray-500 block">ID: {product.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-[#39322f] font-semibold">{product.category}</td>
                        <td className="py-3.5 px-4 font-bold text-[#b58349]">
                          ₹{product.price.toLocaleString()}
                          {product.originalPrice && (
                            <span className="line-through text-gray-400 text-[10px] ml-1.5 font-normal">
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-[130px]">
                            {(() => {
                              const filtered = (product.sizes || []).filter(s => ['S', 'M', 'L', 'XL', 'XXL'].includes(s));
                              const displaySizes = filtered.length > 0 ? filtered : ['M', 'L', 'XL', 'XXL'];
                              return displaySizes.map((sz) => (
                                <span key={sz} className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#f8f4ee] text-[#39322f] border border-[#e8e2d9]">
                                  {sz}
                                </span>
                              ));
                            })()}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-md bg-[#d4a373]/15 text-[#b58349] text-[10px] font-bold border border-[#d4a373]/30">
                            {product.badge || 'Standard'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => {
                              updateProduct(product.id, { isSoldOut: !product.isSoldOut });
                              showToast(`Updated stock status for ${product.name}`);
                            }}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                              product.isSoldOut
                                ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            }`}
                          >
                            {product.isSoldOut ? 'Sold Out' : 'In Stock'}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditProductModal(product)}
                              className="p-2 rounded-lg bg-[#f8f4ee] hover:bg-[#d4a373] text-[#39322f] transition-colors cursor-pointer border border-[#e8e2d9]"
                              title="Edit product details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id, product.name)}
                              className="p-2 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white transition-colors cursor-pointer border border-rose-200"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4">
                <PaginationBar
                  currentPage={productsPage}
                  totalItems={filteredProducts.length}
                  onPageChange={setProductsPage}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGER */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#e8e2d9] rounded-2xl p-6 shadow-xs">
              <h2 className="text-lg font-cinzel font-bold text-[#2d2624] mb-4">Customer Orders & Fulfillment</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8f4ee] text-[#b58349] uppercase tracking-wider font-bold border-b border-[#e8e2d9]">
                    <tr>
                      <th className="py-3.5 px-4">Order ID & Date</th>
                      <th className="py-3.5 px-4">Customer Info</th>
                      <th className="py-3.5 px-4">Items</th>
                      <th className="py-3.5 px-4">Total & Payment</th>
                      <th className="py-3.5 px-4">Order Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8e2d9]">
                    {paginatedOrders.map(order => (
                      <tr key={order.id} className="hover:bg-[#f8f4ee]/60 transition-colors">
                        <td className="py-4 px-4">
                          <span className="font-mono font-bold text-[#b58349] block">{order.id}</span>
                          <span className="text-[10px] text-gray-500">{new Date(order.createdAt || order.date || Date.now()).toLocaleDateString()}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-[#2d2624]">{order.customerName || order.customer?.name || 'Guest Customer'}</div>
                          <div className="text-[10px] text-gray-600">{order.customerPhone || order.customer?.phone || 'N/A'}</div>
                          <div className="text-[10px] text-gray-500 truncate max-w-xs">{order.customerAddress || order.customer?.address || 'N/A'}</div>
                        </td>
                        <td className="py-4 px-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="text-[#39322f] text-[11px] mb-1">
                              <span className="font-bold">{item.quantity}x {item.name}</span>
                              <span className="text-gray-500 text-[10px] block">Size: {item.size} | Color: {item.color}</span>
                            </div>
                          ))}
                        </td>
                        <td className="py-4 px-4 font-bold">
                          <span className="text-[#b58349] block text-sm">₹{order.total.toLocaleString()}</span>
                          <span className="text-[10px] text-gray-500 font-normal block">{order.paymentMethod}</span>
                          {order.refundRequired && (
                            <span className="inline-flex items-center gap-1 bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 shadow-xs">
                              <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                              Refund Needed
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 space-y-2">
                          <select
                            value={order.status}
                            onChange={(e) => {
                              const newStatus = e.target.value;
                              if (newStatus === 'Shipped') {
                                setSelectedOrderForShipment(order);
                                setShipmentForm({
                                  status: 'Shipped',
                                  trackingNumber: order.trackingNumber || '',
                                  carrier: order.carrier || 'Delhivery'
                                });
                                setIsShipmentModalOpen(true);
                              } else {
                                updateOrderStatus(order.id, newStatus);
                                showToast(`Order ${order.id} status updated to ${newStatus}`);
                              }
                            }}
                            className="bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-3 py-1.5 text-xs text-[#2d2624] font-bold focus:outline-none focus:border-[#d4a373]"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>

                          {(order.status === 'Pending' || order.status === 'Processing') && (
                            <button
                              type="button"
                              onClick={() => {
                                confirmAction(
                                  `Cancel order ${order.id}?`,
                                  async () => {
                                    await cancelAdminOrder(order.id, 'Cancelled by admin');
                                    showToast(`Order ${order.id} cancelled by admin`);
                                  },
                                  'Cancel Order'
                                );
                              }}
                              className="text-[10px] text-rose-600 font-bold hover:underline flex items-center gap-1 block cursor-pointer"
                            >
                              <XCircle className="w-3 h-3 text-rose-600" /> Cancel Order
                            </button>
                          )}

                          {(order.cancellationReason || (Array.isArray(order.statusHistory) && order.statusHistory.find(h => h.status === 'Cancelled')?.reason)) && (
                            <div className="text-[10px] text-rose-800 bg-rose-50 border border-rose-200 p-2 rounded-lg mt-1 font-sans leading-tight">
                              <strong className="font-bold uppercase tracking-wider block text-[9px] text-rose-900 mb-0.5">Cancellation Reason:</strong>
                              <span>"{order.cancellationReason || order.statusHistory.find(h => h.status === 'Cancelled')?.reason}"</span>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrderForShipment(order);
                              setShipmentForm({
                                status: order.status,
                                trackingNumber: order.trackingNumber || '',
                                carrier: order.carrier || 'Delhivery'
                              });
                              setIsShipmentModalOpen(true);
                            }}
                            className="text-[10px] text-[#b58349] font-bold hover:underline flex items-center gap-1 block cursor-pointer"
                          >
                            <Truck className="w-3 h-3" /> {order.trackingNumber ? `AWB: ${order.trackingNumber}` : '+ Add Tracking AWB'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-4">
                <PaginationBar
                  currentPage={ordersPage}
                  totalItems={orders.length}
                  onPageChange={setOrdersPage}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB: REGISTERED CUSTOMERS MANAGER */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#e8e2d9] rounded-2xl p-6 shadow-xs">
              <div>
                <h2 className="text-lg font-cinzel font-bold text-[#2d2624]">Registered Customers & LTV Insights</h2>
                <p className="text-xs text-gray-500 font-sans mt-0.5">Full access to customer profiles, phone numbers, shipping addresses, and order spend</p>
              </div>

              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={customerSearch}
                  onChange={(e) => { setCustomerSearch(e.target.value); setCustomersPage(1); }}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl pl-9 pr-4 py-2 text-xs text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>
            </div>

            <div className="bg-white border border-[#e8e2d9] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8f4ee] text-[#b58349] uppercase tracking-wider font-bold border-b border-[#e8e2d9]">
                    <tr>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Contact Info</th>
                      <th className="py-3.5 px-4">Auth & Registration</th>
                      <th className="py-3.5 px-4">Orders & Lifetime Spend</th>
                      <th className="py-3.5 px-4">Primary Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8e2d9]">
                    {paginatedCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500 font-sans">
                          No registered customer profiles found matching "{customerSearch}".
                        </td>
                      </tr>
                    ) : (
                      paginatedCustomers.map((cust) => (
                        <tr key={cust.id} className="hover:bg-[#f8f4ee]/60 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              {cust.avatar ? (
                                <img src={cust.avatar} alt={cust.name} className="w-10 h-10 rounded-full object-cover border border-[#d4a373]" />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-[#39322f] text-white flex items-center justify-center font-serif text-sm font-bold uppercase shrink-0">
                                  {cust.name ? cust.name.charAt(0) : 'U'}
                                </div>
                              )}
                              <div>
                                <span className="font-bold text-[#2d2624] block">{cust.name || 'Customer'}</span>
                                <span className="text-[10px] text-gray-500 font-mono">ID: {cust.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-[#39322f] font-semibold">{cust.email}</div>
                            <div className="text-gray-500 text-[11px]">{cust.phone || 'No phone recorded'}</div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#d4a373]/15 text-[#b58349] border border-[#d4a373]/30">
                              {cust.provider}
                            </span>
                            <span className="text-gray-500 text-[10px] block mt-1">
                              Joined {new Date(cust.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-serif font-bold text-sm text-[#b58349] block">
                              ₹{cust.totalSpent?.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-gray-500 font-semibold block">
                              {cust.totalOrders} Completed Order(s)
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-xs text-[#39322f]/80 max-w-xs block line-clamp-2">
                              {cust.primaryAddress || 'No saved address'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <PaginationBar
                currentPage={customersPage}
                totalItems={filteredCustomers.length}
                onPageChange={setCustomersPage}
              />
            </div>
          </div>
        )}

        {/* TAB 4: CATEGORY MANAGER */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white border border-[#e8e2d9] rounded-2xl p-4 shadow-xs">
              <div>
                <h2 className="text-base font-cinzel font-bold text-[#2d2624]">Category Catalog Architecture</h2>
                <p className="text-xs text-gray-500 font-sans">Manage homepage category cards and shop collection filters</p>
              </div>
              <button
                onClick={() => {
                  setEditingCat(null);
                  setCatForm({ name: '', slug: '', tagline: '', count: '', image: '/images/products/real_product_1.jpg' });
                  setIsCatModalOpen(true);
                }}
                className="bg-[#39322f] hover:bg-[#d4a373] text-[#f7f3ee] hover:text-[#39322f] font-semibold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4 text-[#d4a373]" /> Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map(cat => (
                <div key={cat.id} className="bg-white border border-[#e8e2d9] rounded-2xl overflow-hidden shadow-xs group">
                  <div className="relative h-48">
                    <img src={cat.image} alt={cat.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="text-xs font-bold text-[#e6c594] uppercase tracking-wider">{cat.slug}</span>
                      <h3 className="text-xl font-cinzel font-bold text-white">{cat.name}</h3>
                      <p className="text-xs text-gray-200 italic line-clamp-1">{cat.tagline}</p>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between border-t border-[#e8e2d9] bg-[#f8f4ee]/40">
                    <span className="text-xs text-gray-500 font-semibold">{cat.count || 'Active Collection'}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingCat(cat);
                          setCatForm({ name: cat.name, slug: cat.slug, tagline: cat.tagline || '', count: cat.count || '', image: cat.image });
                          setIsCatModalOpen(true);
                        }}
                        className="p-2 rounded-lg bg-white border border-[#e8e2d9] hover:bg-[#d4a373] hover:text-white transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          confirmAction(
                            `Delete category "${cat.name}"?`,
                            () => {
                              deleteCategory(cat.id);
                              showToast('Category deleted');
                            },
                            'Delete Category'
                          );
                        }}
                        className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: BANNERS & HERO CAROUSEL */}
        {activeTab === 'banners' && (
          <div className="space-y-8">
            {/* Top Promo Bar Messages Manager */}
            <div className="bg-white border border-[#e8e2d9] rounded-2xl p-6 shadow-xs">
              <h2 className="text-lg font-cinzel font-bold text-[#2d2624] mb-1">Top Announcement Promo Bar</h2>
              <p className="text-xs text-gray-500 font-sans mb-6">Messages configured here rotate live on the top header promo bar</p>

              <form onSubmit={handleAddPromo} className="flex gap-3 mb-6">
                <input
                  type="text"
                  placeholder="Enter new promo code or discount announcement..."
                  value={newPromoText}
                  onChange={(e) => setNewPromoText(e.target.value)}
                  className="flex-1 bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-xs text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
                <button
                  type="submit"
                  className="bg-[#39322f] hover:bg-[#d4a373] text-[#f7f3ee] hover:text-[#39322f] font-semibold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0 shadow-sm"
                >
                  Add Banner Text
                </button>
              </form>

              <div className="space-y-3">
                {promoMessages.map((msg, index) => (
                  <div key={index} className="flex items-center justify-between bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl p-3.5 text-xs font-semibold">
                    <span className="text-[#39322f]">{msg}</span>
                    <button
                      onClick={() => {
                        deletePromoMessage(index);
                        showToast('Removed announcement message');
                      }}
                      className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Carousel Manager */}
            <div className="bg-white border border-[#e8e2d9] rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-cinzel font-bold text-[#2d2624]">Hero Homepage Slides</h2>
                  <p className="text-xs text-gray-500 font-sans">Slides featured prominently on the main homepage banner</p>
                </div>
                <button
                  onClick={() => {
                    setEditingSlide(null);
                    setSlideForm({
                      title: '',
                      subtitle: '',
                      description: '',
                      cta: 'Explore Collection',
                      categorySlug: 'kurtis',
                      image: '/images/products/real_product_1.jpg',
                      order: heroSlides.length + 1
                    });
                    setIsSlideModalOpen(true);
                  }}
                  className="bg-[#39322f] hover:bg-[#d4a373] text-[#f7f3ee] hover:text-[#39322f] font-semibold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4 text-[#d4a373]" /> Add Hero Slide
                </button>
              </div>

              <div className="space-y-4">
                {heroSlides.map((slide) => (
                  <div key={slide.id} className="flex flex-col sm:flex-row items-center gap-4 bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl p-4">
                    <img src={slide.image} alt={slide.title} loading="lazy" className="w-24 h-24 object-cover rounded-lg border border-[#e8e2d9] shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] text-[#b58349] font-bold uppercase tracking-wider">{slide.subtitle}</span>
                        {typeof slide.order === 'number' && (
                          <span className="text-[9px] bg-white px-2 py-0.5 rounded-md border border-[#e8e2d9] font-bold text-gray-600">Order: {slide.order}</span>
                        )}
                        <span className="text-[9px] bg-[#d4a373]/15 text-[#b58349] px-2 py-0.5 rounded-md border border-[#d4a373]/30 font-bold uppercase">{slide.categorySlug || 'kurtis'}</span>
                      </div>
                      <h4 className="text-base font-serif font-bold text-[#2d2624]">{slide.title}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2 mt-1">{slide.description}</p>
                      {slide.cta && <span className="text-[10px] text-gray-500 font-semibold block mt-1">CTA: "{slide.cta}"</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingSlide(slide);
                          setSlideForm({
                            title: slide.title || '',
                            subtitle: slide.subtitle || '',
                            description: slide.description || '',
                            cta: slide.cta || 'Explore Collection',
                            categorySlug: slide.categorySlug || 'kurtis',
                            image: slide.image || '',
                            order: typeof slide.order === 'number' ? slide.order : 0
                          });
                          setIsSlideModalOpen(true);
                        }}
                        className="p-2 rounded-lg bg-white border border-[#e8e2d9] text-[#39322f] hover:bg-[#d4a373] hover:text-white transition-colors cursor-pointer"
                        title="Edit Hero Slide"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          deleteHeroSlide(slide.id);
                          showToast('Slide removed');
                        }}
                        className="p-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer border border-rose-200"
                        title="Delete Hero Slide"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: DISCOUNTS */}
        {activeTab === 'discounts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white border border-[#e8e2d9] rounded-2xl p-4 shadow-xs">
              <div>
                <h2 className="text-base font-cinzel font-bold text-[#2d2624]">Promo Codes & Coupon Manager</h2>
                <p className="text-xs text-gray-500 font-sans">Manage checkout discount codes and special offers</p>
              </div>
              <button
                onClick={() => {
                  setEditingDiscount(null);
                  setDiscountForm({ code: '', discountPercent: 10, minSpend: 0, description: '' });
                  setIsDiscountModalOpen(true);
                }}
                className="bg-[#39322f] hover:bg-[#d4a373] text-[#f7f3ee] hover:text-[#39322f] font-semibold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4 text-[#d4a373]" /> Create Coupon
              </button>
            </div>

            {(!discountCodes || discountCodes.length === 0) ? (
              <div className="bg-white border border-[#e8e2d9] rounded-2xl p-12 text-center space-y-3 shadow-xs">
                <Tag className="w-10 h-10 text-[#d4a373] mx-auto" />
                <h3 className="font-serif text-lg font-bold text-[#2d2624]">No Discount Coupons Found</h3>
                <p className="text-xs text-gray-500 font-sans max-w-sm mx-auto">
                  Create promo codes for your patrons to use during checkout.
                </p>
                <button
                  onClick={() => {
                    setEditingDiscount(null);
                    setDiscountForm({ code: '', discountPercent: 10, minSpend: 0, description: '' });
                    setIsDiscountModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-[#39322f] hover:bg-[#d4a373] text-white hover:text-[#39322f] text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  + Create First Coupon
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {discountCodes.map((dc) => (
                  <div key={dc.code} className="bg-white border border-[#e8e2d9] rounded-2xl p-5 flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-lg font-bold text-[#b58349] px-3 py-1 bg-[#f7f3ee] border border-[#d4a373]/30 rounded-lg">
                          {dc.code}
                        </span>
                        <button
                          onClick={() => {
                            toggleDiscountCode(dc.code);
                            showToast(`Toggled coupon ${dc.code}`);
                          }}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                            dc.isActive ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {dc.isActive ? 'Active' : 'Disabled'}
                        </button>
                      </div>
                      <p className="text-xs text-[#2d2624] font-semibold mb-1">{dc.description}</p>
                      <p className="text-[11px] text-gray-500">
                        Discount: <span className="text-[#39322f] font-bold">{dc.discountPercent}% OFF</span> | Min spend: ₹{dc.minSpend}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#e8e2d9] flex justify-end gap-3">
                      <button
                        onClick={() => {
                          setEditingDiscount(dc);
                          setDiscountForm({
                            code: dc.code,
                            discountPercent: dc.discountPercent,
                            minSpend: dc.minSpend || 0,
                            description: dc.description || ''
                          });
                          setIsDiscountModalOpen(true);
                        }}
                        className="text-xs text-[#b58349] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => {
                          deleteDiscountCode(dc.code);
                          showToast(`Deleted coupon ${dc.code}`);
                        }}
                        className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: STORE SETTINGS & CONTACT */}
        {activeTab === 'settings' && (
          <div className="bg-white border border-[#e8e2d9] rounded-2xl p-6 max-w-3xl mx-auto space-y-6 shadow-xs">
            <div>
              <h2 className="text-lg font-cinzel font-bold text-[#2d2624]">Studio Contact & Operating Settings</h2>
              <p className="text-xs text-gray-500 font-sans">Updating these details updates the Footer and Contact Page automatically across all 10 parameters</p>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Raw Store Phone (dialer format)</label>
                  <input
                    type="text"
                    value={settingsForm?.phone ?? storeSettings?.phone ?? ''}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+919116655814"
                    className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  />
                </div>

                <div>
                  <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Display Formatted Phone</label>
                  <input
                    type="text"
                    value={settingsForm?.displayPhone ?? storeSettings?.displayPhone ?? ''}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, displayPhone: e.target.value }))}
                    placeholder="+91 91166 55814"
                    className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Store Email Address</label>
                <input
                  type="email"
                  value={settingsForm?.email ?? storeSettings?.email ?? ''}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="surangi.naar@gmail.com"
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Instagram URL</label>
                  <input
                    type="text"
                    value={settingsForm?.instagram ?? storeSettings?.instagram ?? ''}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, instagram: e.target.value }))}
                    placeholder="https://www.instagram.com/surangi.naar"
                    className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  />
                </div>

                <div>
                  <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Instagram Handle</label>
                  <input
                    type="text"
                    value={settingsForm?.instagramHandle ?? storeSettings?.instagramHandle ?? ''}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, instagramHandle: e.target.value }))}
                    placeholder="@surangi.naar"
                    className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Facebook Page URL</label>
                  <input
                    type="text"
                    value={settingsForm?.facebook ?? storeSettings?.facebook ?? ''}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, facebook: e.target.value }))}
                    placeholder="https://www.facebook.com/..."
                    className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  />
                </div>

                <div>
                  <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">WhatsApp Direct Link / Number</label>
                  <input
                    type="text"
                    value={settingsForm?.whatsapp ?? storeSettings?.whatsapp ?? ''}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                    placeholder="https://wa.me/919116655814"
                    className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Physical Studio Address</label>
                <textarea
                  rows={2}
                  value={settingsForm?.address ?? storeSettings?.address ?? ''}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Google Maps Embed / Short Link</label>
                  <input
                    type="text"
                    value={settingsForm?.googleMaps ?? storeSettings?.googleMaps ?? ''}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, googleMaps: e.target.value }))}
                    placeholder="https://maps.app.goo.gl/..."
                    className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  />
                </div>

                <div>
                  <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Studio Operating Hours</label>
                  <input
                    type="text"
                    value={settingsForm?.hours ?? storeSettings?.hours ?? ''}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, hours: e.target.value }))}
                    placeholder="Mon - Sat: 10:30 AM - 7:30 PM IST"
                    className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Shipping Fee (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={settingsForm?.shippingFee ?? storeSettings?.shippingFee ?? 250}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setSettingsForm(prev => ({ ...prev, shippingFee: isNaN(val) ? 0 : val }));
                    }}
                    placeholder="250"
                    className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  />
                </div>

                <div>
                  <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Free Shipping Threshold (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={settingsForm?.freeShippingThreshold ?? storeSettings?.freeShippingThreshold ?? 5000}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setSettingsForm(prev => ({ ...prev, freeShippingThreshold: isNaN(val) ? 0 : val }));
                    }}
                    placeholder="5000"
                    className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#e8e2d9] flex justify-end">
              <button
                onClick={async () => {
                  try {
                    if (settingsForm) {
                      await updateStoreSettings(settingsForm);
                      showToast('Store settings updated successfully!');
                    }
                  } catch (err) {
                    showToast(err.response?.data?.message || 'Failed to update store settings');
                  }
                }}
                className="bg-[#39322f] hover:bg-[#d4a373] text-[#f7f3ee] hover:text-[#39322f] font-semibold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4 text-[#d4a373]" /> Save Settings
              </button>
            </div>
          </div>
        )}

      </div>

      {/* PRODUCT ADD/EDIT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#d4a373]/30 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-[#39322f] overscroll-contain" data-lenis-prevent>
            <div className="flex items-center justify-between border-b border-[#e8e2d9] pb-4">
              <h3 className="text-lg font-cinzel font-bold text-[#2d2624]">
                {editingProduct ? 'Edit Product Details' : 'Add New Catalog Product'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Product Title</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Category</label>
                  <select
                    value={productForm.categorySlug}
                    onChange={(e) => {
                      const slug = e.target.value;
                      const catObj = categories.find(c => c.slug === slug);
                      setProductForm({
                        ...productForm,
                        categorySlug: slug,
                        category: catObj ? catObj.name : 'Kurtis'
                      });
                    }}
                    className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  >
                    <option value="kurtis">Kurtis</option>
                    <option value="short-kurtis">Short Kurtis</option>
                    <option value="festive-wear">Festive Wear</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Badge Tag</label>
                  <input
                    type="text"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    placeholder="Bestseller, New Drop, Trending"
                    className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Sale Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Original Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Stock Quantity</label>
                  <input
                    type="number"
                    min={0}
                    value={productForm.stockQuantity}
                    onChange={(e) => setProductForm({ ...productForm, stockQuantity: Number(e.target.value) })}
                    className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  />
                </div>
              </div>

              {/* Available Sizes Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block uppercase tracking-wider text-[#39322f] font-bold">
                    Available Sizes
                  </label>
                </div>
                <div className="flex flex-wrap gap-2 p-3 bg-[#f8f4ee] border border-[#e8e2d9] rounded-2xl">
                  {['S', 'M', 'L', 'XL', 'XXL'].map((size) => {
                    const isSelected = (productForm.sizes || []).includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          const current = productForm.sizes || [];
                          let updated;
                          if (isSelected) {
                            updated = current.filter(s => s !== size);
                          } else {
                            const order = ['S', 'M', 'L', 'XL', 'XXL'];
                            updated = [...current, size].sort((a, b) => order.indexOf(a) - order.indexOf(b));
                          }
                          setProductForm({ ...productForm, sizes: updated });
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#39322f] text-white border-[#39322f] shadow-xs'
                            : 'bg-white text-[#39322f]/70 border-[#e8e2d9] hover:border-[#d4a373]'
                        }`}
                      >
                        <span>{size}</span>
                        <span className={`text-[10px] font-bold ${isSelected ? 'text-[#d4a373]' : 'text-gray-400'}`}>
                          {isSelected ? '✓' : '+'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Repeatable Color Variants Container */}
              <div className="p-4 bg-[#f8f4ee] rounded-2xl border border-[#d4a373]/30 space-y-4">
                <div className="flex items-center justify-between border-b border-[#e8e2d9] pb-2">
                  <div>
                    <label className="block uppercase tracking-wider text-[#b58349] font-bold text-xs">Product Color Variants</label>
                    <p className="text-[10px] text-gray-500 font-sans">Each color variant can have its own main image & secondary hover image.</p>
                  </div>
                  <span className="text-[10px] font-semibold text-[#39322f]/60 bg-white px-2.5 py-1 rounded-full border border-[#e8e2d9]">
                    {(productForm.colorVariants || []).length} Variant(s)
                  </span>
                </div>

                <div className="space-y-4">
                  {(productForm.colorVariants || []).map((variant, index) => (
                    <div key={index} className="p-3.5 bg-white rounded-xl border border-[#e8e2d9] space-y-3 relative shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#39322f]">
                          Color Variant #{index + 1}
                        </span>
                        {productForm.colorVariants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = productForm.colorVariants.filter((_, i) => i !== index);
                              setProductForm({ ...productForm, colorVariants: updated });
                            }}
                            className="text-rose-600 hover:text-rose-800 text-xs font-bold p-1 cursor-pointer"
                            title="Remove Variant"
                          >
                            ✕ Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-semibold text-[10px]">Color Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Royal Purple, Sage Green"
                            value={variant.name}
                            onChange={(e) => {
                              const updated = [...productForm.colorVariants];
                              updated[index].name = e.target.value;
                              setProductForm({ ...productForm, colorVariants: updated });
                            }}
                            className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-3 py-2 text-[#39322f] focus:outline-none focus:border-[#d4a373] text-xs"
                          />
                        </div>

                        <div>
                          <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-semibold text-[10px]">Color Hex Code *</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={variant.hex || '#5a2d82'}
                              onChange={(e) => {
                                const updated = [...productForm.colorVariants];
                                updated[index].hex = e.target.value;
                                setProductForm({ ...productForm, colorVariants: updated });
                              }}
                              className="w-8 h-8 rounded-xl cursor-pointer border border-[#e8e2d9] p-0.5 bg-white shrink-0"
                            />
                            <input
                              type="text"
                              placeholder="#5a2d82"
                              value={variant.hex}
                              onChange={(e) => {
                                const updated = [...productForm.colorVariants];
                                updated[index].hex = e.target.value;
                                setProductForm({ ...productForm, colorVariants: updated });
                              }}
                              className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-3 py-2 text-[#39322f] focus:outline-none focus:border-[#d4a373] uppercase font-mono text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#e8e2d9]/60 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block uppercase tracking-wider text-[#39322f] font-semibold text-[10px]">
                            Variant Gallery Images * <span className="text-gray-400 font-sans font-normal lowercase">(up to 6 images)</span>
                          </label>
                          <span className="text-[9px] text-gray-500 font-sans">
                            {(variant.images || []).length} / 6
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          {(variant.images || []).map((imgUrl, imgIdx) => (
                            <div key={imgIdx} className="relative group w-16 h-16 rounded-xl border border-[#e8e2d9] overflow-hidden bg-[#f8f4ee] shrink-0">
                              <img src={getImageUrl(imgUrl)} alt={`Variant ${index + 1} image ${imgIdx + 1}`} className="w-full h-full object-cover" />
                              {imgIdx === 0 && (
                                <span className="absolute bottom-0.5 left-0.5 right-0.5 bg-[#39322f]/90 text-white text-[8px] font-bold text-center py-0.5 rounded-xs uppercase tracking-tighter">
                                  Main
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...productForm.colorVariants];
                                  updated[index].images = updated[index].images.filter((_, i) => i !== imgIdx);
                                  setProductForm({ ...productForm, colorVariants: updated });
                                }}
                                className="absolute top-0.5 right-0.5 bg-rose-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold opacity-90 hover:opacity-100 cursor-pointer shadow-xs"
                                title="Remove Image"
                              >
                                ✕
                              </button>
                            </div>
                          ))}

                          {(variant.images || []).length < 6 && (
                            <label className="w-16 h-16 rounded-xl border-2 border-dashed border-[#d4a373]/60 bg-[#f8f4ee] hover:bg-white flex flex-col items-center justify-center cursor-pointer transition-all shrink-0">
                              <span className="text-xs font-bold text-[#b58349]">+ Add</span>
                              <span className="text-[8px] text-gray-400 font-sans">Image</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const formData = new FormData();
                                  formData.append('image', file);
                                  formData.append('file', file);
                                  setUploadingField(`variant_img_${index}`);
                                  try {
                                    const res = await api.post('/admin/upload', formData, {
                                      headers: { 'Content-Type': 'multipart/form-data' },
                                    });
                                    if (res.data?.url) {
                                      const updated = [...productForm.colorVariants];
                                      const currentImgs = updated[index].images || [];
                                      updated[index].images = [...currentImgs, res.data.url];
                                      setProductForm({ ...productForm, colorVariants: updated });
                                    }
                                  } catch (err) {
                                    toast.error('Image upload failed');
                                  } finally {
                                    setUploadingField(null);
                                  }
                                }}
                              />
                            </label>
                          )}
                        </div>

                        {uploadingField === `variant_img_${index}` && (
                          <p className="text-[10px] text-[#d4a373] mt-1 animate-pulse font-medium">Uploading image...</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    const newVar = { name: '', hex: '#5a2d82', images: [] };
                    setProductForm({
                      ...productForm,
                      colorVariants: [...(productForm.colorVariants || []), newVar]
                    });
                    setTimeout(() => {
                      e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 50);
                  }}
                  className="w-full bg-white hover:bg-[#39322f] text-[#39322f] hover:text-white border border-[#d4a373]/50 font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5 text-[#d4a373]" /> Add Another Color Variant
                </button>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Product Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Fabric Composition</label>
                  <input
                    type="text"
                    placeholder="e.g. 100% Pure Chanderi Silk"
                    value={productForm.fabric}
                    onChange={(e) => setProductForm({ ...productForm, fabric: e.target.value })}
                    className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Care Instructions</label>
                  <input
                    type="text"
                    placeholder="e.g. Dry Clean Only"
                    value={productForm.care}
                    onChange={(e) => setProductForm({ ...productForm, care: e.target.value })}
                    className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Craftsmanship & Embroidery Story</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Handcrafted with Zardosi metallic threads & Gota Patti embellishments by master artisans in Jaipur."
                  value={productForm.craftsmanship}
                  onChange={(e) => setProductForm({ ...productForm, craftsmanship: e.target.value })}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Shipping & Return Policy Note</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Dispatched within 3-5 business days. 7-day hassle-free exchange."
                  value={productForm.shipping}
                  onChange={(e) => setProductForm({ ...productForm, shipping: e.target.value })}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>

              <div className="pt-4 border-t border-[#e8e2d9] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#39322f] hover:bg-[#d4a373] text-[#f7f3ee] hover:text-[#39322f] font-bold transition-all cursor-pointer shadow-sm"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY EDIT MODAL */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#d4a373]/30 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-[#39322f] overscroll-contain" data-lenis-prevent>
            <div className="flex items-center justify-between border-b border-[#e8e2d9] pb-4">
              <h3 className="text-lg font-cinzel font-bold text-[#2d2624]">
                {editingCat ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setIsCatModalOpen(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Category Name *</label>
                <input
                  type="text"
                  required
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Category Slug</label>
                <input
                  type="text"
                  placeholder="e.g. kurtis"
                  value={catForm.slug}
                  onChange={(e) => setCatForm({ ...catForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] font-mono focus:outline-none focus:border-[#d4a373]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Tagline</label>
                <input
                  type="text"
                  placeholder="Handprinted Malmal & Chanderi Tunics"
                  value={catForm.tagline}
                  onChange={(e) => setCatForm({ ...catForm, tagline: e.target.value })}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Collection Count Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. 28 Styles"
                  value={catForm.count}
                  onChange={(e) => setCatForm({ ...catForm, count: e.target.value })}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Category Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'cat')}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2 text-[#39322f] focus:outline-none focus:border-[#d4a373] file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#39322f] file:text-white file:font-semibold hover:file:bg-[#d4a373] hover:file:text-[#39322f] cursor-pointer"
                />
                {uploadingField === 'cat' && (
                  <p className="text-xs text-[#d4a373] mt-1 animate-pulse font-medium">Uploading to Cloudinary...</p>
                )}
                {catForm.image && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={catForm.image} alt="Preview" loading="lazy" className="w-12 h-12 object-cover rounded-lg border border-[#e8e2d9]" />
                    <span className="text-xs text-gray-500 truncate max-w-xs">{catForm.image}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#e8e2d9] flex justify-end gap-3">
                <button type="button" onClick={() => setIsCatModalOpen(false)} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 cursor-pointer font-semibold">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-[#39322f] text-[#f7f3ee] hover:bg-[#d4a373] hover:text-[#39322f] font-bold cursor-pointer">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HERO SLIDE MODAL */}
      {isSlideModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#d4a373]/30 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-[#39322f] overscroll-contain" data-lenis-prevent>
            <div className="flex items-center justify-between border-b border-[#e8e2d9] pb-4">
              <h3 className="text-lg font-cinzel font-bold text-[#2d2624]">
                {editingSlide ? 'Edit Hero Banner Slide' : 'Add Hero Banner Slide'}
              </h3>
              <button onClick={() => setIsSlideModalOpen(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveHeroSlide} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Main Title *</label>
                <input
                  type="text"
                  required
                  value={slideForm.title}
                  onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Subtitle Header</label>
                <input
                  type="text"
                  value={slideForm.subtitle}
                  onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Slide Description</label>
                <textarea
                  rows={2}
                  value={slideForm.description}
                  onChange={(e) => setSlideForm({ ...slideForm, description: e.target.value })}
                  placeholder="Intricate hand-highlighted Zardosi & Gota Patti festive ensembles..."
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">CTA Button Label</label>
                  <input
                    type="text"
                    value={slideForm.cta}
                    onChange={(e) => setSlideForm({ ...slideForm, cta: e.target.value })}
                    placeholder="Explore Collection"
                    className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Category Link</label>
                  <select
                    value={slideForm.categorySlug}
                    onChange={(e) => setSlideForm({ ...slideForm, categorySlug: e.target.value })}
                    className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.slug}>{c.name} ({c.slug})</option>
                    ))}
                    <option value="kurtis">Kurtis</option>
                    <option value="short-kurtis">Short Kurtis</option>
                    <option value="festive-wear">Festive Wear</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Carousel Display Order</label>
                <input
                  type="number"
                  min={0}
                  value={slideForm.order}
                  onChange={(e) => setSlideForm({ ...slideForm, order: e.target.value })}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Hero Slide Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'slide')}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2 text-[#39322f] focus:outline-none focus:border-[#d4a373] file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#39322f] file:text-white file:font-semibold hover:file:bg-[#d4a373] hover:file:text-[#39322f] cursor-pointer"
                />
                {uploadingField === 'slide' && (
                  <p className="text-xs text-[#d4a373] mt-1 animate-pulse font-medium">Uploading to Cloudinary...</p>
                )}
                {slideForm.image && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={slideForm.image} alt="Preview" loading="lazy" className="w-12 h-12 object-cover rounded-lg border border-[#e8e2d9]" />
                    <span className="text-xs text-gray-500 truncate max-w-xs">{slideForm.image}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#e8e2d9] flex justify-end gap-3">
                <button type="button" onClick={() => setIsSlideModalOpen(false)} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 cursor-pointer font-semibold">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-[#39322f] text-[#f7f3ee] hover:bg-[#d4a373] hover:text-[#39322f] font-bold cursor-pointer">
                  {editingSlide ? 'Save Slide Changes' : 'Add Hero Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISCOUNT MODAL */}
      {isDiscountModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#d4a373]/30 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-[#39322f] overscroll-contain" data-lenis-prevent>
            <div className="flex items-center justify-between border-b border-[#e8e2d9] pb-4">
              <h3 className="text-lg font-cinzel font-bold text-[#2d2624]">
                {editingDiscount ? 'Edit Discount Coupon' : 'Create Discount Coupon'}
              </h3>
              <button onClick={() => setIsDiscountModalOpen(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveDiscount} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE15"
                  value={discountForm.code}
                  onChange={(e) => setDiscountForm({ ...discountForm, code: e.target.value })}
                  disabled={Boolean(editingDiscount)}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] uppercase tracking-wider font-mono font-bold focus:outline-none focus:border-[#d4a373] disabled:opacity-60"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Discount %</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={discountForm.discountPercent}
                    onChange={(e) => setDiscountForm({ ...discountForm, discountPercent: e.target.value })}
                    className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Min Spend (₹)</label>
                  <input
                    type="number"
                    value={discountForm.minSpend}
                    onChange={(e) => setDiscountForm({ ...discountForm, minSpend: e.target.value })}
                    className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Description</label>
                <input
                  type="text"
                  placeholder="15% OFF for festival season"
                  value={discountForm.description}
                  onChange={(e) => setDiscountForm({ ...discountForm, description: e.target.value })}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>

              <div className="pt-4 border-t border-[#e8e2d9] flex justify-end gap-3">
                <button type="button" onClick={() => setIsDiscountModalOpen(false)} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 cursor-pointer font-semibold">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-[#39322f] text-[#f7f3ee] hover:bg-[#d4a373] hover:text-[#39322f] font-bold cursor-pointer">
                  {editingDiscount ? 'Save Coupon Changes' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* SHIPMENT & TRACKING MODAL */}
      {isShipmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-[#d4a373]/30 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-[#39322f]">
            <div className="flex items-center justify-between border-b border-[#e8e2d9] pb-4">
              <h3 className="text-lg font-cinzel font-bold text-[#2d2624]">
                Fulfill / Track Order #{selectedOrderForShipment?.id}
              </h3>
              <button onClick={() => setIsShipmentModalOpen(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveShipment} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Order Status</label>
                <select
                  value={shipmentForm.status}
                  onChange={(e) => setShipmentForm({ ...shipmentForm, status: e.target.value })}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] font-bold focus:outline-none focus:border-[#d4a373]"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Courier / Logistics Partner</label>
                <input
                  type="text"
                  placeholder="e.g. Delhivery, Blue Dart, India Post"
                  value={shipmentForm.carrier}
                  onChange={(e) => setShipmentForm({ ...shipmentForm, carrier: e.target.value })}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#39322f] mb-1 font-bold">Tracking AWB Number</label>
                <input
                  type="text"
                  placeholder="e.g. DELH129482910"
                  value={shipmentForm.trackingNumber}
                  onChange={(e) => setShipmentForm({ ...shipmentForm, trackingNumber: e.target.value })}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-xl px-4 py-2.5 text-[#39322f] font-mono font-bold focus:outline-none focus:border-[#d4a373]"
                />
              </div>

              <div className="pt-4 border-t border-[#e8e2d9] flex justify-end gap-3">
                <button type="button" onClick={() => setIsShipmentModalOpen(false)} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 cursor-pointer font-semibold">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-[#39322f] text-[#f7f3ee] hover:bg-[#d4a373] hover:text-[#39322f] font-bold cursor-pointer">Save Status & Tracking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
