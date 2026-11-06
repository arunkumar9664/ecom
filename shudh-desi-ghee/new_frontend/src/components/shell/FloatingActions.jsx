import { useEffect, useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { IconPhone, IconUp } from './icons';

export default function FloatingActions() {
  const { storeSettings, sections } = useShop();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 360);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const phone = sections.settings.status === 'ready' ? storeSettings?.phone : '';
  const whatsapp = sections.settings.status === 'ready' ? storeSettings?.whatsapp : '';

  return (
    <>
      {visible ? (
        <button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
          className="fixed bottom-24 left-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper text-ink shadow-sm md:bottom-6"
        >
          <IconUp className="h-5 w-5" />
        </button>
      ) : null}
      <div className="fixed right-4 bottom-24 z-40 flex flex-col gap-3 md:bottom-6">
        {phone ? (
          <a href={`tel:${phone}`} aria-label="Call the workshop" className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper md:hidden">
            <IconPhone className="h-5 w-5" />
          </a>
        ) : null}
        {whatsapp ? (
          <a href={whatsapp} aria-label="WhatsApp" className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-paper text-ink">
            <span className="font-body text-[10px] font-semibold tracking-wide">WA</span>
          </a>
        ) : null}
      </div>
    </>
  );
}
