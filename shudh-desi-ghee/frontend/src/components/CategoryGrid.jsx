import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { getImageUrl } from '../utils/image';
import { ArrowRight } from 'lucide-react';

export default function CategoryGrid() {
  const { categories } = useShop();
  const cats = categories && categories.length > 0 ? categories : [];

  return (
    <section className="py-20 sm:py-28 bg-[#f8f4ee] border-b border-[#d4a373]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-18">
          <span className="text-xs uppercase font-sans tracking-[0.3em] text-[#d4a373] font-bold block mb-2">
            Curated Collections
          </span>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-[#2d2624]">
            Shop Our Core Edits
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#d4a373] to-transparent mx-auto mt-4 rounded-full" />
        </div>

        {/* Dynamic Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cats.map((cat) => (
            <Link
              key={cat.id || cat.slug}
              to={`/category/${cat.slug}`}
              className="group relative h-[340px] sm:h-[420px] lg:h-[460px] rounded-3xl overflow-hidden shadow-xl border border-[#d4a373]/35 transition-all duration-700 hover:shadow-2xl hover:border-[#d4a373] gold-glow-hover flex flex-col justify-end p-6 sm:p-8"
            >
              {/* Background Image */}
              <img
                src={getImageUrl(cat.image, { width: 800 })}
                alt={cat.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-108"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1716]/95 via-[#1a1716]/40 to-transparent transition-opacity duration-500 group-hover:opacity-95" />

              {/* Content Box */}
              <div className="relative z-10 space-y-2 text-white">
                <span className="text-[10px] uppercase font-sans tracking-widest px-3.5 py-1 rounded-full bg-gradient-to-r from-[#d4a373] via-[#e6c594] to-[#b58349] text-[#1a1716] font-extrabold inline-block shadow-md">
                  {cat.count || 'Active Collection'}
                </span>

                <h3 className="font-cinzel text-2xl sm:text-3xl font-bold tracking-wider text-white group-hover:text-[#e6c594] transition-colors">
                  {cat.name}
                </h3>

                <p className="text-xs font-sans text-gray-200 font-light line-clamp-2">
                  {cat.tagline}
                </p>

                <div className="pt-2 flex items-center gap-2 text-xs uppercase font-sans font-bold tracking-widest text-[#e6c594] group-hover:translate-x-1 transition-transform">
                  <span>Explore Edit</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

