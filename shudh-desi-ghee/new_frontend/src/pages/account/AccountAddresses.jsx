import { useEffect, useState } from 'react';
import api from '../../services/api';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

const empty = { fullName: '', phone: '', street: '', city: '', state: '', pincode: '' };
const phoneOk = (value) => /^[6-9]\d{9}$/.test(String(value || '').trim());

export default function AccountAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [formError, setFormError] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = () => {
    setStatus('loading');
    api.get('/addresses').then((res) => {
      setAddresses(res.data?.addresses || []);
      setError('');
      setStatus('ready');
    }).catch((err) => {
      setError(err?.response?.data?.message || 'Could not load addresses');
      setStatus('error');
    });
  };

  useEffect(() => {
    const gate = { current: false };
    api.get('/addresses').then((res) => {
      if (gate.current) return;
      setAddresses(res.data?.addresses || []);
      setStatus('ready');
    }).catch((err) => {
      if (gate.current) return;
      setError(err?.response?.data?.message || 'Could not load addresses');
      setStatus('error');
    });
    return () => {
      gate.current = true;
    };
  }, []);

  const save = async (event) => {
    event.preventDefault();
    setFormError('');
    if (!form.fullName || !form.street || !form.city || !form.state || !form.pincode) {
      setFormError('Fill in every address field.');
      return;
    }
    if (!phoneOk(form.phone)) {
      setFormError('Enter a 10-digit mobile number starting with 6, 7, 8, or 9.');
      return;
    }
    setBusy(true);
    try {
      const payload = { ...form, phone: form.phone.trim() };
      if (editing?.id) await api.put(`/addresses/${editing.id}`, payload);
      else await api.post('/addresses', payload);
      setEditing(null);
      setForm(empty);
      load();
    } catch (err) {
      setFormError(err?.response?.data?.message || 'Could not save the address.');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!pendingDelete) return;
    setBusy(true);
    try {
      await api.delete(`/addresses/${pendingDelete.id}`);
      setAddresses((list) => list.filter((entry) => entry.id !== pendingDelete.id));
      setPendingDelete(null);
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not delete the address.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h2 className="font-heading text-3xl text-ink">Addresses</h2>
      {status === 'loading' ? <p className="mt-4 font-body text-sm text-muted">Loading addresses…</p> : null}
      {error ? (
        <p className="mt-4 font-body text-sm text-terracotta" role="alert">
          {error} <button type="button" className="underline" onClick={load}>Retry</button>
        </p>
      ) : null}
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {addresses.map((entry) => (
          <li key={entry.id} className="border border-line p-4">
            <p className="font-body text-sm font-semibold text-ink">{entry.fullName}</p>
            <p className="mt-1 font-body text-sm text-muted">{entry.street}</p>
            <p className="font-body text-sm text-muted">{entry.city}, {entry.state} {entry.pincode}</p>
            <p className="mt-1 font-body text-sm text-ink">{entry.phone}</p>
            <div className="mt-3 flex gap-4">
              <button type="button" className="min-h-11 font-body text-sm underline" onClick={() => { setEditing(entry); setForm({ ...empty, ...entry }); }}>Edit</button>
              <button type="button" className="min-h-11 font-body text-sm underline" onClick={() => setPendingDelete(entry)}>Delete</button>
            </div>
          </li>
        ))}
        <li>
          <button type="button" onClick={() => { setEditing(null); setForm(empty); }} className="flex min-h-36 w-full items-center justify-center border border-dashed border-line font-body text-sm text-muted">
            Add new address
          </button>
        </li>
      </ul>
      <form onSubmit={save} className="mt-8 grid gap-3 sm:grid-cols-2" noValidate>
        <h3 className="font-heading text-2xl text-ink sm:col-span-2">{editing?.id ? 'Edit address' : 'New address'}</h3>
        {['fullName', 'phone', 'street', 'city', 'state', 'pincode'].map((key) => (
          <label key={key} className="font-body text-sm capitalize text-ink">{key}
            <input value={form[key] || ''} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} className="mt-1 h-11 w-full border border-line px-3" />
          </label>
        ))}
        {formError ? <p className="font-body text-sm text-terracotta sm:col-span-2" role="alert">{formError}</p> : null}
        <button type="submit" disabled={busy} className="h-11 bg-ink font-body text-xs tracking-[0.14em] text-paper uppercase disabled:bg-line sm:col-span-2">{busy ? 'Saving' : 'Save address'}</button>
      </form>
      {pendingDelete ? (
        <ConfirmDialog
          title="Delete this address?"
          body={`${pendingDelete.fullName}, ${pendingDelete.city}`}
          confirmLabel={busy ? 'Deleting' : 'Delete'}
          busy={busy}
          onConfirm={remove}
          onClose={() => setPendingDelete(null)}
        />
      ) : null}
    </div>
  );
}
