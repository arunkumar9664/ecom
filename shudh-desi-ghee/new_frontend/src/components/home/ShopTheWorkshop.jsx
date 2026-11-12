import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import SafeImage from '../SafeImage';
import { IconChevron } from '../shell/icons';
import { useShop } from '../../hooks/useShop';
import { formatRupee } from '../../utils/money';

export default function ShopTheWorkshop() {
  const { products, sections, toggleWishlist, isInWishlist } = useShop();
  const scroller = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const items = useMemo(() => {
    const list = Array.isArray(products) ? [...products] : [];
    return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 12);
  }, [products]);

  const scrollByCard = (direction) => {
    const node = scroller.current;
    if (!node) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    node.scrollBy({ left: direction * (node.clientWidth * 0.8), behavior: reduce ? 'auto' : 'smooth' });
  };

  const share = async (product) => {
    const url = `${window.location.origin}/product/${product.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url });
        return;
      }
    } catch (error) {
      if (error?.name === 'AbortError') return;
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied');
    } catch {
      toast.error('Could not copy the link');
    }
  };

  return (
    <section aria-label="Shop the Workshop" className="px-gutter py-12">
      <h2 className="text-center font-heading text-[26px] text-ink min-[1000px]:text-[32px]">Shop the Workshop</h2>
      {sections.products.status === 'loading' || sections.products.status === 'idle' ? (
        <div className="mx-auto mt-8 h-[420px] max-w-[1360px] animate-pulse rounded-[14px] bg-sand motion-reduce:animate-none" />
      ) : null}
      {sections.products.status === 'error' ? <p className="mt-6 text-center font-body text-sm text-terracotta">{sections.products.error}</p> : null}
      {sections.products.status === 'ready' && !items.length ? <p className="mt-6 text-center font-body text-sm text-muted">Nothing in the workshop row yet.</p> : null}
      {items.length ? (
        <div className="relative mx-auto mt-8 max-w-[960px]">
          {!atStart ? (
            <button type="button" aria-label="Previous workshop pieces" onClick={() => scrollByCard(-1)} className="absolute top-1/2 left-1 z-10 hidden h-[50px] w-[50px] -translate-y-1/2 items-center justify-center rounded-full bg-[#444] text-white min-[1000px]:flex">
              <IconChevron className="h-5 w-5 rotate-180" />
            </button>
          ) : null}
          <button type="button" aria-label="Next workshop pieces" onClick={() => scrollByCard(1)} className="absolute top-1/2 right-1 z-10 hidden h-[50px] w-[50px] -translate-y-1/2 items-center justify-center rounded-full bg-[#444] text-white min-[1000px]:flex">
            <IconChevron className="h-5 w-5" />
          </button>
          <div
            ref={scroller}
            onScroll={(event) => setAtStart(event.currentTarget.scrollLeft < 8)}
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 scroll-touch -mx-gutter px-gutter scroll-px-gutter min-[1000px]:mx-0 min-[1000px]:px-0 min-[1000px]:scroll-px-0"
          >
            {items.map((product) => {
              const saved = isInWishlist(product.id);
              return (
                <article key={product.id} className="relative aspect-[300/550] w-[75vw] max-w-[300px] shrink-0 snap-start overflow-hidden rounded-[14px] min-[1000px]:h-[550px] min-[1000px]:w-[300px] min-[1000px]:aspect-auto">
                  <Link to={`/product/${product.id}`} className="absolute inset-0" aria-label={product.name} draggable={false}>
                    <SafeImage src={product.image} alt="" draggable={false} className="h-full w-full object-cover select-none pointer-events-none" />
                  </Link>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-16 text-white">
                    <p className="font-heading text-2xl leading-tight">{product.name}</p>
                    <p className="mt-1 font-body text-sm">{formatRupee(product.price)}</p>
                  </div>
                  <div className="absolute right-3 bottom-3 z-10 flex gap-2">
                    <button
                      type="button"
                      aria-pressed={saved}
                      aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name}`}
                      onClick={() => toggleWishlist(product.id)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white text-white"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <path d="M12 19s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z" />
                      </svg>
                    </button>
                    <button type="button" aria-label={`Share ${product.name}`} onClick={() => share(product)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white text-white">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <circle cx="6" cy="12" r="2" />
                        <circle cx="16" cy="7" r="2" />
                        <circle cx="16" cy="17" r="2" />
                        <path d="M8 12l6-4M8 12l6 4" />
                      </svg>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}
