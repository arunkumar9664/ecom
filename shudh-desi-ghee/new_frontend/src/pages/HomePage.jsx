import { useShop } from '../hooks/useShop';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { brand } from '../config/brand';
import { bestsellerSelection, giftingSelection } from '../utils/collections';
import HeroCarousel from '../components/home/HeroCarousel';
import CategoryTiles from '../components/home/CategoryTiles';
import ProductCarousel from '../components/home/ProductCarousel';
import CraftCoverflow from '../components/home/CraftCoverflow';
import ShopTheWorkshop from '../components/home/ShopTheWorkshop';
import OurStory from '../components/home/OurStory';
import JournalRow from '../components/home/JournalRow';

export default function HomePage() {
  const { products, categories, heroSlides, sections, loadCatalog } = useShop();
  const gifts = giftingSelection(products, categories);
  const best = bestsellerSelection(products);
  const arrivals = (products || []).slice(0, 12);
  useDocumentTitle('', brand.tagline);

  return (
    <main>
      <HeroCarousel slides={heroSlides} status={sections.hero} onRetry={loadCatalog} />
      <CategoryTiles categories={categories} status={sections.categories} onRetry={loadCatalog} />
      <ProductCarousel
        title="Gifting Essentials"
        label="Gifting Essentials"
        products={gifts.products}
        href={gifts.href}
        status={sections.products}
        onRetry={loadCatalog}
      />
      <ProductCarousel
        title="New Arrivals"
        label="New Arrivals"
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
      <ShopTheWorkshop />
      <OurStory />
      <JournalRow />
    </main>
  );
}
