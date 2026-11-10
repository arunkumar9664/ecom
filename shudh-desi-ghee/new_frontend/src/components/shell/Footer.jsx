import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../../hooks/useShop';
import { storageKeys } from '../../config/brand';
import { MockLine } from './MockBadge';

function SocialIcon({ name }) {
  const common = { viewBox: '0 0 24 24', className: 'h-5 w-5', fill: 'currentColor', 'aria-hidden': true };
  if (name === 'facebook') return <svg {...common}><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1z" /></svg>;
  if (name === 'instagram') return <svg {...common}><path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 4.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5zm6.2-.9a1 1 0 1 0 1 1 1 1 0 0 0-1-1zM12 9.2A2.8 2.8 0 1 1 9.2 12 2.8 2.8 0 0 1 12 9.2z" /></svg>;
  if (name === 'whatsapp') return <svg {...common}><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3zm4.8 12.7c-.2.6-1.2 1.1-1.7 1.1s-1.3.2-4.2-1.1-3.6-3.4-3.7-3.6-.9-1.2-.9-2.3.6-1.6.8-1.8.4-.3.6-.3h.4c.2 0 .4 0 .5.4s.7 1.6.7 1.7.1.3 0 .5-.2.4-.3.5-.2.2-.1.4.6 1 1.3 1.6 1.5 1.8c.2.2.4.1.5 0s.6-.7.8-.9.3-.2.5-.1 1.3.6 1.5.7.4.2.4.3-.1.7-.3 1.3z" /></svg>;
  if (name === 'youtube') return <svg {...common}><path d="M22 12.2s0-3.2-.4-4.6a3 3 0 0 0-2.1-2.1C17.9 5 12 5 12 5s-5.9 0-7.5.5a3 3 0 0 0-2.1 2.1C2 9 2 12.2 2 12.2s0 3.2.4 4.6a3 3 0 0 0 2.1 2.1C6.1 19.4 12 19.4 12 19.4s5.9 0 7.5-.5a3 3 0 0 0 2.1-2.1c.4-1.4.4-4.6.4-4.6zM10 15.5v-6l5 3z" /></svg>;
  return <svg {...common}><path d="M4 4h3.2l4.1 5.6L16.2 4H20l-6.2 7.1L20.4 20h-3.2l-4.5-6.1L7.6 20H4l6.6-7.5z" /></svg>;
}

export default function Footer() {
  const { categories, sections, storeSettings } = useShop();
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [note, setNote] = useState('');
  const [expanded, setExpanded] = useState(false);
  const shopLinks = (categories || []).filter((category) => category?.slug);

  const subscribe = (event) => {
    event.preventDefault();
    if (!email.trim() || !consent) return;
    sessionStorage.setItem(storageKeys.newsletterSession, 'subscribed');
    setNote('You are on the list. We will write when the next batch is ready.');
    setEmail('');
  };

  const socials = [
    storeSettings?.facebook ? { href: storeSettings.facebook, label: 'Facebook', icon: 'facebook' } : null,
    storeSettings?.instagram ? { href: storeSettings.instagram, label: 'Instagram', icon: 'instagram' } : null,
    storeSettings?.whatsapp ? { href: storeSettings.whatsapp, label: 'WhatsApp', icon: 'whatsapp' } : null,
    storeSettings?.youtube ? { href: storeSettings.youtube, label: 'YouTube', icon: 'youtube' } : null,
    storeSettings?.twitter ? { href: storeSettings.twitter, label: 'X', icon: 'x' } : null,
  ].filter(Boolean);

  return (
    <footer className="relative">
      <svg viewBox="0 0 64 64" aria-hidden="true" className="absolute -top-6 left-4 h-14 w-14 text-olive">
        <path fill="currentColor" d="M32 60C14 42 8 28 14 16c8 6 12 6 18-4 6 10 10 10 18 4 6 12 0 26-18 44z" />
      </svg>
      <svg viewBox="0 0 64 64" aria-hidden="true" className="absolute -top-6 right-4 h-14 w-14 -scale-x-100 text-olive">
        <path fill="currentColor" d="M32 60C14 42 8 28 14 16c8 6 12 6 18-4 6 10 10 10 18 4 6 12 0 26-18 44z" />
      </svg>
      <div className="bg-olive text-paper">
        <div className="mx-auto grid max-w-[1360px] gap-10 px-gutter py-12 sm:grid-cols-2 lg:grid-cols-5">
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
              <label htmlFor="footer-email" className="font-body text-xs text-sand">Your Email Id*</label>
              <div className="mt-2 flex">
                <input
                  id="footer-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-10 min-w-0 flex-1 bg-white px-3 font-body text-sm text-ink outline-none"
                />
                <button type="submit" className="h-10 bg-paper px-3 font-body text-sm font-semibold text-ink">
                  Subscribe
                </button>
              </div>
              <label className="mt-3 flex items-start gap-2 font-body text-[11px] leading-relaxed text-sand">
                <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required className="mt-0.5" />
                <span>
                  By checking this box you consent to our <Link to="/privacy-policy" className="underline">Privacy Policy</Link> and <Link to="/terms" className="underline">Terms of Use</Link>
                </span>
              </label>
              {/* TODO(backend) */}
              {note ? <p className="mt-2 font-body text-sm text-paper">{note}</p> : null}
            </form>
            <div className="mt-5 flex gap-3">
              {socials.map((item) => (
                <a key={item.label} href={item.href} aria-label={item.label} className="text-paper hover:text-sand">
                  <SocialIcon name={item.icon} />
                </a>
              ))}
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
      <div className="bg-paper px-6 py-12 pb-28">
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
          <MockLine />
        </div>
      </div>
    </footer>
  );
}
