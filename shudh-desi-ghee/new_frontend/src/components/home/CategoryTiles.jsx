import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SafeImage from '../SafeImage';
import { IconChevron } from '../shell/icons';
import { categoryFocus } from '../../config/media';

export default function CategoryTiles({ categories, status, onRetry }) {
  const items = (Array.isArray(categories) ? categories : []).filter((category) => category?.slug);
  const scroller = useRef(null);
  const [overflow, setOverflow] = useState(false);

  useEffect(() => {
    const node = scroller.current;
    if (!node) return undefined;
    const measure = () => {
      const extra = node.scrollWidth - node.clientWidth;
      setOverflow(extra > 4);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [items.length, status?.status]);

  const scrollByTile = (direction) => {
    const node = scroller.current;
    if (!node) return;
    node.scrollBy({
      left: direction * 164,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };

  if (status?.status === 'loading' || status?.status === 'idle') {
    return (
      <div className="flex justify-center gap-[14px] overflow-hidden px-4 py-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-[120px] w-[120px] shrink-0 animate-pulse rounded-[14px] bg-sand motion-reduce:animate-none md:h-[150px] md:w-[150px]" />
        ))}
      </div>
    );
  }

  if (status?.status === 'error') {
    return (
      <section className="px-6 py-10 text-center">
        <p className="font-body text-sm text-terracotta">{status.error}</p>
        <button type="button" onClick={onRetry} className="mt-4 border border-olive px-4 py-2 font-body text-sm text-olive">Retry</button>
      </section>
    );
  }

  if (!items.length) return null;

  return (
    <section aria-label="Shop by category" className="relative py-8 md:py-10">
      <div className="relative mx-auto max-w-[1360px]">
        {overflow ? (
          <>
            <button type="button" aria-label="Previous categories" onClick={() => scrollByTile(-1)} className="absolute top-1/2 -left-1 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-paper text-ink min-[1000px]:flex">
              <IconChevron className="h-4 w-4 rotate-180" />
            </button>
            <button type="button" aria-label="Next categories" onClick={() => scrollByTile(1)} className="absolute top-1/2 -right-1 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-paper text-ink min-[1000px]:flex">
              <IconChevron className="h-4 w-4" />
            </button>
          </>
        ) : null}
        <div
          ref={scroller}
          className="no-scrollbar flex snap-x snap-proximity gap-[14px] overflow-x-auto overscroll-x-contain pb-1 scroll-touch px-gutter scroll-px-gutter justify-start min-[1000px]:justify-center"
        >
          {items.map((category) => (
            <Link
              key={category.id || category.slug}
              to={`/category/${category.slug}`}
              draggable={false}
              className="relative h-[120px] w-[120px] shrink-0 flex-none snap-start overflow-hidden rounded-[14px] bg-sand select-none md:h-[150px] md:w-[150px]"
            >
              <SafeImage
                src={category.image}
                alt=""
                draggable={false}
                className="h-full w-full object-contain p-2 mix-blend-multiply pointer-events-none"
                style={{ objectPosition: categoryFocus[category.slug] || 'center center' }}
              />
              <span className="absolute inset-0 bg-[linear-gradient(to_top,rgba(43,38,32,0.28),rgba(43,38,32,0.05))] pointer-events-none" aria-hidden="true" />
              <span className="absolute inset-0 flex items-center justify-center px-2 text-center font-body text-[15px] leading-tight font-medium tracking-normal text-white uppercase pointer-events-none md:text-[16px]">
                <span className="line-clamp-2">{category.name}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
