import { catalogImages as img } from '../config/media';

const pack = (name, hex, images) => ({ name, hex, images });

export const mockCategories = [
  { id: 'soaps', slug: 'soaps', name: 'Soaps', count: '3 bars', image: img.honey, tagline: 'Cold-pressed bars for the sink and the bath' },
  { id: 'candles', slug: 'candles', name: 'Candles', count: '2 lights', image: img.ghee2, tagline: 'Beeswax lights poured in small batches' },
  { id: 'home-linen', slug: 'home-linen', name: 'Home Linen', count: '2 weaves', image: img.atta, tagline: 'Washed linen and cotton for the bed' },
  { id: 'bags', slug: 'bags', name: 'Bags', count: '2 bags', image: img.comboMother, tagline: 'Cloth bags stitched for market days' },
  { id: 'attars-perfumes', slug: 'attars-perfumes', name: 'Attars & Perfumes', count: '2 oils', image: img.oilCoconut, tagline: 'Alcohol-free attars in glass' },
  { id: 'gifting', slug: 'gifting', name: 'Gifting', count: '1 hamper', image: img.comboEssential, tagline: 'A small set, tied and ready to give' },
];

export const mockHeroSlides = [
  {
    id: 1,
    subtitle: 'THE WASH',
    title: 'Soap, poured by hand',
    description: 'Neem, turmeric, and milk bars cured for a full month.',
    cta: 'Shop soaps',
    categorySlug: 'soaps',
    image: img.hero1,
    order: 1,
  },
  {
    id: 2,
    subtitle: 'THE TABLE',
    title: 'Light for a quiet room',
    description: 'Beeswax candles with cotton wicks and no perfume oils.',
    cta: 'Shop candles',
    categorySlug: 'candles',
    image: img.hero2,
    order: 2,
  },
  {
    id: 3,
    subtitle: 'THE BED',
    title: 'Linen that softens',
    description: 'Stone-washed sheets in undyed flax.',
    cta: 'Shop linen',
    categorySlug: 'home-linen',
    image: img.heroSide1,
    order: 3,
  },
];

export const mockPromoMessages = [
  { id: 1, message: 'Free dispatch on orders over the amount set in the shop', order: 1 },
  { id: 2, message: 'Alcohol-free attars, bottled in small glass vials', order: 2 },
  { id: 3, message: 'Use code HEARTH10 on your first parcel', order: 3 },
];

export const mockSettings = {
  id: 1,
  phone: '+919800011122',
  displayPhone: '+91 98000 11122',
  email: 'hello@fieldandhearth.example',
  instagram: 'https://instagram.com',
  instagramHandle: '@fieldandhearth',
  facebook: 'https://facebook.com',
  whatsapp: 'https://wa.me/919800011122',
  address: '12 Workshop Lane, Jaipur, Rajasthan 302001',
  googleMaps: 'https://maps.google.com',
  hours: 'Mon – Sat, 10:00 – 18:00 IST',
  shippingFee: 79,
  freeShippingThreshold: 1499,
};

export const mockDiscounts = [
  { id: 'mock-hearth10', code: 'HEARTH10', discountPercent: 10, minSpend: 0, description: '10% off a first parcel', isActive: true, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'mock-linen5', code: 'LINEN5', discountPercent: 5, minSpend: 2000, description: '5% off linen orders over ₹2,000', isActive: true, createdAt: '2026-01-02T00:00:00.000Z' },
];

const product = (fields) => ({
  secondaryImage: null,
  rating: 4.8,
  isSoldOut: false,
  stockQuantity: 24,
  reviewCount: 0,
  averageRating: 0,
  createdAt: '2026-06-01T00:00:00.000Z',
  ...fields,
});

