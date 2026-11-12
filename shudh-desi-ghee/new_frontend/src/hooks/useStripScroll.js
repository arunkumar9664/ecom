import { useEffect, useRef } from 'react';

function attach(node, dragged) {
  const gesture = { active: false, startX: 0, origin: 0, moved: false, snap: '', holding: false, wheelTimer: 0 };

  const holdSnap = () => {
    if (!gesture.holding) {
      gesture.snap = node.style.scrollSnapType;
      gesture.holding = true;
    }
    node.style.scrollSnapType = 'none';
  };
  const releaseSnap = () => {
    if (!gesture.holding) return;
    node.style.scrollSnapType = gesture.snap;
    gesture.holding = false;
  };

  const down = (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    if (node.scrollWidth <= node.clientWidth + 1) return;
    window.clearTimeout(gesture.wheelTimer);
    gesture.active = true;
    gesture.moved = false;
    gesture.startX = event.clientX;
    gesture.origin = node.scrollLeft;
  };
  const move = (event) => {
    if (!gesture.active) return;
    const delta = event.clientX - gesture.startX;
    if (Math.abs(delta) <= 8) return;
    if (!gesture.moved) holdSnap();
    gesture.moved = true;
    node.scrollLeft = gesture.origin - delta;
  };
  const up = () => {
    if (!gesture.active) return;
    gesture.active = false;
    releaseSnap();
    dragged.current = gesture.moved;
  };
  const wheel = (event) => {
    const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
    if (!horizontal || node.scrollWidth <= node.clientWidth + 1) return;
    const atStart = node.scrollLeft <= 0;
    const atEnd = node.scrollLeft + node.clientWidth >= node.scrollWidth - 1;
    if ((event.deltaX < 0 && atStart) || (event.deltaX > 0 && atEnd)) return;
    holdSnap();
    node.scrollLeft += event.deltaX;
    event.preventDefault();
    window.clearTimeout(gesture.wheelTimer);
    gesture.wheelTimer = window.setTimeout(releaseSnap, 140);
  };

  node.addEventListener('pointerdown', down);
  node.addEventListener('pointermove', move);
  node.addEventListener('pointerup', up);
  node.addEventListener('pointercancel', up);
  node.addEventListener('wheel', wheel, { passive: false });
  return () => {
    window.clearTimeout(gesture.wheelTimer);
    releaseSnap();
    node.removeEventListener('pointerdown', down);
    node.removeEventListener('pointermove', move);
    node.removeEventListener('pointerup', up);
    node.removeEventListener('pointercancel', up);
    node.removeEventListener('wheel', wheel);
  };
}

export default function useStripScroll(ref) {
  const dragged = useRef(false);
  const boundNode = useRef(null);
  const stop = useRef(null);

  useEffect(() => () => {
    stop.current?.();
    stop.current = null;
    boundNode.current = null;
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (node === boundNode.current) return;
    stop.current?.();
    boundNode.current = node;
    stop.current = node ? attach(node, dragged) : null;
  });

  const swallowClick = (event) => {
    if (!dragged.current) return;
    event.preventDefault();
    event.stopPropagation();
    dragged.current = false;
  };

  return swallowClick;
}
