/**
 * Shudh Desi Ghee — Master Catalog (aligned with Rosier Foods structure)
 * UI reference: https://www.rosierfoods.com/
 */

export const BRAND = {
  name: 'Shudh Desi Ghee',
  tagline: 'Pure | Traditional | Ethically Crafted',
  motto: 'Foods That Heal, Not Hype',
  domain: 'shudhdesighee.com',
};

const CDN = 'https://www.rosierfoods.com/cdn/shop/files';
const img = (file, width = 800) => `${CDN}/${file}&width=${width}`;

const IMG = {
  // Hero banners (full posters from rosierfoods.com)
  hero1: img('web_home_pg1.png?v=1788185972', 1600),
  hero2: img('janmashtami_banner_web_1.png?v=1788186000', 1600),
  heroSide1: img('file_000000003dac72079cfebe0b11c3b066.png?v=1778869603', 800),
  heroSide2: img('Untitled-1.png?v=1787768234', 800),
  // Category icons / thumbnails
  catGhee: img('ghee_09a692b1-5b73-4156-a411-b30777b76af0.webp?v=1779380654', 800),
  catAtta: img('atta.webp?v=1779380667', 800),
  catBreakfast: img('healthy_breakfast.webp?v=1779380683', 800),
  catPickles: img('pickles.webp?v=1779380696', 800),
  catOils: img('oils.webp?v=1779380714', 800),
  catImmunity: img('immunity_bosters.webp?v=1779380728', 800),
  iconGhee: img('Ghee_Icons.png?v=1781252536', 120),
  // Products
  ghee1: img('rosier-foods-ghee-500-ml-gir-cow-a2-ghee-made-from-curd-1239446978.jpg?v=1779283720', 800),
  ghee2: img('rosier-foods-ghee-gir-cow-a2-ghee-made-from-curd-1210408687.jpg?v=1769604150', 800),
  ghee3: img('rosier-foods-ghee-250-ml-gir-cow-a2-ghee-made-from-curd-250-ml-1240619455.jpg?v=1779888192', 800),
  honey: img('rosier-foods-honey-500g-wild-forest-honey-1238550349.jpg?v=1778873413', 800),
  honey2: img('rosier-foods-honey-500g-wild-forest-honey-1248149128.webp?v=1783502591', 800),
  atta: img('rosier-foods-flour-2-kg-khapli-emmer-wheat-atta-1239446981.jpg?v=1779283597', 800),
  atta2: img('rosier-foods-flour-khapli-emmer-wheat-atta-1218401189.jpg?v=1772123192', 800),
  oil: img('rosier-foods-oil-1000-ml-pet-bottle-stone-pressed-black-mustard-oil-1238506731.jpg?v=1778844370', 800),
  oil2: img('rosier-foods-oil-stone-pressed-black-mustard-oil-1217524985.jpg?v=1768916437', 800),
  oilGroundnut: img('rosier-foods-oil-1000-ml-pet-bottle-stone-pressed-groundnut-oil-1238550351.jpg?v=1778873379', 800),
  oilCoconut: img('rosier-foods-oil-1000-ml-pet-bottle-stone-pressed-coconut-oil-1238550353.jpg?v=1778873320', 800),
  oilYellow: img('rosier-foods-oil-stone-pressed-yellow-mustard-oil-1253320259.webp?v=1786037109', 800),
  pickle: img('rosier-foods-pickle-300-gms-mango-pickle-natural-sun-dried-1239710636.jpg?v=1779377171', 800),
  pickle2: img('rosier-foods-pickle-300-gms-mango-pickle-natural-sun-dried-1233338543.png?v=1776765159', 800),
  breakfast: img('healthy_breakfast.webp?v=1779380683', 800),
  // Combos
  comboMother: img('rosier-foods-combo-a2-ghee-1-ltr-wild-forest-honey-500g-mother-s-pure-delight-1256539139.png?v=1788196631', 800),
  comboTrio: img('rosier-foods-1-ltr-yellow-mustard-1-ltr-groundnut-1-ltr-black-mustard-oil-cold-pressed-trio-1256539133.png?v=1788196841', 800),
  comboGrain: img('rosier-foods-combo-jowar-flour-1kg-sattu-flour-1kg-ragi-flour-1kg-grain-trial-trio-1256539142.png?v=1788196753', 800),
  comboGrandma: img('rosier-foods-combo-black-mustard-oil-5-ltr-a2-ghee-500-ml-grandma-s-kitchen-essentials-1256539137.png?v=1788196723', 800),
  comboCooking: img('rosier-foods-combo-khapli-flour-2kg-gir-cow-a2-ghee-1-ltr-cooking-pack-1256539134.png?v=1788196813', 800),
  comboMom: img('rosier-foods-combo-a2-ghee-500-ml-groundnut-oil-1-ltr-wild-forest-honey-300g-mom-s-wholesome-trio-1256539140.png?v=1788196658', 800),
  comboEssential: img('rosier-foods-combo-a2-ghee-500ml-black-mustard-oil-1-ltr-wild-forest-honey-300g-mango-pickle-essential-kitchen-pack-1256539135.png?v=1788196782', 800),
  comboImmunity: img('rosier-foods-combo-a2-ghee-250-ml-wild-forest-honey-300g-immunity-pack-1256539138.png?v=1788196696', 800),
};

