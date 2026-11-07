import { useState } from 'react';
import { Link } from 'react-router-dom';
import SafeImage from '../SafeImage';
import { useShop } from '../../hooks/useShop';
import { formatRupee } from '../../utils/money';
import { needsVariantPicker, variantChoices } from '../../utils/collections';
import VariantPicker from '../home/VariantPicker';

export default function ListingCard({ product }) {
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
    <article className="group flex h-full flex-col">
      <Link to={`/product/${product.id}`} className="block bg-white">
        <SafeImage src={product.image} alt={product.name} className="aspect-[16/10] w-full object-contain" />
      </Link>
      <div className="mt-3 flex items-center justify-between gap-3">
        {product.badge ? (
          <p className="font-body text-[11px] tracking-[0.14em] text-ink uppercase">{product.badge}</p>
        ) : <span />}
        {reviews > 0 && Number.isFinite(rating) ? (
          <p className="font-body text-sm text-ink">{rating.toFixed(1)} ★ ({reviews})</p>
        ) : null}
      </div>
      <Link to={`/product/${product.id}`} className="mt-2 line-clamp-2 font-heading text-xl leading-snug text-ink">
        {product.name}
      </Link>
      <p className="mt-1 line-clamp-2 font-body text-sm text-muted">{product.description}</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="font-body text-sm font-bold text-ink">
          {formatRupee(product.price)}
          {product.originalPrice && product.originalPrice > product.price ? (
            <span className="ml-2 font-normal text-muted line-through">{formatRupee(product.originalPrice)}</span>
          ) : null}
        </p>
        <button
          type="button"
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={saved}
          onClick={() => toggleWishlist(product.id)}
          className="text-ink"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M12 19s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z" />
          </svg>
        </button>
      </div>
      <button
        type="button"
        disabled={product.isSoldOut}
        onClick={() => (needsVariantPicker(product) ? setOpen(true) : addDirect())}
        className="add-on-hover mt-3 h-11 w-full border border-ink font-body text-xs tracking-[0.14em] text-ink uppercase enabled:hover:bg-ink enabled:hover:text-paper disabled:border-line disabled:text-muted"
      >
        {product.isSoldOut ? 'Sold out' : 'Add to Bag'}
      </button>
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
