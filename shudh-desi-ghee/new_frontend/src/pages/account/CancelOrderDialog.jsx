import { useRef, useState } from 'react';
import useFocusTrap from '../../hooks/useFocusTrap';

const REASONS = ['Ordered by mistake', 'Found a better price', 'Delivery is too slow', 'Other'];

export default function CancelOrderDialog({ onClose, onConfirm, busy }) {
  const ref = useRef(null);
  const [reason, setReason] = useState(REASONS[0]);
  const [other, setOther] = useState('');
  const [error, setError] = useState('');
  useFocusTrap(true, ref, onClose);

  const submit = (event) => {
    event.preventDefault();
    const text = reason === 'Other' ? other.trim() : reason;
    if (!text) {
      setError('Tell us a little more.');
      return;
    }
    onConfirm(text);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/40 p-4 sm:items-center">
      <form ref={ref} role="dialog" aria-modal="true" aria-labelledby="cancel-title" onSubmit={submit} className="w-full max-w-md rounded-[4px] bg-paper p-6 shadow-[0_16px_40px_rgba(43,38,32,0.16)]">
        <h2 id="cancel-title" className="font-heading text-2xl text-ink">Cancel order</h2>
        <fieldset className="mt-4 space-y-2">
          <legend className="font-body text-sm text-muted">Reason</legend>
          {REASONS.map((entry) => (
            <label key={entry} className="flex min-h-11 items-center gap-2 font-body text-sm">
              <input type="radio" name="reason" checked={reason === entry} onChange={() => setReason(entry)} />
              {entry}
            </label>
          ))}
        </fieldset>
        {reason === 'Other' ? (
          <textarea value={other} onChange={(event) => setOther(event.target.value)} className="mt-3 w-full border border-line px-3 py-2 font-body text-sm" rows={3} aria-label="Other reason" />
        ) : null}
        {error ? <p className="mt-2 font-body text-sm text-terracotta" role="alert">{error}</p> : null}
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} className="h-11 flex-1 border border-ink font-body text-xs tracking-[0.14em] uppercase">Back</button>
          <button type="submit" disabled={busy} className="h-11 flex-1 bg-ink font-body text-xs tracking-[0.14em] text-paper uppercase disabled:bg-line">{busy ? 'Cancelling' : 'Cancel order'}</button>
        </div>
      </form>
    </div>
  );
}
