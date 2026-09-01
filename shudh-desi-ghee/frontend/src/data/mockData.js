// Mock Data for Suranghi Naar E-Commerce Store with Real Catalog Images

export const BRAND_CONTACT = {
  phone: "+91 9116655814",
  displayPhone: "+91 91166 55814",
  email: "surangi.naar@gmail.com",
  instagram: "https://www.instagram.com/surangi.naar",
  instagramHandle: "@surangi.naar",
  facebook: "https://www.facebook.com/profile.php?id=1274421192401737&hr=1&wtsid=rdr_0GcwbFGifB7kgtTxr",
  whatsapp: "https://wa.me/919116655814",
  address: "Tiranga Marg, Manyawas, Jaipur, Rajasthan 302020, India",
  googleMaps: "https://maps.app.goo.gl/9kU8jVfN7ZBhj5fG9",
  hours: "Mon - Sat: 10:30 AM - 7:30 PM IST"
};

export const PROMO_MESSAGES = [
  "5% OFF first order — use code HAPPY5 at checkout",
  "10% OFF prepaid orders — use code LAH10",
  "Complimentary Express Shipping across India on orders over ₹5,000"
];

// Core 3 Categories
export const CATEGORIES_LIST = [
  { name: "Kurtis", slug: "kurtis", tag: "New Drop", description: "Everyday & Designer Handprinted Kurtis" },
  { name: "Short Kurtis", slug: "short-kurtis", tag: "Trending", description: "Modern Silk & Linen Short Kurtis" },
  { name: "Festive Wear", slug: "festive-wear", tag: "Exclusive", description: "Royal Zardosi & Gota Patti Festive Wear" }
];

export const CATEGORIES_GRID = [
  {
    id: "kurtis",
    slug: "kurtis",
    name: "Kurtis",
    count: "28 Styles",
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236587/surangi-naar/products/real_product_3.jpg",
    tagline: "Handprinted Malmal & Chanderi Tunics"
  },
  {
    id: "short-kurtis",
    slug: "short-kurtis",
    name: "Short Kurtis",
    count: "24 Styles",
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236591/surangi-naar/products/real_product_6.jpg",
    tagline: "Resort Luxe & Linen Sets"
  },
  {
    id: "festive-wear",
    slug: "festive-wear",
    name: "Festive Wear",
    count: "32 Styles",
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236590/surangi-naar/products/real_product_5.jpg",
    tagline: "Heavy Embroidered Anarkalis & Festive Sets"
  }
];

export const HERO_SLIDES = [
  {
    id: 1,
    subtitle: "Royal Festive Collection 2026",
    title: "Festive Grandeur",
    description: "Intricate hand-highlighted Zardosi & Gota Patti festive ensembles for grand celebrations.",
    cta: "Explore Festive Wear",
    categorySlug: "festive-wear",
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236592/surangi-naar/products/real_product_7.jpg"
  },
  {
    id: 2,
    subtitle: "Contemporary Silk Staples",
    title: "Luxe Short Kurtis",
    description: "Flowing breathable fabrics designed for sunshine, warm breezes, and effortless elegance.",
    cta: "Shop Short Kurtis",
    categorySlug: "short-kurtis",
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236588/surangi-naar/products/real_product_4.jpg"
  },
  {
    id: 3,
    subtitle: "Hand-Block Artisanal Prints",
    title: "Handcrafted Kurtis",
    description: "Versatile Mul Chanderi & Soft Cotton Kurtis featuring authentic Jaipur embroidery and prints.",
    cta: "Discover Kurtis",
    categorySlug: "kurtis",
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236586/surangi-naar/products/real_product_2.jpg"
  }
];

