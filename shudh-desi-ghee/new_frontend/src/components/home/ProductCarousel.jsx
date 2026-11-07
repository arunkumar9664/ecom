import { useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { IconChevron } from '../shell/icons';
import useStripScroll from '../../hooks/useStripScroll';

function Skeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="w-[72%] shrink-0 md:w-[calc((100%-2rem)/3)]">
          <div className="aspect-[3/4] w-full animate-pulse bg-sand motion-reduce:animate-none" />
          <div className="mt-4 h-5 w-2/3 animate-pulse bg-sand motion-reduce:animate-none" />
          <div className="mt-2 h-4 w-full animate-pulse bg-sand motion-reduce:animate-none" />
        </div>
      ))}
    </div>
  );
}

export default function ProductCarousel({ title, products, href, status, onRetry, label }) {
  const scroller = useRef(null);
  const swallowClick = useStripScroll(scroller);
  const items = Array.isArray(products) ? products : [];

  const scrollByCard = (direction) => {
    const node = scroller.current;
    if (!node) return;
    const amount = node.clientWidth * 0.8 * direction;
    node.scrollBy({ left: amount, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  return (
    <section aria-label={label || title} className="px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto mb-6 max-w-[1360px] text-center min-[1000px]:flex min-[1000px]:items-end min-[1000px]:justify-between min-[1000px]:text-left">
        <h2 className="font-heading text-[26px] text-ink min-[1000px]:text-[32px]">{title}</h2>
        <Link to={href} className="mt-4 hidden font-body text-[17px] tracking-normal text-ink hover:underline min-[1000px]:inline">
          View All
        </Link>
        <Link to={href} className="mt-4 flex h-11 w-full items-center justify-center border border-ink font-body text-[17px] tracking-normal text-ink min-[1000px]:hidden">
          View All
        </Link>
      </div>

      {status?.status === 'loading' || status?.status === 'idle' ? <Skeleton /> : null}
      {status?.status === 'error' ? (
        <div className="py-8 text-center">
          <p className="font-body text-sm text-terracotta">{status.error}</p>
          <button type="button" onClick={onRetry} className="mt-4 border border-olive px-4 py-2 font-body text-sm text-olive">Retry</button>
        </div>
      ) : null}
      {status?.status === 'ready' && !items.length ? (
        <p className="py-8 text-center font-body text-sm text-muted">Nothing in this row yet.</p>
      ) : null}
      {status?.status === 'ready' && items.length ? (
        <div className="relative mx-auto max-w-[1360px]">
          {items.length > 1 ? (
            <button type="button" aria-label={`Previous ${title}`} onClick={() => scrollByCard(-1)} className="absolute top-1/3 -left-2 z-10 hidden h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-ink md:flex">
              <IconChevron className="h-4 w-4 rotate-180" />
            </button>
          ) : null}
          <div ref={scroller} onClickCapture={swallowClick} className="flex snap-x snap-proximity gap-4 overflow-x-auto overscroll-x-contain pb-2">
            {items.map((product) => (
              <div key={product.id} className="w-[70%] shrink-0 snap-start min-[1000px]:w-[calc((100%-2rem)/3)]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          {items.length > 1 ? (
            <button type="button" aria-label={`Next ${title}`} onClick={() => scrollByCard(1)} className="absolute top-1/3 -right-2 z-10 hidden h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-ink md:flex">
              <IconChevron className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      ) : null}

    </section>
  );
}
