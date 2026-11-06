import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import SafeImage from '../SafeImage';
import { IconClose } from './icons';
import { formatRupee } from './icons';

export default function SearchOverlay() {
  const { isSearchOpen, setIsSearchOpen, products, searchQuery, setSearchQuery } = useShop();
  const navigate = useNavigate();
  const [local, setLocal] = useState(searchQuery);

  useEffect(() => {
    if (!isSearchOpen) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isSearchOpen, setIsSearchOpen]);

  const results = useMemo(() => {
    const query = local.trim().toLowerCase();
    if (!query) return products.slice(0, 6);
    return products
      .filter((product) =>
        [product.name, product.description, product.fabric, product.category].filter(Boolean).join(' ').toLowerCase().includes(query)
      )
      .slice(0, 8);
  }, [local, products]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-ink/30" role="dialog" aria-label="Search">
      <div className="bg-paper px-4 pt-4 pb-6 shadow-lg sm:px-8">
        <form
          className="mx-auto flex max-w-3xl items-center gap-3 border-b border-ink"
          onSubmit={(event) => {
            event.preventDefault();
            setSearchQuery(local);
            setIsSearchOpen(false);
            navigate(`/shop?search=${encodeURIComponent(local.trim())}`);
          }}
        >
          <input
            autoFocus
            value={local}
            onChange={(event) => setLocal(event.target.value)}
            placeholder="Search soaps, linen, attars"
            className="h-12 flex-1 bg-transparent font-heading text-lg outline-none"
            aria-label="Search the shop"
          />
          <button type="button" aria-label="Close search" onClick={() => setIsSearchOpen(false)}>
            <IconClose className="h-5 w-5" />
          </button>
        </form>
        <ul className="mx-auto mt-4 max-w-3xl divide-y divide-line">
          {results.map((product) => (
            <li key={product.id}>
              <Link
                to={`/product/${product.id}`}
                onClick={() => setIsSearchOpen(false)}
                className="flex items-center gap-4 py-3"
              >
                <SafeImage src={product.image} alt="" className="h-14 w-14 object-cover" />
                <span>
                  <span className="block font-heading text-lg">{product.name}</span>
                  <span className="font-body text-sm text-muted">{formatRupee(product.price)}</span>
                </span>
              </Link>
            </li>
          ))}
          {!results.length ? <li className="py-6 font-body text-sm text-muted">Nothing matches that search.</li> : null}
        </ul>
      </div>
    </div>
  );
}
