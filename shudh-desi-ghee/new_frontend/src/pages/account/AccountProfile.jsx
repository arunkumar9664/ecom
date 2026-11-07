import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useShop } from '../../hooks/useShop';

const phoneOk = (value) => /^[6-9]\d{9}$/.test(String(value || '').trim());

export default function AccountProfile() {
  const { currentUser, replaceUser } = useShop();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: currentUser?.name || '', phone: currentUser?.phone || '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const dirty = profile.name !== (currentUser?.name || '') || profile.phone !== (currentUser?.phone || '');

  useEffect(() => {
    if (!dirty) return undefined;
    const onLeave = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', onLeave);
    return () => window.removeEventListener('beforeunload', onLeave);
  }, [dirty]);

  const save = async (event) => {
    event.preventDefault();
    const next = {};
    if (!profile.name.trim()) next.name = 'Enter your name.';
    if (!phoneOk(profile.phone)) next.phone = 'Enter a 10-digit mobile number starting with 6, 7, 8, or 9.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      const res = await api.put('/users/me', { name: profile.name.trim(), phone: profile.phone.trim() });
      if (res.data?.user) replaceUser(res.data.user);
      toast.success('Changes saved');
    } catch (err) {
      setErrors({ form: err?.response?.data?.message || 'Could not save your profile.' });
    } finally {
      setBusy(false);
    }
  };

  const go = (to) => {
    if (dirty && !window.confirm('Leave without saving your changes?')) return;
    navigate(to);
  };

  return (
    <form onSubmit={save} noValidate>
      <h2 className="font-heading text-3xl text-ink">Profile</h2>
      <label className="mt-6 block font-body text-sm text-ink">Name
        <input value={profile.name} onChange={(event) => setProfile((c) => ({ ...c, name: event.target.value }))} className="mt-1 h-11 w-full border border-line px-3" aria-invalid={Boolean(errors.name)} />
      </label>
      {errors.name ? <p className="mt-1 font-body text-sm text-terracotta" role="alert">{errors.name}</p> : null}
      <label className="mt-4 block font-body text-sm text-ink">Email
        <input value={currentUser.email || ''} readOnly className="mt-1 h-11 w-full border border-line bg-sand px-3 text-muted" />
      </label>
      <label className="mt-4 block font-body text-sm text-ink">Phone
        <input inputMode="numeric" value={profile.phone} onChange={(event) => setProfile((c) => ({ ...c, phone: event.target.value }))} className="mt-1 h-11 w-full border border-line px-3" aria-invalid={Boolean(errors.phone)} />
      </label>
      {errors.phone ? <p className="mt-1 font-body text-sm text-terracotta" role="alert">{errors.phone}</p> : null}
      {errors.form ? <p className="mt-3 font-body text-sm text-terracotta" role="alert">{errors.form}</p> : null}
      <button type="submit" disabled={busy} className="mt-6 h-11 bg-ink px-5 font-body text-xs tracking-[0.14em] text-paper uppercase disabled:bg-line">{busy ? 'Saving' : 'Save changes'}</button>
      <button type="button" onClick={() => go('/account')} className="mt-4 block font-body text-sm text-muted underline">Back to overview</button>
    </form>
  );
}
