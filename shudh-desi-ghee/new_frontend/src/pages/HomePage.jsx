import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { brand } from '../config/brand';
import { resolveNav } from '../config/nav';
import SafeImage from '../components/SafeImage';

const SECTION_LABELS = {
  products: 'Products',
  categories: 'Categories',
  hero: 'Hero',
  promo: 'Announcements',
  settings: 'Store settings',
  coupons: 'Offers',
};

export default function HomePage() {
  const { sections, products, categories, shippingQuote, loadCatalog } = useShop();
  const nav = resolveNav(categories);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-condensed text-sm tracking-[0.18em] text-terracotta uppercase">Phase 1</p>
      <h1 className="mt-3 font-heading text-4xl text-ink">{brand.name}</h1>
      <p className="mt-4 font-body text-base leading-relaxed text-muted">{brand.tagline}</p>
      <SafeImage src={products[0]?.image} alt="" className="mt-8 h-40 w-full" />

      <h2 className="mt-10 font-heading text-2xl">Catalog</h2>
      <ul className="mt-4 divide-y divide-line border border-line">
        {Object.entries(SECTION_LABELS).map(([key, label]) => (
          <li key={key} className="flex items-baseline justify-between gap-4 px-4 py-3 font-body text-sm">
            <span>{label}</span>
            <span className={sections[key]?.status === 'error' ? 'text-terracotta' : 'text-muted'}>
              {sections[key]?.status === 'error' ? sections[key].error : sections[key]?.status}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 font-body text-sm text-muted">{shippingQuote.known ? `Shipping fee ₹${shippingQuote.fee}` : shippingQuote.message}</p>
      <button type="button" onClick={loadCatalog} className="mt-4 border border-olive px-4 py-2 font-body text-sm text-olive">
        Retry
      </button>

      <h2 className="mt-10 font-heading text-2xl">Nav from categories</h2>
      {sections.categories.status === 'error' ? (
        <p className="mt-3 text-sm text-terracotta">{sections.categories.error}</p>
      ) : (
        <ul className="mt-4 flex flex-wrap gap-4 font-heading text-sm tracking-[0.08em]">
          {nav.map((item) => (
            <li key={item.to}>
              <Link to={item.to}>{item.label}</Link>
            </li>
          ))}
          {!nav.length && sections.categories.status === 'ready' ? <li className="text-muted">No categories returned.</li> : null}
        </ul>
      )}
    </main>
  );
}
