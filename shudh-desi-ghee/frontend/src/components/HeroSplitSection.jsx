import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORY_PILLS, SIDE_BANNERS } from '../data/rosierContent';
import { useIsMobile } from '../hooks/useMediaQuery';

/** Rosier-style split: side promo banners + category icon row (mobile-first) */
export default function HeroSplitSection() {
  const isMobile = useIsMobile(1024);
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -120 : 120, behavior: 'smooth' });
  };

  if (!isMobile) return null;

  return (
    <section className="bg-[#FFF8E7] border-b border-[#E8DCC8] py-3 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto flex gap-2 sm:gap-3">
        {/* Left: promo banners */}
        <div className="flex flex-col gap-2 w-[38%] shrink-0">
          {SIDE_BANNERS.map((banner, i) => (
            <Link key={i} to={banner.link} className="block rounded-xl overflow-hidden shadow-sm">
              <img src={banner.image} alt="" className="w-full h-auto object-cover" loading="lazy" />
            </Link>
          ))}
        </div>

        {/* Right: category icon slider */}
        <div className="flex-1 min-w-0 relative">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-6 h-6 flex items-center justify-center bg-white/90 rounded-full shadow text-[#3E2723] text-sm cursor-pointer touch-manipulation"
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <div
            ref={scrollRef}
            className="flex gap-0 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory px-6"
          >
            {CATEGORY_PILLS.map((pill) => (
              <Link
                key={pill.slug}
                to={`/category/${pill.slug}`}
                className="snap-start shrink-0 flex flex-col items-center justify-center w-1/4 min-w-[25%] py-1"
              >
                <img
                  src={pill.image}
                  alt={pill.label}
                  className="w-[60px] h-[60px] sm:w-[75px] sm:h-[75px] object-contain pb-1"
                  loading="lazy"
                />
                <p className="text-[10px] sm:text-xs font-medium text-[#3E2723] text-center leading-tight px-0.5">
                  {pill.label}
                </p>
              </Link>
            ))}
          </div>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-6 h-6 flex items-center justify-center bg-white/90 rounded-full shadow text-[#3E2723] text-sm cursor-pointer touch-manipulation"
            aria-label="Scroll categories right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
