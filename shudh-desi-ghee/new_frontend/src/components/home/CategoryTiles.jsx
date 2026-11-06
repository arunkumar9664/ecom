import { Link } from 'react-router-dom';
import SafeImage from '../SafeImage';

export default function CategoryTiles({ categories, status, onRetry }) {
  const items = (Array.isArray(categories) ? categories : []).filter((category) => category?.slug);

  if (status?.status === 'loading' || status?.status === 'idle') {
    return (
      <div className="flex gap-3 overflow-hidden px-4 py-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-40 w-44 shrink-0 animate-pulse rounded-[14px] bg-sand motion-reduce:animate-none" />
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
    <section aria-label="Shop by category" className="overflow-hidden py-8 md:py-10">
      <div className="mx-auto flex max-w-[1360px] gap-3 overflow-x-auto px-4 pb-2 md:px-8">
        {items.map((category) => (
          <Link
            key={category.id || category.slug}
            to={`/category/${category.slug}`}
            className="relative h-44 w-44 shrink-0 overflow-hidden rounded-[14px] md:h-52 md:w-52"
          >
            <SafeImage src={category.image} alt="" className="h-full w-full object-cover" />
            <span className="absolute inset-0 bg-ink/25" aria-hidden="true" />
            <span className="absolute inset-0 flex items-center justify-center px-3 text-center font-body text-sm font-semibold tracking-[0.16em] text-white uppercase">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
