import React, { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import RosierProductCard from '../components/RosierProductCard';
import { Filter, SlidersHorizontal, ChevronRight, X } from 'lucide-react';


export default function CategoryPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const { allProducts, categories } = useShop();

  const [sortBy, setSortBy] = useState('recommended');
  const [maxPrice, setMaxPrice] = useState(40000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Find active category info
  const catList = categories || [];
  const currentCategory = catList.find(
    c => c.slug === slug || c.id === slug
  );
  
  const categoryTitle = searchQuery 
    ? `Search Results for "${searchQuery}"`
    : (currentCategory ? currentCategory.name : (slug ? slug.replace(/-/g, ' ') : 'All Products'));


  // Filter products by category (if slug exists), search query, price, and stock status
  let products = allProducts;

  if (slug && slug !== 'all') {
    products = products.filter(
      p => p.categorySlug === slug || (p.category && p.category.toLowerCase().replace(/\s+/g, '-') === slug)
    );
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    products = products.filter(
      p => p.name.toLowerCase().includes(q) ||
           p.category.toLowerCase().includes(q) ||
           (p.description && p.description.toLowerCase().includes(q)) ||
           (p.fabric && p.fabric.toLowerCase().includes(q))
    );
  }

  // Filter by price & stock
  products = products.filter(p => p.price <= maxPrice);
  if (inStockOnly) {
    products = products.filter(p => !p.isSoldOut);
  }

  // Sort products
  if (sortBy === 'price-low') {
    products.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    products.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  // Helper to dynamically calculate style count for each category based on real products
  const getCategoryStyleCount = (cat) => {
    const matchingCount = (allProducts || []).filter(p => 
      p.categorySlug === cat.slug || 
      (p.category && p.category.toLowerCase().replace(/\s+/g, '-') === cat.slug) ||
      (p.category && cat.name && p.category.toLowerCase() === cat.name.toLowerCase())
    ).length;
    return `${matchingCount} Styles`;
  };

  return (
    <div className="bg-[#f7f3ee] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-sans text-[#39322f]/60 mb-6 uppercase tracking-wider">
          <Link to="/" className="hover:text-[#d4a373] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/shop" className="hover:text-[#d4a373] transition-colors">Collections</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#39322f] font-semibold">{categoryTitle}</span>
        </nav>

        {/* Header Title Banner */}
        <div className="bg-[#fcfbfa] border border-[#e8e2d9] rounded-2xl p-8 sm:p-12 mb-10 text-center relative overflow-hidden shadow-xs">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase font-sans tracking-[0.25em] text-[#d4a373] font-semibold">
              Curated Edit
            </span>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#39322f] capitalize">
              {categoryTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#39322f]/70 font-sans font-light max-w-lg mx-auto">
              Handcrafted in Jaipur with pure Mulberry silks, organza drapes, and intricate artisanal embroidery.
            </p>
          </div>
        </div>

        {/* Toolbar & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#fcfbfa] border border-[#e8e2d9] p-4 rounded-xl mb-8 shadow-2xs">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 bg-[#39322f] text-white px-4 py-2 rounded-lg text-xs font-sans uppercase font-semibold cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>

            <span className="text-xs font-sans text-[#39322f]/70 font-medium">
              Showing <strong className="text-[#39322f]">{products.length}</strong> luxury styles
            </span>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-sans font-medium text-[#39322f]/70 uppercase tracking-wider hidden sm:inline">
              Sort By:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#e8e2d9] text-xs font-sans text-[#39322f] font-semibold px-4 py-2 rounded-lg focus:outline-none focus:border-[#d4a373] cursor-pointer"
            >
              <option value="recommended">Featured & Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

        </div>

        {/* Main Grid + Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6 bg-[#fcfbfa] p-6 rounded-2xl border border-[#e8e2d9] h-fit">
            <div className="flex items-center justify-between border-b border-[#e8e2d9] pb-4">
              <h3 className="font-serif font-bold text-lg text-[#39322f]">Filter Catalog</h3>
              <Filter className="w-4 h-4 text-[#d4a373]" />
            </div>

            {/* Categories Filter list */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#39322f]">Categories</h4>
              <ul className="space-y-2 text-xs font-sans">
                <li>
                  <Link
                    to="/shop"
                    className={`block py-1 hover:text-[#d4a373] transition-colors ${!slug ? 'font-bold text-[#d4a373]' : 'text-[#39322f]/80'}`}
                  >
                    All Collections ({allProducts.length})
                  </Link>
                </li>
                {catList.map((cat) => {
                  const styleCount = getCategoryStyleCount(cat);
                  return (
                    <li key={cat.id || cat.slug}>
                      <Link
                        to={`/category/${cat.slug}`}
                        className={`flex items-center justify-between py-1 hover:text-[#d4a373] transition-colors ${slug === cat.slug ? 'font-bold text-[#d4a373]' : 'text-[#39322f]/80'}`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-[#39322f]/50 font-sans">{styleCount}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#e8e2d9]">
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="font-semibold uppercase tracking-wider text-[#39322f]">Max Price</span>
                <span className="font-bold text-[#d4a373]">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="3000"
                max="40000"
                step="1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#d4a373] cursor-pointer"
              />
            </div>

            {/* In Stock Only Toggle */}
            <div className="flex items-center justify-between pt-4 border-t border-[#e8e2d9]">
              <span className="text-xs font-sans font-semibold text-[#39322f] uppercase tracking-wider">In Stock Only</span>
              <button
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`w-11 h-6 rounded-full transition-colors p-1 cursor-pointer ${inStockOnly ? 'bg-[#d4a373]' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${inStockOnly ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </aside>

          {/* Product Grid Column */}
          <div className="lg:col-span-3 space-y-6">
            {products.length === 0 ? (
              <div className="text-center py-20 bg-[#fcfbfa] rounded-2xl border border-[#e8e2d9]">
                <p className="font-serif text-xl text-[#39322f] font-semibold">No products found</p>
                <p className="text-xs text-gray-500 font-sans mt-1">Try adjusting your filters or price slider.</p>
                <button
                  onClick={() => { setMaxPrice(40000); setInStockOnly(false); }}
                  className="mt-4 px-6 py-2 bg-[#39322f] text-white text-xs uppercase tracking-widest font-sans rounded-full cursor-pointer hover:bg-[#d4a373] transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {products.map(product => (
                  <RosierProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden animate-in fade-in duration-200">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="relative w-4/5 max-w-xs bg-[#fcfbfa] h-full shadow-2xl p-6 z-10 space-y-6 overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="font-serif font-bold text-lg text-[#39322f]">Filters</h3>
              <button onClick={() => setIsMobileFilterOpen(false)}><X className="w-6 h-6" /></button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#39322f]">Category</h4>
              <div className="flex flex-col gap-2 text-xs">
                {catList.map(cat => {
                  const styleCount = getCategoryStyleCount(cat);
                  return (
                    <Link
                      key={cat.id || cat.slug}
                      to={`/category/${cat.slug}`}
                      onClick={() => setIsMobileFilterOpen(false)}
                      className="flex items-center justify-between py-1 text-[#39322f]/80 hover:text-[#d4a373]"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-[#39322f]/50 font-sans">{styleCount}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <span className="text-xs font-semibold uppercase">Max Price: ₹{maxPrice.toLocaleString('en-IN')}</span>
              <input
                type="range"
                min="3000"
                max="40000"
                step="1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#d4a373]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
