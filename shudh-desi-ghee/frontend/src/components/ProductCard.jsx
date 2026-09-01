import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { getImageUrl } from '../utils/image';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';

export default function ProductCard({ product }) {
  const { 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setQuickViewProduct 
  } = useShop();

  const cardVariants = (product.colorVariants && product.colorVariants.length > 0)
    ? product.colorVariants
    : (product.colors && product.colors.length > 0
        ? product.colors.map(c => ({
            name: typeof c === 'object' ? c.name : c,
            hex: typeof c === 'object' ? c.hex : '#5a2d82',
            images: [product.image, product.secondaryImage || product.image].filter(Boolean)
          }))
        : [{ name: 'Royal Purple', hex: '#5a2d82', images: [product.image, product.secondaryImage || product.image].filter(Boolean) }]);

  const [selectedColor, setSelectedColor] = useState(cardVariants[0]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(0);

  const intervalRef = useRef(null);

  useEffect(() => {
    const vars = (product.colorVariants && product.colorVariants.length > 0)
      ? product.colorVariants
      : (product.colors && product.colors.length > 0
          ? product.colors.map(c => ({
              name: typeof c === 'object' ? c.name : c,
              hex: typeof c === 'object' ? c.hex : '#5a2d82',
              images: [product.image, product.secondaryImage || product.image].filter(Boolean)
            }))
          : [{ name: 'Royal Purple', hex: '#5a2d82', images: [product.image, product.secondaryImage || product.image].filter(Boolean) }]);
    setSelectedColor(vars[0]);
  }, [product.id, product.colorVariants, product.colors, product.image, product.secondaryImage]);

  const variantImages = (selectedColor?.images && selectedColor.images.length > 0)
    ? selectedColor.images
    : (selectedColor?.image
        ? [selectedColor.image, ...(selectedColor.secondaryImage ? [selectedColor.secondaryImage] : [])].filter(Boolean)
        : [product.image]);

  const stopCycling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleMouseEnter = () => {
    if (variantImages.length > 1) {
      stopCycling();
      intervalRef.current = setInterval(() => {
        setHoverIndex((prev) => (prev + 1) % variantImages.length);
      }, 700);
    }
  };

  const handleMouseLeave = () => {
    stopCycling();
    setHoverIndex(0);
  };

  useEffect(() => {
    stopCycling();
    setHoverIndex(0);
    return () => stopCycling();
  }, [selectedColor, product.id]);

  const isWishlisted = isInWishlist(product.id);
  const validSizes = (product.sizes || []).filter(s => ['S', 'M', 'L', 'XL', 'XXL'].includes(s));
  const availableSizes = validSizes.length > 0 ? validSizes : ['M', 'L', 'XL', 'XXL'];

  const handleQuickAddSize = (e, size) => {
    e.stopPropagation();
    e.preventDefault();
    if (product.isSoldOut) return;
    setSelectedSize(size);
    addToCart(product, selectedColor, size, 1);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (product.isSoldOut) return;
    addToCart(product, selectedColor, selectedSize || availableSizes[0]);
  };

  return (
    <div 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col luxury-glass border border-[#d4a373]/30 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-[#d4a373] gold-glow-hover"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f8f4ee]">
        
        {/* Link to Product Details */}
        <Link to={`/product/${product.id}`} className="block w-full h-full relative overflow-hidden">
          {variantImages.length > 1 ? (
            variantImages.map((imgUrl, idx) => (
              <img
                key={idx}
                src={getImageUrl(imgUrl, { width: 800 })}
                alt={`${product.name} view ${idx + 1}`}
                loading={idx === 0 ? "eager" : "lazy"}
                className={`w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-108 absolute inset-0 ${
                  idx === hoverIndex ? 'opacity-100 z-1' : 'opacity-0 z-0'
                }`}
              />
            ))
          ) : (
            <img
              src={getImageUrl(variantImages[0] || product.image, { width: 800 })}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
            />
          )}
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isSoldOut ? (
            <span className="bg-[#1a1716] text-white text-[9px] uppercase font-sans tracking-widest px-3 py-1 rounded-full font-bold shadow-md">
              Sold Out
            </span>
          ) : product.badge ? (
            <span className="bg-gradient-to-r from-[#d4a373] via-[#e6c594] to-[#b58349] text-[#1a1716] text-[9px] uppercase font-sans tracking-widest px-3 py-1 rounded-full font-extrabold shadow-md">
              {product.badge}
            </span>
          ) : null}

          {product.originalPrice && !product.isSoldOut && (
            <span className="bg-[#b58349] text-white text-[9px] font-sans px-2.5 py-0.5 rounded-full font-bold shadow-md">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label="Wishlist"
          className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-white/90 hover:bg-white text-[#39322f] shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 cursor-pointer"
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-[#d4a373] text-[#d4a373]' : 'hover:text-[#d4a373]'
            }`} 
          />
        </button>

        {/* Quick-Size Selector Drawer Bar on Hover */}
        {!product.isSoldOut && (
          <div className="absolute inset-x-3 bottom-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-3 group-hover:translate-y-0">
            <div className="bg-[#fcfbfa]/95 backdrop-blur-md p-2 rounded-xl shadow-xl border border-[#e8e2d9] text-center">
              <div className="text-[9px] uppercase tracking-widest text-[#39322f]/60 font-semibold mb-1">
                Quick Add Size
              </div>
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={(e) => handleQuickAddSize(e, size)}
                    className="px-2.5 py-1 text-[10px] font-semibold uppercase rounded-md bg-[#f7f3ee] hover:bg-[#39322f] hover:text-white text-[#39322f] transition-all border border-[#e8e2d9] cursor-pointer"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick View Floating Action */}
        <div className="absolute top-14 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 hidden sm:block">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            title="Quick View"
            className="p-2.5 rounded-full bg-white/90 hover:bg-[#39322f] text-[#39322f] hover:text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Information Body */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between bg-[#fcfbfa]">
        <div>
          {/* Category Tag & Rating */}
          <div className="flex items-center justify-between text-xs text-[#39322f]/60 font-sans mb-1">
            <Link to={`/category/${product.categorySlug || 'kurtis'}`} className="uppercase tracking-wider text-[9px] sm:text-[10px] font-semibold text-[#d4a373] hover:underline">
              {product.category}
            </Link>
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-[#39322f]">
                <Star className="w-3 h-3 fill-[#d4a373] text-[#d4a373]" />
                <span>{product.averageRating} ({product.reviewCount})</span>
              </div>
            )}
          </div>

          {/* Product Title Link */}
          <Link 
            to={`/product/${product.id}`}
            className="font-serif text-sm sm:text-base font-semibold text-[#39322f] hover:text-[#d4a373] transition-colors line-clamp-1 block"
          >
            {product.name}
          </Link>

          {/* Color Swatches Row */}
          <div className="flex items-center gap-1.5 mt-2 mb-1.5">
            {cardVariants.map((color, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedColor(color)}
                title={color.name}
                className={`w-3.5 h-3.5 rounded-full border border-gray-300 transition-all cursor-pointer ${
                  selectedColor?.name === color.name ? 'ring-2 ring-[#d4a373] scale-110' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: color.hex || '#5a2d82' }}
              />
            ))}
            <span className="text-[9px] sm:text-[10px] text-[#39322f]/60 font-sans ml-0.5 line-clamp-1">
              {selectedColor?.name || cardVariants[0]?.name}
            </span>
          </div>
        </div>

        {/* Price & Action Button Footer */}
        <div className="pt-2.5 mt-1.5 border-t border-[#e8e2d9]/60 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="font-serif text-sm sm:text-base font-bold text-[#39322f]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] sm:text-xs text-[#39322f]/40 line-through font-sans">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.isSoldOut}
            className={`p-2 sm:p-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              product.isSoldOut
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#39322f] hover:bg-[#d4a373] text-white shadow-md hover:scale-110'
            }`}
            title={product.isSoldOut ? "Sold Out" : "Add to Cart"}
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.8]" />
          </button>
        </div>

      </div>
    </div>
  );
}
