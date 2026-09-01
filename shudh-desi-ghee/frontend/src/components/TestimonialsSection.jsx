import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data/rosierContent';
import { useWindowWidth } from '../hooks/useMediaQuery';

export default function TestimonialsSection() {
  const scrollRef = useRef(null);
  const width = useWindowWidth();
  const cardWidth = width < 480 ? width * 0.85 : width < 768 ? 300 : 340;

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -(cardWidth + 16) : cardWidth + 16, behavior: 'smooth' });
  };

  return (
    <section className="py-10 sm:py-16 bg-[#3E2723] text-[#FFF8E7]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8 gap-2">
          <h2 className="font-serif text-xl sm:text-3xl font-bold leading-tight">What Our Customers Say</h2>
          <div className="flex gap-1.5 shrink-0">
            <button type="button" onClick={() => scroll('left')} className="p-2 rounded-full border border-[#C8960C]/40 hover:bg-[#C8960C] transition-colors cursor-pointer touch-manipulation" aria-label="Previous">
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button type="button" onClick={() => scroll('right')} className="p-2 rounded-full border border-[#C8960C]/40 hover:bg-[#C8960C] transition-colors cursor-pointer touch-manipulation" aria-label="Next">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
        <div ref={scrollRef} className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-2 -mx-1 px-1">
          {TESTIMONIALS.map((t) => (
            <blockquote
              key={t.id}
              className="shrink-0 snap-start p-5 sm:p-6 rounded-xl bg-[#4E342E] border border-[#C8960C]/20"
              style={{ width: cardWidth }}
            >
              <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-[#C8960C] mb-3 opacity-60" />
              <p className="text-xs sm:text-sm leading-relaxed text-[#FFF8E7]/90 italic line-clamp-5 sm:line-clamp-none">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-4 pt-4 border-t border-[#C8960C]/20">
                <cite className="not-italic font-semibold text-[#C8960C] text-sm">{t.name}</cite>
                <p className="text-[10px] sm:text-xs text-[#FFF8E7]/60 mt-1 line-clamp-1">{t.product}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
