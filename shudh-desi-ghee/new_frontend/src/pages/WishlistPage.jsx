import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../hooks/useShop';
import useDocumentTitle from '../hooks/useDocumentTitle';
import ProductCard from '../components/home/ProductCard';
import VariantPicker from '../components/home/VariantPicker';
import Diamond from '../components/ui/Diamond';
import { EmptyBagArt } from '../components/ui/illustrations';
import { needsVariantPicker, variantChoices } from '../utils/collections';

export default function WishlistPage() {
  const { wishlist, products, sections, toggleWishlist, addToCart, currentUser, loadCatalog } = useShop();
  const [sort, setSort] = useState('recent');
  const [picker, setPicker] = useState(null);
  useDocumentTitle('My Wishlist', 'Pieces you have saved at Field & Hearth.');

  const items = useMemo(() => {
    const saved = wishlist
      .map((id) => products.find((product) => product.id === id))
      .filter(Boolean);
    const recent = [...saved].reverse();
    if (sort === 'price-asc') return [...recent].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') return [...recent].sort((a, b) => b.price - a.price);
    return recent;
  }, [wishlist, products, sort]);

  const suggestions = [...products].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 4);

  const move = async (product) => {
    if (product.isSoldOut) return;
    if (needsVariantPicker(product)) {
      setPicker(product);
      return;
    }
    const { colors, sizes } = variantChoices(product);
    await addToCart(product, { name: colors[0].name, hex: colors[0].hex }, sizes[0], 1);
  };

  return (
    <main className="mx-auto max-w-[1100px] px-gutter py-10">
      <p className="font-body text-xs tracking-[0.16em] text-muted uppercase">Saved</p>
      <h1 className="mt-2 font-heading text-4xl text-ink md:text-5xl">My Wishlist</h1>
      <p className="mt-2 font-body text-sm text-muted">{items.length} {items.length === 1 ? 'piece' : 'pieces'}</p>
      <p className="mt-4 flex items-center gap-3" aria-hidden="true">
        <span className="h-px w-10 bg-line" />
        <Diamond />
        <span className="h-px w-10 bg-line" />
      </p>

      {!currentUser ? (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[4px] bg-sand px-4 py-3">
          <p className="font-body text-sm text-ink">Sign in to keep your wishlist on every device</p>
          <Link to="/login?next=%2Fwishlist" className="inline-flex h-11 items-center bg-ink px-4 font-body text-xs tracking-[0.14em] text-paper uppercase">Login</Link>
        </div>
      ) : null}

      {sections.products.status === 'loading' ? <p className="mt-8 font-body text-sm text-muted">Loading products…</p> : null}
      {sections.products.status === 'error' ? (
        <div className="mt-8" role="alert">
          <p className="font-body text-sm text-terracotta">{sections.products.error}</p>
          <button type="button" onClick={loadCatalog} className="mt-3 h-11 border border-olive px-4 font-body text-sm text-olive">Retry</button>
        </div>
      ) : null}

      {sections.products.status === 'ready' && items.length ? (
        <>
          <label className="mt-8 flex items-center justify-end gap-2 font-body text-xs tracking-[0.14em] text-terracotta uppercase">
            Sort
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="h-11 border border-line bg-paper px-2 text-ink normal-case">
              <option value="recent">Recently added</option>
              <option value="price-asc">Price, low to high</option>
              <option value="price-desc">Price, high to low</option>
            </select>
          </label>
          <ul className="mt-6 grid grid-cols-2 gap-[22px] min-[1000px]:grid-cols-3">
            {items.map((product) => (
              <li key={product.id} className="relative">
                <button
                  type="button"
                  aria-label={`Remove ${product.name}`}
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-2 left-2 z-10 flex h-11 w-11 items-center justify-center bg-white/90 text-ink"
                >
                  ×
                </button>
                <ProductCard product={product} />
                <button
                  type="button"
                  disabled={product.isSoldOut}
                  onClick={() => move(product)}
                  className="mt-3 h-11 w-full border border-ink font-body text-xs tracking-[0.14em] uppercase disabled:border-line disabled:text-muted"
                >
                  {product.isSoldOut ? 'Sold out' : 'Move to bag'}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {sections.products.status === 'ready' && !items.length ? (
        <div className="mt-12 text-center">
          <EmptyBagArt className="mx-auto h-24 w-24 text-olive" />
          <p className="mt-4 font-heading text-2xl text-ink">Nothing saved yet</p>
          <p className="mt-2 font-body text-sm text-muted">Keep a piece here while you decide.</p>
          <Link to="/shop" className="mt-5 inline-flex h-11 items-center bg-olive px-5 font-body text-xs tracking-[0.14em] text-paper uppercase">Discover our products</Link>
          {suggestions.length ? (
            <ul className="mt-10 grid grid-cols-2 gap-4 text-left md:grid-cols-4">
              {suggestions.map((product) => (
                <li key={product.id}><ProductCard product={product} /></li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {picker ? (
        <VariantPicker
          product={picker}
          onClose={() => setPicker(null)}
          onConfirm={(color, size) => {
            addToCart(picker, color, size, 1);
            setPicker(null);
          }}
        />
      ) : null}
    </main>
  );
}
