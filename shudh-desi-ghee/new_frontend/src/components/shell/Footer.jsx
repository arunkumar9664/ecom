import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../../hooks/useShop';
import { storageKeys } from '../../config/brand';

export default function Footer() {
  const { categories, sections, storeSettings } = useShop();
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [expanded, setExpanded] = useState(false);
  const shopLinks = (categories || []).filter((category) => category?.slug);

  const subscribe = (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    sessionStorage.setItem(storageKeys.newsletterSession, 'subscribed');
    setNote('You are on the list. We will write when the next batch is ready.');
    setEmail('');
  };

  return (
    <footer>
      <div className="bg-olive text-paper">
        <div className="mx-auto grid max-w-[1360px] gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-5 lg:px-8">
          <div>
            <p className="font-body text-[12px] tracking-[0.16em] uppercase">Shop</p>
            <ul className="mt-4 space-y-2 font-body text-sm text-sand">
              <li><Link to="/shop" className="hover:text-paper">All products</Link></li>
              {shopLinks.map((category) => (
                <li key={category.slug}>
                  <Link to={`/category/${category.slug}`} className="hover:text-paper">{category.name}</Link>
                </li>
              ))}
              {sections.categories.status === 'error' ? <li className="text-sand">{sections.categories.error}</li> : null}
            </ul>
          </div>
          <div>
            <p className="font-body text-[12px] tracking-[0.16em] uppercase">Customer care</p>
            <ul className="mt-4 space-y-2 font-body text-sm text-sand">
              <li><Link to="/contact" className="hover:text-paper">Contact</Link></li>
              <li><Link to="/refund-policy" className="hover:text-paper">Delivery and returns</Link></li>
              <li><Link to="/disclaimer" className="hover:text-paper">Questions</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-paper">Privacy</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-body text-[12px] tracking-[0.16em] uppercase">The workshop</p>
            <ul className="mt-4 space-y-2 font-body text-sm text-sand">
              <li><Link to="/about" className="hover:text-paper">About us</Link></li>
              <li><Link to="/our-story" className="hover:text-paper">Our story</Link></li>
              <li><Link to="/journal" className="hover:text-paper">Journal</Link></li>
              <li><Link to="/lab-reports" className="hover:text-paper">Notes on the work</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-body text-[12px] tracking-[0.16em] uppercase">My account</p>
            <ul className="mt-4 space-y-2 font-body text-sm text-sand">
              <li><Link to="/account" className="hover:text-paper">Profile</Link></li>
              <li><Link to="/orders" className="hover:text-paper">Orders</Link></li>
              <li><Link to="/wishlist" className="hover:text-paper">Wishlist</Link></li>
              <li><Link to="/track-order" className="hover:text-paper">Track an order</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-body text-[12px] tracking-[0.16em] uppercase">Letters from the workshop</p>
            <form onSubmit={subscribe} className="mt-4">
              <label htmlFor="footer-email" className="font-body text-xs text-sand">Email</label>
              <div className="mt-2 flex">
                <input
                  id="footer-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Your email"
                  className="h-10 min-w-0 flex-1 border border-sand bg-transparent px-3 font-body text-sm text-paper outline-none placeholder:text-sand/70"
                />
                <button type="submit" className="h-10 border border-sand px-3 font-body text-[11px] tracking-[0.14em] uppercase">
                  Join
                </button>
              </div>
              <p className="mt-2 font-body text-[11px] leading-relaxed text-sand">
                {/* TODO(backend) */}
                This form stays in your browser. We do not store the address yet.
              </p>
              {note ? <p className="mt-2 font-body text-sm text-paper">{note}</p> : null}
            </form>
            <div className="mt-5 flex gap-3 font-body text-sm">
              {storeSettings?.instagram ? <a href={storeSettings.instagram} className="hover:text-sand">Instagram</a> : null}
              {storeSettings?.facebook ? <a href={storeSettings.facebook} className="hover:text-sand">Facebook</a> : null}
              {storeSettings?.whatsapp ? <a href={storeSettings.whatsapp} className="hover:text-sand">WhatsApp</a> : null}
            </div>
          </div>
        </div>
        <p className="px-6 pb-8 text-center font-heading text-lg leading-snug text-paper sm:text-xl">
          We never ask for bank details, one-time passwords, or payment in advance.
        </p>
        <p className="px-6 pb-8 text-center font-body text-xs text-sand">
          {storeSettings?.address || 'Workshop address appears when store settings load.'}
        </p>
      </div>
      <div className="bg-paper px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading text-3xl text-ink">Made slowly, in small batches</h2>
          <div className={`mt-4 space-y-3 font-body text-sm leading-relaxed text-muted ${expanded ? '' : 'max-h-24 overflow-hidden'}`}>
            <p>
              Field & Hearth is a workshop for soap, candles, linen, bags, and alcohol-free attars. Each piece is mixed, poured, or stitched by hand, then left to cure or soften before it leaves the bench.
            </p>
            <p>
              We keep the list short on purpose. When a bar or a length of linen runs out, it waits for the next batch instead of being replaced with a substitute.
            </p>
            <p>
              Orders travel in plain paper and cloth. If something arrives damaged, write to the workshop address on this page and we will sort it with you.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="mt-4 border border-ink px-5 py-2 font-body text-xs tracking-[0.14em] text-ink uppercase"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        </div>
      </div>
    </footer>
  );
}
