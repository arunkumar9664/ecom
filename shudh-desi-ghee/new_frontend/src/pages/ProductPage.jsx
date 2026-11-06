import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { labels } from '../config/labels';
import { brand } from '../config/brand';
import { useShop } from '../context/ShopContext';
import { variantChoices } from '../utils/collections';
import { formatRupee } from '../components/shell/icons';
import ProductGallery from '../components/product/ProductGallery';
import ReviewSection from '../components/product/ReviewSection';
import ProductCarousel from '../components/home/ProductCarousel';

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function galleryImages(product, colorName) {
  const variants = Array.isArray(product?.colorVariants) ? product.colorVariants : [];
  const chosen = variants.find((variant) => variant?.name === colorName);
  const variantImages = (chosen?.images || []).filter(Boolean);
  const shared = [product?.image, product?.secondaryImage].filter(Boolean);
  if (colorName && variantImages.length) return unique([...variantImages, ...shared]);
  const everyVariant = variants.flatMap((variant) => variant?.images || []);
  return unique([...shared, ...everyVariant]);
}

function Stars({ value }) {
  const score = Math.round(Number(value) || 0);
  return (
    <span className="text-gold" aria-hidden="true">
      {'★★★★★'.slice(0, score)}
      <span className="text-line">{'★★★★★'.slice(score)}</span>
    </span>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchProduct, addToCart, toggleWishlist, isInWishlist, queryProducts, products, sections, storeSettings, cartCount } = useShop();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [missing, setMissing] = useState(false);
  const [colorName, setColorName] = useState('');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [choiceError, setChoiceError] = useState('');
  const [related, setRelated] = useState([]);
  const [showBar, setShowBar] = useState(false);
  const [openPanels, setOpenPanels] = useState({ description: true });
  const [descOpen, setDescOpen] = useState(false);
  const addRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setProduct(null);
    setMissing(false);
    fetchProduct(id).then((result) => {
      if (cancelled) return;
      if (result.error) {
        setError(result.error);
        setStatus('error');
        return;
      }
      if (result.missing || !result.product) {
        setMissing(true);
        setStatus('ready');
        return;
      }
      const choices = variantChoices(result.product);
      setProduct(result.product);
      setColorName(choices.colors.length === 1 ? choices.colors[0].name : '');
      setSize(choices.sizes.length === 1 ? choices.sizes[0] : '');
      setQuantity(1);
      setChoiceError('');
      setStatus('ready');
    });
    return () => {
      cancelled = true;
    };
  }, [id, fetchProduct]);

  useEffect(() => {
    if (!product) return undefined;
    const previous = document.title;
    document.title = `${product.name} · ${brand.name}`;
    return () => {
      document.title = previous;
    };
  }, [product]);

  useEffect(() => {
    if (!product) return undefined;
    let cancelled = false;
    const apply = (list) => {
      if (cancelled) return;
      setRelated(list.filter((item) => item.id !== product.id).slice(0, 12));
    };
    if (product.categorySlug) {
      queryProducts({ categorySlug: product.categorySlug }).then((result) => {
        const list = result.products || [];
        if (list.filter((item) => item.id !== product.id).length) apply(list);
        else apply(products || []);
      });
    } else {
      apply(products || []);
    }
    return () => {
      cancelled = true;
    };
  }, [product, queryProducts, products]);

  useEffect(() => {
    const node = addRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      setShowBar(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [product?.id, status]);

  const choices = product ? variantChoices(product) : { colors: [], sizes: [] };
  const images = useMemo(() => (product ? galleryImages(product, colorName) : []), [product, colorName]);
  const saved = product ? isInWishlist(product.id) : false;

  const shippingLine = sections.settings.status === 'ready' && storeSettings
    ? `Dispatch is ₹${Number(storeSettings.shippingFee || 0).toLocaleString('en-IN')} and free once the order reaches ₹${Number(storeSettings.freeShippingThreshold || 0).toLocaleString('en-IN')}.`
    : 'Shipping calculated at checkout';

  const commit = async (buyNow) => {
    if (!product || product.isSoldOut) return;
    if (!String(colorName).trim() || !String(size).trim()) {
      setChoiceError(`Choose a ${labels.variant.toLowerCase()} and a ${labels.size.toLowerCase()}.`);
      return;
    }
    const color = choices.colors.find((entry) => entry.name === colorName) || { name: colorName };
    try {
      const added = await addToCart(product, { name: color.name, hex: color.hex }, size, quantity);
      if (added && buyNow) navigate('/checkout');
    } catch {
      /* addToCart already reports the failure */
    }
  };

  const panels = product ? [
    { id: 'description', title: labels.description, body: product.description },
    { id: 'ingredients', title: labels.ingredients, body: product.fabric },
    { id: 'use', title: labels.howToUse, body: product.care },
    { id: 'craft', title: 'Made by hand', body: product.craftsmanship },
    { id: 'shipping', title: 'Shipping and returns', body: product.shipping },
  ].filter((panel) => String(panel.body || '').trim()) : [];

  if (status === 'loading') {
    return (
      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2 md:px-8">
        <div className="aspect-square animate-pulse bg-sand motion-reduce:animate-none" />
        <div className="space-y-4">
          <div className="h-10 w-2/3 animate-pulse bg-sand motion-reduce:animate-none" />
          <div className="h-6 w-1/3 animate-pulse bg-sand motion-reduce:animate-none" />
          <div className="h-24 animate-pulse bg-sand motion-reduce:animate-none" />
        </div>
      </main>
    );
  }

  if (status === 'error') {
    return (
      <main className="mx-auto max-w-xl px-6 py-20 text-center">
        <p className="font-body text-sm text-terracotta">{error}</p>
        <button type="button" onClick={() => fetchProduct(id).then((result) => {
          if (result.error) return;
          if (!result.product) {
            setMissing(true);
            setStatus('ready');
            return;
          }
          setProduct(result.product);
          setStatus('ready');
        })} className="mt-4 border border-olive px-4 py-2 font-body text-sm text-olive">
          Retry
        </button>
        <div className="mt-4">
          <Link to="/shop" className="font-body text-sm text-ink underline">Back to the shop</Link>
        </div>
      </main>
    );
  }

  if (missing || !product) {
    return (
      <main className="mx-auto max-w-xl px-6 py-20 text-center">
        <h1 className="font-heading text-4xl text-ink">This piece is not in the shop</h1>
        <p className="mt-3 font-body text-sm text-muted">It may have been retired, or the link is out of date.</p>
        <Link to="/shop" className="mt-6 inline-flex h-11 items-center border border-ink px-5 font-body text-xs tracking-[0.14em] text-ink uppercase">
          Browse all products
        </Link>
      </main>
    );
  }

  return (
    <main className="pb-24 md:pb-0">
      <nav aria-label="Breadcrumb" className="mx-auto flex max-w-[1360px] items-center gap-2 px-4 pt-4 font-body text-[11px] font-medium tracking-[0.12em] text-muted uppercase md:px-8">
        <Link to="/" className="shrink-0 hover:text-ink">Home</Link>
        <span aria-hidden="true">&gt;</span>
        {product.categorySlug ? (
          <Link to={`/category/${product.categorySlug}`} className="shrink-0 hover:text-ink">{product.category || 'Category'}</Link>
        ) : (
          <Link to="/shop" className="shrink-0 hover:text-ink">Shop</Link>
        )}
        <span aria-hidden="true">&gt;</span>
        <span className="truncate text-ink">{product.name}</span>
      </nav>

      <div className="mx-auto grid max-w-[1360px] items-start gap-6 px-4 py-6 lg:grid-cols-[minmax(0,55%)_minmax(0,45%)] lg:px-8">
        <ProductGallery images={images} name={product.name} saved={saved} onWishlist={() => toggleWishlist(product.id)} />
        <div className="bg-white px-6 py-8 md:px-12 lg:px-16">
          {product.badge ? (
            <p className="font-body text-[11px] font-bold tracking-[0.14em] text-ink uppercase">{product.badge}</p>
          ) : null}
          <h1 className="font-heading text-[clamp(28px,2.6vw,40px)] leading-[1.5] font-normal text-ink">{product.name}</h1>
          {product.description ? (
            <p className="mt-1 truncate font-body text-sm font-medium text-ink">{product.description}</p>
          ) : null}
          <p className="mt-4 font-body text-sm text-muted">
            {product.reviewCount > 0 ? (
              <>
                <Stars value={product.averageRating} />
                <span className="sr-only">{product.averageRating} out of 5, {product.reviewCount} reviews</span>
                <span className="ml-2">{product.averageRating} · {product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'}</span>
              </>
            ) : 'No reviews yet'}
          </p>
          <p className="mt-4 font-body text-sm text-ink">
            <span className="font-bold">{brand.origin.label}</span>
            <span className="ml-2">{brand.origin.value}</span>
          </p>
          {product.description ? (
            <div className="mt-4">
              <p className={`font-body text-sm leading-relaxed text-muted ${descOpen ? '' : 'line-clamp-3'}`}>{product.description}</p>
              <button type="button" onClick={() => setDescOpen((value) => !value)} className="mt-1 font-body text-sm text-ink underline">
                {descOpen ? 'Show less' : 'Read More'}
              </button>
            </div>
          ) : null}
          <p className="mt-5 font-body text-sm text-ink">
            <span className="font-bold">MRP</span>
            {product.originalPrice && product.originalPrice > product.price ? (
              <span className="ml-2 text-muted line-through">{formatRupee(product.originalPrice)}</span>
            ) : null}
            <span className="ml-2 font-bold">{formatRupee(product.price)}</span>
            <span className="ml-2 text-xs text-muted">(incl. of all taxes)</span>
          </p>

          <fieldset className="mt-6">
            <legend className="font-body text-sm font-bold text-ink">{labels.variant}</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {choices.colors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  aria-pressed={colorName === color.name}
                  onClick={() => {
                    setColorName(color.name);
                    setChoiceError('');
                  }}
                  className={`flex items-center gap-2 border px-3 py-2 font-body text-sm ${colorName === color.name ? 'border-ink' : 'border-line'}`}
                >
                  <span className="h-4 w-4 border border-line" style={{ backgroundColor: color.hex }} aria-hidden="true" />
                  {color.name}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="font-body text-sm font-bold text-ink">{labels.size}</legend>
            <p className="mt-1 font-body text-xs text-muted">The price does not change by size.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {choices.sizes.map((entry) => (
                <button
                  key={entry}
                  type="button"
                  aria-pressed={size === entry}
                  onClick={() => {
                    setSize(entry);
                    setChoiceError('');
                  }}
                  className={`border px-3 py-2 font-body text-sm ${size === entry ? 'border-ink text-ink' : 'border-line text-muted'}`}
                >
                  {entry}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 flex items-center gap-4">
            <p className="font-body text-sm font-bold text-ink">Quantity</p>
            <div className="inline-flex border border-line">
              <button type="button" aria-label="Decrease quantity" className="h-11 w-11 font-bold" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button>
              <span className="flex h-11 w-12 items-center justify-center font-body text-sm" aria-live="polite">{quantity}</span>
              <button type="button" aria-label="Increase quantity" className="h-11 w-11 font-bold" onClick={() => setQuantity((value) => Math.min(10, value + 1))}>+</button>
            </div>
          </div>

          {choiceError ? <p className="mt-4 font-body text-sm text-terracotta" role="alert">{choiceError}</p> : null}
          {product.isSoldOut ? <p className="mt-4 font-body text-sm text-terracotta">Sold out</p> : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button ref={addRef} type="button" disabled={product.isSoldOut} onClick={() => commit(false)} className="h-12 flex-1 border border-ink font-body text-xs tracking-[0.16em] text-ink uppercase disabled:border-line disabled:text-muted">
              {product.isSoldOut ? 'Sold out' : 'Add to Bag'}
            </button>
            <button type="button" disabled={product.isSoldOut} onClick={() => commit(true)} className="h-12 flex-1 bg-olive font-body text-xs tracking-[0.16em] text-paper uppercase disabled:bg-line">
              Buy now
            </button>
          </div>

          <p className="mt-6 font-body text-sm text-muted">{shippingLine}</p>
          <ul className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[
              ['Handmade', 'Mixed, poured, or stitched in short runs'],
              ['Gentle ingredients', 'Named on the piece, nothing hidden'],
              ['Secure payment', 'Prepaid or cash on delivery'],
            ].map(([title, note]) => (
              <li key={title} className="border border-line px-2 py-3">
                <p className="font-body text-xs font-semibold tracking-[0.08em] text-ink uppercase">{title}</p>
                <p className="mt-1 font-body text-[11px] leading-snug text-muted">{note}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-8 md:px-8">
        {panels.map((panel) => {
          const open = Boolean(openPanels[panel.id]);
          return (
            <div key={panel.id} className="border-b border-line">
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenPanels((current) => ({ ...current, [panel.id]: !current[panel.id] }))}
                className="flex w-full items-center justify-between py-4 text-left font-heading text-2xl text-ink"
              >
                {panel.title}
                <span aria-hidden="true" className="font-body text-lg">{open ? '−' : '+'}</span>
              </button>
              {open ? <p className="pb-4 font-body text-sm leading-relaxed text-muted">{panel.body}</p> : null}
            </div>
          );
        })}
      </div>

      <ReviewSection productId={product.id} />
      <ProductCarousel
        title="You may also like"
        products={related}
        href={product.categorySlug ? `/category/${product.categorySlug}` : '/shop'}
        status={{ status: 'ready' }}
      />

      {showBar && !product.isSoldOut ? (
        <div className={`fixed inset-x-0 z-40 flex items-center justify-between gap-3 border-t border-line bg-paper px-4 py-3 md:hidden ${cartCount ? 'bottom-16' : 'bottom-0'}`}>
          <p className="font-body text-sm font-bold text-ink">{formatRupee(product.price)}</p>
          <button type="button" onClick={() => commit(false)} className="h-11 flex-1 border border-ink font-body text-xs tracking-[0.14em] text-ink uppercase">
            Add to Bag
          </button>
        </div>
      ) : null}
    </main>
  );
}