export const BRAND_CONTACT = {
  id: 1,
  phone: '+91 98765 43210',
  displayPhone: '+91 98765 43210',
  email: 'shudhdesighee@gmail.com',
  instagram: 'https://www.instagram.com/shudhdesighee',
  instagramHandle: '@shudhdesighee',
  facebook: 'https://www.facebook.com/shudhdesighee',
  whatsapp: 'https://wa.me/919876543210',
  address: 'Village Gaushala Road, Jaipur, Rajasthan 302020, India',
  googleMaps: 'https://maps.google.com',
  hours: 'Mon - Sat: 9:00 AM - 7:00 PM IST',
  shippingFee: 99,
  freeShippingThreshold: 999,
};

export const PROMO_MESSAGES = [
  '✨ Janmashtami Sale Is Live! Get Up to 17% OFF 🎉',
  'Free delivery on all orders above ₹999',
  '10% OFF first order — use code GHEE10 at checkout',
  '100% Pure Desi Cow Ghee — Traditional Bilona Method',
];

export const CATEGORIES = [
  { id: 'desi-cow-ghee', slug: 'desi-cow-ghee', name: 'Gir Cow A2 Desi Ghee', count: '6 Variants', image: IMG.catGhee, tagline: 'Pure indigenous breed cow ghee' },
  { id: 'a2-bilona-ghee', slug: 'a2-bilona-ghee', name: 'A2 Bilona Ghee', count: '4 Variants', image: IMG.ghee2, tagline: 'Hand-churned A2 ghee the traditional way' },
  { id: 'atta', slug: 'atta', name: 'Atta', count: '3 Variants', image: IMG.catAtta, tagline: 'Heritage grain stone-milled flour' },
  { id: 'healthy-breakfast', slug: 'healthy-breakfast', name: 'Healthy Breakfast', count: '4 Items', image: IMG.catBreakfast, tagline: 'Wholesome morning staples' },
  { id: 'pickles', slug: 'pickles', name: 'Pickles', count: '3 Variants', image: IMG.catPickles, tagline: 'Sun-dried traditional pickles' },
  { id: 'stone-pressed-oils', slug: 'stone-pressed-oils', name: 'Stone Pressed Oils', count: '4 Variants', image: IMG.catOils, tagline: 'Cold pressed oils for healthy cooking' },
  { id: 'immunity-booster', slug: 'immunity-booster', name: 'Immunity Booster', count: '4 Items', image: IMG.catImmunity, tagline: 'Honey, ghee & wellness combos' },
  { id: 'combo-packs', slug: 'combo-packs', name: 'Combo & Gift Packs', count: '8 Hampers', image: IMG.comboMother, tagline: 'Buy more, save more' },
];

export const HERO_SLIDES = [
  { id: 1, subtitle: '', title: '', description: '', cta: '', categorySlug: 'desi-cow-ghee', image: IMG.hero1, posterOnly: true, order: 1 },
  { id: 2, subtitle: '', title: '', description: '', cta: '', categorySlug: 'combo-packs', image: IMG.hero2, posterOnly: true, order: 2 },
];

const pack = (name, hex, images) => ({ name, hex, images });

