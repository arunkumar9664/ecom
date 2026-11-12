import { useRef, useState } from 'react';
import { labels } from '../../config/labels';
import { scentLinks } from '../../config/nav';
import useFocusTrap from '../../hooks/useFocusTrap';
import { IconClose } from '../shell/icons';

const PRESETS = [
  { id: 'under-500', label: 'Under ₹500', min: '', max: '500' },
  { id: 'mid', label: '₹500–₹1,500', min: '500', max: '1500' },
  { id: 'over', label: '₹1,500 and up', min: '1500', max: '' },
];

function Chip({ pressed, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`rounded-[4px] border px-3 py-1.5 font-body text-sm ${pressed ? 'border-olive bg-olive text-paper' : 'border-ink bg-white text-ink'}`}
    >
      {children}
    </button>
  );
}

export default function FilterDrawer({ open, onClose, applied, sizes, categories, onApply }) {
  const panel = useRef(null);
  const [draft, setDraft] = useState(applied);
  const [synced, setSynced] = useState(false);
  useFocusTrap(open, panel, onClose);
  if (open && !synced) {
    setSynced(true);
    setDraft(applied);
  }
  if (!open && synced) setSynced(false);

  if (!open) return null;

  const presetId = PRESETS.find((item) => item.min === draft.min && item.max === draft.max)?.id || '';

  return (
    <div className="fixed inset-0 z-[80]">
      <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Close filters" onClick={onClose} />
      <div ref={panel} role="dialog" aria-modal="true" aria-label="Filters" className="absolute inset-y-0 right-0 flex w-full flex-col bg-white shadow-xl md:w-[clamp(340px,30vw,440px)]">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-heading text-2xl text-ink">Filters</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="p-1 text-ink">
            <IconClose className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-2">
          <section className="border-b border-line py-5">
            <h3 className="font-heading text-xl text-ink">Price</h3>
            <div className="mt-3 flex gap-3">
              <label className="flex-1 font-body text-xs text-muted">
                Min
                <input inputMode="numeric" value={draft.min} onChange={(event) => setDraft((current) => ({ ...current, min: event.target.value }))} className="mt-1 h-10 w-full rounded-[4px] border border-line bg-white px-3 font-body text-sm text-ink" />
              </label>
              <label className="flex-1 font-body text-xs text-muted">
                Max
                <input inputMode="numeric" value={draft.max} onChange={(event) => setDraft((current) => ({ ...current, max: event.target.value }))} className="mt-1 h-10 w-full rounded-[4px] border border-line bg-white px-3 font-body text-sm text-ink" />
              </label>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {PRESETS.map((item) => (
                <Chip key={item.id} pressed={presetId === item.id} onClick={() => setDraft((current) => ({ ...current, min: item.min, max: item.max }))}>
                  {item.label}
                </Chip>
              ))}
            </div>
          </section>
          <section className="border-b border-line py-5">
            <h3 className="font-heading text-xl text-ink">{labels.size}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {sizes.map((size) => (
                <Chip key={size} pressed={draft.size === size} onClick={() => setDraft((current) => ({ ...current, size: current.size === size ? '' : size }))}>
                  {size}
                </Chip>
              ))}
            </div>
          </section>
          <section className="border-b border-line py-5">
            <h3 className="font-heading text-xl text-ink">Category</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {(categories || []).filter((category) => category?.slug).map((category) => (
                <Chip key={category.slug} pressed={draft.category === category.slug} onClick={() => setDraft((current) => ({ ...current, category: current.category === category.slug ? '' : category.slug }))}>
                  {category.name}
                </Chip>
              ))}
            </div>
          </section>
          <section className="py-5">
            <h3 className="font-heading text-xl text-ink">Scent / Material</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {scentLinks.map((link) => {
                const term = new URLSearchParams(link.to.split('?')[1] || '').get('search') || '';
                return (
                  <Chip key={link.label} pressed={draft.search === term} onClick={() => setDraft((current) => ({ ...current, search: current.search === term ? '' : term }))}>
                    {link.label}
                  </Chip>
                );
              })}
            </div>
          </section>
        </div>
        <div className="grid grid-cols-2 border-t border-line">
          <button type="button" onClick={() => setDraft({ min: '', max: '', size: '', search: '', category: '' })} className="h-14 border border-ink bg-white font-body text-sm tracking-[0.12em] text-ink uppercase">
            Reset
          </button>
          <button type="button" onClick={() => onApply(draft)} className="h-14 bg-ink font-body text-sm tracking-[0.12em] text-paper uppercase">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
