import { useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import api from '../services/api';
import { useShop } from '../hooks/useShop';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { catalogImages } from '../config/media';
import { googleClientId, MOCK_SIGNIN_MESSAGE } from '../config/brand';

const emailOk = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const phoneOk = (value) => /^[6-9]\d{9}$/.test(value);

export default function LoginPage({ tab = 'login' }) {
  const { currentUser, useMockData, loginWithEmail, registerWithEmail, loginWithGoogle } = useShop();
  const register = tab === 'register';
  const [mode, setMode] = useState(register ? 'register' : 'login');
  const [seenTab, setSeenTab] = useState(tab);
  if (seenTab !== tab) {
    setSeenTab(tab);
    setMode(tab === 'register' ? 'register' : 'login');
  }
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [fields, setFields] = useState({ name: '', email: '', phone: '', password: '' });
  const [invalid, setInvalid] = useState({});
  const [params] = useSearchParams();
  useDocumentTitle(register ? 'Register' : 'Sign in', 'Sign in to Field & Hearth.');
  const next = params.get('next');
  const dest = next && next.startsWith('/') && !next.startsWith('//') ? next : '/account';
  if (currentUser) return <Navigate to={dest} replace />;

  const set = (key) => (event) => {
    setFields((current) => ({ ...current, [key]: event.target.value }));
    setInvalid((current) => ({ ...current, [key]: '' }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');
    if (useMockData) {
      setError(MOCK_SIGNIN_MESSAGE);
      return;
    }
    const next = {};
    if (mode !== 'forgot' && fields.password.trim().length < 6) next.password = 'Use at least 6 characters.';
    if (!emailOk(fields.email.trim())) next.email = 'Enter a valid email address.';
    if (mode === 'register') {
      if (!fields.name.trim()) next.name = 'Enter your name.';
      if (!phoneOk(fields.phone.trim())) next.phone = 'Enter a 10-digit mobile number starting with 6, 7, 8, or 9.';
    }
    setInvalid(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      if (mode === 'forgot') {
        await api.post('/auth/forgot-password', { email: fields.email.trim() });
        setNotice('If that address has a password, a reset link is on its way.');
      } else if (mode === 'register') {
        await registerWithEmail(fields.name.trim(), fields.email.trim(), fields.phone.trim(), fields.password);
      } else {
        await loginWithEmail(fields.email.trim(), fields.password, true);
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="relative flex min-h-[70vh] items-center justify-center px-4 py-12">
      <img src={catalogImages.hero1} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-olive/45" aria-hidden="true" />
      <div className="relative grid w-[min(80vw,1100px)] overflow-hidden rounded-[8px] bg-white shadow-[0_18px_50px_rgba(43,38,32,0.18)] md:grid-cols-2">
        <form onSubmit={submit} className="px-8 py-10" noValidate>
          {mode === 'forgot' ? (
            <>
              <h1 className="font-heading text-4xl text-ink">Forgot password</h1>
              <Line label="Email" type="email" value={fields.email} onChange={set('email')} error={invalid.email} autoComplete="email" />
            </>
          ) : mode === 'register' ? (
            <>
              <p className="font-heading text-lg text-ink">Don&apos;t have an account ?</p>
              <h1 className="mt-2 font-heading text-5xl text-ink">Register</h1>
              <Line label="Name" value={fields.name} onChange={set('name')} error={invalid.name} autoComplete="name" />
              <Line label="Email" type="email" value={fields.email} onChange={set('email')} error={invalid.email} autoComplete="email" />
              <label className="mt-6 block font-body text-sm text-muted">
                Mobile
                <span className="mt-2 flex items-center gap-2 border-b border-line focus-within:border-terracotta">
                  <span className="flex items-center gap-1 font-body text-sm text-ink" aria-hidden="true">
                    <svg viewBox="0 0 18 12" className="h-3 w-4"><rect width="18" height="4" fill="#FF9933" /><rect y="4" width="18" height="4" fill="#fff" /><rect y="8" width="18" height="4" fill="#138808" /></svg>
                    +91
                  </span>
                  <input value={fields.phone} onChange={set('phone')} inputMode="numeric" autoComplete="tel" aria-label="Mobile" className="h-10 flex-1 bg-transparent font-body text-sm text-ink outline-none" />
                </span>
                {invalid.phone ? <span className="mt-1 block text-xs text-terracotta" role="alert">{invalid.phone}</span> : null}
              </label>
              <Line label="Password" type={showPassword ? 'text' : 'password'} value={fields.password} onChange={set('password')} error={invalid.password} autoComplete="new-password" toggle={() => setShowPassword((value) => !value)} shown={showPassword} />
            </>
          ) : (
            <>
              <p className="font-heading text-lg text-ink">Have an account ?</p>
              <h1 className="mt-2 font-heading text-5xl text-ink">Sign in</h1>
              <Line label="Email" type="email" value={fields.email} onChange={set('email')} error={invalid.email} autoComplete="email" />
              <Line label="Password" type={showPassword ? 'text' : 'password'} value={fields.password} onChange={set('password')} error={invalid.password} autoComplete="current-password" toggle={() => setShowPassword((value) => !value)} shown={showPassword} />
              <button type="button" className="mt-3 font-body text-sm text-ink underline" onClick={() => { setMode('forgot'); setError(''); }}>Forgot password?</button>
            </>
          )}
          {useMockData ? <p className="mt-4 font-body text-sm text-terracotta" role="status">{MOCK_SIGNIN_MESSAGE}</p> : null}
          {error ? <p className="mt-3 font-body text-sm text-terracotta" role="alert">{error}</p> : null}
          {notice ? <p className="mt-3 font-body text-sm text-olive" role="status">{notice}</p> : null}
          <button type="submit" disabled={busy || useMockData} className="mt-6 h-12 w-full bg-olive font-body text-sm tracking-[0.14em] text-paper uppercase disabled:bg-line">
            {busy ? 'Please wait' : mode === 'forgot' ? 'Send reset link' : mode === 'register' ? 'Create account' : 'Sign in'}
          </button>
          {mode === 'forgot' ? (
            <button type="button" className="mt-3 font-body text-sm underline" onClick={() => setMode('login')}>Back to sign in</button>
          ) : null}
          {googleClientId && mode !== 'forgot' ? (
            <div className="mt-6">
              <div className="flex items-center gap-3 font-body text-xs tracking-[0.16em] text-muted uppercase">
                <span className="h-px flex-1 bg-line" />
                Or
                <span className="h-px flex-1 bg-line" />
              </div>
              <p className="mt-3 text-center font-body text-sm text-muted">You can also sign in/register with</p>
              <div className="mt-3 flex justify-center">
                <GoogleLogin
                  shape="circle"
                  onSuccess={(response) => {
                    if (!response.credential || useMockData) {
                      if (useMockData) setError(MOCK_SIGNIN_MESSAGE);
                      return;
                    }
                    setBusy(true);
                    loginWithGoogle(response.credential).catch((err) => setError(err?.message || 'Google sign-in failed.')).finally(() => setBusy(false));
                  }}
                  onError={() => setError('Google sign-in failed.')}
                />
              </div>
            </div>
          ) : null}
          <p className="mt-4 text-center font-body text-xs text-muted">
            <Link to="/reset-password" className="underline">Have a reset link?</Link>
          </p>
        </form>
        <aside className="flex flex-col items-center justify-center bg-sand px-8 py-10 text-center">
          <p className="font-heading text-2xl text-ink">{mode === 'register' ? 'Have an account?' : 'Don\'t have an account ?'}</p>
          <svg viewBox="0 0 160 120" className="my-6 h-28 w-40 text-olive" aria-hidden="true">
            <circle cx="80" cy="28" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M62 78c4-18 12-26 18-26s14 8 18 26" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M104 62h18l8 16h-14" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M40 96c8-10 22-8 28 0 8 8 22 8 32-2" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          <Link to={mode === 'register' ? '/login' : '/register'} className="flex h-12 w-full max-w-xs items-center justify-center border border-ink font-body text-sm tracking-[0.14em] text-ink uppercase">
            {mode === 'register' ? 'Sign in' : 'Register'}
          </Link>
        </aside>
      </div>
    </main>
  );
}

function Line({ label, error, toggle, shown, ...props }) {
  const id = `account-${label.toLowerCase()}`;
  return (
    <label htmlFor={id} className="mt-6 block font-body text-sm text-muted">
      {label}
      <span className="relative mt-2 block border-b border-line focus-within:border-terracotta">
        <input id={id} {...props} className="h-10 w-full bg-transparent pr-16 font-body text-sm text-ink outline-none" />
        {toggle ? (
          <button type="button" onClick={toggle} className="absolute top-2 right-0 font-body text-xs text-ink">{shown ? 'Hide' : 'Show'}</button>
        ) : null}
      </span>
      {error ? <span className="mt-1 block text-xs text-terracotta" role="alert">{error}</span> : null}
    </label>
  );
}
