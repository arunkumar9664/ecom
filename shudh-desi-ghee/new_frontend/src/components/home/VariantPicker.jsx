import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { labels } from '../../config/labels';
import { variantChoices } from '../../utils/collections';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export default function VariantPicker({ product, onClose, onConfirm }) {
  const { colors, sizes } = variantChoices(product);
  const [colorName, setColorName] = useState(colors[0].name);
  const [size, setSize] = useState(sizes[0]);
  const titleId = useId();
  const narrow = useMediaQuery('(max-width: 767px)');
  const color = colors.find((entry) => entry.name === colorName) || colors[0];

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const panel = (
    <div className={narrow ? 'fixed inset-x-0 bottom-0 z-[80] max-h-[80vh] overflow-y-auto bg-paper px-5 pt-5 pb-8 shadow-[0_-12px_40px_rgba(43,38,32,0.16)]' : 'fixed top-1/2 left-1/2 z-[80] w-[min(100%-2rem,22rem)] -translate-x-1/2 -translate-y-1/2 bg-paper p-5 shadow-xl'}>
      <h2 id={titleId} className="font-heading text-2xl text-ink">{product.name}</h2>
      <fieldset className="mt-4">
        <legend className="font-body text-xs tracking-[0.14em] text-muted uppercase">{labels.variant}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {colors.map((entry) => (
            <button
              key={entry.name}
              type="button"
              aria-pressed={entry.name === colorName}
              onClick={() => setColorName(entry.name)}
              className={`border px-3 py-2 font-body text-sm ${entry.name === colorName ? 'border-ink text-ink' : 'border-line text-muted'}`}
            >
              {entry.name}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="mt-4">
        <legend className="font-body text-xs tracking-[0.14em] text-muted uppercase">{labels.size}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {sizes.map((entry) => (
            <button
              key={entry}
              type="button"
              aria-pressed={entry === size}
              onClick={() => setSize(entry)}
              className={`border px-3 py-2 font-body text-sm ${entry === size ? 'border-ink text-ink' : 'border-line text-muted'}`}
            >
              {entry}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="mt-6 flex gap-3">
        <button type="button" onClick={onClose} className="h-11 flex-1 border border-line font-body text-sm">
          Cancel
        </button>
        <button
          type="button"
          className="h-11 flex-1 border border-ink font-body text-sm"
          onClick={() => {
            const chosenColor = String(color?.name || '').trim();
            const chosenSize = String(size || '').trim();
            if (!chosenColor || !chosenSize) return;
            onConfirm({ name: chosenColor, hex: color.hex }, chosenSize);
          }}
        >
          Add to Bag
        </button>
      </div>
    </div>
  );

  return createPortal(
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Close options" onClick={onClose} />
      {panel}
    </div>,
    document.body
  );
}
