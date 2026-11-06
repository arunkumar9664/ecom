import { useEffect, useRef, useState } from 'react';
import SafeImage from '../SafeImage';
import { IconChevron, IconClose } from '../shell/icons';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';

export default function ProductGallery({ images, name, saved, onWishlist }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');
  const [viewer, setViewer] = useState(false);
  const reduce = usePrefersReducedMotion();
  const dragX = useRef(0);
  const list = Array.isArray(images) ? images : [];
  const imageKey = list.join('|');
  const [seenKey, setSeenKey] = useState(imageKey);
  if (seenKey !== imageKey) {
    setSeenKey(imageKey);
    setIndex(0);
  }
  const photos = list.length ? list : [''];
  const current = photos[Math.min(index, photos.length - 1)];

  useEffect(() => {
    if (!viewer) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setViewer(false);
      if (event.key === 'ArrowRight') setIndex((value) => (value + 1) % photos.length);
      if (event.key === 'ArrowLeft') setIndex((value) => (value - 1 + photos.length) % photos.length);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [viewer, photos.length]);

  const go = (next) => setIndex((next + photos.length) % photos.length);

  return (
    <div className="flex gap-3">
      {photos.length > 1 ? (
        <div className="hidden max-h-[640px] w-[90px] shrink-0 flex-col gap-2 overflow-y-auto md:flex" role="list">
          {photos.map((src, dot) => (
            <button
              key={`${src}-${dot}`}
              type="button"
              role="listitem"
              aria-label={`Show image ${dot + 1}`}
              aria-current={dot === index ? 'true' : undefined}
              onClick={() => setIndex(dot)}
              className={`h-[90px] w-[90px] shrink-0 border bg-white ${dot === index ? 'border-terracotta' : 'border-line'}`}
            >
              <SafeImage src={src} alt="" className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <div
          className="relative overflow-hidden bg-white"
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => setZoom(false)}
          onMouseMove={(event) => {
            const box = event.currentTarget.getBoundingClientRect();
            setOrigin(`${((event.clientX - box.left) / box.width) * 100}% ${((event.clientY - box.top) / box.height) * 100}%`);
          }}
          onPointerDown={(event) => {
            dragX.current = event.clientX;
          }}
          onPointerUp={(event) => {
            const delta = event.clientX - dragX.current;
            if (delta > 48) go(index - 1);
            if (delta < -48) go(index + 1);
          }}
        >
          <button type="button" className="block w-full" aria-label={`Open ${name} image ${index + 1}`} onClick={() => setViewer(true)}>
            <SafeImage
              src={current}
              alt={name}
              className={`aspect-square w-full object-contain md:aspect-[4/5] ${zoom && !reduce ? 'md:scale-150' : ''}`}
              style={zoom && !reduce ? { transformOrigin: origin } : undefined}
            />
          </button>
          <div className="absolute right-3 bottom-3 flex gap-2">
            <button type="button" aria-label="Zoom image" onClick={() => setViewer(true)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <circle cx="11" cy="11" r="6" />
                <path d="M16 16l4 4M11 8v6M8 11h6" />
              </svg>
            </button>
            <button
              type="button"
              aria-pressed={saved}
              aria-label={saved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
              onClick={onWishlist}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M12 19s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z" />
              </svg>
            </button>
          </div>
        </div>
        {photos.length > 1 ? (
          <div className="mt-3 flex justify-center gap-2 md:hidden">
            {photos.map((src, dot) => (
              <button
                key={`${src}-dot-${dot}`}
                type="button"
                aria-label={`Show image ${dot + 1}`}
                aria-current={dot === index ? 'true' : undefined}
                onClick={() => setIndex(dot)}
                className={`h-2 rounded-full ${dot === index ? 'w-6 bg-terracotta' : 'w-2 bg-line'}`}
              />
            ))}
          </div>
        ) : null}
      </div>
      {viewer ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/90" role="dialog" aria-modal="true" aria-label={`${name} gallery`}>
          <button type="button" className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-paper text-ink" aria-label="Close gallery" onClick={() => setViewer(false)}>
            <IconClose className="h-4 w-4" />
          </button>
          {photos.length > 1 ? (
            <>
              <button type="button" aria-label="Previous image" onClick={() => go(index - 1)} className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-paper text-ink">
                <IconChevron className="h-4 w-4 rotate-180" />
              </button>
              <button type="button" aria-label="Next image" onClick={() => go(index + 1)} className="absolute right-3 flex h-10 w-10 items-center justify-center rounded-full bg-paper text-ink">
                <IconChevron className="h-4 w-4" />
              </button>
            </>
          ) : null}
          <SafeImage src={current} alt={name} className="max-h-[85vh] max-w-[90vw] object-contain" />
        </div>
      ) : null}
    </div>
  );
}