export const PRODUCTS = [
  { id: 'g1', name: 'Gir Cow A2 Ghee - Made From Curd', category: 'Gir Cow A2 Desi Ghee', categorySlug: 'desi-cow-ghee', price: 699, originalPrice: 899, colorVariants: [pack('Glass Jar', '#C8960C', [IMG.ghee1, IMG.ghee2]), pack('Steel Dolchi', '#8B6914', [IMG.ghee3, IMG.ghee1])], sizes: ['250 ML', '500 ML', '1 Ltr', '2 Ltr', '5 Ltr'], image: IMG.ghee1, badge: 'Best Seller', rating: 4.9, isSoldOut: false, stockQuantity: 50, description: 'Pure A2 desi cow ghee from curd using bilona method.', fabric: '100% A2 Gir Cow Milk', care: 'Store cool & dry', craftsmanship: 'Bilona churned, wood-fire slow cooked', shipping: '2-4 business days' },
  { id: 'g2', name: 'Premium A2 Bilona Ghee', category: 'A2 Bilona Ghee', categorySlug: 'a2-bilona-ghee', price: 899, originalPrice: 1099, colorVariants: [pack('Glass Jar', '#D4AF37', [IMG.ghee2, IMG.ghee3])], sizes: ['250 ML', '500 ML', '1 Ltr', '2 Ltr'], image: IMG.ghee2, badge: 'Trending', rating: 4.95, isSoldOut: false, stockQuantity: 40, description: 'Hand-churned bilona ghee from free-grazing Gir cows.', fabric: 'A2 Gir Cow Milk', care: 'Away from direct sunlight', craftsmanship: 'Curd-churned Bilona', shipping: '2-4 business days' },
  { id: 'h1', name: 'Wild Forest Honey', category: 'Immunity Booster', categorySlug: 'immunity-booster', price: 589, originalPrice: 649, colorVariants: [pack('Glass Jar', '#F5DEB3', [IMG.honey, IMG.honey2])], sizes: ['500g', '300g'], image: IMG.honey, badge: 'Trending', rating: 4.7, isSoldOut: false, stockQuantity: 45, description: 'Raw wild forest honey — unprocessed and nutrient-rich.', fabric: '100% Raw Forest Honey', care: 'Store at room temperature', craftsmanship: 'Ethically harvested', shipping: '2-3 business days' },
  { id: 'a1', name: 'Khapli (Emmer) Wheat Atta', category: 'Atta', categorySlug: 'atta', price: 499, originalPrice: 549, colorVariants: [pack('Paper Pack', '#DEB887', [IMG.atta, IMG.atta2])], sizes: ['2 kg', '5 kg'], image: IMG.atta, badge: 'Must Try', rating: 4.7, isSoldOut: false, stockQuantity: 60, description: 'Stone-milled Khapli wheat atta — low gluten, high fibre.', fabric: '100% Khapli Emmer Wheat', care: 'Store in airtight container', craftsmanship: 'Traditional stone-milling', shipping: '2-4 business days' },
  { id: 'o1', name: 'Stone Pressed Black Mustard Oil', category: 'Stone Pressed Oils', categorySlug: 'stone-pressed-oils', price: 390, originalPrice: 450, colorVariants: [pack('PET Bottle', '#FFD700', [IMG.oil, IMG.oil2])], sizes: ['1000 ML'], image: IMG.oil, badge: 'Trending', rating: 4.9, isSoldOut: false, stockQuantity: 70, description: 'Cold stone-pressed black mustard oil — unrefined & chemical-free.', fabric: '100% Black Mustard Seeds', care: 'Away from heat & light', craftsmanship: 'Stone-press extraction', shipping: '2-3 business days' },
  { id: 'p1', name: 'Mango Pickle - Natural Sun Dried', category: 'Pickles', categorySlug: 'pickles', price: 349, originalPrice: 399, colorVariants: [pack('Glass Jar', '#FF6347', [IMG.pickle, IMG.pickle2])], sizes: ['300 Gms'], image: IMG.pickle, badge: 'Summer Special', rating: 4.8, isSoldOut: false, stockQuantity: 40, description: 'Traditional sun-dried mango pickle with mustard oil & spices.', fabric: 'Raw Mango, Mustard Oil, Spices', care: 'Refrigerate after opening', craftsmanship: 'Sun-dried traditional recipe', shipping: '2-4 business days' },
  { id: 'o2', name: 'Stone Pressed Groundnut Oil', category: 'Stone Pressed Oils', categorySlug: 'stone-pressed-oils', price: 445, originalPrice: 499, colorVariants: [pack('PET Bottle', '#DAA520', [IMG.oilGroundnut, IMG.oil2])], sizes: ['1000 ML'], image: IMG.oilGroundnut, badge: 'Trending', rating: 4.9, isSoldOut: false, stockQuantity: 55, description: 'Unrefined groundnut oil for everyday Indian cooking.', fabric: '100% Groundnuts', care: 'Cool, dry storage', craftsmanship: 'Cold stone-pressed', shipping: '2-3 business days' },
  { id: 'o3', name: 'Stone Pressed Coconut Oil', category: 'Stone Pressed Oils', categorySlug: 'stone-pressed-oils', price: 899, originalPrice: 999, colorVariants: [pack('PET Bottle', '#FFF8DC', [IMG.oilCoconut, IMG.oilYellow])], sizes: ['1000 ML'], image: IMG.oilCoconut, badge: 'Premium', rating: 4.9, isSoldOut: false, stockQuantity: 35, description: 'Virgin coconut oil — ideal for cooking and wellness.', fabric: '100% Coconuts', care: 'Store away from heat', craftsmanship: 'Stone-pressed virgin extraction', shipping: '2-4 business days' },
  { id: 'o4', name: 'Stone Pressed Yellow Mustard Oil', category: 'Stone Pressed Oils', categorySlug: 'stone-pressed-oils', price: 490, originalPrice: 550, colorVariants: [pack('PET Bottle', '#FFD700', [IMG.oilYellow, IMG.oil])], sizes: ['1000 ml', '5 L (Tin Pack)'], image: IMG.oilYellow, badge: 'Trending', rating: 5.0, isSoldOut: false, stockQuantity: 45, description: 'Cold stone-pressed yellow mustard oil for authentic flavour.', fabric: '100% Yellow Mustard Seeds', care: 'Cool, dry storage', craftsmanship: 'Stone-press extraction', shipping: '2-3 business days' },
  { id: 'b1', name: 'Sattu Breakfast Mix', category: 'Healthy Breakfast', categorySlug: 'healthy-breakfast', price: 299, originalPrice: 349, colorVariants: [pack('Pouch Pack', '#8B4513', [IMG.breakfast, IMG.atta])], sizes: ['500g', '1 kg'], image: IMG.breakfast, badge: 'Healthy', rating: 4.6, isSoldOut: false, stockQuantity: 50, description: 'Roasted gram sattu — protein-rich traditional breakfast drink.', fabric: 'Roasted Bengal Gram', care: 'Airtight storage', craftsmanship: 'Slow-roasted & ground', shipping: '2-3 business days' },
  { id: 'i1', name: 'Turmeric Infused Desi Ghee', category: 'Immunity Booster', categorySlug: 'immunity-booster', price: 749, originalPrice: 899, colorVariants: [pack('Glass Jar', '#FF8C00', [IMG.ghee3, IMG.ghee1])], sizes: ['250 ML', '500 ML'], image: IMG.ghee3, badge: 'Immunity Booster', rating: 4.85, isSoldOut: false, stockQuantity: 35, description: 'Lakadong turmeric infused desi ghee for daily wellness.', fabric: 'Desi Ghee + Lakadong Turmeric', care: 'Cool storage', craftsmanship: 'Ayurvedic infusion', shipping: '2-4 business days' },
  { id: 'c1', name: "Mother's Pure Delight", category: 'Combo & Gift Packs', categorySlug: 'combo-packs', price: 2438, originalPrice: 2869, colorVariants: [pack('Gift Box', '#8B0000', [IMG.comboMother, IMG.ghee1])], sizes: ['Combo Pack'], image: IMG.comboMother, badge: 'Combo', rating: 4.9, isSoldOut: false, stockQuantity: 20, description: 'A2 Ghee 1 Ltr + Wild Forest Honey 500g', fabric: 'A2 Ghee + Raw Honey', care: 'Gift-ready box', craftsmanship: 'Curated combo', shipping: 'Free shipping' },
  { id: 'c2', name: 'Cold Pressed Trio', category: 'Combo & Gift Packs', categorySlug: 'combo-packs', price: 1126, originalPrice: 1325, colorVariants: [pack('Combo Box', '#556B2F', [IMG.comboTrio, IMG.oil])], sizes: ['Combo Pack'], image: IMG.comboTrio, badge: 'Combo', rating: 4.9, isSoldOut: false, stockQuantity: 25, description: 'Yellow Mustard + Groundnut + Black Mustard Oil (1L each)', fabric: 'Assorted Cold-Pressed Oils', care: 'Store cool & dry', craftsmanship: 'Kitchen essentials combo', shipping: 'Free shipping' },
  { id: 'c3', name: "Grandma's Kitchen Essentials", category: 'Combo & Gift Packs', categorySlug: 'combo-packs', price: 2729, originalPrice: 3249, colorVariants: [pack('Premium Box', '#FFD700', [IMG.comboGrandma, IMG.oil])], sizes: ['Combo Pack'], image: IMG.comboGrandma, badge: 'Best Value', rating: 4.9, isSoldOut: false, stockQuantity: 15, description: 'Black Mustard Oil 5L + A2 Ghee 500 ML', fabric: 'Oil + Ghee combo', care: 'Gift packaging', craftsmanship: 'Family value pack', shipping: 'Free shipping' },
  { id: 'c4', name: 'Immunity Pack', category: 'Combo & Gift Packs', categorySlug: 'combo-packs', price: 940, originalPrice: 1069, colorVariants: [pack('Gift Box', '#228B22', [IMG.comboImmunity, IMG.honey])], sizes: ['Combo Pack'], image: IMG.comboImmunity, badge: 'Immunity', rating: 4.9, isSoldOut: false, stockQuantity: 30, description: 'A2 Ghee 250 ML + Wild Forest Honey 300g', fabric: 'Ghee + Honey', care: 'Cool, dry place', craftsmanship: 'Wellness combo', shipping: 'Free shipping' },
  { id: 'c5', name: 'Cooking Pack', category: 'Combo & Gift Packs', categorySlug: 'combo-packs', price: 2447, originalPrice: 2879, colorVariants: [pack('Family Pack', '#8B6914', [IMG.comboCooking, IMG.atta])], sizes: ['Combo Pack'], image: IMG.comboCooking, badge: 'Combo', rating: 4.7, isSoldOut: false, stockQuantity: 18, description: 'Khapli Flour 2Kg + Gir Cow A2 Ghee 1 Ltr', fabric: 'Atta + Ghee', care: 'Store separately', craftsmanship: 'Daily cooking combo', shipping: 'Free shipping' },
  { id: 'c6', name: 'Essential Kitchen Pack', category: 'Combo & Gift Packs', categorySlug: 'combo-packs', price: 2090, originalPrice: 2459, colorVariants: [pack('Kitchen Box', '#CD853F', [IMG.comboEssential, IMG.pickle])], sizes: ['Combo Pack'], image: IMG.comboEssential, badge: 'Popular', rating: 4.7, isSoldOut: false, stockQuantity: 22, description: 'Ghee 500ML + Mustard Oil 1L + Honey 300g + Mango Pickle', fabric: 'Multi-product kitchen set', care: 'See individual labels', craftsmanship: 'Complete kitchen starter', shipping: 'Free shipping' },
  { id: 'c7', name: "Mom's Wholesome Trio", category: 'Combo & Gift Packs', categorySlug: 'combo-packs', price: 1840, originalPrice: 2165, colorVariants: [pack('Gift Box', '#8B4513', [IMG.comboMom, IMG.honey])], sizes: ['Combo Pack'], image: IMG.comboMom, badge: 'Combo', rating: 4.9, isSoldOut: false, stockQuantity: 20, description: 'A2 Ghee 500 ML + Groundnut Oil 1 Ltr + Wild Forest Honey 300g', fabric: 'Ghee + Oil + Honey', care: 'Gift-ready box', craftsmanship: 'Family wellness combo', shipping: 'Free shipping' },
  { id: 'c8', name: 'Grain Trial Trio', category: 'Combo & Gift Packs', categorySlug: 'combo-packs', price: 599, originalPrice: 675, colorVariants: [pack('Trial Pack', '#DEB887', [IMG.comboGrain, IMG.atta])], sizes: ['Combo Pack'], image: IMG.comboGrain, badge: 'Must Try', rating: 4.8, isSoldOut: false, stockQuantity: 25, description: 'Jowar Flour 1Kg + Sattu Flour 1Kg + Ragi Flour 1kg', fabric: 'Heritage grain flours', care: 'Airtight storage', craftsmanship: 'Stone-milled trio', shipping: 'Free shipping' },
];

