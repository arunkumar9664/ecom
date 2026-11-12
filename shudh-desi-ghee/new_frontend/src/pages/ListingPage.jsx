import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/home/ProductCard';
import FilterDrawer from '../components/listing/FilterDrawer';
import { useShop } from '../hooks/useShop';
import useDocumentTitle from '../hooks/useDocumentTitle';

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
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { categories, products: catalog, sections, loadCatalog, queryProducts } = useShop();
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [queryKey, setQueryKey] = useState('');
  const sortRef = useRef(null);

  useEffect(() => {
    if (!sortOpen) return undefined;
    const onOutside = (e) => {
      if (!sortRef.current?.contains(e.target)) setSortOpen(false);
    };
    document.addEventListener('pointerdown', onOutside);
    return () => document.removeEventListener('pointerdown', onOutside);
  }, [sortOpen]);

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

  const applyFilters = (draft) => {
    const next = new URLSearchParams();
    if (draft.search) next.set('search', draft.search);
    if (draft.min) next.set('minPrice', draft.min);
    if (draft.max) next.set('maxPrice', draft.max);
    if (draft.size) next.set('size', draft.size);
    if (sort !== 'newest') next.set('sort', sort);
    if (collection) next.set('collection', collection);
    const path = draft.category ? `/category/${draft.category}` : '/shop';
    navigate({ pathname: path, search: next.toString() });
    setFiltersOpen(false);
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
    <main className="py-8">
      <div className="mx-auto max-w-[1360px] px-gutter">
      <div className="mb-4 flex items-end justify-between gap-4">
        <h1 className="font-heading text-3xl text-ink">{title}</h1>
        <p className="sr-only" aria-live="polite">{status === 'ready' ? `${sorted.length} products` : ''}</p>
      </div>
      <div className="mb-6 flex items-center justify-end gap-6">
        <div ref={sortRef} className="relative">
          <button type="button" aria-expanded={sortOpen} onClick={() => setSortOpen((open) => !open)} className="flex items-center gap-2 font-body text-[15px] font-medium tracking-[0.06em] text-terracotta uppercase">
            Sort by
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M8 7h10M6 12h8M10 17h6" /></svg>
          </button>
          {sortOpen ? (
            <ul className="absolute right-0 z-20 mt-2 w-52 border border-line bg-white py-1 shadow-md">
              {SORTS.map((item) => (
                <li key={item.id}>
                  <button type="button" className="w-full px-3 py-2 text-left font-body text-sm text-ink hover:bg-sand" onClick={() => { patchParams({ sort: item.id === 'newest' ? '' : item.id }); setSortOpen(false); }}>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <button type="button" onClick={() => setFiltersOpen(true)} className="flex items-center gap-2 font-body text-[15px] font-medium tracking-[0.06em] text-terracotta uppercase">
          Filter by
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M4 5h16l-6 7v6l-4 2v-8z" /></svg>
        </button>
      </div>

      {chips.length ? (
        <div className="mb-4 flex flex-wrap items-center gap-2">
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

      <div className="pb-16">
        {status === 'loading' ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="aspect-[16/10] animate-pulse bg-sand motion-reduce:animate-none" />
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
            <div className="grid grid-cols-2 gap-3 items-stretch md:grid-cols-3 md:gap-6">
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

      </div>
      <FilterDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        applied={{ min: minPrice, max: maxPrice, size, search, category: slug || '' }}
        sizes={sizes}
        categories={categories}
        onApply={applyFilters}
      />
    </main>
  );
}
