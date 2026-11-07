import { useEffect, useRef } from 'react';

export default function useStripScroll(ref) {
  const dragged = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const gesture = { active: false, startX: 0, origin: 0, moved: false };

    const down = (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      gesture.active = true;
      gesture.moved = false;
      gesture.startX = event.clientX;
      gesture.origin = node.scrollLeft;
    };
    const move = (event) => {
      if (!gesture.active) return;
      const delta = event.clientX - gesture.startX;
      if (Math.abs(delta) > 6) gesture.moved = true;
      if (gesture.moved) node.scrollLeft = gesture.origin - delta;
    };
    const up = () => {
      gesture.active = false;
      dragged.current = gesture.moved;
    };
    const wheel = (event) => {
      const horizontal = event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY);
      if (!horizontal || node.scrollWidth <= node.clientWidth) return;
      node.scrollLeft += event.deltaX || event.deltaY;
      event.preventDefault();
    };

    node.addEventListener('pointerdown', down);
    node.addEventListener('pointermove', move);
    node.addEventListener('pointerup', up);
    node.addEventListener('pointercancel', up);
    node.addEventListener('wheel', wheel, { passive: false });
    return () => {
      node.removeEventListener('pointerdown', down);
      node.removeEventListener('pointermove', move);
      node.removeEventListener('pointerup', up);
      node.removeEventListener('pointercancel', up);
      node.removeEventListener('wheel', wheel);
    };
  }, [ref]);

  const swallowClick = (event) => {
    if (!dragged.current) return;
    event.preventDefault();
    event.stopPropagation();
    dragged.current = false;
  };

  return swallowClick;
}