export const mockProducts = [
  product({
    id: 'soap-neem',
    name: 'Neem and turmeric soap',
    category: 'Soaps',
    categorySlug: 'soaps',
    price: 240,
    originalPrice: 280,
    badge: 'Best Seller',
    image: img.honey,
    description: 'A firm bar for daily washing, with neem leaf and turmeric.',
    fabric: 'Coconut oil, neem, turmeric',
    care: 'Keep dry between washes',
    craftsmanship: 'Cold process, cured four weeks',
    shipping: '2–5 days',
    sizes: ['100 g', '150 g'],
    colorVariants: [pack('Unscented', '#C4A574', [img.honey, img.honey2]), pack('Lemongrass', '#C6B35A', [img.honey2, img.honey])],
  }),
  product({
    id: 'soap-milk',
    name: 'Milk and honey soap',
    category: 'Soaps',
    categorySlug: 'soaps',
    price: 260,
    originalPrice: 300,
    badge: null,
    image: img.ghee1,
    description: 'A softer bar with honey and powdered milk.',
    fabric: 'Olive oil, honey, milk',
    care: 'Drain the dish after use',
    craftsmanship: 'Hand cut',
    shipping: '2–5 days',
    sizes: ['100 g'],
    colorVariants: [pack('Honey', '#E2C48A', [img.ghee1, img.ghee3])],
  }),
  product({
    id: 'soap-charcoal',
    name: 'Charcoal face soap',
    category: 'Soaps',
    categorySlug: 'soaps',
    price: 280,
    originalPrice: null,
    badge: null,
    image: img.pickle,
    description: 'A small bar with activated charcoal for the face.',
    fabric: 'Charcoal, clay, coconut oil',
    care: 'Avoid the eyes',
    craftsmanship: 'Moulded in wood frames',
    shipping: '2–5 days',
    sizes: ['75 g'],
    colorVariants: [pack('Charcoal', '#3A3530', [img.pickle, img.pickle2])],
  }),
  product({
    id: 'candle-pillar',
    name: 'Beeswax pillar candle',
    category: 'Candles',
    categorySlug: 'candles',
    price: 890,
    originalPrice: 980,
    badge: 'Best Seller',
    image: img.ghee2,
    description: 'A tall beeswax pillar with a cotton wick.',
    fabric: 'Beeswax, cotton wick',
    care: 'Trim the wick to 5 mm',
    craftsmanship: 'Poured in small tins',
    shipping: '2–5 days',
    sizes: ['200 g', '400 g'],
    colorVariants: [pack('Natural wax', '#E6C56E', [img.ghee2, img.ghee1])],
  }),
  product({
    id: 'candle-votive',
    name: 'Fig leaf votive',
    category: 'Candles',
    categorySlug: 'candles',
    price: 420,
    originalPrice: null,
    badge: null,
    image: img.ghee3,
    description: 'A short votive scented with fig leaf.',
    fabric: 'Beeswax, fig leaf',
    care: 'Burn on a stable plate',
    craftsmanship: 'Hand poured',
    shipping: '2–5 days',
    sizes: ['80 g'],
    colorVariants: [pack('Fig', '#8A9A62', [img.ghee3, img.oilYellow])],
  }),
  product({
    id: 'linen-sheet',
    name: 'Washed linen sheet set',
    category: 'Home Linen',
    categorySlug: 'home-linen',
    price: 4200,
    originalPrice: 4800,
    badge: null,
    image: img.atta,
    description: 'A flat sheet and two pillowcases in washed flax.',
    fabric: '100% flax linen',
    care: 'Machine wash cold, hang dry',
    craftsmanship: 'Stone washed before sewing',
    shipping: '3–6 days',
    sizes: ['Single', 'Queen', 'King'],
    colorVariants: [pack('Oat', '#E7D7BE', [img.atta, img.atta2]), pack('Sage', '#8B9374', [img.atta2, img.atta])],
  }),
  product({
    id: 'linen-throw',
    name: 'Cotton throw',
    category: 'Home Linen',
    categorySlug: 'home-linen',
    price: 1800,
    originalPrice: 2100,
    badge: null,
    image: img.comboGrain,
    description: 'A light cotton throw for the foot of the bed.',
    fabric: 'Cotton',
    care: 'Wash cold',
    craftsmanship: 'Hemmed by hand',
    shipping: '3–6 days',
    sizes: ['120 × 180 cm'],
    colorVariants: [pack('Sand', '#D8C4A4', [img.comboGrain, img.atta])],
  }),
  product({
    id: 'bag-tote',
    name: 'Market tote',
    category: 'Bags',
    categorySlug: 'bags',
    price: 1450,
    originalPrice: 1600,
    badge: 'Best Seller',
    image: img.comboMother,
    description: 'A sturdy cloth tote with an inner pocket.',
    fabric: 'Heavy cotton canvas',
    care: 'Spot clean',
    craftsmanship: 'Stitched and turned',
    shipping: '2–5 days',
    sizes: ['One size'],
    colorVariants: [pack('Natural', '#EFE6D6', [img.comboMother, img.comboCooking]), pack('Olive', '#3B4A32', [img.comboCooking, img.comboMother])],
  }),
  product({
    id: 'bag-pouch',
    name: 'Drawstring pouch',
    category: 'Bags',
    categorySlug: 'bags',
    price: 680,
    originalPrice: null,
    badge: null,
    image: img.comboTrio,
    description: 'A small pouch for soap, keys, or a vial of attar.',
    fabric: 'Cotton',
    care: 'Shake out and air',
    craftsmanship: 'Drawstring channel sewn in',
    shipping: '2–5 days',
    sizes: ['Small'],
    colorVariants: [pack('Terracotta', '#B5573A', [img.comboTrio, img.pickle])],
  }),
  product({
    id: 'attar-vetiver',
    name: 'Vetiver attar',
    category: 'Attars & Perfumes',
    categorySlug: 'attars-perfumes',
    price: 1250,
    originalPrice: 1400,
    badge: 'Best Seller',
    image: img.oil,
    description: 'An alcohol-free vetiver attar in a glass roll-on.',
    fabric: 'Vetiver, sandalwood base',
    care: 'Keep the cap tight',
    craftsmanship: 'Aged, then bottled by hand',
    shipping: '2–5 days',
    sizes: ['6 ml', '12 ml'],
    colorVariants: [pack('Vetiver', '#6B6248', [img.oil, img.oil2])],
  }),
  product({
    id: 'attar-rose',
    name: 'Rose water perfume oil',
    category: 'Attars & Perfumes',
    categorySlug: 'attars-perfumes',
    price: 980,
    originalPrice: null,
    badge: null,
    image: img.oilCoconut,
    description: 'A light rose oil with no alcohol.',
    fabric: 'Rose, jojoba',
    care: 'Store away from sun',
    craftsmanship: 'Bottled in small lots',
    shipping: '2–5 days',
    sizes: ['8 ml'],
    colorVariants: [pack('Rose', '#C48B8B', [img.oilCoconut, img.oilYellow])],
  }),
  product({
    id: 'gift-hamper',
    name: 'Workshop hamper',
    category: 'Gifting',
    categorySlug: 'gifting',
    price: 2200,
    originalPrice: 2540,
    badge: 'New',
    image: img.comboEssential,
    description: 'A soap, a votive, and a small attar, packed in cloth.',
    fabric: 'Mixed workshop goods',
    care: 'See each piece',
    craftsmanship: 'Packed to order',
    shipping: '3–6 days',
    sizes: ['One set'],
    colorVariants: [pack('Cloth wrap', '#EFE6D6', [img.comboEssential, img.comboImmunity])],
  }),
];

