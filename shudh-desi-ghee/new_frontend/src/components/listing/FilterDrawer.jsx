import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { labels } from '../../config/labels';
import { scentLinks } from '../../config/nav';

export default function FilterDrawer({ open, onClose, price, setPrice, onApplyPrice, sizes, activeSize, onSize, scentTo }) {
  const panel = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const node = panel.current;
    const previous = document.activeElement;
    const focusable = () => [...node.querySelectorAll('button, a, input, select, textarea')].filter((el) => !el.disabled);
    focusable()[0]?.focus();
    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
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
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Filters">
      <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Close filters" onClick={onClose} />
      <div ref={panel} className="absolute inset-y-0 right-0 flex w-[min(100%,22rem)] flex-col bg-paper shadow-xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-heading text-2xl text-ink">Filter</h2>
          <button type="button" onClick={onClose} className="font-body text-sm text-ink">Close</button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <fieldset>
            <legend className="font-body text-xs tracking-[0.16em] text-muted uppercase">Price</legend>
            <div className="mt-3 flex gap-3">
              <label className="flex-1 font-body text-xs text-muted">
                Min
                <input
                  inputMode="numeric"
                  value={price.min}
                  onChange={(event) => setPrice((current) => ({ ...current, min: event.target.value }))}
                  className="mt-1 h-11 w-full border border-line bg-white px-3 font-body text-sm text-ink"
                />
              </label>
              <label className="flex-1 font-body text-xs text-muted">
                Max
                <input
                  inputMode="numeric"
                  value={price.max}
                  onChange={(event) => setPrice((current) => ({ ...current, max: event.target.value }))}
                  className="mt-1 h-11 w-full border border-line bg-white px-3 font-body text-sm text-ink"
                />
              </label>
            </div>
            <button type="button" onClick={onApplyPrice} className="mt-3 h-10 border border-ink px-4 font-body text-xs tracking-[0.14em] text-ink uppercase">
              Apply price
            </button>
          </fieldset>

          <fieldset className="mt-8">
            <legend className="font-body text-xs tracking-[0.16em] text-muted uppercase">{labels.size}</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" aria-pressed={!activeSize} onClick={() => onSize('')} className={`border px-3 py-2 font-body text-sm ${activeSize ? 'border-line text-muted' : 'border-ink text-ink'}`}>
                Any
              </button>
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  aria-pressed={activeSize === size}
                  onClick={() => onSize(size)}
                  className={`border px-3 py-2 font-body text-sm ${activeSize === size ? 'border-ink text-ink' : 'border-line text-muted'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-8">
            <h3 className="font-body text-xs tracking-[0.16em] text-muted uppercase">By scent / material</h3>
            <ul className="mt-3 space-y-2">
              {scentLinks.map((link) => (
                <li key={link.label}>
                  <Link to={scentTo(link)} onClick={onClose} className="font-body text-sm text-ink underline-offset-4 hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
