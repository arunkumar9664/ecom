import { useEffect, useState } from 'react';
import { useShop } from '../../hooks/useShop';
import MockBadge from './MockBadge';
import { IconLeaf } from './icons';

function isGenericShipping(message) {
  return /free (shipping|dispatch|delivery)/i.test(message) && !/₹|\brs\.?\s*\d/i.test(message);
}

export default function AnnouncementBar() {
  const { promoMessages, sections, storeSettings, useMockData } = useShop();
  const [index, setIndex] = useState(0);
  const threshold = Number(storeSettings?.freeShippingThreshold);
  const shippingKnown = sections.settings.status === 'ready' && Number.isFinite(threshold) && threshold > 0;
  const shippingLine = shippingKnown
    ? `Free shipping on orders above ₹${threshold.toLocaleString('en-IN')}`
    : null;
  const messages = promoMessages.filter(Boolean).flatMap((message) => {
    if (!isGenericShipping(message)) return [message];
    return shippingLine ? [shippingLine] : [];
  });

  const safeIndex = messages.length ? index % messages.length : 0;

  useEffect(() => {
    if (messages.length < 2) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % messages.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [messages.length]);

  const text = sections.promo.status === 'error'
    ? sections.promo.error
    : messages[safeIndex] || (sections.promo.status === 'loading' ? 'Loading announcements' : '');

  if (!text && !useMockData) return null;

  return (
    <div className="relative bg-olive px-gutter py-2 text-paper">
      <MockBadge />
      <p className="mx-auto flex max-w-4xl items-center justify-center gap-3 px-8 text-center font-body text-[12px] leading-snug sm:text-[13px]">
        <IconLeaf className="h-3 w-3 shrink-0 text-gold" />
        <span className="min-w-0">{text}</span>
        <IconLeaf className="h-3 w-3 shrink-0 -scale-x-100 text-gold" />
      </p>
    </div>
  );
}
