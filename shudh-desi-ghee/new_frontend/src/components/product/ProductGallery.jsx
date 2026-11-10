import { useEffect, useRef, useState } from 'react';
import SafeImage from '../SafeImage';
import { getImageUrl } from '../../utils/image';
import { IconChevron, IconClose } from '../shell/icons';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import useFocusTrap from '../../hooks/useFocusTrap';

function useSlideIndex(scroller, count) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const node = scroller.current;
    if (!node || count < 2) return undefined;
    const slides = [...node.children];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.6)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const next = slides.indexOf(visible.target);
      if (next >= 0) setIndex(next);
    }, { root: node, threshold: [0.6, 0.9] });
    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [scroller, count]);
  return [index, setIndex];
}

export default function ProductGallery({ images, name, saved, onWishlist }) {
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');
  const [viewer, setViewer] = useState(false);
  const [viewerScale, setViewerScale] = useState(1);
  const reduce = usePrefersReducedMotion();
  const mobile = useRef(null);
  const viewerRef = useRef(null);
  const trap = useRef(null);
  const list = Array.isArray(images) ? images : [];
  const imageKey = list.join('|');
  const photos = list.length ? list : [''];
  const [index, setIndex] = useSlideIndex(mobile, photos.length);
  const [seenKey, setSeenKey] = useState(imageKey);
  if (seenKey !== imageKey) {
    setSeenKey(imageKey);
    setIndex(0);
  }
  const current = photos[Math.min(index, photos.length - 1)];
  const indexRef = useRef(index);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    mobile.current?.scrollTo({ left: 0 });
  }, [imageKey]);

  useEffect(() => {
    if (!viewer) return undefined;
    document.body.dataset.viewer = 'open';
    const frame = window.requestAnimationFrame(() => {
      const node = viewerRef.current;
      if (!node) return;
      node.scrollTo({ left: indexRef.current * node.clientWidth });
    });
    return () => {
      window.cancelAnimationFrame(frame);
      delete document.body.dataset.viewer;
    };
  }, [viewer]);

  useFocusTrap(viewer, trap, () => setViewer(false));

  const go = (next) => {
    const safe = (next + photos.length) % photos.length;
    setIndex(safe);
    const node = mobile.current;
    if (node) node.scrollTo({ left: safe * node.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <div className="min-w-0">
      <div className="md:hidden">
        <div
          ref={mobile}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain bg-white"
          style={{ touchAction: 'pan-y pinch-zoom' }}
        >
          {photos.map((src, dot) => (
            <div key={`${src}-${dot}`} className="aspect-square w-full shrink-0 snap-center snap-always bg-white p-4">
              <SafeImage src={src} alt={dot === index ? name : ''} priority={dot === 0} draggable={false} className="h-full w-full object-contain" />
            </div>
          ))}
        </div>
        {photos.length > 1 ? (
          <div className="mt-3 flex items-center justify-center gap-3">
            <div className="flex gap-2">
              {photos.map((src, dot) => (
                <button
                  key={`${src}-dot-${dot}`}
                  type="button"
                  aria-label={`Show image ${dot + 1}`}
                  aria-current={dot === index ? 'true' : undefined}
                  onClick={() => go(dot)}
                  className="flex h-11 w-6 items-center justify-center"
                >
                  <span className={`h-2 rounded-full ${dot === index ? 'w-6 bg-terracotta' : 'w-2 bg-line'}`} />
                </button>
              ))}
            </div>
            <p className="font-body text-xs tracking-[0.12em] text-muted" aria-live="polite">{index + 1} / {photos.length}</p>
          </div>
        ) : null}
        <div className="mt-2 flex justify-end gap-2 px-gutter">
          <button type="button" aria-label="Zoom image" onClick={() => { setViewerScale(1); setViewer(true); }} className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-sm">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="11" cy="11" r="6" /><path d="M16 16l4 4M11 8v6M8 11h6" /></svg>
          </button>
          <button type="button" aria-pressed={saved} aria-label={saved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`} onClick={onWishlist} className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-sm">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M12 19s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z" /></svg>
          </button>
        </div>
      </div>

      <div className="hidden gap-3 md:flex">
        {photos.length > 1 ? (
          <div className="max-h-[640px] w-[90px] shrink-0 overflow-y-auto" role="list">
            <div className="flex flex-col gap-2">
              {photos.map((src, dot) => (
                <button key={`${src}-desk-${dot}`} type="button" role="listitem" aria-label={`Show image ${dot + 1}`} aria-current={dot === index ? 'true' : undefined} onClick={() => setIndex(dot)} className={`h-[90px] w-[90px] shrink-0 border bg-white ${dot === index ? 'border-terracotta' : 'border-line'}`}>
                  <SafeImage src={src} alt="" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
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
          >
            <button type="button" className="block w-full" aria-label={`Open ${name} image ${index + 1}`} onClick={() => { setViewerScale(1); setViewer(true); }}>
              <SafeImage src={current} alt={name} draggable={false} className={`aspect-square w-full object-contain md:aspect-[4/5] ${zoom && !reduce ? 'md:scale-150' : ''}`} style={zoom && !reduce ? { transformOrigin: origin } : undefined} />
            </button>
            <div className="absolute right-3 bottom-3 flex gap-2">
              <button type="button" aria-label="Zoom image" onClick={() => { setViewerScale(1); setViewer(true); }} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-ink">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="11" cy="11" r="6" /><path d="M16 16l4 4M11 8v6M8 11h6" /></svg>
              </button>
              <button type="button" aria-pressed={saved} aria-label={saved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`} onClick={onWishlist} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-ink">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M12 19s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {viewer ? (
        <div ref={trap} className="fixed inset-0 z-[90] bg-ink" role="dialog" aria-modal="true" aria-label={`${name} gallery`}>
          <button type="button" className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-paper text-ink" aria-label="Close gallery" onClick={() => setViewer(false)}>
            <IconClose className="h-4 w-4" />
          </button>
          <div
            ref={viewerRef}
            className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto"
            style={{ touchAction: 'pan-y pinch-zoom' }}
          >
            {photos.map((src, dot) => (
              <div key={`view-${src}-${dot}`} className="flex h-full w-full shrink-0 snap-center items-center justify-center">
                <img
                  src={getImageUrl(src) || undefined}
                  alt={name}
                  draggable={false}
                  onDoubleClick={() => setViewerScale((value) => (value > 1 ? 1 : 2))}
                  className="max-h-[85dvh] max-w-[92vw] object-contain"
                  style={{ transform: `scale(${dot === index ? viewerScale : 1})` }}
                />
              </div>
            ))}
          </div>
          {photos.length > 1 ? (
            <>
              <button type="button" aria-label="Previous image" onClick={() => go(index - 1)} className="absolute top-1/2 left-3 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-ink md:flex">
                <IconChevron className="h-4 w-4 rotate-180" />
              </button>
              <button type="button" aria-label="Next image" onClick={() => go(index + 1)} className="absolute top-1/2 right-3 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-ink md:flex">
                <IconChevron className="h-4 w-4" />
              </button>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