mockProducts.forEach((item, index) => {
  item.createdAt = new Date(Date.UTC(2026, 5, 20 - index)).toISOString();
});

const neem = mockProducts.find((item) => item.id === 'soap-neem');
const linen = mockProducts.find((item) => item.id === 'linen-sheet');
const pouch = mockProducts.find((item) => item.id === 'bag-pouch');
if (neem) {
  neem.secondaryImage = img.honey2;
  neem.averageRating = 4.7;
  neem.reviewCount = 6;
}
if (linen) {
  linen.secondaryImage = img.atta2;
  linen.averageRating = 4.5;
  linen.reviewCount = 4;
}
if (pouch) pouch.isSoldOut = true;

const mockReviewsByProduct = {
  'soap-neem': [
    { id: 'r1', rating: 5, comment: 'Firm, and it lasts through a damp week by the sink.', user: { name: 'Meera' }, createdAt: '2026-08-02T00:00:00.000Z' },
    { id: 'r2', rating: 5, comment: 'The turmeric note is quiet. Skin feels clean, not stripped.', user: { name: 'Arjun' }, createdAt: '2026-07-18T00:00:00.000Z' },
    { id: 'r3', rating: 4, comment: 'A little soft if the dish stays wet. Still the bar I repurchase.', user: { name: 'Leela' }, createdAt: '2026-06-30T00:00:00.000Z' },
    { id: 'r4', rating: 5, comment: 'Lemongrass is bright without smelling like a cleaner.', user: { name: 'Kabir' }, createdAt: '2026-06-12T00:00:00.000Z' },
    { id: 'r5', rating: 4, comment: 'Cured hard, which I wanted. Lather is modest.', user: { name: 'Nisha' }, createdAt: '2026-05-20T00:00:00.000Z' },
    { id: 'r6', rating: 5, comment: 'Used the unscented bar for weeks. No perfume left on towels.', user: { name: 'Dev' }, createdAt: '2026-05-02T00:00:00.000Z' },
  ],
  'linen-sheet': [
    { id: 'r7', rating: 5, comment: 'Stiff on night one, soft by the weekend.', user: { name: 'Anika' }, createdAt: '2026-08-11T00:00:00.000Z' },
    { id: 'r8', rating: 4, comment: 'Sage is a true grey-green. Hem is even.', user: { name: 'Rohit' }, createdAt: '2026-07-01T00:00:00.000Z' },
    { id: 'r9', rating: 5, comment: 'Cool in the heat. I stopped using a top sheet.', user: { name: 'Sara' }, createdAt: '2026-06-08T00:00:00.000Z' },
    { id: 'r10', rating: 4, comment: 'Washed cold as asked. No pilling after a month.', user: { name: 'Imran' }, createdAt: '2026-05-15T00:00:00.000Z' },
  ],
};

