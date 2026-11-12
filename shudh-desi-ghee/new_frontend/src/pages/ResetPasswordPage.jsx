import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useShop } from '../hooks/useShop';
import { MOCK_SIGNIN_MESSAGE } from '../config/brand';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function ResetPasswordPage() {
  const { useMockData } = useShop();
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  useDocumentTitle('Reset password', 'Choose a new password for your Field & Hearth account.');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setNote('');
    if (useMockData) {
      setError(MOCK_SIGNIN_MESSAGE);
      return;
    }
    if (!token) {
      setError('This link is missing a token.');
      return;
    }
    if (password.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    setBusy(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword: password });
      setNote('Password updated. You can sign in.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not reset the password.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="font-heading text-4xl text-ink">Reset password</h1>
      {useMockData ? <p className="mt-4 font-body text-sm text-terracotta">{MOCK_SIGNIN_MESSAGE}</p> : null}
      <form onSubmit={submit} className="mt-6 bg-white p-6" noValidate>
        <label htmlFor="new-password" className="font-body text-sm">New password
          <input id="new-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 h-11 w-full border border-line px-3" />
        </label>
        {error ? <p className="mt-3 font-body text-sm text-terracotta" role="alert">{error}</p> : null}
        {note ? <p className="mt-3 font-body text-sm text-olive" role="status">{note}</p> : null}
        <button type="submit" disabled={busy || useMockData} className="mt-4 h-11 w-full bg-olive font-body text-xs tracking-[0.14em] text-paper uppercase disabled:bg-line">{busy ? 'Please wait' : 'Update password'}</button>
      </form>
      <Link to="/login" className="mt-4 inline-block font-body text-sm underline">Back to sign in</Link>
    </main>
  );
}
