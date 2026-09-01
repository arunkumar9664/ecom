import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, ShoppingBag } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="bg-[#f7f3ee] min-h-[70vh] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-[#fcfbfa] rounded-3xl p-8 sm:p-12 border border-[#e8e2d9] shadow-sm text-center space-y-6">
        
        {/* Subtle Brand Badge */}
        <div className="inline-flex items-center gap-1.5 bg-[#f7f3ee] px-3.5 py-1.5 rounded-full border border-[#e8e2d9]">
          <Sparkles className="w-3.5 h-3.5 text-[#d4a373]" />
          <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-extrabold text-[#d4a373]">
            Error 404
          </span>
        </div>

        {/* Large 404 Title */}
        <div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#39322f] tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-[#39322f]/70 font-sans font-light leading-relaxed mt-3">
            The page or garment details you are looking for may have been moved, renamed, or are no longer available in our collection.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#39322f] hover:bg-[#d4a373] text-[#f7f3ee] hover:text-[#39322f] text-xs font-sans uppercase font-semibold tracking-wider transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>

          <Link
            to="/shop"
            className="w-full sm:w-auto px-6 py-3 rounded-full border border-[#d4a373]/60 bg-white hover:bg-[#f7f3ee] text-[#39322f] text-xs font-sans uppercase font-semibold tracking-wider transition-all duration-300 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#d4a373]" />
            <span>Explore Catalog</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
