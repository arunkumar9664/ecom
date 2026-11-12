import { useEffect, useRef, useState } from 'react';
import SafeImage from '../SafeImage';
import { getImageUrl } from '../../utils/image';
import { IconChevron, IconClose } from '../shell/icons';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import useFocusTrap from '../../hooks/useFocusTrap';

export default function ProductGallery({ images, name, saved, onWishlist }) {
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');
  const [viewer, setViewer] = useState(false);
  const [viewerScale, setViewerScale] = useState(1);
  const reduce = usePrefersReducedMotion();
  const mobile = useRef(null);
  const viewerRef = useRef(null);
  const trap = useRef(null);
  const lastTapTime = useRef(0);
  const pinch = useRef({ dist: 0, startScale: 1 });
  const list = Array.isArray(images) ? images : [];
  const imageKey = list.join('|');
  const photos = list.length ? list : [''];
  const [index, setIndex] = useState(0);
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

  useFocusTrap(viewer, trap, () => {
    setViewerScale(1);
    setViewer(false);
  });

  const onMobileScroll = (event) => {
    const node = event.currentTarget;
    const width = node.clientWidth;
    if (width > 0) {
      const next = Math.round(node.scrollLeft / width);
      if (next >= 0 && next < photos.length && next !== indexRef.current) {
        setIndex(next);
      }
    }
  };

  const onViewerScroll = (event) => {
    const node = event.currentTarget;
    const width = node.clientWidth;
    if (width > 0) {
      const next = Math.round(node.scrollLeft / width);
      if (next >= 0 && next < photos.length && next !== indexRef.current) {
        setIndex(next);
        setViewerScale(1);
        if (mobile.current) {
          mobile.current.scrollTo({ left: next * mobile.current.clientWidth });
        }
      }
    }
  };

  const go = (next) => {
    const safe = (next + photos.length) % photos.length;
    setIndex(safe);
    const node = mobile.current;
    if (node) node.scrollTo({ left: safe * node.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
  };

  const goViewer = (next) => {
    const safe = (next + photos.length) % photos.length;
    setIndex(safe);
    setViewerScale(1);
    viewerRef.current?.scrollTo({ left: safe * viewerRef.current.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
    if (mobile.current) {
      mobile.current.scrollTo({ left: safe * mobile.current.clientWidth });
    }
  };

  const handleDoubleTap = (event) => {
    const now = Date.now();
    if (now - lastTapTime.current < 300) {
      event.preventDefault();
      setViewerScale((prev) => (prev > 1 ? 1 : 2.5));
    }
    lastTapTime.current = now;
  };

  const onTouchStart = (event) => {
    if (event.touches.length === 2) {
      const dist = Math.hypot(
        event.touches[0].clientX - event.touches[1].clientX,
        event.touches[0].clientY - event.touches[1].clientY,
      );
      pinch.current = { dist, startScale: viewerScale };
    }
  };

  const onTouchMove = (event) => {
    if (event.touches.length === 2 && pinch.current.dist > 0) {
      const dist = Math.hypot(
        event.touches[0].clientX - event.touches[1].clientX,
        event.touches[0].clientY - event.touches[1].clientY,
      );
      const scale = (dist / pinch.current.dist) * pinch.current.startScale;
      setViewerScale(Math.min(4, Math.max(1, scale)));
    }
  };

  const onTouchEnd = () => {
    pinch.current.dist = 0;
  };

  return (
    <div className="min-w-0">
      <div className="md:hidden">
        <div
          ref={mobile}
          onScroll={onMobileScroll}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-touch bg-white"
        >
          {photos.map((src, dot) => (
            <div key={`${src}-${dot}`} className="aspect-square w-full shrink-0 flex-none snap-center snap-always bg-white p-4">
              <SafeImage src={src} alt={dot === index ? name : ''} priority={dot === 0} draggable={false} className="h-full w-full object-contain select-none" />
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
                  <SafeImage src={src} alt="" draggable={false} className="h-full w-full object-contain select-none" />
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
            <button type="button" className="block w-full cursor-zoom-in" aria-label={`Open ${name} image ${index + 1}`} onClick={() => { setViewerScale(1); setViewer(true); }}>
              <SafeImage src={current} alt={name} draggable={false} className={`aspect-square w-full object-contain md:aspect-[4/5] select-none ${zoom && !reduce ? 'md:scale-150' : ''}`} style={zoom && !reduce ? { transformOrigin: origin } : undefined} />
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
        <div ref={trap} className="fixed inset-0 z-[90] bg-ink select-none" role="dialog" aria-modal="true" aria-label={`${name} gallery`}>
          <button type="button" className="absolute top-4 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-paper text-ink" aria-label="Close gallery" onClick={() => { setViewerScale(1); setViewer(false); }}>
            <IconClose className="h-4 w-4" />
          </button>
          <div
            ref={viewerRef}
            onScroll={onViewerScroll}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-touch"
          >
            {photos.map((src, dot) => (
              <div key={`view-${src}-${dot}`} className="flex h-full w-full shrink-0 flex-none snap-center items-center justify-center p-4">
                <img
                  src={getImageUrl(src) || undefined}
                  alt={name}
                  draggable={false}
                  onTouchEnd={handleDoubleTap}
                  onDoubleClick={() => setViewerScale((value) => (value > 1 ? 1 : 2.5))}
                  className="max-h-[85dvh] max-w-[92vw] object-contain select-none transition-transform duration-200"
                  style={{ transform: `scale(${dot === index ? viewerScale : 1})` }}
                />
              </div>
            ))}
          </div>
          {photos.length > 1 ? (
            <>
              <button type="button" aria-label="Previous image" onClick={() => goViewer(index - 1)} className="absolute top-1/2 left-3 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-ink md:flex">
                <IconChevron className="h-4 w-4 rotate-180" />
              </button>
              <button type="button" aria-label="Next image" onClick={() => goViewer(index + 1)} className="absolute top-1/2 right-3 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-ink md:flex">
                <IconChevron className="h-4 w-4" />
              </button>
              <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex flex-col items-center gap-2">
                <div className="pointer-events-auto flex gap-2">
                  {photos.map((src, dot) => (
                    <button
                      key={`viewer-dot-${dot}`}
                      type="button"
                      aria-label={`Show image ${dot + 1}`}
                      aria-current={dot === index ? 'true' : undefined}
                      onClick={() => goViewer(dot)}
                      className="flex h-8 w-6 items-center justify-center"
                    >
                      <span className={`h-2 rounded-full ${dot === index ? 'w-6 bg-paper' : 'w-2 bg-paper/40'}`} />
                    </button>
                  ))}
                </div>
                <p className="font-body text-xs tracking-[0.12em] text-paper/80" aria-live="polite">
                  {index + 1} / {photos.length}
                </p>
              </div>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
