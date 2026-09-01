import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Star, 
  Plus, 
  Minus,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getImageUrl } from '../utils/image';


function QuickViewModalContent({ product, onClose }) {
  const { 
    addToCart, 
    toggleWishlist, 
    isInWishlist 
  } = useShop();

  const modalVariants = (product.colorVariants && product.colorVariants.length > 0)
    ? product.colorVariants
    : (product.colors && product.colors.length > 0
        ? product.colors.map(c => ({
            name: typeof c === 'object' ? c.name : c,
            hex: typeof c === 'object' ? c.hex : '#5a2d82',
            images: [product.image, product.secondaryImage || product.image].filter(Boolean)
          }))
        : [{ name: 'Royal Purple', hex: '#5a2d82', images: [product.image, product.secondaryImage || product.image].filter(Boolean) }]);

  const modalSizes = (product.sizes || []).filter(s => ['S', 'M', 'L', 'XL', 'XXL'].includes(s));
  const availableModalSizes = modalSizes.length > 0 ? modalSizes : ['M', 'L', 'XL', 'XXL'];

  const [selectedColor, setSelectedColor] = useState(modalVariants[0]);
  const [selectedSize, setSelectedSize] = useState(availableModalSizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const modalImages = (selectedColor?.images && selectedColor.images.length > 0)
    ? selectedColor.images
    : (selectedColor?.image ? [selectedColor.image, ...(selectedColor.secondaryImage ? [selectedColor.secondaryImage] : [])] : [product.image]);

  React.useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedColor]);

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + modalImages.length) % modalImages.length);
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % modalImages.length);
  };

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (product.isSoldOut) return;
    addToCart(product, selectedColor, selectedSize, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-4xl bg-[#fcfbfa] rounded-2xl shadow-2xl overflow-hidden border border-[#e8e2d9] grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto overscroll-contain"
        data-lenis-prevent
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 p-2 text-[#39322f]/60 hover:text-[#39322f] rounded-full bg-white/80 backdrop-blur-xs hover:bg-white transition-all cursor-pointer shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Images Column */}
        <div className="p-6 bg-[#f7f3ee] flex flex-col justify-between">
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-inner border border-[#e8e2d9] bg-white mb-4 group">
            <img 
              src={getImageUrl(modalImages[activeImageIndex] || modalImages[0])} 
              alt={product.name} 
              loading="lazy"
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 bg-[#39322f] text-[#f7f3ee] text-[10px] uppercase font-sans tracking-widest font-semibold px-3 py-1 rounded-full shadow-md">
                {product.badge}
              </span>
            )}

            {modalImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  aria-label="Previous image"
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 text-[#39322f] hover:bg-white shadow-md transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextImage}
                  aria-label="Next image"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 text-[#39322f] hover:bg-white shadow-md transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

        </div>

        {/* Details & Customization Column */}
        <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs uppercase font-sans tracking-widest text-[#d4a373] font-bold">
                {product.category}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#39322f] mt-1">
                {product.name}
              </h3>
            </div>

            {/* Price & Ratings */}
            <div className="flex items-center justify-between pb-3 border-b border-[#e8e2d9]">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl font-bold text-[#39322f]">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="font-sans text-sm text-gray-400 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {product.rating && (
                <div className="flex items-center gap-1 text-xs font-semibold text-[#39322f]">
                  <Star className="w-4 h-4 fill-[#d4a373] text-[#d4a373]" />
                  <span>{product.rating}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-xs font-sans text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Colors Selection */}
            {modalVariants && modalVariants.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs uppercase font-sans tracking-wider font-semibold text-[#39322f] block">
                  Color Option: <span className="text-[#d4a373] font-normal">{selectedColor?.name}</span>
                </label>
                <div className="flex gap-2">
                  {modalVariants.map((c, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(c)}
                      aria-label={`Select color ${c.name}`}
                      className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                        selectedColor?.name === c.name ? 'border-[#39322f] scale-110 shadow-xs' : 'border-white shadow-2xs hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {selectedColor?.name === c.name && (
                        <Check className="w-3.5 h-3.5 text-white drop-shadow-xs" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes Selection */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-sans tracking-wider font-semibold text-[#39322f] block">
                Select Size: <span className="text-[#d4a373] font-normal">{selectedSize}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {availableModalSizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-sans uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-[#39322f] text-white shadow-xs'
                        : 'bg-[#f7f3ee] text-[#39322f] hover:bg-[#e8e2d9]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-sans tracking-wider font-semibold text-[#39322f] block">
                Quantity
              </label>
              <div className="inline-flex items-center border border-[#e8e2d9] rounded-xl bg-[#f7f3ee]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-[#39322f] hover:text-[#d4a373] transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-sans font-semibold text-sm text-[#39322f]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-[#39322f] hover:text-[#d4a373] transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#e8e2d9] flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.isSoldOut}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-sans text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer shadow-md ${
                product.isSoldOut
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#39322f] hover:bg-[#d4a373] text-[#f7f3ee] hover:text-[#39322f]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{product.isSoldOut ? 'Sold Out' : 'Add to Bag'}</span>
            </button>

            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-3.5 rounded-xl border border-[#e8e2d9] transition-all cursor-pointer ${
                isWishlisted ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-[#f7f3ee] text-[#39322f] hover:bg-[#e8e2d9]'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct } = useShop();

  React.useEffect(() => {
    if (quickViewProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  return (
    <QuickViewModalContent 
      product={quickViewProduct} 
      onClose={() => setQuickViewProduct(null)} 
    />
  );
}

