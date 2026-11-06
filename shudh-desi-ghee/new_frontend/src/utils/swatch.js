const FALLBACK_HEX = '#D9CDB8';

export function swatchFor(product, colorName) {
  const name = colorName || 'Standard';
  const variants = Array.isArray(product?.colorVariants) ? product.colorVariants : [];
  const match = variants.find(
    (variant) => variant?.name && String(variant.name).toLowerCase() === String(name).toLowerCase()
  );
  if (match?.hex) return { name: match.name, hex: match.hex };
  if (match) return { name: match.name, hex: FALLBACK_HEX };
  return { name, hex: variants[0]?.hex || FALLBACK_HEX };
}

export function defaultSwatch(product) {
  const first = product?.colorVariants?.[0];
  if (first?.name) return swatchFor(product, first.name);
  return { name: 'Standard', hex: FALLBACK_HEX };
}
