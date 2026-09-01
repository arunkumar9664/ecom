const CDN = 'https://www.rosierfoods.com/cdn/shop/files';
const icon = (file) => `${CDN}/${file}&width=120`;

export const TESTIMONIALS = [
  { id: 1, name: 'Sumit S.', quote: 'A2 Bilona Desi Ghee supports my digestion and gives me steady, long-lasting energy.', product: 'Gir Cow A2 Ghee - Made From Curd' },
  { id: 2, name: 'Alisha A.', quote: 'Khapli Wheat Atta was the best choice for our health — fresh, nutritious, perfect for daily meals!', product: 'Khapli (Emmer) Wheat Atta' },
  { id: 3, name: 'Himanshi S.', quote: 'The quality and purity of A2 Desi Cow Ghee is simply outstanding.', product: 'Gir Cow A2 Ghee - Made From Curd' },
  { id: 4, name: 'Ankush S.', quote: 'Pure aroma, authentic taste — my family loves it!', product: 'Premium A2 Bilona Ghee' },
];

export const EXPERIENCE_PILLARS = [
  { title: 'Source To Table', description: 'Direct relationships with heritage grain farmers and gaushalas, ensuring sustainable sourcing.' },
  { title: 'Time-Honored Techniques', description: 'Slow Bilona churning, traditional stone-milling, and authentic methods.' },
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
  { id: 'lr1', title: 'A2 Ghee Purity Report — Aug 2026', product: 'Gir Cow A2 Ghee', status: 'Passed' },
  { id: 'lr2', title: 'Honey Quality Analysis — Jul 2026', product: 'Wild Forest Honey', status: 'Passed' },
  { id: 'lr3', title: 'Mustard Oil FSSAI Compliance — Jun 2026', product: 'Stone Pressed Mustard Oil', status: 'Passed' },
];

export const POPULAR_SEARCHES = ['A2 Ghee', 'Wild Forest Honey', 'Cold Pressed Oil', 'Khapli Atta'];

export const CATEGORY_PILLS = [
  { label: 'A2 Ghee', slug: 'desi-cow-ghee', image: icon('Ghee_Icons.png?v=1781252536') },
  { label: 'Pickles', slug: 'pickles', image: icon('pickles.webp?v=1779380696') },
  { label: 'Atta', slug: 'atta', image: icon('atta.webp?v=1779380667') },
  { label: 'Stone Pressed Oils', slug: 'stone-pressed-oils', image: icon('oils.webp?v=1779380714') },
  { label: 'Healthy Breakfast', slug: 'healthy-breakfast', image: icon('healthy_breakfast.webp?v=1779380683') },
  { label: 'Immunity Booster', slug: 'immunity-booster', image: icon('immunity_bosters.webp?v=1779380728') },
];

export const SIDE_BANNERS = [
  { image: `${CDN}/file_000000003dac72079cfebe0b11c3b066.png?v=1778869603&width=800`, link: '/shop' },
  { image: `${CDN}/Untitled-1.png?v=1787768234&width=800`, link: '/category/healthy-breakfast' },
];

/** Mobile hero posters — Rosier Foods CDN, keyed by slide order */
export const HERO_MOBILE_IMAGES = {
  1: `${CDN}/mob_home_pg1.png?v=1788185955&width=800`,
  2: `${CDN}/janmashtami_banner_mobile_1.png?v=1788186016&width=800`,
};