const RAW_PRODUCTS_CURATED = [
  {
    id: "p1",
    name: "Pink Lehariya Silk Kurta Set",
    category: "Kurtis",
    categorySlug: "kurtis",
    price: 899,
    originalPrice: 1999,
    colorVariants: [
      { name: "Lavender Lilac", hex: "#b497d6", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236556/surangi-naar/products/real_product_1.jpg", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236586/surangi-naar/products/real_product_2.jpg" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236556/surangi-naar/products/real_product_1.jpg",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236586/surangi-naar/products/real_product_2.jpg",
    badge: "Bestseller",
    rating: 4.9,
    isSoldOut: false,
    description: " Add a festive touch to your wardrobe with this elegant Pink Lehariya Silk Kurta Set. Featuring a beautiful traditional lehariya pattern and rich pink tones, this outfit is perfect for festive celebrations, family gatherings, and special occasions.",
    fabric: "Silk",
    care: "Machine Wash",
    shipping: "Dispatched within 5-7 business days. Free shipping across India over ₹5,000."
  },
  {
    id: "p2",
    name: "Mustard Yellow Cotton Mirror Embroidered Kurta Set",
    category: "Kurtis",
    categorySlug: "kurtis",
    price: 1199,
    originalPrice: 1499,
    colorVariants: [
      { name: "Sage Green", hex: "#95a383", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236586/surangi-naar/products/real_product_2.jpg", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236556/surangi-naar/products/real_product_1.jpg" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236586/surangi-naar/products/real_product_2.jpg",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236556/surangi-naar/products/real_product_1.jpg",
    badge: "New Arrival",
    rating: 4.92,
    isSoldOut: false,
    description: "Brighten your ethnic wardrobe with this elegant Mustard Yellow Cotton Kurta Set, featuring beautiful embroidery and delicate mirror-style detailing around the neckline. The vibrant mustard shade adds a festive touch, while the soft cotton fabric keeps the outfit comfortable and breathable.",
    fabric: "Cotton",
    care: "Machine Wash.",
    shipping: "Dispatched within 4-7 business days."
  },
  {
    id: "p3",
    name: "Chocolate Brown Rose Printed Cotton Daily Wear Kurta Set",
    category: "Kurtis",
    categorySlug: "kurtis",
    price: 999,
    originalPrice: 1299,
    colorVariants: [
      { name: "Slate Grey", hex: "#87888a", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236587/surangi-naar/products/real_product_3.jpg", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236588/surangi-naar/products/real_product_4.jpg" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236587/surangi-naar/products/real_product_3.jpg",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236588/surangi-naar/products/real_product_4.jpg",
    badge: "Trending",
    rating: 4.88,
    isSoldOut: false,
    description: " Comfortable and stylish Rose Printed Cotton Kurta Set, designed for effortless everyday wear. The set features a beautiful rose print with matching pants and dupatta, making it perfect for work, casual outings, and daily ethnic styling.",
    fabric: "Pure Cotton ",
    care: "Machine Wash",
    shipping: "Dispatched within 4-7 business days."
  },
  {
    id: "p4",
    name: "Orange Rose Printed Cotton Daily Wear Kurta Set",
    category: "Kurtis",
    categorySlug: "kurtis",
    price: 999,
    originalPrice: 1299,
    colorVariants: [
      { name: "Mustard Gold", hex: "#d4a017", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236588/surangi-naar/products/real_product_4.jpg", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236590/surangi-naar/products/real_product_5.jpg" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236588/surangi-naar/products/real_product_4.jpg",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236590/surangi-naar/products/real_product_5.jpg",
    badge: "Featured",
    rating: 4.85,
    isSoldOut: false,
    description: " Comfortable and stylish Rose Printed Cotton Kurta Set, designed for effortless everyday wear. The set features a beautiful rose print with matching pants and dupatta, making it perfect for work, casual outings, and daily ethnic styling.",
    fabric: "Cotton",
    care: "Machine Wash",
    shipping: "Dispatched within 5-7 business days."
  },
  {
    id: "p5",
    name: "Wine Rose Printed Cotton Daily Wear Kurta Set",
    category: "Kurtis",
    categorySlug: "kurtis",
    price: 999,
    originalPrice: 1299,
    colorVariants: [
      { name: "Royal Purple", hex: "#5a2d82", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236590/surangi-naar/products/real_product_5.jpg", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236591/surangi-naar/products/real_product_6.jpg" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236590/surangi-naar/products/real_product_5.jpg",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236591/surangi-naar/products/real_product_6.jpg",
    badge: "Glamour Edit",
    rating: 4.95,
    isSoldOut: false,
    description: "Comfortable and stylish Rose Printed Cotton Kurta Set, designed for effortless everyday wear. The set features a beautiful rose print with matching pants and dupatta, making it perfect for work, casual outings, and daily ethnic styling.",
    fabric: "Cotton",
    care: "Machine Wash.",
    shipping: "Dispatched within 4-7 business days."
  },
  {
    id: "p6",
    name: "Embroidered Kurta Set",
    category: "Kurtis",
    categorySlug: "kurtis",
    price: 1199,
    originalPrice: 1499,
    colorVariants: [
      { name: "Royal Red", hex: "#c83228", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236591/surangi-naar/products/real_product_6.jpg", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236592/surangi-naar/products/real_product_7.jpg" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236591/surangi-naar/products/real_product_6.jpg",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236592/surangi-naar/products/real_product_7.jpg",
    badge: "Popular",
    rating: 4.8,
    isSoldOut: false,
    description: "Elegant 100% Pure Cotton Kurta Set featuring beautiful ethnic embroidery on the neckline, paired with matching pants and a dupatta. Available in Orange & Pink, perfect for comfortable daily wear and festive occasions.",
    fabric: "Cotton",
    care: "Machine Wash",
    shipping: "Dispatched within 4-7 days."
  },

  // Short Kurtis
  {
    id: "p7",
    name: "Floral Embroidered Mul Chanderi Kurta Set",
    category: "Short Kurtis",
    categorySlug: "short-kurtis",
    price: 1349,
    originalPrice: 1799,
    colorVariants: [
      { name: "Champagne Gold", hex: "#e0c9a6", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236595/surangi-naar/products/real_product_9.jpg", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236557/surangi-naar/products/real_product_10.jpg" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236595/surangi-naar/products/real_product_9.jpg",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236557/surangi-naar/products/real_product_10.jpg",
    badge: "Trending",
    rating: 4.89,
    isSoldOut: false,
    description: "Elegant Mul Chanderi Kurta Set featuring delicate floral embroidery, paired with Roman pants and a graceful dupatta. Available in Green & Lavender, perfect for festive occasions and special gatherings.",
    fabric: "Mul Chanderi",
    care: "Dry Clean Only",
    shipping: "Dispatched within 4-7 business days."
  },
  {
    id: "p8",
    name: "Floral Embroidered Mul Chanderi Kurta Set",
    category: "Short Kurtis",
    categorySlug: "short-kurtis",
    price: 1349,
    originalPrice: 1799,
    colorVariants: [
      { name: "Terracotta Earth", hex: "#c86d51", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236557/surangi-naar/products/real_product_10.jpg", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236561/surangi-naar/products/real_product_11.png" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236557/surangi-naar/products/real_product_10.jpg",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236561/surangi-naar/products/real_product_11.png",
    badge: "Resort Luxe",
    rating: 4.91,
    isSoldOut: false,
    description: "Elegant Mul Chanderi Kurta Set featuring delicate floral embroidery, paired with Roman pants and a graceful dupatta. Available in Green & Lavender, perfect for festive occasions and special gatherings.",
    fabric: "Mul Chanderi",
    care: "Dry Clean Only",
    shipping: "Dispatched within 5-7 business days."
  },
  {
    id: "p9",
    name: "Mustard Yellow Cotton Embroidered Kurti Set",
    category: "Short Kurtis",
    categorySlug: "short-kurtis",
    price: 1299,
    originalPrice: 1699,
    colorVariants: [
      { name: "Olive Palm", hex: "#4b5320", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236561/surangi-naar/products/real_product_11.png", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236562/surangi-naar/products/real_product_12.jpg" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236561/surangi-naar/products/real_product_11.png",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236562/surangi-naar/products/real_product_12.jpg",
    badge: "Must Have",
    rating: 4.86,
    isSoldOut: false,
    description: "Elegant Mustard Yellow Cotton Kurti Set featuring beautiful multi-colour floral embroidery on the neckline and hem. Paired with matching pants and a lightweight Malmal dupatta, perfect for a graceful festive look.",
    fabric: "Cotton 60-60",
    care: "Dry Clean Only",
    shipping: "Dispatched within 2-3 days."
  },

  // Festive Wear
  {
    id: "p10",
    name: "Teal Blue Floral Printed Kurta Set",
    category: "Festive Wear",
    categorySlug: "festive-wear",
    price: 1299,
    originalPrice: 1699,
    colorVariants: [
      { name: "Royal Emerald", hex: "#1b4332", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236569/surangi-naar/products/real_product_14.png", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236573/surangi-naar/products/real_product_15.png" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236569/surangi-naar/products/real_product_14.png",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236573/surangi-naar/products/real_product_15.png",
    badge: "Exclusive",
    rating: 5.0,
    isSoldOut: false,
    description: " Elegant Teal Blue Kurta Set featuring beautiful floral print detailing on the neckline, sleeves, and hem. Paired with matching pants and dupatta, it is perfect for comfortable daily wear and festive ethnic styling.",
    fabric: "Cotton 60-60",
    care: "Machine Wash",
    shipping: "Dispatched within 4-7 business days."
  },
  {
    id: "p11",
    name: "Mustard Floral Printed Cotton Kurta Set",
    category: "Festive Wear",
    categorySlug: "festive-wear",
    price: 999,
    originalPrice: 1299,
    colorVariants: [
      { name: "Crimson Red", hex: "#8b0000", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236573/surangi-naar/products/real_product_15.png", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236578/surangi-naar/products/real_product_16.png" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236573/surangi-naar/products/real_product_15.png",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236578/surangi-naar/products/real_product_16.png",
    badge: "Royal Edit",
    rating: 4.96,
    isSoldOut: false,
    description: " Comfortable Mustard Cotton Kurta Set featuring bold cream floral prints with elegant border detailing. Paired with matching pants and dupatta, making it perfect for daily wear and casual outings.",
    fabric: "Cotton",
    care: "Machine Wash",
    shipping: "Dispatched within 5-7 business days."
  },
  {
    id: "p12",
    name: "Green Floral Printed Cotton Kurta Set",
    category: "Festive Wear",
    categorySlug: "festive-wear",
    price: 999,
    originalPrice: 1299,
    colorVariants: [
      { name: "Deep Ruby", hex: "#5c1325", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236578/surangi-naar/products/real_product_16.png", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236582/surangi-naar/products/real_product_17.png" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236578/surangi-naar/products/real_product_16.png",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236582/surangi-naar/products/real_product_17.png",
    badge: "Bridal Couture",
    rating: 4.98,
    isSoldOut: false,
    description: "Comfortable Green Cotton Kurta Set featuring a beautiful floral print with contrasting cream motifs and elegant border detailing. Paired with matching pants and dupatta, making it perfect for daily wear and casual outings.",
    fabric: "Cotton",
    care: "Machine Wash",
    shipping: "Dispatched within 4-7 business days."
  }
];

export const NEW_ARRIVALS = [
  {
    id: "na1",
    name: "Orange Cotton Embroidered Kurta Set",
    category: "Kurtis",
    categorySlug: "kurtis",
    price: 1199,
    originalPrice: 1499,
    colorVariants: [
      { name: "Rust Orange", hex: "#d9531e", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236592/surangi-naar/products/real_product_7.jpg", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236593/surangi-naar/products/real_product_8.jpg" }
    ],
    sizes:["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236592/surangi-naar/products/real_product_7.jpg",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236593/surangi-naar/products/real_product_8.jpg",
    isSoldOut: false,
    rating: 4.9,
    description: "Elegant Orange Cotton Kurta Set featuring delicate floral embroidery on the front, paired with matching pants and a graceful dupatta. A comfortable and stylish choice for daily wear and festive occasions.",
    fabric: "Chanderi Silk with Fine Zari Work",
    care: "Machine Wash",
    shipping: "Dispatched within 5-7 business days."
  },
  {
    id: "na2",
    name: "Grey Floral Embroidered Cotton Kurta Set",
    category: "Short Kurtis",
    categorySlug: "short-kurtis",
    price: 1499,
    originalPrice: 1799,
    colorVariants: [
      { name: "Olive Green", hex: "#556b2f", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236562/surangi-naar/products/real_product_12.jpg", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236564/surangi-naar/products/real_product_13.jpg" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236562/surangi-naar/products/real_product_12.jpg",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236564/surangi-naar/products/real_product_13.jpg",
    isSoldOut: false,
    rating: 4.88,
    description: " Elegant Grey Cotton Kurta Set featuring delicate multi-colour floral embroidery on the neckline, kurta and dupatta. Paired with matching pants, this set is perfect for festive occasions and graceful everyday ethnic wear.",
    fabric: "Cotton",
    care: "Machine Wash",
    shipping: "Dispatched within 5-7 business days."
  },
  {
    id: "na3",
    name: "Purple Floral Embroidered Cotton Kurta Set",
    category: "Festive Wear",
    categorySlug: "festive-wear",
    price: 1199,
    originalPrice: 1499,
    colorVariants: [
      { name: "Royal Purple", hex: "#5a2d82", image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236582/surangi-naar/products/real_product_17.png", secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236584/surangi-naar/products/real_product_18.png" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236582/surangi-naar/products/real_product_17.png",
    secondaryImage: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236584/surangi-naar/products/real_product_18.png",
    isSoldOut: false,
    rating: 4.95,
    description: "Elegant Purple Cotton Kurta Set featuring beautiful floral embroidery with delicate detailing on the neckline and sleeves. Paired with matching pants and a lightweight dupatta, perfect for daily wear and festive occasions.",
    fabric: "Cotton",
    care: "Machine Wash",
    shipping: "Dispatched within 4-7 business days."
  }
];

export const PRODUCTS_CURATED = RAW_PRODUCTS_CURATED.map(prod => ({
  ...prod,
  colorVariants: (prod.colorVariants || []).map(v => {
    if (v.images && Array.isArray(v.images)) return v;
    const imgs = [];
    if (v.image) imgs.push(v.image);
    if (v.secondaryImage && v.secondaryImage !== v.image) imgs.push(v.secondaryImage);
    if (imgs.length === 0 && prod.image) imgs.push(prod.image);
    const { image, secondaryImage, ...rest } = v;
    return { ...rest, images: imgs };
  }),
}));

export const PRODUCTS = PRODUCTS_CURATED;

export const EXCLUSIVE_COLLECTION = [
  {
    id: "ex1",
    title: "Handcrafted Kurtis Collection",
    tagline: "Timeless motifs block-printed and embroidered by master craftsmen of Jaipur.",
    categorySlug: "kurtis",
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236556/surangi-naar/products/real_product_1.jpg"
  },
  {
    id: "ex2",
    title: "Short Kurtis",
    tagline: "Fluid resort silhouettes woven with pure Mulberry silk and organic linen.",
    categorySlug: "short-kurtis",
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236595/surangi-naar/products/real_product_9.jpg"
  },
  {
    id: "ex3",
    title: "Royal Festive Wear Edit",
    tagline: "Intricate Zardosi & Gota Patti handcrafted for grand celebrations.",
    categorySlug: "festive-wear",
    image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236569/surangi-naar/products/real_product_14.png"
  }
];

export const FOUNDER_INFO = {
  name: "Suranghi Naar",
  role: "Creative Director & Founder",
  quote: "“Fashion at Suranghi Naar is not merely attire — it is an emotional ode to traditional Indian craftsmanship re-imagined for the global woman.”",
  storyParagraph1: "Suranghi Naar emerged from a passion for preserving India’s rich textile heritage while catering to modern aesthetic sensibilities. Each garment tells a story of dedicated master artisans, hand-selected pure fabrics, and meticulous embroidery.",
  storyParagraph2: "From royal Chanderi weaves to contemporary fluid short kurtis, the label blends understated luxury with expressive, feminine grace — creating timeless pieces crafted to be cherished across generations.",
  image: "https://res.cloudinary.com/ztgqdi6r/image/upload/v1787236584/surangi-naar/products/real_product_18.png",
  badges: [
    { label: "Handcrafted in India", icon: "Sparkles" },
    { label: "Sustainable Fabrics", icon: "Leaf" },
    { label: "Artisanal Embroidery", icon: "Crown" },
    { label: "Worldwide Express Delivery", icon: "Globe" },
    { label: "Bespoke Custom Fitting", icon: "Scissors" },
    { label: "Ethical & Fair Trade", icon: "ShieldCheck" }
  ]
};
