import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SafeImage from '../SafeImage';
import { IconChevron } from '../shell/icons';
import useStripScroll from '../../hooks/useStripScroll';

export default function CategoryTiles({ categories, status, onRetry }) {
  const items = (Array.isArray(categories) ? categories : []).filter((category) => category?.slug);
  const scroller = useRef(null);
  const swallowClick = useStripScroll(scroller);
  const [overflow, setOverflow] = useState(false);

  useEffect(() => {
    const node = scroller.current;
    if (!node) return undefined;
    const measure = () => setOverflow(node.scrollWidth > node.clientWidth + 4);
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
      <div className="flex gap-[14px] overflow-hidden px-4 py-8">
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
        <div ref={scroller} onClickCapture={swallowClick} className="no-scrollbar flex gap-[14px] overflow-x-auto px-4 pb-1 md:px-8">
          {items.map((category) => (
            <Link
              key={category.id || category.slug}
              to={`/category/${category.slug}`}
              className="relative h-[120px] w-[120px] shrink-0 overflow-hidden rounded-[14px] md:h-[150px] md:w-[150px]"
            >
              <SafeImage src={category.image} alt="" className="h-full w-full object-cover" />
              <span className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.45),rgba(0,0,0,0.25))]" aria-hidden="true" />
              <span className="absolute inset-0 flex items-center justify-center px-2 text-center font-body text-[15px] leading-tight font-medium tracking-normal text-white uppercase md:text-[16px]">
                <span className="line-clamp-2">{category.name}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
