import { useEffect, useState } from 'react';
import { useShop } from '../../context/ShopContext';

function isGenericShipping(message) {
  return /free (shipping|dispatch|delivery)/i.test(message) && !/₹|\brs\.?\s*\d/i.test(message);
}

export default function AnnouncementBar() {
  const { promoMessages, sections, storeSettings } = useShop();
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

  useEffect(() => {
    setIndex(0);
  }, [messages.length]);

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
    : messages[index] || (sections.promo.status === 'loading' ? 'Loading announcements' : '');

  if (!text) return null;

  return (
    <div className="bg-olive px-4 py-2 text-center text-[12px] leading-snug text-paper sm:text-[13px]">
      <p className="mx-auto max-w-4xl">{text}</p>
    </div>
  );
}
