import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useShop } from '../context/ShopContext';
import api from '../services/api';
import { X, Sparkles, Mail, Lock, User, Phone, ArrowRight, ArrowLeft } from 'lucide-react';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle
  } = useShop();

  const [activeTab, setActiveTab] = useState(authModalTab || 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState('');

  useEffect(() => {
    setActiveTab(authModalTab || 'login');
    const savedEmail = localStorage.getItem('surangi_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    } else {
      setEmail('');
      setRememberMe(true);
    }
    setPassword('');
    setName('');
    setPhone('');
    setPhoneError('');
    setErrorMessage('');
    setForgotSuccessMessage('');
  }, [authModalTab, isAuthModalOpen]);

  const changeTab = (tab) => {
    setActiveTab(tab);
    if (typeof setAuthModalTab === 'function') {
      setAuthModalTab(tab);
    }
  };

  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Email address is required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Password is required.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      await loginWithEmail(trimmedEmail, password, rememberMe);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Login failed. Please check your credentials.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setErrorMessage('Full name must be at least 2 characters.');
      return;
    }
    if (!trimmedEmail) {
      setErrorMessage('Email address is required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    const cleanPhone = trimmedPhone.replace(/\D/g, '');
    if (!trimmedPhone || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      setPhoneError('Enter a valid 10-digit mobile number');
      setErrorMessage('Enter a valid 10-digit mobile number');
      return;
    }
    if (!password) {
      setErrorMessage('Password is required.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerWithEmail(trimmedName, trimmedEmail, trimmedPhone, password);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Registration failed.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setForgotSuccessMessage('');
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/auth/forgot-password', { email: trimmedEmail });
      setForgotSuccessMessage(res.data?.message || 'If an account exists for this email, a reset link has been sent');
    } catch (err) {
      setForgotSuccessMessage('If an account exists for this email, a reset link has been sent');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white border border-[#d4a373]/30 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-[#39322f] max-h-[90vh] overflow-y-auto overscroll-contain"
        data-lenis-prevent
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-[#39322f] rounded-full hover:bg-[#f8f4ee] transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Logo & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#f8f4ee] text-[#b58349] border border-[#d4a373]/30 mb-3 shadow-xs">
            <Sparkles className="w-6 h-6 text-[#d4a373]" />
          </div>
          <h2 className="font-cinzel text-2xl font-bold text-[#2d2624]">Shudh Desi Ghee</h2>
          <p className="text-xs text-gray-500 font-sans mt-1">Sign in to access your luxury account & order history</p>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-semibold text-center animate-in fade-in duration-200">
            {errorMessage}
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex bg-[#f8f4ee] p-1 rounded-2xl border border-[#e8e2d9] mb-6">
          <button
            type="button"
            onClick={() => changeTab('login')}
            className={`flex-1 py-2 text-xs font-sans uppercase tracking-wider font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-[#39322f] text-[#f7f3ee] shadow-xs'
                : 'text-gray-600 hover:text-[#39322f]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => changeTab('register')}
            className={`flex-1 py-2 text-xs font-sans uppercase tracking-wider font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-[#39322f] text-[#f7f3ee] shadow-xs'
                : 'text-gray-600 hover:text-[#39322f]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Real Google Login Button */}
        <div className="mb-5 flex justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              if (credentialResponse.credential) {
                loginWithGoogle(credentialResponse.credential);
              }
            }}
            onError={() => {
              console.error('Google Sign In failed');
            }}
            theme="outline"
            shape="pill"
            text="continue_with"
            size="large"
            width="320"
          />
        </div>

        <div className="relative flex items-center justify-center mb-5">
          <div className="border-t border-[#e8e2d9] w-full" />
          <span className="bg-white px-3 text-[10px] uppercase font-sans tracking-widest text-gray-400 font-semibold absolute">or email</span>
        </div>

        {/* SIGN IN FORM */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} autoComplete="on" className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="username"
                  placeholder="ananya.sharma@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-2xl pl-10 pr-4 py-3 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-2xl pl-10 pr-4 py-3 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 accent-[#d4a373]"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => changeTab('forgot')}
                className="text-[#b58349] font-bold hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#39322f] hover:bg-[#d4a373] text-[#f7f3ee] hover:text-[#39322f] font-bold py-3.5 px-6 rounded-2xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Signing In...' : 'Sign In to Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : activeTab === 'forgot' ? (
          /* FORGOT PASSWORD FORM */
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Your Account Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="Enter your registered email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-2xl pl-10 pr-4 py-3 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>
            </div>

            {forgotSuccessMessage && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-medium leading-relaxed">
                {forgotSuccessMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#39322f] hover:bg-[#d4a373] text-[#f7f3ee] hover:text-[#39322f] font-bold py-3.5 px-6 rounded-2xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Sending Reset Link...' : 'Send Reset Link'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => changeTab('login')}
                className="text-[#b58349] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>
            </div>
          </form>
        ) : (
          /* CREATE ACCOUNT FORM */
          <form onSubmit={handleRegisterSubmit} autoComplete="on" className="space-y-3.5 text-xs font-sans">
            <div>
              <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Ananya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-2xl pl-10 pr-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="username"
                  placeholder="ananya.sharma@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-2xl pl-10 pr-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Phone Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  required
                  autoComplete="tel"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPhone(val);
                    const clean = val.trim().replace(/\D/g, '');
                    if (clean && !/^[6-9]\d{9}$/.test(clean)) {
                      setPhoneError('Enter a valid 10-digit mobile number');
                    } else {
                      setPhoneError('');
                    }
                  }}
                  className={`w-full bg-[#f8f4ee] border rounded-2xl pl-10 pr-4 py-2.5 text-[#39322f] focus:outline-none ${
                    phoneError ? 'border-rose-500' : 'border-[#e8e2d9] focus:border-[#d4a373]'
                  }`}
                />
              </div>
              {phoneError && (
                <p className="text-[11px] text-rose-600 font-semibold mt-1">
                  {phoneError}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  required
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-2xl pl-10 pr-4 py-2.5 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#39322f] hover:bg-[#d4a373] text-[#f7f3ee] hover:text-[#39322f] font-bold py-3.5 px-6 rounded-2xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 mt-3 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
