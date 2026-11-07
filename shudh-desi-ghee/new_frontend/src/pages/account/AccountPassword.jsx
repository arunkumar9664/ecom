import { useState } from 'react';
import api from '../../services/api';

export default function AccountPassword() {
  const [fields, setFields] = useState({ current: '', next: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const save = async (event) => {
    event.preventDefault();
    setError('');
    setNote('');
    if (fields.next.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (fields.next !== fields.confirm) {
      setError('The new passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      await api.put('/users/change-password', { currentPassword: fields.current, newPassword: fields.next });
      setNote('Password changed.');
      setFields({ current: '', next: '', confirm: '' });
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not change the password.');
    } finally {
      setBusy(false);
    }
  };

  const type = show ? 'text' : 'password';
  return (
    <form onSubmit={save} noValidate>
      <h2 className="font-heading text-3xl text-ink">Change password</h2>
      <label className="mt-6 block font-body text-sm">Current password
        <input type={type} value={fields.current} onChange={(event) => setFields((c) => ({ ...c, current: event.target.value }))} className="mt-1 h-11 w-full border border-line px-3" autoComplete="current-password" />
      </label>
      <label className="mt-4 block font-body text-sm">New password
        <input type={type} value={fields.next} onChange={(event) => setFields((c) => ({ ...c, next: event.target.value }))} className="mt-1 h-11 w-full border border-line px-3" autoComplete="new-password" />
      </label>
      <label className="mt-4 block font-body text-sm">Confirm new password
        <input type={type} value={fields.confirm} onChange={(event) => setFields((c) => ({ ...c, confirm: event.target.value }))} className="mt-1 h-11 w-full border border-line px-3" autoComplete="new-password" />
      </label>
      <button type="button" onClick={() => setShow((value) => !value)} className="mt-3 min-h-11 font-body text-sm text-ink underline">{show ? 'Hide passwords' : 'Show passwords'}</button>
      {error ? <p className="mt-3 font-body text-sm text-terracotta" role="alert">{error}</p> : null}
      {note ? <p className="mt-3 font-body text-sm text-olive" role="status">{note}</p> : null}
      <button type="submit" disabled={busy} className="mt-4 h-11 bg-ink px-5 font-body text-xs tracking-[0.14em] text-paper uppercase disabled:bg-line">{busy ? 'Saving' : 'Update password'}</button>
    </form>
  );
}
