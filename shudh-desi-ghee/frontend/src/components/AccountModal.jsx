import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useShop } from '../context/ShopContext';
import { X, Phone, ShoppingBag, LogOut, ShieldCheck, Sparkles, Trash2, User } from 'lucide-react';

export default function AccountModal() {
  const {
    currentUser,
    isAccountModalOpen,
    closeAccountModal,
    logoutUser,
    orders
  } = useShop();

  useEffect(() => {
    if (isAccountModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAccountModalOpen]);

  if (!isAccountModalOpen || !currentUser) return null;

  // Filter orders for current user or default demo history
  const userOrders = (orders || []).filter(o => 
    (o.userId && o.userId === currentUser.id) ||
    (o.customerEmail && o.customerEmail.toLowerCase() === currentUser.email?.toLowerCase()) ||
    (o.customer?.email && o.customer.email.toLowerCase() === currentUser.email?.toLowerCase()) ||
    (currentUser.name && o.customerName && o.customerName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0])) ||
    (currentUser.name && o.customer?.name && o.customer.name.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0]))
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white border border-[#d4a373]/30 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-[#39322f] max-h-[90vh] overflow-y-auto overscroll-contain"
        data-lenis-prevent
      >
        
        {/* Close Button */}
        <button
          onClick={closeAccountModal}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-[#39322f] rounded-full hover:bg-[#f8f4ee] transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Profile Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-[#e8e2d9]">
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              loading="lazy"
              className="w-16 h-16 rounded-full object-cover border-2 border-[#d4a373] shadow-md shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#39322f] to-[#b58349] text-[#f7f3ee] flex items-center justify-center font-serif text-2xl font-bold border-2 border-[#d4a373] shadow-md shrink-0 uppercase">
              {currentUser.name ? currentUser.name.charAt(0) : <User className="w-8 h-8" />}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-cinzel text-xl font-bold text-[#2d2624] truncate">{currentUser.name}</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] uppercase tracking-wider font-bold border border-emerald-300">
                Verified
              </span>
            </div>
            <p className="text-xs text-gray-500 font-sans truncate mt-0.5">{currentUser.email}</p>
            <span className="text-[10px] text-[#b58349] font-bold uppercase tracking-wider block mt-1">
              Suranghi VIP Member
            </span>
          </div>
        </div>

        {/* User Info Details Grid */}
        <div className="py-6 space-y-4 border-b border-[#e8e2d9]">
          <div className="grid grid-cols-2 gap-3 text-xs font-sans">
            <div className="bg-[#f8f4ee] p-3.5 rounded-2xl border border-[#e8e2d9]">
              <span className="text-[10px] uppercase tracking-wider text-[#39322f]/60 font-bold block">Contact Phone</span>
              <p className="font-bold text-[#39322f] truncate mt-0.5">
                {currentUser.phone || "+91 91166 55814"}
              </p>
            </div>

            <div className="bg-[#f8f4ee] p-3.5 rounded-2xl border border-[#e8e2d9]">
              <span className="text-[10px] uppercase tracking-wider text-[#39322f]/60 font-bold block">Total Orders</span>
              <p className="font-bold text-[#b58349] mt-0.5">
                {userOrders.length} Order(s)
              </p>
            </div>
          </div>

          <Link
            to="/account?tab=orders"
            onClick={closeAccountModal}
            className="w-full py-3 bg-[#39322f] text-white rounded-2xl font-sans text-xs uppercase font-bold tracking-widest hover:bg-[#d4a373] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 text-[#d4a373]" />
            <span>View Full Account & Track Orders</span>
          </Link>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 flex items-center justify-between">
          <Link
            to="/account?tab=addresses"
            onClick={closeAccountModal}
            className="text-xs text-[#b58349] font-bold hover:underline"
          >
            Saved Addresses
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={logoutUser}
              className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 transition-colors text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
