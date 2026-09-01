import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../utils/image';
import { useIsMobile } from '../hooks/useMediaQuery';
import { HERO_MOBILE_IMAGES } from '../data/rosierContent';

function getSlideImage(slide, isMobile) {
  if (isMobile) {
    const mobile = HERO_MOBILE_IMAGES[slide.order] || HERO_MOBILE_IMAGES[slide.id];
    if (mobile) return mobile;
  }
  return getImageUrl(slide.image, { width: isMobile ? 800 : 1600 });
}

export default function HeroCarousel() {
  const { heroSlides } = useShop();
  const [currentSlide, setCurrentSlide] = useState(0);
  const isMobile = useIsMobile();
  const touchStartX = useRef(null);
  const slides = heroSlides?.length ? heroSlides : [];

  const goTo = useCallback((index) => {
    if (slides.length === 0) return;
    setCurrentSlide(((index % slides.length) + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => goTo(currentSlide + 1), 5500);
    return () => clearInterval(interval);
  }, [slides.length, currentSlide, goTo]);

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(currentSlide + (diff > 0 ? 1 : -1));
    touchStartX.current = null;
  };

  if (slides.length === 0) return null;

  return (
    <section
      className="relative w-full overflow-hidden bg-[#FFF8E7]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className={`relative w-full ${isMobile ? 'h-auto aspect-[4/5] max-h-[70vh]' : 'h-[45vh] sm:h-[55vh] lg:h-[65vh]'}`}>
        {slides.map((slide, index) => {
          const isPoster = slide.posterOnly || !slide.title?.trim();
          const src = getSlideImage(slide, isMobile);
          const imgEl = (
            <img
              src={src}
              alt={slide.title || 'Shudh Desi Ghee banner'}
              className={`w-full h-full ${isMobile ? 'object-contain object-center bg-[#FFF8E7]' : 'object-cover object-center'}`}
              loading={index === 0 ? 'eager' : 'lazy'}
              draggable={false}
            />
          );

          return (
            <div
              key={slide.id || index}
              className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
            >
              {isPoster ? (
                <Link to={`/category/${slide.categorySlug || 'desi-cow-ghee'}`} className="block w-full h-full">
                  {imgEl}
                </Link>
              ) : (
                <>
                  {imgEl}
                  {slide.title && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#3E2723]/80 via-[#3E2723]/40 to-transparent" />
                      <div className="absolute inset-0 flex items-end sm:items-center p-4 sm:p-0">
                        <div className="max-w-7xl mx-auto w-full">
                          <div className="max-w-lg text-white">
                            {slide.subtitle && (
                              <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mb-1">{slide.subtitle}</p>
                            )}
                            <h1 className="font-serif text-xl sm:text-5xl font-bold leading-tight">{slide.title}</h1>
                            {slide.description && (
                              <p className="text-xs sm:text-base text-white/85 mt-2 max-w-md line-clamp-2 sm:line-clamp-none">{slide.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(currentSlide - 1)}
            className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2 rounded-full bg-white/90 text-[#3E2723] shadow cursor-pointer touch-manipulation"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(currentSlide + 1)}
            className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2 rounded-full bg-white/90 text-[#3E2723] shadow cursor-pointer touch-manipulation"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all touch-manipulation ${i === currentSlide ? 'w-5 bg-[#C8960C]' : 'w-1.5 bg-white/70'}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
