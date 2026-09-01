import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORY_PILLS } from '../data/rosierContent';
import { useIsMobile } from '../hooks/useMediaQuery';

export default function CategoryPills() {
  const scrollRef = useRef(null);
  const isMobile = useIsMobile(1024);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  // On mobile, HeroSplitSection shows category icons — hide duplicate row
  if (isMobile) return null;

  return (
    <section className="bg-[#FFF8E7] border-b border-[#E8DCC8] py-4 hidden lg:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <button type="button" onClick={() => scroll('left')} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white shadow border border-[#E8DCC8] flex cursor-pointer" aria-label="Scroll left">
          <ChevronLeft className="w-4 h-4 text-[#3E2723]" />
        </button>
        <div ref={scrollRef} className="flex gap-6 overflow-x-auto no-scrollbar px-10 scroll-smooth justify-center">
          {CATEGORY_PILLS.map((pill) => (
            <Link
              key={pill.slug}
              to={`/category/${pill.slug}`}
              className="shrink-0 flex flex-col items-center gap-2 group min-w-[90px]"
            >
              <img
                src={pill.image}
                alt={pill.label}
                className="w-16 h-16 object-contain group-hover:scale-105 transition-transform"
                loading="lazy"
              />
              <span className="text-xs font-semibold text-[#3E2723] text-center group-hover:text-[#C8960C] transition-colors">
                {pill.label}
              </span>
            </Link>
          ))}
        </div>
        <button type="button" onClick={() => scroll('right')} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white shadow border border-[#E8DCC8] flex cursor-pointer" aria-label="Scroll right">
          <ChevronRight className="w-4 h-4 text-[#3E2723]" />
        </button>
      </div>
    </section>
  );
}
