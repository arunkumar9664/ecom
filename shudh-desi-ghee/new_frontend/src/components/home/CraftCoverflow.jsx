import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SafeImage from '../SafeImage';
import { craftStories } from '../../data/homeStories';
import { IconChevron } from '../shell/icons';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';

export default function CraftCoverflow() {
  const [index, setIndex] = useState(0);
  const [live, setLive] = useState('');
  const count = craftStories.length;
  const reduce = usePrefersReducedMotion();
  const drag = useRef({ x: 0, moved: false, active: false });
  const stage = useRef(null);
  const indexRef = useRef(0);
  const wheelLock = useRef(false);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    const node = stage.current;
    if (!node) return undefined;
    const step = (next) => {
      const value = Math.max(0, Math.min(count - 1, next));
      setIndex(value);
      const story = craftStories[value];
      if (story) setLive(`${story.title}, slide ${value + 1} of ${count}`);
    };
    const onWheel = (event) => {
      const horizontal = event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY);
      if (!horizontal || wheelLock.current) return;
      event.preventDefault();
      wheelLock.current = true;
      window.setTimeout(() => { wheelLock.current = false; }, 350);
      const current = indexRef.current;
      if (event.deltaX > 0 || (event.shiftKey && event.deltaY > 0)) step(current + 1);
      if (event.deltaX < 0 || (event.shiftKey && event.deltaY < 0)) step(current - 1);
    };
    node.addEventListener('wheel', onWheel, { passive: false });
    return () => node.removeEventListener('wheel', onWheel);
  }, [count]);

  if (!count) return null;

  const go = (next) => {
    const value = Math.max(0, Math.min(count - 1, next));
    setIndex(value);
    const story = craftStories[value];
    setLive(`${story.title}, slide ${value + 1} of ${count}`);
  };

  const onPointerDown = (event) => {
    if (event.isPrimary === false || (event.pointerType === 'mouse' && event.button !== 0)) return;
    drag.current = {
      startX: event.clientX,
      startY: event.clientY,
      pointerId: event.pointerId,
      active: true,
      captured: false,
      moved: false,
    };
  };

  const onPointerMove = (event) => {
    const d = drag.current;
    if (!d.active || d.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - d.startX;
    const deltaY = event.clientY - d.startY;

    if (!d.captured) {
      if (Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY)) {
        d.captured = true;
        d.moved = true;
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          // pointer capture unsupported or blocked
        }
      } else if (Math.abs(deltaY) > 8) {
        d.active = false;
        return;
      }
    }

    if (d.captured) {
      d.moved = true;
    }
  };

  const endDrag = (event) => {
    const d = drag.current;
    if (!d.active || d.pointerId !== event.pointerId) return;
    d.active = false;
    if (d.captured) {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        // ignore
      }
      d.captured = false;
      const deltaX = event.clientX - d.startX;
      if (deltaX > 40) {
        go(indexRef.current - 1);
      } else if (deltaX < -40) {
        go(indexRef.current + 1);
      }
    }
  };

  const onPointerCancel = (event) => {
    const d = drag.current;
    if (d.captured && d.pointerId != null) {
      try {
        event.currentTarget.releasePointerCapture(d.pointerId);
      } catch {
        // ignore
      }
    }
    drag.current = { startX: 0, startY: 0, active: false, captured: false, moved: false, pointerId: null };
  };

  const onClickCapture = (event) => {
    if (drag.current.moved) {
      event.preventDefault();
      event.stopPropagation();
      window.setTimeout(() => {
        drag.current.moved = false;
      }, 60);
    }
  };

  return (
    <section aria-roledescription="carousel" aria-label="Behind the Craft" className="overflow-hidden bg-sand px-gutter py-14 md:py-16">
      <h2 className="text-center font-heading text-[26px] text-ink min-[1000px]:text-[32px]">Behind the Craft</h2>
      <p className="sr-only" aria-live="polite">{live}</p>
      <div
        ref={stage}
        tabIndex={0}
        style={{ touchAction: 'pan-y', userSelect: 'none', WebkitUserSelect: 'none' }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') go(index - 1);
          if (event.key === 'ArrowRight') go(index + 1);
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={onPointerCancel}
        onClickCapture={onClickCapture}
        className="relative mx-auto mt-8 h-[min(148vw,760px)] w-full max-w-[720px] outline-none select-none"
      >
        {craftStories.map((story, dot) => {
          const delta = dot - index;
          if (Math.abs(delta) > 2) return null;
          const scale = delta === 0 ? 1 : 0.94 ** Math.abs(delta);
          const centre = delta === 0;
          return (
            <article
              key={story.id}
              aria-hidden={!centre}
              aria-label={story.title}
              className={`absolute top-0 left-1/2 h-full w-[min(68vw,390px)] overflow-hidden rounded-[14px] ${centre ? 'shadow-[0_22px_50px_rgba(43,38,32,0.22)]' : ''} ${reduce ? '' : 'transition-transform duration-500'}`}
              style={{
                zIndex: 10 - Math.abs(delta),
                transform: `translateX(calc(-50% + ${delta * 52}px)) scale(${scale})`,
                filter: centre ? 'none' : 'brightness(0.55)',
              }}
            >
              {!centre ? (
                <button type="button" className="absolute inset-0 z-10" aria-label={`Show ${story.title}`} onClick={() => go(dot)} />
              ) : null}
              <SafeImage src={story.image} alt="" draggable={false} className="h-full w-full object-cover select-none pointer-events-none" />
              {centre ? (
                <>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-6 pt-24 pb-24 text-white">
                    <h3 className="font-heading text-[28px] leading-none min-[1000px]:text-[34px]">{story.title}</h3>
                    <p className="mt-3 line-clamp-3 font-body text-[15px] leading-relaxed text-white/90">{story.text}</p>
                  </div>
                  <Link to="/journal" draggable={false} className="absolute bottom-5 left-1/2 flex h-[42px] w-[min(275px,calc(100%-2.5rem))] -translate-x-1/2 items-center justify-center rounded-[4px] bg-white font-body text-sm font-semibold text-ink shadow-sm">
                    Explore More
                  </Link>
                </>
              ) : null}
            </article>
          );
        })}
        {index > 0 ? (
          <button type="button" aria-label="Previous story" onClick={() => go(index - 1)} className="absolute top-1/2 left-0 z-20 flex h-[50px] w-[50px] -translate-y-1/2 items-center justify-center rounded-full bg-[#444] text-white shadow-md">
            <IconChevron className="h-5 w-5 rotate-180" />
          </button>
        ) : null}
        {index < count - 1 ? (
          <button type="button" aria-label="Next story" onClick={() => go(index + 1)} className="absolute top-1/2 right-0 z-20 flex h-[50px] w-[50px] -translate-y-1/2 items-center justify-center rounded-full bg-[#444] text-white shadow-md">
            <IconChevron className="h-5 w-5" />
          </button>
        ) : null}
      </div>
      <div className="mt-6 flex justify-center gap-2" aria-hidden="true">
        {craftStories.map((story, dot) => (
          <span key={story.id} className={`h-1.5 rounded-full ${dot === index ? 'w-6 bg-ink' : 'w-1.5 bg-ink/25'}`} />
        ))}
      </div>
    </section>
  );
}
