import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import api from '../../services/api';
import { useShop } from '../../hooks/useShop';
import { googleClientId, MOCK_SIGNIN_MESSAGE } from '../../config/brand';

const emailOk = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const phoneOk = (value) => /^[6-9]\d{9}$/.test(value);

export default function AuthForm({ initialTab = 'login', onDone }) {
  const { useMockData, loginWithEmail, registerWithEmail, loginWithGoogle } = useShop();
  const [tab, setTab] = useState(initialTab === 'register' ? 'register' : initialTab === 'forgot' ? 'forgot' : 'login');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [fields, setFields] = useState({ name: '', email: '', phone: '', password: '' });
  const [invalid, setInvalid] = useState({});

  const set = (key) => (event) => {
    setFields((current) => ({ ...current, [key]: event.target.value }));
    setInvalid((current) => ({ ...current, [key]: '' }));
  };

  const validate = () => {
    const next = {};
    if (tab !== 'forgot' && fields.password.trim().length < 6) next.password = 'Use at least 6 characters.';
    if (!emailOk(fields.email.trim())) next.email = 'Enter a valid email address.';
    if (tab === 'register') {
      if (!fields.name.trim()) next.name = 'Enter your name.';
      if (!phoneOk(fields.phone.trim())) next.phone = 'Enter a 10-digit mobile number starting with 6, 7, 8, or 9.';
    }
    setInvalid(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');
    if (useMockData) {
      setError(MOCK_SIGNIN_MESSAGE);
      return;
    }
    if (!validate()) return;
    setBusy(true);
    try {
      if (tab === 'forgot') {
        await api.post('/auth/forgot-password', { email: fields.email.trim() });
        setNotice('If that address has a password, a reset link is on its way.');
      } else if (tab === 'register') {
        await registerWithEmail(fields.name.trim(), fields.email.trim(), fields.phone.trim(), fields.password);
        onDone?.();
      } else {
        await loginWithEmail(fields.email.trim(), fields.password, true);
        onDone?.();
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      {useMockData ? <p className="mb-4 font-body text-sm text-terracotta" role="status">{MOCK_SIGNIN_MESSAGE}</p> : null}
      <div className="mb-4 flex gap-4 font-body text-sm">
        <button type="button" className={tab === 'login' ? 'font-bold text-ink underline' : 'text-muted'} onClick={() => setTab('login')}>Sign in</button>
        <button type="button" className={tab === 'register' ? 'font-bold text-ink underline' : 'text-muted'} onClick={() => setTab('register')}>Register</button>
      </div>
      <form onSubmit={submit} className="space-y-3" noValidate>
        {tab === 'register' ? (
          <Field label="Name" value={fields.name} onChange={set('name')} error={invalid.name} autoComplete="name" />
        ) : null}
        <Field label="Email" type="email" value={fields.email} onChange={set('email')} error={invalid.email} autoComplete="email" />
        {tab === 'register' ? (
          <Field label="Phone" value={fields.phone} onChange={set('phone')} error={invalid.phone} autoComplete="tel" inputMode="numeric" />
        ) : null}
        {tab !== 'forgot' ? (
          <Field label="Password" type="password" value={fields.password} onChange={set('password')} error={invalid.password} autoComplete={tab === 'register' ? 'new-password' : 'current-password'} />
        ) : null}
        {error ? <p className="font-body text-sm text-terracotta" role="alert">{error}</p> : null}
        {notice ? <p className="font-body text-sm text-olive" role="status">{notice}</p> : null}
        <button type="submit" disabled={busy || useMockData} className="h-12 w-full bg-olive font-body text-xs tracking-[0.14em] text-paper uppercase disabled:bg-line">
          {busy ? 'Please wait' : tab === 'forgot' ? 'Send reset link' : tab === 'register' ? 'Create account' : 'Sign in'}
        </button>
      </form>
      {tab === 'login' ? (
        <button type="button" className="mt-3 font-body text-sm text-ink underline" onClick={() => { setTab('forgot'); setError(''); }}>
          Forgot password
        </button>
      ) : null}
      {googleClientId && tab !== 'forgot' ? (
        <div className="mt-4">
          <GoogleLogin
            onSuccess={(response) => {
              if (!response.credential || useMockData) return;
              setBusy(true);
              loginWithGoogle(response.credential).then(() => onDone?.()).catch((err) => {
                setError(err?.message || 'Google sign-in failed.');
              }).finally(() => setBusy(false));
            }}
            onError={() => setError('Google sign-in failed.')}
          />
        </div>
      ) : null}
      <p className="mt-4 font-body text-xs text-muted">
        <Link to="/reset-password" className="underline">Have a reset link?</Link>
      </p>
    </div>
  );
}

function Field({ label, error, ...props }) {
  const id = `auth-${label.toLowerCase()}`;
  return (
    <label htmlFor={id} className="block font-body text-sm text-ink">
      {label}
      <input id={id} {...props} className="mt-1 h-11 w-full border border-line bg-white px-3 font-body text-sm text-ink" />
      {error ? <span className="mt-1 block text-xs text-terracotta" role="alert">{error}</span> : null}
    </label>
  );
}
