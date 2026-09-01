import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import RosierProductCard from '../components/RosierProductCard';
import NotFoundPage from './NotFoundPage';
import { getImageUrl } from '../utils/image';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Plus, 
  Minus, 
  Check, 
  ChevronRight,
  ChevronLeft,
  Phone,
  MessageCircle,
  Sparkles,
  User,
  MessageSquare
} from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { 
    allProducts, 
    storeSettings, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    loading,
    currentUser,
    fetchProductReviews,
    submitProductReview
  } = useShop();

  const BRAND_CONTACT = storeSettings || {};
  const product = (allProducts || []).find(p => p.id === id);

  const productColors = (product?.colorVariants && product.colorVariants.length > 0)
    ? product.colorVariants
    : (product?.colors && product.colors.length > 0
        ? product.colors.map(c => ({
            name: typeof c === 'object' ? c.name : c,
            hex: typeof c === 'object' ? c.hex : '#5a2d82',
            images: [product.image, product.secondaryImage || product.image].filter(Boolean)
          }))
        : [{ name: 'Standard Pack', hex: '#C8960C', images: [product?.image, product?.secondaryImage || product?.image].filter(Boolean) }]);

  const availableDetailSizes = (product?.sizes && product.sizes.length > 0) ? product.sizes : ['Standard'];

  const [selectedColor, setSelectedColor] = useState(productColors[0]);
  const [selectedSize, setSelectedSize] = useState(availableDetailSizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Reviews state
  const [reviewsList, setReviewsList] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [canReview, setCanReview] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ratingInput, setRatingInput] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentInput, setCommentInput] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isEditingReview, setIsEditingReview] = useState(false);

  const RATING_DESCRIPTIONS = {
    1: '1 / 5 - Poor',
    2: '2 / 5 - Fair',
    3: '3 / 5 - Good',
    4: '4 / 5 - Very Good',
    5: '5 / 5 - Excellent'
  };

  // Gallery Images Array for the currently selected color
  const galleryImages = (selectedColor?.images && selectedColor.images.length > 0)
    ? selectedColor.images
    : (selectedColor?.image ? [selectedColor.image, ...(selectedColor.secondaryImage ? [selectedColor.secondaryImage] : [])] : [product?.image].filter(Boolean));

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Touch swipe state for mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    if (!product || !product.id) return;
    const cols = (product.colorVariants && product.colorVariants.length > 0)
      ? product.colorVariants
      : (product.colors && product.colors.length > 0
          ? product.colors.map(c => ({
              name: typeof c === 'object' ? c.name : c,
              hex: typeof c === 'object' ? c.hex : '#5a2d82',
              images: [product.image, product.secondaryImage || product.image].filter(Boolean)
            }))
          : [{ name: 'Standard Pack', hex: '#C8960C', images: [product.image, product.secondaryImage || product.image].filter(Boolean) }]);
    setSelectedColor(cols[0]);
    const sizes = (product.sizes && product.sizes.length > 0) ? product.sizes : ['Standard'];
    setSelectedSize(sizes[0]);
    setQuantity(1);
    setActiveImageIndex(0);
  }, [product?.id, product?.colorVariants, product?.colors, product?.sizes, product?.image]);

  // Load Product Reviews
  const loadReviews = async (page = 1) => {
    if (!product?.id) return;
    const res = await fetchProductReviews(product.id, page);
    if (res) {
      setReviewsList(res.reviews || []);
      setUserReview(res.userReview || null);
      setCanReview(Boolean(res.canReview));
      if (res.pagination) {
        setTotalPages(res.pagination.totalPages || 1);
      }
      if (res.userReview) {
        setRatingInput(res.userReview.rating);
        setCommentInput(res.userReview.comment || '');
      }
    }
  };

  useEffect(() => {
    if (product?.id) {
      loadReviews(reviewPage);
    }
  }, [product?.id, reviewPage]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!product?.id || isSubmittingReview) return;
    setIsSubmittingReview(true);
    try {
      await submitProductReview(product.id, {
        rating: ratingInput,
        comment: commentInput,
      });
      setIsEditingReview(false);
      await loadReviews(reviewPage);
    } catch (err) {
      // error toast handled in ShopContext
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Reset active image index when color changes
  const handleColorChange = (col) => {
    setSelectedColor(col);
    setActiveImageIndex(0);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 40) {
      handleNextImage();
    } else if (distance < -40) {
      handlePrevImage();
    }
  };

  const isWishlisted = isInWishlist(product?.id);
  const relatedProducts = (allProducts || []).filter(p => p?.id && p.id !== product?.id).slice(0, 4);

  const handleAddToCart = () => {
    if (!product?.id || product.isSoldOut) return;
    addToCart(product, selectedColor, selectedSize, quantity);
  };

  if (loading || !allProducts) {
    return (
      <div className="bg-[#f7f3ee] min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-2 border-[#d4a373] border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="font-serif text-xl font-bold text-[#39322f] mb-2">Loading Product Details...</h2>
        <p className="text-xs text-[#39322f]/60 mb-6 font-sans">Fetching artisanal details from Suranghi Naar studio.</p>
      </div>
    );
  }

  if (!product) {
    return <NotFoundPage />;
  }

  return (
    <div className="bg-[#f7f3ee] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#39322f]/60 mb-8 font-sans">
          <Link to="/" className="hover:text-[#39322f] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/shop" className="hover:text-[#39322f] transition-colors">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#39322f] font-semibold truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          
          {/* Main Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            
            {/* Thumbnail Strip */}
            {galleryImages.length > 1 && (
              <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto no-scrollbar max-h-[540px] shrink-0 justify-center sm:justify-start">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-[3/4] w-14 sm:w-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-[#f8f4ee] shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-[#d4a373] ring-2 ring-[#d4a373]/30 scale-105 shadow-md'
                        : 'border-[#e8e2d9] opacity-70 hover:opacity-100 hover:border-[#d4a373]/60'
                    }`}
                  >
                    <img src={getImageUrl(imgUrl, { width: 200 })} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Display Image */}
            <div className="relative aspect-[3/4] w-full luxury-glass rounded-3xl overflow-hidden border border-[#d4a373]/30 shadow-xl group flex-1">
              <div 
                className="w-full h-full relative overflow-hidden cursor-grab active:cursor-grabbing"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <img
                  src={getImageUrl(galleryImages[activeImageIndex] || galleryImages[0], { width: 1200 })}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transition-all duration-500"
                />
              </div>

              {product.badge && (
                <div className="absolute top-4 left-4 z-10 pointer-events-none">
                  <span className="bg-[#39322f] text-white text-[10px] uppercase font-sans tracking-widest px-3.5 py-1.5 rounded-full font-bold shadow-md flex items-center gap-1.5 border border-[#d4a373]/40">
                    <Sparkles className="w-3 h-3 text-[#d4a373]" />
                    {product.badge}
                  </span>
                </div>
              )}

              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 p-3 rounded-full bg-white/80 backdrop-blur-md text-[#39322f] hover:bg-white hover:text-rose-500 transition-all duration-300 shadow-lg z-10 cursor-pointer"
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>

              {/* Left / Right Navigation Arrows */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    aria-label="Previous Image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-white/80 hover:bg-white text-[#39322f] shadow-lg backdrop-blur-xs transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    aria-label="Next Image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-white/80 hover:bg-white text-[#39322f] shadow-lg backdrop-blur-xs transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Mobile Dot Indicators */}
              {galleryImages.length > 1 && (
                <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-10 sm:hidden">
                  {galleryImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        activeImageIndex === idx ? 'w-5 bg-[#d4a373]' : 'w-1.5 bg-white/70 hover:bg-white'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Purchasing Info */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-sans tracking-widest text-[#d4a373] font-bold">
                  {product.category || 'Luxury Ensemble'}
                </span>
                {product.reviewCount > 0 ? (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#39322f]">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < Math.floor(product.averageRating)
                              ? 'fill-[#d4a373] text-[#d4a373]'
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span>{product.averageRating}</span>
                    <span className="text-[#39322f]/50 font-normal">({product.reviewCount})</span>
                  </div>
                ) : null}
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#39322f] leading-tight">
                {product.name}
              </h1>

              {/* Price Row */}
              <div className="flex items-baseline gap-4 border-b border-[#e8e2d9] pb-4">
                <span className="font-serif text-3xl font-bold text-[#39322f]">
                  ₹{(product.price || 0).toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-[#39322f]/40 line-through font-sans">
                    ₹{(product.originalPrice || 0).toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md">
                  Inclusive of all taxes
                </span>
              </div>

              {/* Description summary */}
              <p className="text-sm text-[#39322f]/80 font-sans font-light leading-relaxed">
                {product.description}
              </p>

              {/* Pack Type Selector */}
              {productColors && productColors.length > 1 && (
                <div className="space-y-2.5">
                  <label className="block text-xs uppercase font-semibold text-[#3E2723] tracking-wider">
                    Pack Type: <span className="text-[#C8960C]">{selectedColor?.name || productColors[0]?.name}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {productColors.map((col, idx) => {
                      const packName = (typeof col === 'object' ? col.name : col) || 'Standard';
                      const isSelected = selectedColor?.name === packName;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleColorChange(col)}
                          className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#3E2723] text-white border-[#3E2723]'
                              : 'bg-white text-[#3E2723] border-[#E8DCC8] hover:border-[#C8960C]'
                          }`}
                        >
                          {packName}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Weight / Size Selector */}
              <div className="space-y-2.5">
                <label className="block text-xs uppercase font-semibold text-[#3E2723] tracking-wider">
                  Select Size: <span className="text-[#C8960C]">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {availableDetailSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-semibold font-sans border transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'bg-[#3E2723] text-white border-[#3E2723] shadow-md'
                          : 'bg-white text-[#3E2723] border-[#E8DCC8] hover:border-[#C8960C]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector & Add to Cart Action */}
              <div className="flex items-center gap-4 pt-4 border-t border-[#e8e2d9]">
                <div className="flex items-center border border-[#e8e2d9] bg-white rounded-full p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-[#39322f] hover:text-[#d4a373] transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold font-sans text-[#39322f]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-[#39322f] hover:text-[#d4a373] transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.isSoldOut}
                  className={`flex-1 py-3.5 px-6 rounded-full text-xs font-semibold uppercase tracking-widest font-sans transition-all duration-300 flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                    product.isSoldOut
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#39322f] hover:bg-[#d4a373] text-[#f7f3ee] hover:text-[#39322f]'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{product.isSoldOut ? 'Sold Out' : 'Add to Cart'}</span>
                </button>
              </div>

            </div>

            {/* Assistance Section */}
            <div className="bg-[#fcfbfa] border border-[#e8e2d9] rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-[#39322f]/80 font-sans">
                <span className="font-semibold">Need help choosing the right pack or bulk order?</span>
                <div className="flex items-center gap-2">
                  <a 
                    href={`tel:${BRAND_CONTACT.phone || '+91 98765 43210'}`}
                    className="flex items-center gap-1 bg-[#f7f3ee] border border-[#e8e2d9] px-3 py-1 rounded-full text-[#39322f] hover:border-[#d4a373] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#d4a373]" />
                    <span>Call Us</span>
                  </a>
                  {BRAND_CONTACT.whatsapp && (
                    <a 
                      href={BRAND_CONTACT.whatsapp}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 bg-emerald-600 text-white px-3 py-1 rounded-full font-semibold hover:bg-emerald-700 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Tabbed Product Details: Description, Fabric & Care, Delivery */}
        <div className="bg-[#fcfbfa] rounded-3xl p-6 sm:p-12 border border-[#e8e2d9] shadow-sm mb-16">
          <div className="flex overflow-x-auto no-scrollbar border-b border-[#e8e2d9] text-xs font-semibold uppercase tracking-wider gap-4 sm:gap-8 whitespace-nowrap">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-4 transition-colors cursor-pointer shrink-0 ${
                activeTab === 'description' ? 'text-[#d4a373] border-b-2 border-[#d4a373]' : 'text-[#39322f]/60 hover:text-[#39322f]'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`pb-4 transition-colors cursor-pointer shrink-0 ${
                activeTab === 'ingredients' ? 'text-[#C8960C] border-b-2 border-[#C8960C]' : 'text-[#3E2723]/60 hover:text-[#3E2723]'
              }`}
            >
              Ingredients & Storage
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-4 transition-colors cursor-pointer shrink-0 ${
                activeTab === 'shipping' ? 'text-[#d4a373] border-b-2 border-[#d4a373]' : 'text-[#39322f]/60 hover:text-[#39322f]'
              }`}
            >
              Shipping & Returns
            </button>
          </div>

          <div className="pt-6 text-sm text-[#39322f]/80 font-sans font-light leading-relaxed">
            {activeTab === 'description' && (
              <p>{product.description}</p>
            )}
            {activeTab === 'ingredients' && (
              <div className="space-y-3">
                <p><strong>Ingredients:</strong> {product.fabric || '100% pure, natural ingredients'}</p>
                {product.craftsmanship && (
                  <p><strong>Process:</strong> {product.craftsmanship}</p>
                )}
                <p><strong>Storage:</strong> {product.care || 'Store in a cool, dry place away from direct sunlight.'}</p>
              </div>
            )}
            {activeTab === 'shipping' && (
              <div className="space-y-2">
                <p>{product.shipping || 'Free delivery on orders above ₹999. Standard delivery in 2-4 business days.'}</p>
                <p>7-Day hassle-free returns on unopened products. Contact us for bulk or wholesale orders.</p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Ratings & Reviews Section */}
        <div className="bg-[#fcfbfa] rounded-3xl p-6 sm:p-12 border border-[#e8e2d9] shadow-sm mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e8e2d9] pb-6 mb-8">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#39322f]">
                Customer Reviews
              </h3>
              <p className="text-xs text-[#39322f]/60 font-sans mt-1">
                Authentic feedback from verified patrons of Suranghi Naar
              </p>
            </div>

            {/* Average Rating Breakdown Header */}
            <div className="flex items-center gap-3 bg-[#f7f3ee] border border-[#e8e2d9] px-4 py-2.5 rounded-2xl">
              <div className="font-serif text-2xl font-bold text-[#39322f]">
                {product.averageRating || '5.0'}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center text-[#d4a373]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.averageRating || 5)
                          ? 'fill-[#d4a373] text-[#d4a373]'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-[10px] text-[#39322f]/60 font-sans">
                  {product.reviewCount || 0} verified reviews
                </div>
              </div>
            </div>
          </div>

          {/* Submit / Edit Review Box (for buyers with delivered orders) */}
          {currentUser && (canReview || userReview) && (
            <div className="mb-10 bg-[#f7f3ee] border border-[#d4a373]/40 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-serif text-base font-bold text-[#39322f]">
                  {userReview && !isEditingReview ? 'Your Verified Review' : (userReview ? 'Edit Your Review' : 'Write a Review')}
                </h4>
                {userReview && !isEditingReview && (
                  <button
                    onClick={() => setIsEditingReview(true)}
                    className="text-xs text-[#d4a373] hover:underline font-semibold cursor-pointer"
                  >
                    Edit Review
                  </button>
                )}
              </div>

              {userReview && !isEditingReview ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex text-[#d4a373]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < userReview.rating ? 'fill-[#d4a373]' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-[#39322f]/50 font-sans">
                      {new Date(userReview.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  {userReview.comment && (
                    <p className="text-xs text-[#39322f]/80 font-sans italic">"{userReview.comment}"</p>
                  )}
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {/* Star Rating Picker */}
                  <div>
                    <label className="block text-xs uppercase font-semibold text-[#39322f] mb-1.5 tracking-wider">
                      Rating:
                    </label>
                    <div 
                      className="flex items-center gap-2"
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const activeRating = hoverRating || ratingInput;
                          const isFilled = star <= activeRating;
                          return (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRatingInput(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              className="p-1 cursor-pointer hover:scale-125 transition-transform"
                              title={`${star} Star${star > 1 ? 's' : ''}`}
                            >
                              <Star
                                className={`w-6 h-6 transition-all duration-150 ${
                                  isFilled
                                    ? 'fill-[#d4a373] text-[#d4a373] drop-shadow-xs'
                                    : 'text-gray-300 fill-transparent'
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                      <span className="text-xs font-bold text-[#b58349] font-sans ml-2">
                        {RATING_DESCRIPTIONS[hoverRating || ratingInput]}
                      </span>
                    </div>
                  </div>

                  {/* Comment Area */}
                  <div>
                    <label className="block text-xs uppercase font-semibold text-[#39322f] mb-1.5 tracking-wider">
                      Your Experience / Comment (Optional):
                    </label>
                    <textarea
                      rows={3}
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Share your experience — taste, quality, packaging, delivery..."
                      className="w-full bg-white border border-[#e8e2d9] rounded-xl p-3 text-xs text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="px-6 py-2.5 bg-[#39322f] hover:bg-[#d4a373] text-white hover:text-[#39322f] font-semibold text-xs uppercase tracking-wider rounded-full transition-all cursor-pointer shadow-md disabled:opacity-50"
                    >
                      {isSubmittingReview ? 'Submitting...' : (userReview ? 'Update Review' : 'Submit Review')}
                    </button>
                    {isEditingReview && (
                      <button
                        type="button"
                        onClick={() => setIsEditingReview(false)}
                        className="px-4 py-2.5 text-xs text-[#39322f]/60 hover:text-[#39322f] cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}

          {/* List of Reviews */}
          {reviewsList.length === 0 ? (
            <div className="text-center py-10 text-[#39322f]/60 font-sans text-xs">
              <MessageSquare className="w-8 h-8 text-[#d4a373]/60 mx-auto mb-2" />
              <p>No reviews yet for this product.</p>
              {!canReview && (
                <p className="text-[11px] text-[#39322f]/40 mt-1">
                  Reviews can be submitted by patrons with delivered orders.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {reviewsList.map((rev) => (
                <div key={rev.id} className="border-b border-[#e8e2d9] pb-6 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#39322f] text-white flex items-center justify-center font-bold text-xs font-serif uppercase">
                        {rev.user?.name ? rev.user.name.charAt(0) : 'C'}
                      </div>
                      <div>
                        <span className="font-semibold text-xs text-[#39322f] block">
                          {rev.user?.name || 'Verified Patron'}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-semibold">
                          Verified Buyer
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex text-[#d4a373]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-[#d4a373]' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-[#39322f]/40 font-sans">
                        {new Date(rev.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {rev.comment && (
                    <p className="text-xs text-[#39322f]/80 font-sans leading-relaxed pl-10">
                      "{rev.comment}"
                    </p>
                  )}
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <button
                    disabled={reviewPage <= 1}
                    onClick={() => setReviewPage(prev => prev - 1)}
                    className="px-3 py-1.5 rounded-lg border border-[#e8e2d9] text-xs font-semibold disabled:opacity-40 cursor-pointer"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-[#39322f]/60 font-sans">
                    Page {reviewPage} of {totalPages}
                  </span>
                  <button
                    disabled={reviewPage >= totalPages}
                    onClick={() => setReviewPage(prev => prev + 1)}
                    className="px-3 py-1.5 rounded-lg border border-[#e8e2d9] text-xs font-semibold disabled:opacity-40 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Related Products Section */}
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#39322f] mb-8">
            You May Also Love
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map(p => (
              <RosierProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
