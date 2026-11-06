// TODO before launch: these images are from the old ghee site / third-party hosts; replace with the client's own photos.

const ROSIER = 'https://www.rosierfoods.com/cdn/shop/files';
const rosier = (file, width = 800) => `${ROSIER}/${file}&width=${width}`;

/** Copied from frontend/public. Not product photography. */
export const localImages = {
  logo: '/images/logo.svg',
  icons: '/images/icons.svg',
};

/** Same files the seed and the old static catalog point at. */
export const catalogImages = {
  hero1: rosier('web_home_pg1.png?v=1788185972', 1600),
  hero2: rosier('janmashtami_banner_web_1.png?v=1788186000', 1600),
  heroSide1: rosier('file_000000003dac72079cfebe0b11c3b066.png?v=1778869603'),
  heroSide2: rosier('Untitled-1.png?v=1787768234'),
  heroMobile1: rosier('mob_home_pg1.png?v=1788185955'),
  heroMobile2: rosier('janmashtami_banner_mobile_1.png?v=1788186016'),
  catGhee: rosier('ghee_09a692b1-5b73-4156-a411-b30777b76af0.webp?v=1779380654'),
  catAtta: rosier('atta.webp?v=1779380667'),
  catBreakfast: rosier('healthy_breakfast.webp?v=1779380683'),
  catPickles: rosier('pickles.webp?v=1779380696'),
  catOils: rosier('oils.webp?v=1779380714'),
  catImmunity: rosier('immunity_bosters.webp?v=1779380728'),
  iconGhee: rosier('Ghee_Icons.png?v=1781252536', 120),
  ghee1: rosier('rosier-foods-ghee-500-ml-gir-cow-a2-ghee-made-from-curd-1239446978.jpg?v=1779283720'),
  ghee2: rosier('rosier-foods-ghee-gir-cow-a2-ghee-made-from-curd-1210408687.jpg?v=1769604150'),
  ghee3: rosier('rosier-foods-ghee-250-ml-gir-cow-a2-ghee-made-from-curd-250-ml-1240619455.jpg?v=1779888192'),
  honey: rosier('rosier-foods-honey-500g-wild-forest-honey-1238550349.jpg?v=1778873413'),
  honey2: rosier('rosier-foods-honey-500g-wild-forest-honey-1248149128.webp?v=1783502591'),
  atta: rosier('rosier-foods-flour-2-kg-khapli-emmer-wheat-atta-1239446981.jpg?v=1779283597'),
  atta2: rosier('rosier-foods-flour-khapli-emmer-wheat-atta-1218401189.jpg?v=1772123192'),
  oil: rosier('rosier-foods-oil-1000-ml-pet-bottle-stone-pressed-black-mustard-oil-1238506731.jpg?v=1778844370'),
  oil2: rosier('rosier-foods-oil-stone-pressed-black-mustard-oil-1217524985.jpg?v=1768916437'),
  oilGroundnut: rosier('rosier-foods-oil-1000-ml-pet-bottle-stone-pressed-groundnut-oil-1238550351.jpg?v=1778873379'),
  oilCoconut: rosier('rosier-foods-oil-1000-ml-pet-bottle-stone-pressed-coconut-oil-1238550353.jpg?v=1778873320'),
  oilYellow: rosier('rosier-foods-oil-stone-pressed-yellow-mustard-oil-1253320259.webp?v=1786037109'),
  pickle: rosier('rosier-foods-pickle-300-gms-mango-pickle-natural-sun-dried-1239710636.jpg?v=1779377171'),
  pickle2: rosier('rosier-foods-pickle-300-gms-mango-pickle-natural-sun-dried-1233338543.png?v=1776765159'),
  comboMother: rosier('rosier-foods-combo-a2-ghee-1-ltr-wild-forest-honey-500g-mother-s-pure-delight-1256539139.png?v=1788196631'),
  comboTrio: rosier('rosier-foods-1-ltr-yellow-mustard-1-ltr-groundnut-1-ltr-black-mustard-oil-cold-pressed-trio-1256539133.png?v=1788196841'),
  comboGrain: rosier('rosier-foods-combo-jowar-flour-1kg-sattu-flour-1kg-ragi-flour-1kg-grain-trial-trio-1256539142.png?v=1788196753'),
  comboGrandma: rosier('rosier-foods-combo-black-mustard-oil-5-ltr-a2-ghee-500-ml-grandma-s-kitchen-essentials-1256539137.png?v=1788196723'),
  comboCooking: rosier('rosier-foods-combo-khapli-flour-2kg-gir-cow-a2-ghee-1-ltr-cooking-pack-1256539134.png?v=1788196813'),
  comboMom: rosier('rosier-foods-combo-a2-ghee-500-ml-groundnut-oil-1-ltr-wild-forest-honey-300g-mom-s-wholesome-trio-1256539140.png?v=1788196658'),
  comboEssential: rosier('rosier-foods-combo-a2-ghee-500ml-black-mustard-oil-1-ltr-wild-forest-honey-300g-mango-pickle-essential-kitchen-pack-1256539135.png?v=1788196782'),
  comboImmunity: rosier('rosier-foods-combo-a2-ghee-250-ml-wild-forest-honey-300g-immunity-pack-1256539138.png?v=1788196696'),
};

/**
 * Clothing photos from frontend/src/data/mockData.js. The live seed does not use them.
 * Listed so they are not forgotten when photos are replaced.
 */
export const legacyCloudinaryImages = [
  'v1787236556/surangi-naar/products/real_product_1.jpg',
  'v1787236586/surangi-naar/products/real_product_2.jpg',
  'v1787236587/surangi-naar/products/real_product_3.jpg',
  'v1787236588/surangi-naar/products/real_product_4.jpg',
  'v1787236590/surangi-naar/products/real_product_5.jpg',
  'v1787236591/surangi-naar/products/real_product_6.jpg',
  'v1787236592/surangi-naar/products/real_product_7.jpg',
  'v1787236593/surangi-naar/products/real_product_8.jpg',
  'v1787236595/surangi-naar/products/real_product_9.jpg',
  'v1787236557/surangi-naar/products/real_product_10.jpg',
  'v1787236561/surangi-naar/products/real_product_11.png',
  'v1787236562/surangi-naar/products/real_product_12.jpg',
  'v1787236564/surangi-naar/products/real_product_13.jpg',
  'v1787236569/surangi-naar/products/real_product_14.png',
  'v1787236573/surangi-naar/products/real_product_15.png',
  'v1787236578/surangi-naar/products/real_product_16.png',
  'v1787236582/surangi-naar/products/real_product_17.png',
  'v1787236584/surangi-naar/products/real_product_18.png',
].map((path) => `https://res.cloudinary.com/ztgqdi6r/image/upload/${path}`);
