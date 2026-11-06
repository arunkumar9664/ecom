import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import SafeImage from '../components/SafeImage';
import ProductCard from '../components/home/ProductCard';
import FilterDrawer from '../components/listing/FilterDrawer';
import { useShop } from '../hooks/useShop';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { scentLinks } from '../config/nav';

const PAGE_SIZE = 12;
const SORTS = [
  { id: 'newest', label: 'Featured' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'name', label: 'Name A–Z' },
];

function sortProducts(list, sort) {
  // TODO(backend: server-side sort and pagination)
  const items = [...list];
  if (sort === 'price-asc') return items.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') return items.sort((a, b) => b.price - a.price);
  if (sort === 'name') return items.sort((a, b) => a.name.localeCompare(b.name));
  return items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

export default function ListingPage() {
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const { categories, products: catalog, sections, loadCatalog, queryProducts } = useShop();
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [price, setPrice] = useState({ min: params.get('minPrice') || '', max: params.get('maxPrice') || '' });
  const [queryKey, setQueryKey] = useState('');

  const search = params.get('search') || '';
  const minPrice = params.get('minPrice') || '';
  const maxPrice = params.get('maxPrice') || '';
  const size = params.get('size') || '';
  const sort = SORTS.some((item) => item.id === params.get('sort')) ? params.get('sort') : 'newest';
  const collection = params.get('collection') || '';
  const category = slug ? (categories || []).find((item) => item.slug === slug) : null;
  const categoriesReady = sections.categories.status === 'ready';
  const missingCategory = Boolean(slug) && categoriesReady && !category;

  const patchParams = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') next.delete(key);
      else next.set(key, String(value));
    });
    setParams(next);
  };

  const nextQueryKey = [slug, search, minPrice, maxPrice, size, sort, collection, missingCategory, sections.categories.status].join('|');
  if (queryKey !== nextQueryKey) {
    setQueryKey(nextQueryKey);
    setPrice({ min: minPrice, max: maxPrice });
    setVisible(PAGE_SIZE);
    if (!(slug && sections.categories.status === 'loading') && !missingCategory) {
      setStatus('loading');
      setError('');
    }
  }

  useEffect(() => {
    if (slug && sections.categories.status === 'loading') return undefined;
    if (missingCategory) return undefined;
    const gate = { current: false };
    queryProducts({
      categorySlug: slug || '',
      search,
      minPrice,
      maxPrice,
      size,
    }).then((result) => {
      if (gate.current) return;
      if (result.error) {
        setRows([]);
        setError(result.error);
        setStatus('error');
        return;
      }
      setRows(result.products);
      setStatus('ready');
    });
    return () => {
      gate.current = true;
    };
  }, [slug, search, minPrice, maxPrice, size, missingCategory, sections.categories.status, queryProducts]);

  const sizes = useMemo(() => {
    const source = slug ? (catalog || []).filter((item) => item.categorySlug === slug) : (catalog || []);
    return [...new Set(source.flatMap((item) => item.sizes || []).filter(Boolean))].sort();
  }, [catalog, slug]);

  const sorted = useMemo(() => {
    let list = rows;
    if (collection === 'bestsellers') {
      const best = list.filter((item) => /best/i.test(item.badge || ''));
      // TODO(backend) badge is a free string, not a featured flag
      list = best.length ? best : list;
    }
    return sortProducts(list, sort);
  }, [rows, sort, collection]);

  const shown = sorted.slice(0, visible);
  const title = search
    ? `Results for “${search}”`
    : collection === 'bestsellers'
      ? 'Bestsellers'
      : category?.name || 'All products';
  useDocumentTitle(title, `Shop ${title} at Field & Hearth.`);

  const clearFilters = () => {
    setParams(new URLSearchParams());
    setFiltersOpen(false);
  };

  const scentTo = (link) => {
    const next = new URLSearchParams(link.to.split('?')[1] || '');
    const term = next.get('search') || '';
    if (slug) return `/category/${slug}?search=${encodeURIComponent(term)}`;
    return link.to;
  };

  if (sections.categories.status === 'error' && slug) {
    return (
      <main className="px-6 py-16 text-center">
        <p className="font-body text-sm text-terracotta">{sections.categories.error}</p>
        <button type="button" onClick={loadCatalog} className="mt-4 border border-olive px-4 py-2 font-body text-sm text-olive">Retry</button>
      </main>
    );
  }

  if (slug && !categoriesReady && !category) {
    return <main className="h-64 animate-pulse bg-sand motion-reduce:animate-none" aria-hidden="true" />;
  }

  if (missingCategory) {
    return (
      <main className="mx-auto max-w-xl px-6 py-20 text-center">
        <h1 className="font-heading text-4xl text-ink">This department is not in the shop</h1>
        <p className="mt-3 font-body text-sm text-muted">The link does not match a category we have loaded.</p>
        <Link to="/shop" className="mt-6 inline-flex h-11 items-center border border-ink px-5 font-body text-xs tracking-[0.14em] text-ink uppercase">
          Browse all products
        </Link>
      </main>
    );
  }

  const chips = [
    search ? { key: 'search', label: `Search: ${search}` } : null,
    minPrice ? { key: 'minPrice', label: `From ₹${minPrice}` } : null,
    maxPrice ? { key: 'maxPrice', label: `Up to ₹${maxPrice}` } : null,
    size ? { key: 'size', label: size } : null,
    collection === 'bestsellers' ? { key: 'collection', label: 'Bestsellers' } : null,
  ].filter(Boolean);

  return (
    <main>
      <section className="relative">
        {category?.image ? (
          <SafeImage src={category.image} alt="" className="h-52 w-full object-cover md:h-72" />
        ) : (
          <div className="h-24 bg-sand md:h-32" />
        )}
        <div className="relative z-10 mx-4 -mt-10 bg-white px-6 py-8 md:mx-auto md:-mt-16 md:max-w-3xl md:px-10">
          <h1 className="text-center font-heading text-4xl text-ink md:text-5xl">{title}</h1>
          {category?.tagline && !search ? (
            <p className="mt-3 text-center font-body text-sm text-muted">{category.tagline}</p>
          ) : null}
          {search ? (
            <p className="mt-3 text-center font-body text-sm text-muted">
              {status === 'ready' ? `${sorted.length} ${sorted.length === 1 ? 'product' : 'products'}` : ''}
            </p>
          ) : null}
        </div>
      </section>

      <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-4 px-4 py-6 md:px-8">
        <button type="button" onClick={() => setFiltersOpen(true)} className="h-11 border border-ink px-5 font-body text-xs tracking-[0.16em] text-ink uppercase">
          Filter
        </button>
        <p className="font-body text-sm text-muted" aria-live="polite">
          {status === 'ready' ? `${sorted.length} ${sorted.length === 1 ? 'product' : 'products'}` : ''}
        </p>
        <label className="flex items-center gap-2 font-body text-xs tracking-[0.16em] text-terracotta uppercase">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M4 7h16M7 12h10M10 17h4" />
          </svg>
          Sort by
          <select
            aria-label="Sort by"
            value={sort}
            onChange={(event) => patchParams({ sort: event.target.value === 'newest' ? '' : event.target.value })}
            className="h-11 border border-line bg-paper px-2 font-body text-sm tracking-normal text-ink normal-case"
          >
            {SORTS.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
        </label>
      </div>

      {chips.length ? (
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-center gap-2 px-4 pb-4 md:px-8">
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => patchParams({ [chip.key]: '' })}
              className="border border-line bg-white px-3 py-1 font-body text-sm text-ink"
            >
              {chip.label} <span aria-hidden="true">×</span>
              <span className="sr-only">Remove {chip.label}</span>
            </button>
          ))}
          <button type="button" onClick={clearFilters} className="font-body text-sm text-ink underline-offset-4 hover:underline">
            Clear all
          </button>
        </div>
      ) : null}

      <div className="mx-auto max-w-[1360px] px-4 pb-16 md:px-8">
        {status === 'loading' ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="aspect-[3/4] animate-pulse bg-sand motion-reduce:animate-none" />
            ))}
          </div>
        ) : null}
        {status === 'error' ? (
          <div className="py-16 text-center">
            <p className="font-body text-sm text-terracotta">{error}</p>
            <button
              type="button"
              onClick={() => queryProducts({ categorySlug: slug || '', search, minPrice, maxPrice, size }).then((result) => {
                if (result.error) {
                  setError(result.error);
                  return;
                }
                setRows(result.products);
                setStatus('ready');
              })}
              className="mt-4 border border-olive px-4 py-2 font-body text-sm text-olive"
            >
              Retry
            </button>
          </div>
        ) : null}
        {status === 'ready' && !shown.length ? (
          <div className="py-16 text-center">
            <p className="font-heading text-2xl text-ink">No products match your filters</p>
            <button type="button" onClick={clearFilters} className="mt-4 border border-ink px-4 py-2 font-body text-sm text-ink">
              Clear filters
            </button>
          </div>
        ) : null}
        {status === 'ready' && shown.length ? (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {shown.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {visible < sorted.length ? (
              <div className="mt-10 text-center">
                <button type="button" onClick={() => setVisible((count) => count + PAGE_SIZE)} className="h-11 border border-ink px-6 font-body text-xs tracking-[0.16em] text-ink uppercase">
                  Load more
                </button>
              </div>
            ) : null}
          </>
        ) : null}
      </div>

      <FilterDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        price={price}
        setPrice={setPrice}
        onApplyPrice={() => {
          patchParams({ minPrice: price.min.trim(), maxPrice: price.max.trim() });
          setFiltersOpen(false);
        }}
        sizes={sizes}
        activeSize={size}
        onSize={(value) => patchParams({ size: value })}
        scentTo={(link) => {
          const known = scentLinks.find((item) => item.label === link.label);
          return scentTo(known || link);
        }}
      />
    </main>
  );
}
