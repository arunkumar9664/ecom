import { useEffect, useRef, useState } from 'react';
import { brand, storageKeys } from '../../config/brand';
import { catalogImages } from '../../config/media';
import SafeImage from '../SafeImage';
import { IconClose } from './icons';
import useFocusTrap from '../../hooks/useFocusTrap';

export default function WelcomePopup() {
  const [open, setOpen] = useState(false);
  const panel = useRef(null);
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(storageKeys.newsletterSession)) return undefined;
    const timer = window.setTimeout(() => setOpen(true), 700);
    return () => window.clearTimeout(timer);
  }, []);

  const close = () => {
    sessionStorage.setItem(storageKeys.newsletterSession, 'dismissed');
    setOpen(false);
  };

  useFocusTrap(open, panel, close);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <button type="button" className="absolute inset-0 bg-ink/35" aria-label="Close" onClick={close} />
      <div ref={panel} className="relative w-full max-w-md border border-line bg-paper px-6 py-8 text-center shadow-xl">
        <button type="button" aria-label="Close" onClick={close} className="absolute top-3 right-3 p-2">
          <IconClose className="h-5 w-5" />
        </button>
        <SafeImage src={catalogImages.heroSide2} alt="" className="mx-auto mb-5 h-28 w-full object-cover" />
        <h2 id="welcome-title" className="font-heading text-3xl text-ink">A note from the bench</h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-muted">
          Leave an email and we will send the first-parcel code. Nothing is stored on a server yet.
        </p>
        <p className="mt-4 inline-block border border-ink px-3 py-1 font-condensed text-sm tracking-[0.16em] text-ink uppercase">
          Use {brand.welcomeCode}
        </p>
        {done ? (
          <p className="mt-5 font-body text-sm text-olive">You are on the list. We will write when the next batch is ready.</p>
        ) : (
          <form
            className="mt-5 flex flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              sessionStorage.setItem(storageKeys.newsletterSession, 'subscribed');
              setDone(true);
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              aria-label="Email address"
              className="h-11 flex-1 border border-line px-3 font-body text-sm outline-none"
            />
            <button type="submit" className="h-11 bg-olive px-4 font-body text-xs tracking-[0.14em] text-paper uppercase">
              Subscribe
            </button>
          </form>
        )}
        {/* TODO(backend) */}
      </div>
    </div>
  );
}
