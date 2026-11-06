/** Gifting and bestseller picks from the loaded catalog. See docs/FEATURE-MAP.md. */

const GIFT_SLUGS = ['combo-packs', 'gifting'];

export function giftingSelection(products, categories) {
  const list = Array.isArray(products) ? products : [];
  const slugs = new Set((categories || []).map((category) => category?.slug).filter(Boolean));
  const slug = GIFT_SLUGS.find((candidate) => slugs.has(candidate)) || null;
  if (!slug) {
    // TODO(backend) no gifting or combo-packs category; newest products stand in
    return { products: list.slice(0, 12), href: '/shop', fallback: true };
  }
  return {
    products: list.filter((product) => product.categorySlug === slug).slice(0, 12),
    href: `/category/${slug}`,
    fallback: false,
  };
}

export function bestsellerSelection(products) {
  const list = Array.isArray(products) ? products : [];
  const best = list.filter((product) => /best/i.test(product.badge || ''));
  if (!best.length) {
    // TODO(backend) badge is a free string, not a featured flag
    return { products: list.slice(0, 12), href: '/shop?collection=bestsellers', fallback: true };
  }
  return { products: best.slice(0, 12), href: '/shop?collection=bestsellers', fallback: false };
}

export function variantChoices(product) {
  const colors = (Array.isArray(product?.colorVariants) ? product.colorVariants : [])
    .filter((variant) => variant?.name && String(variant.name).trim());
  const sizes = (Array.isArray(product?.sizes) ? product.sizes : [])
    .map((size) => String(size).trim())
    .filter(Boolean);
  return {
    colors: colors.length ? colors : [{ name: 'Standard', hex: '#D9CDB8', images: [] }],
    sizes: sizes.length ? sizes : ['Standard'],
  };
}

export function needsVariantPicker(product) {
  const { colors, sizes } = variantChoices(product);
  return colors.length > 1 || sizes.length > 1;
}
