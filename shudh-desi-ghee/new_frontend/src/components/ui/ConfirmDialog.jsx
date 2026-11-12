import { useRef } from 'react';
import useFocusTrap from '../../hooks/useFocusTrap';

export default function ConfirmDialog({ title, body, confirmLabel = 'Confirm', onConfirm, onClose, busy = false }) {
  const ref = useRef(null);
  useFocusTrap(true, ref, onClose);
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/40 p-4 sm:items-center" role="presentation">
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="confirm-title" className="w-full max-w-md rounded-[4px] bg-paper p-6 shadow-[0_16px_40px_rgba(43,38,32,0.16)]">
        <h2 id="confirm-title" className="font-heading text-2xl text-ink">{title}</h2>
        <p className="mt-2 font-body text-sm leading-relaxed text-muted">{body}</p>
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} className="h-11 flex-1 border border-ink font-body text-xs tracking-[0.14em] text-ink uppercase">Back</button>
          <button type="button" disabled={busy} onClick={onConfirm} className="h-11 flex-1 bg-ink font-body text-xs tracking-[0.14em] text-paper uppercase disabled:bg-line">{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