export const DISCOUNT_CODES = [
  { code: 'GHEE10', discountPercent: 10, minSpend: 0, description: '10% OFF first order', isActive: true },
  { code: 'BILONA15', discountPercent: 15, minSpend: 1500, description: '15% OFF orders above ₹1,500', isActive: true },
  { code: 'FESTIVE17', discountPercent: 17, minSpend: 2000, description: '17% OFF festive orders above ₹2,000', isActive: true },
];

export const INITIAL_ORDERS = [
  { id: 'ORD-GHEE-001', customerName: 'Rahul Sharma', customerEmail: 'rahul.s@gmail.com', customerPhone: '9876543210', customerAddress: 'B-402 Green Heights, Gurgaon 122002', items: [{ id: 'g1', name: 'Gir Cow A2 Ghee', size: '500 ML', color: 'Glass Jar', quantity: 2, price: 699 }], total: 1497, status: 'Delivered', paymentMethod: 'Prepaid (UPI)', createdAt: new Date('2026-08-20T10:00:00.000Z') },
  { id: 'ORD-GHEE-002', customerName: 'Priya Verma', customerEmail: 'priya.v@gmail.com', customerPhone: '9812345678', customerAddress: '72 Lake View, Jaipur 302001', items: [{ id: 'c4', name: 'Immunity Pack', size: 'Combo Pack', color: 'Gift Box', quantity: 1, price: 940 }], total: 1039, status: 'Processing', paymentMethod: 'Prepaid (Credit Card)', createdAt: new Date('2026-08-28T11:00:00.000Z') },
];

