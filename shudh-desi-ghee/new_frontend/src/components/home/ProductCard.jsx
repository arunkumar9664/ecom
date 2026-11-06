import { useState } from 'react';
import { Link } from 'react-router-dom';
import SafeImage from '../SafeImage';
import { useShop } from '../../context/ShopContext';
import { formatRupee } from '../shell/icons';
import { needsVariantPicker, variantChoices } from '../../utils/collections';
import VariantPicker from './VariantPicker';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const [open, setOpen] = useState(false);
  const saved = isInWishlist(product.id);
  const choices = variantChoices(product);

  const addDirect = () => {
    const color = choices.colors[0];
    const size = choices.sizes[0];
    if (!color?.name || !size) return;
    addToCart(product, { name: color.name, hex: color.hex }, size, 1);
  };

  return (
    <article className="group flex h-full flex-col bg-paper">
      <div className="relative bg-white">
        <Link to={`/product/${product.id}`} className="block">
          <SafeImage src={product.image} alt={product.name} className="aspect-[3/4] w-full object-contain" />
        </Link>
        {product.badge ? (
          <span className="absolute top-3 left-3 bg-terracotta px-2 py-1 font-body text-[10px] font-semibold tracking-[0.12em] text-paper uppercase">
            {product.badge}
          </span>
        ) : null}
        <button
          type="button"
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={saved}
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M12 19s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z" />
          </svg>
        </button>
      </div>
      <div className="flex flex-1 flex-col px-1 pt-4">
        <Link to={`/product/${product.id}`} className="font-heading text-xl leading-snug text-ink">
          {product.name}
        </Link>
        <p className="mt-1 truncate font-body text-sm text-muted">{product.description}</p>
        <p className="mt-2 font-body text-sm font-bold text-ink">
          {formatRupee(product.price)}
          {product.originalPrice && product.originalPrice > product.price ? (
            <span className="ml-2 font-normal text-muted line-through">{formatRupee(product.originalPrice)}</span>
          ) : null}
        </p>
        <button
          type="button"
          disabled={product.isSoldOut}
          onClick={() => (needsVariantPicker(product) ? setOpen(true) : addDirect())}
          className="add-on-hover mt-3 h-11 w-full border border-ink font-body text-xs tracking-[0.14em] text-ink uppercase enabled:hover:bg-ink enabled:hover:text-paper disabled:border-line disabled:text-muted"
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
