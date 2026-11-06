import { useShop } from '../context/ShopContext';
import { bestsellerSelection, giftingSelection } from '../utils/collections';
import HeroCarousel from '../components/home/HeroCarousel';
import CategoryTiles from '../components/home/CategoryTiles';
import ProductCarousel from '../components/home/ProductCarousel';
import CraftCoverflow from '../components/home/CraftCoverflow';
import OurStory from '../components/home/OurStory';
import JournalRow from '../components/home/JournalRow';

export default function HomePage() {
  const { products, categories, heroSlides, sections, loadCatalog } = useShop();
  const gifts = giftingSelection(products, categories);
  const best = bestsellerSelection(products);
  const arrivals = (products || []).slice(0, 12);

  return (
    <main>
      <HeroCarousel slides={heroSlides} status={sections.hero} onRetry={loadCatalog} />
      <CategoryTiles categories={categories} status={sections.categories} onRetry={loadCatalog} />
      <ProductCarousel
        title="Gifting essentials"
        label="Gifting essentials"
        products={gifts.products}
        href={gifts.href}
        status={sections.products}
        onRetry={loadCatalog}
      />
      <ProductCarousel
        title="New arrivals"
        label="New arrivals"
        products={arrivals}
        href="/shop"
        status={sections.products}
        onRetry={loadCatalog}
      />
      <ProductCarousel
        title="Bestsellers"
        label="Bestsellers"
        products={best.products}
        href={best.href}
        status={sections.products}
        onRetry={loadCatalog}
      />
      <CraftCoverflow />
      <OurStory />
      <JournalRow />
    </main>
  );
}