export const ADMIN = {
  email: 'admin@shudhdesighee.com',
  password: 'admin123',
  name: 'Shudh Desi Ghee Admin',
};

/** Static content for frontend (no DB model yet) */
export const TESTIMONIALS = [
  { id: 1, name: 'Sumit S.', quote: 'A2 Bilona Desi Ghee supports my digestion and gives me steady, long-lasting energy.', product: 'Gir Cow A2 Ghee - Made From Curd' },
  { id: 2, name: 'Alisha A.', quote: 'Khapli Wheat Atta was the best choice for our health — fresh, nutritious, perfect for daily meals!', product: 'Khapli (Emmer) Wheat Atta' },
  { id: 3, name: 'Himanshi S.', quote: 'The quality and purity of A2 Desi Cow Ghee is simply outstanding. Taste that feels like home.', product: 'Gir Cow A2 Ghee - Made From Curd' },
  { id: 4, name: 'Ankush S.', quote: 'Pure aroma, authentic taste — my family loves it!', product: 'Premium A2 Bilona Ghee' },
];

export const EXPERIENCE_PILLARS = [
  { title: 'Source To Table', description: 'Direct relationships with heritage grain farmers and gaushalas.' },
  { title: 'Time-Honored Techniques', description: 'Slow Bilona churning, stone-milling, and authentic methods.' },
  { title: 'Unwavering Purity', description: 'No refined oils, no additives — just pure, wholesome ingredients.' },
  { title: 'Commitment to Community', description: 'Fair trade practices and direct support to rural farming families.' },
];

export const BRAND_STATS = [
  { value: '50K+', label: 'Happy Families' },
  { value: '100%', label: 'Pure & Natural' },
  { value: '15+', label: 'Artisan Partners' },
  { value: '4.9★', label: 'Average Rating' },
];

export const LAB_REPORTS = [
  { id: 'lr1', title: 'A2 Ghee Purity Report — Aug 2026', product: 'Gir Cow A2 Ghee', status: 'Passed', pdfUrl: '#' },
  { id: 'lr2', title: 'Honey Quality Analysis — Jul 2026', product: 'Wild Forest Honey', status: 'Passed', pdfUrl: '#' },
  { id: 'lr3', title: 'Mustard Oil FSSAI Compliance — Jun 2026', product: 'Stone Pressed Mustard Oil', status: 'Passed', pdfUrl: '#' },
];

/** Bundled catalog — powers the UI when backend is offline or for static deploy */
export const staticCatalog = {
  products: PRODUCTS,
  categories: CATEGORIES,
  heroSlides: HERO_SLIDES,
  promoMessages: PROMO_MESSAGES,
  storeSettings: BRAND_CONTACT,
  discountCodes: DISCOUNT_CODES,
};
