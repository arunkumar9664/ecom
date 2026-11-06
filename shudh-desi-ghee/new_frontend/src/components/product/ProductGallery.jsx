import { useEffect, useState } from 'react';
import SafeImage from '../SafeImage';
import { IconChevron, IconClose } from '../shell/icons';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';

export default function ProductGallery({ images, name }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');
  const [viewer, setViewer] = useState(false);
  const reduce = usePrefersReducedMotion();
  const photos = images.length ? images : [''];
  const current = photos[Math.min(index, photos.length - 1)];

  useEffect(() => {
    setIndex(0);
  }, [images.join('|')]);

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
  let startX = 0;

  return (
    <div>
      <div
        className="relative overflow-hidden bg-white"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={(event) => {
          const box = event.currentTarget.getBoundingClientRect();
          setOrigin(`${((event.clientX - box.left) / box.width) * 100}% ${((event.clientY - box.top) / box.height) * 100}%`);
        }}
        onPointerDown={(event) => {
          startX = event.clientX;
        }}
        onPointerUp={(event) => {
          const delta = event.clientX - startX;
          if (delta > 48) go(index - 1);
          if (delta < -48) go(index + 1);
        }}
      >
        <button type="button" className="block w-full" aria-label={`Open ${name} image ${index + 1}`} onClick={() => setViewer(true)}>
          <SafeImage
            src={current}
            alt={name}
            className={`aspect-square w-full object-contain ${zoom && !reduce ? 'scale-150' : ''}`}
            style={zoom && !reduce ? { transformOrigin: origin } : undefined}
          />
        </button>
      </div>
      {photos.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto" role="list">
          {photos.map((src, dot) => (
            <button
              key={`${src}-${dot}`}
              type="button"
              role="listitem"
              aria-label={`Show image ${dot + 1}`}
              aria-current={dot === index ? 'true' : undefined}
              onClick={() => setIndex(dot)}
              className={`h-16 w-16 shrink-0 border bg-white ${dot === index ? 'border-ink' : 'border-line'}`}
            >
              <SafeImage src={src} alt="" className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      ) : null}

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
