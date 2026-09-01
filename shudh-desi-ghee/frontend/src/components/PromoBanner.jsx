import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function PromoBanner({
  title = "The Royal Festive Wardrobe",
  subtitle = "Limited Edition 2026 Collection",
  description = "Intricate handcrafted zardozi embroidery paired with flowing silk short kurtis and festive Anarkali suit sets.",
  ctaText = "Shop Festive Edit",
  categoryLink = "festive-wear",
  bgImage = "/images/products/real_product_14.jpg"
}) {

  return (
    <section className="relative w-full py-24 sm:py-32 overflow-hidden bg-[#1a1716] border-y border-[#d4a373]/30">
      {/* Background Image with Parallax & Gradient */}
      <img
        src={bgImage}
        alt={title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-40 scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1716] via-[#1a1716]/80 to-transparent" />

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-xl space-y-4">
          
          <div className="inline-flex items-center gap-2 bg-[#d4a373]/25 backdrop-blur-md border border-[#d4a373]/60 px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-sans uppercase tracking-[0.25em] text-[#e6c594] font-bold shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#e6c594]" />
            <span>{subtitle}</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-wider text-white leading-tight">
            {title}
          </h2>

          <p className="font-cormorant text-lg sm:text-2xl text-gray-200 font-light italic leading-relaxed">
            “{description}”
          </p>

          <div className="pt-4">
            <Link
              to={`/category/${categoryLink}`}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#d4a373] via-[#e6c594] to-[#b58349] text-[#1a1716] hover:bg-white hover:text-[#1a1716] px-9 py-4 rounded-full text-xs font-sans uppercase tracking-widest font-bold transition-all duration-300 shadow-2xl border border-white/20 transform hover:-translate-y-1 cursor-pointer"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
