import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import RosierProductCard from './RosierProductCard';
import { useWindowWidth } from '../hooks/useMediaQuery';

function getCardWidth(width) {
  if (width < 480) return Math.min(width * 0.72, 280);
  if (width < 768) return Math.min(width * 0.55, 300);
  return 280;
}

export default function ProductCarousel() {
  const { products } = useShop();
  const scrollRef = useRef(null);
  const width = useWindowWidth();
  const cardWidth = getCardWidth(width);

  const items = (products || []).filter((p) => p.categorySlug !== 'combo-packs');

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -(cardWidth + 16) : cardWidth + 16, behavior: 'smooth' });
  };

  return (
    <section className="py-8 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 sm:mb-8 gap-2">
          <h2 className="font-serif text-xl sm:text-3xl font-bold text-[#3E2723] leading-tight">Loved Across Generations</h2>
          <div className="flex gap-1.5 shrink-0">
            <button type="button" onClick={() => scroll('left')} className="p-2 rounded-full border border-[#E8DCC8] hover:bg-[#3E2723] hover:text-white transition-colors cursor-pointer touch-manipulation" aria-label="Previous">
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button type="button" onClick={() => scroll('right')} className="p-2 rounded-full border border-[#E8DCC8] hover:bg-[#3E2723] hover:text-white transition-colors cursor-pointer touch-manipulation" aria-label="Next">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2 scroll-smooth snap-x snap-mandatory -mx-1 px-1"
        >
          {items.map((product) => (
            <div key={product.id} className="shrink-0 snap-start" style={{ width: cardWidth }}>
              <RosierProductCard product={product} compact />
            </div>
          ))}
        </div>
        <div className="text-center mt-6 sm:mt-8">
          <Link to="/shop" className="inline-block text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#3E2723] border-b-2 border-[#C8960C] pb-1 hover:text-[#C8960C] transition-colors">
            View More
          </Link>
        </div>
      </div>
    </section>
  );
}