function filteredMockProducts(params) {
  let list = [...mockProducts];
  const categorySlug = params.get('categorySlug');
  const search = (params.get('search') || '').trim().toLowerCase();
  const minPrice = params.get('minPrice');
  const maxPrice = params.get('maxPrice');
  const size = params.get('size');
  if (categorySlug && categorySlug !== 'all') list = list.filter((item) => item.categorySlug === categorySlug);
  if (minPrice) list = list.filter((item) => item.price >= Number(minPrice));
  if (maxPrice) list = list.filter((item) => item.price <= Number(maxPrice));
  if (size) list = list.filter((item) => (item.sizes || []).includes(size));
  if (search) {
    list = list.filter((item) => [item.name, item.description, item.fabric]
      .some((value) => String(value || '').toLowerCase().includes(search)));
  }
  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const page = Math.max(1, Number(params.get('page') || 1));
  const limit = Math.max(1, Number(params.get('limit') || 50));
  const total = list.length;
  return {
    products: list.slice((page - 1) * limit, page * limit),
    pagination: { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) },
  };
}

function mockReviewPage(productId, params) {
  const all = mockReviewsByProduct[productId] || [];
  const page = Math.max(1, Number(params.get('page') || 1));
  const limit = Math.max(1, Number(params.get('limit') || 10));
  const total = all.length;
  return {
    reviews: all.slice((page - 1) * limit, page * limit),
    userReview: null,
    canReview: false,
    pagination: { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit) || 1) },
  };
}

/** Same envelopes as the live API, so the shop context can apply them unchanged. */
export function mockGet(path) {
  const [pathname, query = ''] = String(path).split('?');
  const params = new URLSearchParams(query);
  const reviews = pathname.match(/^\/products\/([^/]+)\/reviews$/);
  if (reviews) {
    return Promise.resolve({ data: { success: true, message: 'Mock', ...mockReviewPage(reviews[1], params) } });
  }
  const one = pathname.match(/^\/products\/([^/]+)$/);
  if (one) {
    const product = mockProducts.find((item) => item.id === one[1]);
    if (!product) {
      const error = new Error('Product not found');
      error.response = { status: 404, data: { message: 'Product not found' } };
      return Promise.reject(error);
    }
    return Promise.resolve({ data: { success: true, message: 'Mock', product } });
  }
  let data;
  if (pathname === '/products') data = filteredMockProducts(params);
  else if (pathname.startsWith('/categories')) data = { categories: mockCategories };
  else if (pathname.startsWith('/hero-slides')) data = { heroSlides: mockHeroSlides };
  else if (pathname.startsWith('/promo-messages')) data = { promoMessages: mockPromoMessages };
  else if (pathname.startsWith('/store-settings')) data = { settings: mockSettings };
  else if (pathname.startsWith('/coupons')) data = { discounts: mockDiscounts };
  else data = {};
  return Promise.resolve({ data: { success: true, message: 'Mock', ...data } });
}
