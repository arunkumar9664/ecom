import { useEffect } from 'react';

export default function useFocusTrap(open, nodeRef, onClose) {
  useEffect(() => {
    if (!open) return undefined;
    const node = nodeRef.current;
    if (!node) return undefined;
    const previous = document.activeElement;
    const focusable = () => [...node.querySelectorAll('button, a, input, select, textarea')].filter((el) => !el.disabled);
    focusable()[0]?.focus();
    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose?.();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      previous?.focus?.();
    };
  }, [open, nodeRef, onClose]);
}
