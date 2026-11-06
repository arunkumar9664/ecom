import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/home/ProductCard';

export default function WishlistPage() {
  const { wishlist, products, sections, toggleWishlist } = useShop();
  const items = products.filter((product) => wishlist.includes(product.id));

  return (
    <main className="mx-auto max-w-[1360px] px-4 py-8 md:px-8">
      <h1 className="font-heading text-4xl text-ink">Wishlist</h1>
      {sections.products.status === 'loading' ? <p className="mt-6 font-body text-sm">Loading products</p> : null}
      {sections.products.status === 'error' ? <p className="mt-6 font-body text-sm text-terracotta" role="alert">{sections.products.error}</p> : null}
      {sections.products.status === 'ready' && items.length === 0 ? (
        <p className="mt-8 font-body text-sm text-muted">Nothing saved yet. <Link to="/shop" className="underline">Browse the shop</Link></p>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((product) => (
            <li key={product.id} className="relative">
              <ProductCard product={product} />
              <button type="button" onClick={() => toggleWishlist(product.id)} className="mt-2 font-body text-sm text-ink underline">Remove</button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
