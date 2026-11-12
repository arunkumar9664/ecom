/** Gifting and bestseller picks from the loaded catalog. See docs/FEATURE-MAP.md. */

const GIFT_SLUGS = ['combo-packs', 'gifting'];

export function giftingSelection(products, categories) {
  const list = Array.isArray(products) ? products : [];
  const slugs = new Set((categories || []).map((category) => category?.slug).filter(Boolean));
  const slug = GIFT_SLUGS.find((candidate) => slugs.has(candidate)) || null;
  const newest = [...list].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  const picked = slug ? newest.filter((product) => product.categorySlug === slug) : [];
  const seen = new Set(picked.map((product) => product.id));
  const filled = [...picked];
  if (!slug || filled.length < 6) {
    // TODO(backend) no gifting or combo-packs category; newest products stand in
    newest.forEach((product) => {
      if (filled.length >= 6 || seen.has(product.id)) return;
      seen.add(product.id);
      filled.push(product);
    });
  }
  return {
    products: (filled.length ? filled : newest).slice(0, 12),
    href: slug ? `/category/${slug}` : '/shop',
    fallback: !slug || picked.length < 6,
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
