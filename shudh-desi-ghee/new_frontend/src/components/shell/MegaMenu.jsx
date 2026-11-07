import { Link } from 'react-router-dom';
import { brand } from '../../config/brand';
import { catalogImages } from '../../config/media';
import { scentLinks } from '../../config/nav';
import SafeImage from '../SafeImage';

export default function MegaMenu({ categories, onNavigate }) {
  const list = (categories || []).filter((category) => category?.slug);
  const gifting = list.find((category) => category.slug === 'gifting');

  return (
    <div className="absolute inset-x-0 top-full z-30 hidden border-t border-line bg-paper shadow-[0_16px_30px_rgba(43,38,32,0.08)] min-[1000px]:block">
      <div className="mx-auto grid max-w-[1360px] grid-cols-[1fr_1fr_1.3fr] gap-10 px-8 py-8">
        <div>
          <p className="font-body text-[11px] font-semibold tracking-[0.16em] text-ink uppercase">By category</p>
          <ul className="mt-4 space-y-2.5">
            {list.map((category) => (
              <li key={category.slug}>
                <Link
                  to={`/category/${category.slug}`}
                  onClick={onNavigate}
                  className="font-body text-sm text-muted hover:text-ink"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-body text-[11px] font-semibold tracking-[0.16em] text-ink uppercase">By scent / material</p>
          <ul className="mt-4 space-y-2.5">
            {scentLinks.map((item) => (
              <li key={item.to}>
                <Link to={item.to} onClick={onNavigate} className="font-body text-sm text-muted hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Link to="/shop" onClick={onNavigate} className="group">
            <SafeImage src={catalogImages.heroSide1} alt="" className="aspect-[4/5] w-full object-cover" />
            <p className="mt-3 font-heading text-lg leading-tight">{brand.name}</p>
            <p className="mt-1 font-body text-sm text-muted">A small set of workshop goods.</p>
          </Link>
          <Link to={gifting ? `/category/${gifting.slug}` : '/shop'} onClick={onNavigate} className="group">
            <SafeImage src={catalogImages.heroSide2} alt="" className="aspect-[4/5] w-full object-cover" />
            <p className="mt-3 font-heading text-lg leading-tight">Packed to give</p>
            <p className="mt-1 font-body text-sm text-muted">Hampers from whatever is in the workshop this week.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
