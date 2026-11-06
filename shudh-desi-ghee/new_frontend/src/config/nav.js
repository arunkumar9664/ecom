/**
 * Optional nav. Leave NAV_SOURCE as 'api' until the database is reseeded
 * with these departments. The override never emits a /category/:slug link
 * unless that slug is present in the GET /categories payload.
 */
export const NAV_SOURCE = 'api';

export const NAV_OVERRIDE = [
  { label: 'Soaps', kind: 'category', slug: 'soaps' },
  { label: 'Candles', kind: 'category', slug: 'candles' },
  { label: 'Home Linen', kind: 'category', slug: 'home-linen' },
  { label: 'Bags', kind: 'category', slug: 'bags' },
  { label: 'Attars & Perfumes', kind: 'category', slug: 'attars-perfumes' },
  { label: 'Gifting', kind: 'category', slug: 'gifting', badge: 'New' },
  { label: 'Bestsellers', kind: 'path', to: '/shop?collection=bestsellers' },
  { label: 'All Products', kind: 'path', to: '/shop' },
];

export function resolveNav(categories) {
  const list = Array.isArray(categories) ? categories : [];
  const bySlug = new Map(list.filter((category) => category?.slug).map((category) => [category.slug, category]));

  if (NAV_SOURCE !== 'override') {
    return list
      .filter((category) => category?.slug)
      .map((category) => ({
        label: category.name,
        to: `/category/${category.slug}`,
        slug: category.slug,
      }));
  }

  return NAV_OVERRIDE.flatMap((item) => {
    if (item.kind === 'path') {
      return [{ label: item.label, to: item.to, badge: item.badge }];
    }
    const category = bySlug.get(item.slug);
    if (!category) return [];
    return [{
      label: item.label,
      to: `/category/${category.slug}`,
      slug: category.slug,
      badge: item.badge,
    }];
  });
}
