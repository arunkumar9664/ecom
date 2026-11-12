import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SafeImage from '../SafeImage';
import { catalogImages, heroFocus } from '../../config/media';
import { IconChevron } from '../shell/icons';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';

const mobileFrame = {
  [catalogImages.hero1]: catalogImages.heroMobile1,
  [catalogImages.hero2]: catalogImages.heroMobile2,
};

function focusFor(src) {
  const match = Object.entries(catalogImages).find(([, url]) => url === src);
  return match ? heroFocus[match[0]] || 'center center' : 'center center';
}

function Caption({ slide, light }) {
  return (
    <>
      {slide.subtitle ? (
        <p className={`font-body text-[12px] tracking-[0.16em] uppercase ${light ? 'text-paper' : 'text-terracotta'}`}>{slide.subtitle}</p>
      ) : null}
      {slide.title ? (
        <h1 className={`mt-2 font-heading text-[clamp(26px,7vw,32px)] leading-tight text-balance md:text-6xl ${light ? 'text-paper' : 'text-ink'}`}>{slide.title}</h1>
      ) : null}
      {slide.description ? (
        <p className={`mt-2.5 line-clamp-3 font-body text-[15px] leading-relaxed ${light ? 'text-paper' : 'text-muted'}`}>{slide.description}</p>
      ) : null}
      {slide.cta && slide.categorySlug ? (
        <Link
          to={`/category/${slide.categorySlug}`}
          className="mt-4 inline-flex h-12 w-full max-w-[280px] items-center justify-center bg-olive px-6 font-body text-xs tracking-[0.16em] text-paper uppercase"
        >
          {slide.cta}
        </Link>
      ) : null}
    </>
  );
}

export default function HeroCarousel({ slides, status, onRetry }) {
  const items = Array.isArray(slides) ? slides : [];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const scroller = useRef(null);
  const fromUser = useRef(false);
  const count = items.length;
  const [seenCount, setSeenCount] = useState(count);
  if (seenCount !== count) {
    setSeenCount(count);
    setIndex(0);
  }

  useEffect(() => {
    const onHide = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onHide);
    return () => document.removeEventListener('visibilitychange', onHide);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion || count < 2) return undefined;
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % count);
    }, 5600);
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion, count, index]);

  useEffect(() => {
    const node = scroller.current;
    if (!node || fromUser.current) {
      fromUser.current = false;
      return;
    }
    const width = node.clientWidth;
    node.scrollTo({ left: index * width, behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [index, reduceMotion]);

  const go = (next) => setIndex((next + count) % count);

  if (status?.status === 'loading' || status?.status === 'idle') {
    return <div className="aspect-[4/5] animate-pulse bg-sand motion-reduce:animate-none md:h-[68vh] md:max-h-[760px]" aria-hidden="true" />;
  }

  if (status?.status === 'error') {
    return (
      <section className="bg-sand px-gutter py-16 text-center">
        <p className="font-body text-sm text-terracotta">{status.error}</p>
        <button type="button" onClick={onRetry} className="mt-4 h-11 border border-olive px-4 font-body text-sm text-olive">Retry</button>
      </section>
    );
  }

  if (!items.length) return null;

  return (
    <section aria-roledescription="carousel" aria-label="Featured" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div
        ref={scroller}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-touch md:hidden"
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
        onScroll={(event) => {
          const node = event.currentTarget;
          const next = Math.round(node.scrollLeft / Math.max(node.clientWidth, 1));
          if (next !== index && next >= 0 && next < count) {
            fromUser.current = true;
            setIndex(next);
          }
        }}
      >
        {items.map((slide, dot) => {
          const image = mobileFrame[slide.image] || slide.image;
          return (
            <article key={slide.id || dot} className="w-full shrink-0 flex-none snap-center snap-always bg-paper">
              <div className="aspect-[4/5] overflow-hidden">
                <SafeImage src={image} alt="" priority={dot === 0} draggable={false} className="h-full w-full object-cover" style={{ objectPosition: focusFor(image) }} />
              </div>
              <div className="flex flex-col items-center px-gutter pt-4 pb-4 text-center">
                <Caption slide={slide} />
              </div>
            </article>
          );
        })}
      </div>
      {count > 1 ? (
        <div className="flex justify-center gap-2 pt-4 pb-6 md:hidden">
          {items.map((slide, dot) => (
            <button
              key={slide.id || dot}
              type="button"
              aria-label={`Show slide ${dot + 1}`}
              aria-current={dot === index ? 'true' : undefined}
              onClick={() => go(dot)}
              className={`h-2 rounded-full ${dot === index ? 'w-6 bg-terracotta' : 'w-2 bg-line'}`}
            />
          ))}
        </div>
      ) : <div className="h-6 md:hidden" />}

      <div className="relative hidden h-[68vh] max-h-[760px] min-h-[520px] overflow-hidden bg-sand md:block">
        <SafeImage
          src={items[index].image}
          alt=""
          priority
          draggable={false}
          className="h-full w-full object-cover"
          style={{ objectPosition: focusFor(items[index].image) }}
        />
        <div className="pointer-events-none absolute inset-6 border border-white/70" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" aria-hidden="true" />
        <div className="absolute bottom-16 left-12 max-w-[520px] text-left">
          <Caption slide={items[index]} light />
        </div>
        {count > 1 ? (
          <>
            <button type="button" aria-label="Previous slide" onClick={() => go(index - 1)} className="absolute top-1/2 left-6 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink">
              <IconChevron className="h-4 w-4 rotate-180" />
            </button>
            <button type="button" aria-label="Next slide" onClick={() => go(index + 1)} className="absolute top-1/2 right-6 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink">
              <IconChevron className="h-4 w-4" />
            </button>
            <div className="absolute bottom-6 left-12 flex gap-2">
              {items.map((slide, dot) => (
                <button key={slide.id || `d-${dot}`} type="button" aria-label={`Show slide ${dot + 1}`} aria-current={dot === index ? 'true' : undefined} onClick={() => go(dot)} className={`h-2 rounded-full ${dot === index ? 'w-6 bg-paper' : 'w-2 bg-paper/60'}`} />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
