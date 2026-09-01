import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Package
} from 'lucide-react';


export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    categories,
    cartCount,
    setIsCartOpen,
    wishlist,
    setIsWishlistOpen,
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    currentUser,
    openAuthModal,
    openAccountModal
  } = useShop();

  const navCategories = categories || [];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Main Navbar */}
      <div
        className={`w-full transition-all duration-300 border-b border-[#E8DCC8] ${isScrolled
          ? 'bg-[#FFF8E7]/95 backdrop-blur-xl shadow-md py-2 sm:py-3'
          : 'bg-[#FFF8E7]/90 backdrop-blur-md py-2.5 sm:py-4'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* Left Nav Actions (Desktop) */}
            <div className="hidden lg:flex items-center space-x-8 text-sm font-sans tracking-wide">
              <Link to="/" className="uppercase text-xs tracking-widest font-semibold text-[#3E2723] hover:text-[#C8960C] transition-colors py-2">Home</Link>

              {/* Shop by Category Mega Menu */}
              <div
                className="relative"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                <button
                  className="flex items-center gap-1.5 font-medium text-[#3E2723] hover:text-[#C8960C] transition-colors py-2 group cursor-pointer"
                  onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                >
                  <span className="uppercase text-xs tracking-widest font-semibold">Shop</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isMegaMenuOpen ? 'rotate-180 text-[#C8960C]' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isMegaMenuOpen && (
                  <div className="absolute top-full left-0 w-80 bg-white shadow-2xl p-6 rounded-b-2xl border border-[#E8DCC8] space-y-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center gap-2 pb-2 border-b border-[#E8DCC8]">
                      <Sparkles className="w-4 h-4 text-[#C8960C]" />
                      <h4 className="font-serif font-bold text-[#3E2723] tracking-wide text-sm">
                        Shop Categories
                      </h4>
                    </div>

                    <ul className="space-y-3">
                      {navCategories.map((cat) => {
                        const isCatActive = location.pathname === `/category/${cat.slug}`;
                        return (
                          <li key={cat.slug || cat.id}>
                            <Link
                              to={`/category/${cat.slug}`}
                              onClick={() => setIsMegaMenuOpen(false)}
                              className={`group flex items-center justify-between p-2.5 rounded-xl transition-all ${isCatActive ? 'bg-[#3E2723] text-[#C8960C] font-bold' : 'hover:bg-[#FFF8E7]'
                                }`}
                            >
                              <div>
                                <div className={`text-xs tracking-wider uppercase font-semibold ${isCatActive ? 'text-[#C8960C]' : 'text-[#3E2723] group-hover:text-[#C8960C]'
                                  }`}>
                                  {cat.name}
                                </div>
                                <p className={`text-[10px] font-sans ${isCatActive ? 'text-[#e8e2d9]' : 'text-[#2d2624]/60'
                                  }`}>
                                  {cat.description || cat.tagline}
                                </p>
                              </div>
                              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${isCatActive ? 'bg-[#C8960C] text-white' : 'bg-[#C8960C]/15 text-[#8B6914]'
                                }`}>
                                {cat.tag || 'Explore'}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>

              <Link to="/our-story" className="uppercase text-xs tracking-widest font-semibold text-[#3E2723] hover:text-[#C8960C] transition-colors py-2">Our Story</Link>
              <Link to="/lab-reports" className="uppercase text-xs tracking-widest font-semibold text-[#3E2723] hover:text-[#C8960C] transition-colors py-2">Lab Reports</Link>
              <Link to="/contact" className="uppercase text-xs tracking-widest font-semibold text-[#3E2723] hover:text-[#C8960C] transition-colors py-2">Contact Us</Link>

              {currentUser && (
                <Link
                  to="/account"
                  className="uppercase text-xs tracking-widest font-bold text-[#b58349] hover:text-[#39322f] transition-all py-1.5 px-3 rounded-full bg-[#d4a373]/15 border border-[#d4a373]/30 flex items-center gap-1.5 hover:bg-[#d4a373]/30"
                >
                  <Package className="w-3.5 h-3.5 text-[#d4a373]" />
                  <span>Track Orders</span>
                </Link>
              )}
            </div>

            {/* Mobile: hamburger left */}
            <div className="lg:hidden flex items-center w-10 shrink-0">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-[#3E2723] hover:text-[#C8960C] transition-colors cursor-pointer touch-manipulation"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* Logo center — compact on mobile */}
            <div className="flex-1 lg:flex-none text-center group cursor-pointer min-w-0">
              <Link to="/" className="flex items-center justify-center lg:justify-start gap-1.5 sm:gap-3 group mx-auto lg:mx-0">
                <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#C8960C] via-[#FFF8E7] to-[#8B6914] shadow-md shrink-0">
                  <img
                    src="/logo.svg"
                    alt="Shudh Desi Ghee"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-white"
                  />
                </div>
                <div className="text-left hidden sm:block min-w-0">
                  <h1 className="font-cinzel text-sm sm:text-xl lg:text-2xl font-bold tracking-wider text-[#3E2723] leading-none group-hover:text-[#C8960C] transition-colors truncate">
                    Shudh Desi Ghee
                  </h1>
                  <span className="text-[6px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.28em] text-[#C8960C] font-bold block mt-0.5">
                    PURE | TRADITIONAL
                  </span>
                </div>
              </Link>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-0.5 sm:gap-2 shrink-0 w-auto lg:w-auto justify-end">

              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-1.5 text-[#39322f] hover:text-[#d4a373] transition-colors cursor-pointer relative"
                aria-label="Search"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5]" />
              </button>

              {/* Account Button / User Profile */}
              {currentUser ? (
                <button
                  onClick={openAccountModal}
                  className="flex items-center gap-1.5 p-1 sm:p-1.5 rounded-full bg-[#d4a373]/15 hover:bg-[#d4a373]/30 border border-[#d4a373]/40 transition-all cursor-pointer"
                  title="My Account Profile"
                >
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover border border-white"
                    />
                  ) : (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#39322f] text-[#f7f3ee] flex items-center justify-center font-serif text-[10px] sm:text-xs font-bold border border-white uppercase shrink-0">
                      {currentUser.name ? currentUser.name.charAt(0) : <User className="w-3 h-3" />}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-[#2d2624] pr-2 hidden md:inline">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#39322f] text-white hover:bg-[#d4a373] hover:text-[#39322f] transition-all cursor-pointer text-[10px] sm:text-xs font-semibold uppercase tracking-wider shadow-xs"
                >
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}



              {/* Wishlist — visible on mobile too */}
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="flex p-2 text-[#3E2723] hover:text-[#C8960C] transition-colors relative cursor-pointer touch-manipulation"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5]" />
                {wishlist.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-[#C8960C] text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-1 sm:p-1.5 text-[#3E2723] hover:text-[#C8960C] transition-colors relative cursor-pointer shrink-0 touch-manipulation"
                aria-label="Cart"
              >
                <div className="flex items-center gap-1 bg-[#3E2723] text-[#FFF8E7] px-2 sm:px-3 py-1 sm:py-1.5 rounded-full hover:bg-[#C8960C] transition-colors shadow-sm">
                  <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.8]" />
                  <span className="bg-[#FFF8E7] text-[#3E2723] text-[9px] sm:text-[11px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-0.5">
                    {cartCount}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Secondary Quick-Links Bar */}
      <div className="hidden lg:block bg-[#fcfbfa] border-b border-[#e8e2d9]/60 py-2.5">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center justify-center space-x-12 text-xs tracking-widest uppercase font-semibold text-[#39322f]">
            <li>
              <Link to="/shop" className="text-[#b58349] font-bold hover:underline">All Collection</Link>
            </li>
            {navCategories.map((cat) => {
              const isCatActive = location.pathname === `/category/${cat.slug}`;
              return (
                <li key={cat.slug || cat.id}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className={`transition-colors flex items-center gap-1.5 py-1 px-3 rounded-full ${isCatActive
                        ? 'bg-[#39322f] text-[#d4a373] font-bold shadow-xs'
                        : 'hover:text-[#d4a373]'
                      }`}
                  >
                    <span>{cat.name}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${isCatActive ? 'bg-[#d4a373] text-white' : 'bg-[#f7f3ee] border border-[#e8e2d9] text-[#d4a373]'
                      }`}>
                      {cat.tag || 'Explore'}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Expandable Search Overlay */}
      {isSearchOpen && (
        <div className="bg-[#FFF8E7] border-b border-[#E8DCC8] p-3 sm:p-4 shadow-lg animate-in slide-in-from-top-2 duration-300">
          <div className="max-w-3xl mx-auto relative flex items-center gap-2">
            <form onSubmit={handleSearchSubmit} className="w-full relative flex items-center">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 sm:left-4 text-[#3E2723]/50" />
              <input
                type="search"
                inputMode="search"
                placeholder="Search A2 Ghee, Honey, Oils..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#E8DCC8] rounded-full pl-10 sm:pl-12 pr-20 sm:pr-24 py-2.5 sm:py-3 text-sm font-sans text-[#3E2723] focus:outline-none focus:border-[#C8960C]"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-1.5 sm:right-2 bg-[#3E2723] text-white text-[10px] sm:text-xs font-sans uppercase tracking-widest px-3 sm:px-5 py-2 rounded-full font-semibold hover:bg-[#C8960C] transition-colors cursor-pointer touch-manipulation"
              >
                Search
              </button>
            </form>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-2 text-[#3E2723]/60 hover:text-[#3E2723] cursor-pointer shrink-0 touch-manipulation"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex lg:hidden animate-in fade-in duration-300">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsMobileMenuOpen(false)} />
          <div
            className="relative w-full max-w-sm bg-[#FFF8E7] h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto overscroll-contain"
            data-lenis-prevent
          >
            <div>
              <div className="pt-6 pb-4 px-5 border-b border-[#e8e2d9] flex items-center justify-between bg-[#f7f3ee]">
                <div className="flex items-center gap-2.5">
                  <img src="/logo.svg" alt="Shudh Desi Ghee Logo" className="w-8 h-8 rounded-full border border-white shadow-xs shrink-0" />
                  <span className="font-cinzel text-lg font-bold text-[#39322f] leading-none">Shudh Desi Ghee</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gray-200/60 text-[#39322f] transition-colors cursor-pointer"
                  aria-label="Close Mobile Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#d4a373] font-bold">
                  Categories
                </div>

                <div className="space-y-2">
                  {(() => {
                    const isShopActive = location.pathname === '/shop';
                    return (
                      <Link
                        to="/shop"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between p-3 rounded-xl text-sm font-sans font-semibold uppercase tracking-wide transition-all active:scale-[0.98] ${isShopActive
                            ? 'bg-[#d4a373] text-white border-2 border-[#39322f] shadow-md font-bold'
                            : 'bg-[#39322f] text-white hover:bg-[#d4a373] active:bg-[#d4a373]'
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          {isShopActive && <span className="w-2 h-2 rounded-full bg-white shrink-0" />}
                          <span>View All Products</span>
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    );
                  })()}

                  {navCategories.map((cat) => {
                    const isCatActive = location.pathname === `/category/${cat.slug}`;
                    return (
                      <Link
                        key={cat.slug || cat.id}
                        to={`/category/${cat.slug}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between p-3 rounded-xl text-sm font-sans uppercase tracking-wide transition-all active:scale-[0.98] ${isCatActive
                            ? 'bg-[#39322f] text-[#d4a373] border-2 border-[#d4a373] shadow-md font-bold'
                            : 'bg-[#f7f3ee]/60 border border-[#e8e2d9]/60 text-[#39322f] font-semibold hover:border-[#d4a373] active:bg-[#d4a373]/20'
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          {isCatActive && <span className="w-2 h-2 rounded-full bg-[#d4a373] shrink-0" />}
                          <span>{cat.name}</span>
                        </span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${isCatActive ? 'bg-[#d4a373] text-white' : 'bg-[#d4a373]/20 text-[#b58349]'
                          }`}>
                          {cat.tag || 'Explore'}
                        </span>
                      </Link>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-[#E8DCC8] space-y-2">
                  <Link to="/our-story" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center p-3 rounded-xl text-xs uppercase tracking-wider font-semibold bg-[#FFF8E7] border border-[#E8DCC8] text-[#3E2723] active:bg-[#C8960C]/20">
                    Our Story
                  </Link>
                  <Link to="/lab-reports" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center p-3 rounded-xl text-xs uppercase tracking-wider font-semibold bg-[#FFF8E7] border border-[#E8DCC8] text-[#3E2723] active:bg-[#C8960C]/20">
                    Lab Reports
                  </Link>
                  <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center p-3 rounded-xl text-xs uppercase tracking-wider font-semibold bg-[#FFF8E7] border border-[#E8DCC8] text-[#3E2723] active:bg-[#C8960C]/20">
                    Contact Us
                  </Link>

                  <button
                    onClick={() => { setIsMobileMenuOpen(false); setIsWishlistOpen(true); }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-[#FFF8E7] border border-[#E8DCC8] text-xs uppercase tracking-wider text-[#3E2723] font-semibold cursor-pointer touch-manipulation active:bg-[#C8960C]/20"
                  >
                    <span className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-[#C8960C]" />
                      Wishlist
                    </span>
                    <span className="bg-[#C8960C] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {wishlist.length}
                    </span>
                  </button>

                  {!currentUser && (
                    <button
                      onClick={() => { setIsMobileMenuOpen(false); openAuthModal('login'); }}
                      className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[#3E2723] text-white text-xs uppercase tracking-wider font-semibold touch-manipulation"
                    >
                      <User className="w-4 h-4" />
                      Sign In
                    </button>
                  )}

                  {currentUser && (
                    <Link
                      to="/account"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center justify-between p-3 rounded-xl text-xs uppercase tracking-wider bg-[#C8960C]/15 border border-[#C8960C]/40 text-[#3E2723] font-bold touch-manipulation"
                    >
                      <span className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-[#C8960C]" />
                        Track Orders
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#C8960C]" />
                    </Link>
                  )}
                </div>
              </div>
            </div>


            {/* Footer inside mobile menu */}
            <div className="p-5 bg-[#f7f3ee] border-t border-[#e8e2d9] text-center text-xs text-[#39322f]/70 font-sans">
              <p>Crafted with Artisanal Heritage</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
