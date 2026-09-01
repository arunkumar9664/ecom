import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Minus, Plus } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { getImageUrl } from '../utils/image';

function getVariants(product) {
  if (product.colorVariants?.length) return product.colorVariants;
  return [{ name: 'Standard', hex: '#C8960C', images: [product.image] }];
}

function getBadgeEmoji(badge) {
  const map = { 'Best Seller': '🔥', Trending: '🚀', 'Must Try': '😋', 'Summer Special': '☀️', Combo: '🎁', Immunity: '💪' };
  for (const [key, emoji] of Object.entries(map)) {
    if (badge?.includes(key)) return emoji;
  }
  return '✨';
}

export default function RosierProductCard({ product, compact = false }) {
  const { addToCart } = useShop();
  const variants = getVariants(product);
  const [selectedPack, setSelectedPack] = useState(variants[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'Standard');
  const [qty, setQty] = useState(1);

  const image = selectedPack?.images?.[0] || product.image;

  const handleAdd = () => {
    if (product.isSoldOut) return;
    addToCart(product, selectedPack, selectedSize, qty);
  };

  return (
    <article className={`flex flex-col bg-white rounded-lg border border-[#E8DCC8] overflow-hidden shadow-sm hover:shadow-md transition-shadow ${compact ? 'min-w-[240px]' : ''}`}>
      <Link to={`/product/${product.id}`} className="block relative aspect-square bg-[#FFF8E7] overflow-hidden">
        <img
          src={getImageUrl(image, { width: 600 })}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        {product.badge && (
          <span className="absolute top-2 left-2 bg-white/95 text-[#3E2723] text-[10px] font-semibold px-2 py-1 rounded-full shadow-sm">
            {getBadgeEmoji(product.badge)} {product.badge}
          </span>
        )}
      </Link>

      <div className="p-3 sm:p-4 flex flex-col flex-1 gap-2">
        <Link to={`/product/${product.id}`} className="font-serif text-sm sm:text-base font-semibold text-[#3E2723] hover:text-[#C8960C] line-clamp-2 leading-snug">
          {product.name}
        </Link>

        <div className="flex items-center gap-1 text-xs text-[#5D4037]">
          <Star className="w-3.5 h-3.5 fill-[#C8960C] text-[#C8960C]" />
          <span className="font-medium">{product.rating || 4.9} Star</span>
        </div>

        {product.sizes?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.sizes.slice(0, compact ? 3 : 5).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                  selectedSize === size
                    ? 'bg-[#3E2723] text-white border-[#3E2723]'
                    : 'bg-[#FFF8E7] text-[#3E2723] border-[#E8DCC8] hover:border-[#C8960C]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        {variants.length > 1 && (
          <div className="flex flex-wrap gap-1">
            {variants.map((v) => (
              <button
                key={v.name}
                type="button"
                onClick={() => setSelectedPack(v)}
                title={v.name}
                className={`text-[10px] px-2 py-0.5 rounded border cursor-pointer ${
                  selectedPack?.name === v.name ? 'border-[#C8960C] bg-[#FFF8E7]' : 'border-[#E8DCC8]'
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className="text-base font-bold text-[#3E2723]">₹{product.price.toLocaleString('en-IN')}.00</span>
          {product.originalPrice && (
            <span className="text-xs text-[#8D6E63] line-through">₹{product.originalPrice.toLocaleString('en-IN')}.00</span>
          )}
        </div>

        <div className="flex items-center gap-2 pt-1">
          <div className="flex items-center border border-[#E8DCC8] rounded-md overflow-hidden shrink-0">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-2.5 py-2 hover:bg-[#FFF8E7] cursor-pointer touch-manipulation min-h-[44px] min-w-[36px] flex items-center justify-center" aria-label="Decrease">
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-sm font-medium min-w-[28px] text-center">{qty}</span>
            <button type="button" onClick={() => setQty((q) => q + 1)} className="px-2.5 py-2 hover:bg-[#FFF8E7] cursor-pointer touch-manipulation min-h-[44px] min-w-[36px] flex items-center justify-center" aria-label="Increase">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={product.isSoldOut}
            className="flex-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider py-2.5 px-2 rounded-md bg-[#3E2723] text-white hover:bg-[#C8960C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer touch-manipulation min-h-[44px]"
          >
            {product.isSoldOut ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  );
}
