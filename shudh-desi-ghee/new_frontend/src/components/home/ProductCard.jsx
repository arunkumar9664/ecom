import { useState } from 'react';
import { Link } from 'react-router-dom';
import SafeImage from '../SafeImage';
import { useShop } from '../../hooks/useShop';
import { formatRupee } from '../../utils/money';
import { needsVariantPicker, variantChoices } from '../../utils/collections';
import VariantPicker from './VariantPicker';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const [open, setOpen] = useState(false);
  const saved = isInWishlist(product.id);
  const choices = variantChoices(product);
  const rating = Number(product.averageRating);
  const reviews = Number(product.reviewCount) || 0;

  const addDirect = () => {
    const color = choices.colors[0];
    const size = choices.sizes[0];
    if (!color?.name || !size) return;
    addToCart(product, { name: color.name, hex: color.hex }, size, 1);
  };

  return (
    <article className="group flex h-full w-full flex-col bg-paper">
      <Link to={`/product/${product.id}`} className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-white">
        <SafeImage src={product.image} alt={product.name} className="h-full w-full object-contain" />
      </Link>
      <div className="mt-2.5 flex min-h-[20px] items-center justify-between gap-1">
        {product.badge ? (
          <p className="min-w-0 truncate font-body text-[11px] font-medium tracking-[0.12em] text-ink uppercase">
            {product.badge}
          </p>
        ) : (
          <span />
        )}
        {reviews > 0 && Number.isFinite(rating) ? (
          <p className="shrink-0 font-body text-[12px] text-ink md:text-sm">
            {rating.toFixed(1)} ★ ({reviews})
          </p>
        ) : null}
      </div>
      <Link
        to={`/product/${product.id}`}
        className="mt-1.5 line-clamp-2 min-h-[44px] font-heading text-[17px] leading-[1.3] break-words text-ink md:mt-2 md:min-h-[52px] md:text-xl md:leading-snug"
      >
        {product.name}
      </Link>
      <p className="mt-1 line-clamp-2 min-h-[36px] font-body text-[13px] leading-[1.4] break-words text-muted md:min-h-[40px] md:text-sm md:leading-normal">
        {product.description}
      </p>
      <div className="mt-auto pt-3">
        <div className="flex items-center justify-between gap-2">
          <p className="font-body text-[16px] font-bold text-ink md:text-lg">
            {formatRupee(product.price)}
            {product.originalPrice && product.originalPrice > product.price ? (
              <span className="ml-1.5 font-normal text-[13px] text-muted line-through md:text-sm">
                {formatRupee(product.originalPrice)}
              </span>
            ) : null}
          </p>
          <button
            type="button"
            aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            aria-pressed={saved}
            onClick={() => toggleWishlist(product.id)}
            className="flex h-[22px] w-[22px] shrink-0 items-center justify-center text-ink"
          >
            <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M12 19s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z" />
            </svg>
          </button>
        </div>
        <button
          type="button"
          disabled={product.isSoldOut}
          onClick={() => (needsVariantPicker(product) ? setOpen(true) : addDirect())}
          className="mt-3 flex h-10 w-full items-center justify-center border border-ink font-body text-[12px] tracking-[0.12em] text-ink uppercase transition-colors hover:bg-ink hover:text-paper disabled:border-line disabled:text-muted md:h-11 md:text-xs md:tracking-[0.14em]"
        >
          {product.isSoldOut ? 'Sold out' : 'Add to Bag'}
        </button>
      </div>
      {open ? (
        <VariantPicker
          product={product}
          onClose={() => setOpen(false)}
          onConfirm={(color, size) => {
            setOpen(false);
            addToCart(product, color, size, 1);
          }}
        />
      ) : null}
    </article>
  );
}
