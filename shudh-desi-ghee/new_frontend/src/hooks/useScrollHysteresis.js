import { useEffect, useRef, useState } from 'react';

export default function useScrollHysteresis({
  topThreshold = 80,
  downThreshold = 24,
  upThreshold = 12,
  minDelta = 4,
} = {}) {
  const [shown, setShown] = useState(true);
  const [scrollY, setScrollY] = useState(() => (typeof window !== 'undefined' ? Math.max(0, window.scrollY) : 0));

  const lastY = useRef(typeof window !== 'undefined' ? Math.max(0, window.scrollY) : 0);
  const anchorY = useRef(typeof window !== 'undefined' ? Math.max(0, window.scrollY) : 0);
  const direction = useRef('up');
  const rafId = useRef(null);
  const activeSwipes = useRef(0);

  useEffect(() => {
    const onTouchStart = (event) => {
      const target = event.target;
      if (!target) return;
      const horizontal = target.closest(
        '[class*="overflow-x"], [style*="overflow-x"], [data-carousel], .no-scrollbar'
      );
      if (horizontal && horizontal.scrollWidth > horizontal.clientWidth + 2) {
        activeSwipes.current += 1;
        document.body.dataset.swiping = '1';
      }
    };

    const onTouchEnd = () => {
      activeSwipes.current = Math.max(0, activeSwipes.current - 1);
      if (activeSwipes.current === 0) {
        delete document.body.dataset.swiping;
      }
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });

    const onScroll = () => {
      if (rafId.current) return;
      rafId.current = window.requestAnimationFrame(() => {
        rafId.current = null;

        // Inhibit completely while swiping a horizontal carousel
        if (document.body.dataset.swiping === '1') {
          return;
        }

        const currentY = Math.max(0, window.scrollY);
        setScrollY(currentY);

        // Always show near the top
        if (currentY < topThreshold) {
          setShown(true);
          lastY.current = currentY;
          anchorY.current = currentY;
          direction.current = 'up';
          return;
        }

        const delta = currentY - lastY.current;

        // Ignore small movements / rubber-banding
        if (Math.abs(delta) < minDelta) {
          return;
        }

        if (delta > 0) {
          // Scrolling down
          if (direction.current !== 'down') {
            direction.current = 'down';
            anchorY.current = currentY;
          }
          if (currentY - anchorY.current > downThreshold) {
            setShown(false);
          }
        } else {
          // Scrolling up
          if (direction.current !== 'up') {
            direction.current = 'up';
            anchorY.current = currentY;
          }
          if (anchorY.current - currentY > upThreshold) {
            setShown(true);
          }
        }

        lastY.current = currentY;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      if (rafId.current) window.cancelAnimationFrame(rafId.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      delete document.body.dataset.swiping;
    };
  }, [topThreshold, downThreshold, upThreshold, minDelta]);

  return { shown, scrollY };
}
