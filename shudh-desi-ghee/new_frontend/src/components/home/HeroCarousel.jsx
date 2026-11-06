import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SafeImage from '../SafeImage';
import { catalogImages } from '../../config/media';
import { IconChevron } from '../shell/icons';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';

const mobileFrame = {
  [catalogImages.hero1]: catalogImages.heroMobile1,
  [catalogImages.hero2]: catalogImages.heroMobile2,
};

export default function HeroCarousel({ slides, status, onRetry }) {
  const items = Array.isArray(slides) ? slides : [];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const dragX = useRef(0);
  const count = items.length;
  const current = items[index] || items[0];

  useEffect(() => {
    setIndex(0);
  }, [count]);

  useEffect(() => {
    if (paused || reduceMotion || count < 2) return undefined;
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % count);
    }, 5600);
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion, count, index]);

  const go = (next) => setIndex((next + count) % count);

  const onPointerUp = (event) => {
    const delta = event.clientX - dragX.current;
    if (delta > 48) go(index - 1);
    if (delta < -48) go(index + 1);
  };

  if (status?.status === 'loading' || status?.status === 'idle') {
    return <div className="h-[72vh] min-h-[420px] animate-pulse bg-sand motion-reduce:animate-none" aria-hidden="true" />;
  }

  if (status?.status === 'error') {
    return (
      <section className="bg-sand px-6 py-16 text-center">
        <p className="font-body text-sm text-terracotta">{status.error}</p>
        <button type="button" onClick={onRetry} className="mt-4 border border-olive px-4 py-2 font-body text-sm text-olive">Retry</button>
      </section>
    );
  }

  if (!current) return null;

  const mobileImage = mobileFrame[current.image];

  return (
    <section
      className="relative h-[72vh] min-h-[440px] overflow-hidden bg-sand md:h-[68vh] md:max-h-[760px] md:min-h-[520px]"
      aria-roledescription="carousel"
      aria-label="Featured"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') go(index - 1);
        if (event.key === 'ArrowRight') go(index + 1);
      }}
    >
      <div
        className="h-full"
        onPointerDown={(event) => {
          dragX.current = event.clientX;
        }}
        onPointerUp={onPointerUp}
      >
        {mobileImage ? (
          <SafeImage src={mobileImage} alt="" className="h-full w-full object-cover object-center md:hidden" />
        ) : null}
        <SafeImage
          src={current.image}
          alt=""
          className={`h-full w-full object-cover object-center ${mobileImage ? 'hidden md:block' : ''}`}
        />
      </div>
      <div className="pointer-events-none absolute inset-3 border border-white/80 md:inset-5" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/60 to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end px-8 pb-16 text-center text-paper md:pb-20">
        {current.subtitle ? (
          <p className="font-condensed text-sm tracking-[0.22em] uppercase">{current.subtitle}</p>
        ) : null}
        {current.title ? <h1 className="mt-2 max-w-3xl font-heading text-4xl md:text-6xl">{current.title}</h1> : null}
        {current.description ? <p className="mt-3 max-w-xl font-body text-sm md:text-base">{current.description}</p> : null}
        {current.cta && current.categorySlug ? (
          <Link
            to={`/category/${current.categorySlug}`}
            className="pointer-events-auto mt-6 inline-flex h-11 items-center border border-paper bg-paper/90 px-6 font-body text-xs tracking-[0.16em] text-ink uppercase"
          >
            {current.cta}
          </Link>
        ) : null}
      </div>
      {count > 1 ? (
        <>
          <button type="button" aria-label="Previous slide" onClick={() => go(index - 1)} className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink md:left-6">
            <IconChevron className="h-4 w-4 rotate-180" />
          </button>
          <button type="button" aria-label="Next slide" onClick={() => go(index + 1)} className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink md:right-6">
            <IconChevron className="h-4 w-4" />
          </button>
          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
            {items.map((slide, dot) => (
              <button
                key={slide.id || dot}
                type="button"
                aria-label={`Show slide ${dot + 1}`}
                aria-current={dot === index ? 'true' : undefined}
                onClick={() => setIndex(dot)}
                className={`h-2 rounded-full ${dot === index ? 'w-6 bg-paper' : 'w-2 bg-paper/60'}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
