import React from 'react';
import { useShop } from '../context/ShopContext';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { getImageUrl } from '../utils/image';


export default function WishlistDrawer() {
  const { 
    allProducts, 
    wishlist, 
    isWishlistOpen, 
    setIsWishlistOpen, 
    toggleWishlist,
    addToCart,
    setQuickViewProduct
  } = useShop();

  React.useEffect(() => {
    if (isWishlistOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isWishlistOpen]);

  if (!isWishlistOpen) return null;

  const wishlistedProducts = allProducts.filter(p => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
        onClick={() => setIsWishlistOpen(false)} 
      />

      {/* Drawer */}
      <div 
        className="relative w-full max-w-md bg-[#fcfbfa] h-full shadow-2xl z-10 flex flex-col justify-between animate-in slide-in-from-right duration-300 overscroll-contain"
        data-lenis-prevent
      >
        
        {/* Header */}
        <div className="p-5 border-b border-[#e8e2d9] flex items-center justify-between bg-[#f7f3ee]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#c59b27] fill-[#c59b27]" />
            <h3 className="font-serif font-bold text-xl text-[#39322f]">
              Saved Wishlist ({wishlistedProducts.length})
            </h3>
          </div>
          <button 
            onClick={() => setIsWishlistOpen(false)}
            aria-label="Close Wishlist"
            className="p-1.5 text-[#39322f] hover:text-[#d4a373] transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {wishlistedProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-16 h-16 rounded-full bg-[#f7f3ee] flex items-center justify-center text-[#39322f]/40">
                <Heart className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-xl font-bold text-[#39322f]">
                Your wishlist is empty
              </h4>
              <p className="text-xs text-[#39322f]/60 font-sans max-w-xs leading-relaxed">
                Save your favorite handcrafted kurtis, short kurtis, and festive wear to revisit anytime.
              </p>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="mt-2 bg-[#39322f] hover:bg-[#d4a373] text-white px-8 py-3 rounded-full text-xs font-sans uppercase tracking-widest font-semibold transition-all cursor-pointer"
              >
                Explore Catalog
              </button>
            </div>
          ) : (
            wishlistedProducts.map((product) => (
              <div 
                key={product.id}
                className="flex gap-4 p-3 bg-[#f7f3ee]/50 rounded-lg border border-[#e8e2d9]/60 relative group"
              >
                <div 
                  onClick={() => {
                    setIsWishlistOpen(false);
                    setQuickViewProduct(product);
                  }}
                  className="w-20 h-24 rounded-md overflow-hidden bg-gray-100 shrink-0 cursor-pointer border border-[#e8e2d9]"
                >
                  <img src={getImageUrl(product.image)} alt={product.name} loading="lazy" className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 
                        onClick={() => {
                          setIsWishlistOpen(false);
                          setQuickViewProduct(product);
                        }}
                        className="font-serif font-semibold text-sm text-[#39322f] line-clamp-1 cursor-pointer hover:text-[#d4a373]"
                      >
                        {product.name}
                      </h4>
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="text-[#39322f]/40 hover:text-red-600 transition-colors p-1 cursor-pointer"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <span className="text-[11px] text-[#d4a373] uppercase tracking-wider font-semibold">
                      {product.category}
                    </span>

                    <p className="font-serif font-bold text-sm text-[#39322f] mt-1">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(product);
                      toggleWishlist(product.id);
                    }}
                    className="mt-2 w-full bg-[#39322f] hover:bg-[#d4a373] text-white py-2 rounded-md text-xs font-sans uppercase font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlistedProducts.length > 0 && (
          <div className="p-5 bg-[#f7f3ee] border-t border-[#e8e2d9]">
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="w-full bg-[#39322f] hover:bg-[#d4a373] text-white py-3 rounded-full text-xs font-sans uppercase tracking-widest font-semibold transition-all cursor-pointer text-center"
            >
              Continue Browsing
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
