import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useShop } from '../context/ShopContext';
import api from '../services/api';
import { Lock, Sparkles, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { openAuthModal } = useShop();

  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!token) {
      setErrorMsg('Invalid or missing password reset token. Please request a new link.');
      return;
    }

    if (!newPassword || !confirmPassword) {
      setErrorMsg('Please fill in all password fields.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/auth/reset-password', {
        token,
        newPassword,
      });

      toast.success(res.data?.message || 'Password reset successfully — please log in');
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/');
        if (typeof openAuthModal === 'function') {
          openAuthModal('login');
        }
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password. The link may have expired.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#f7f3ee] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border border-[#d4a373]/30 rounded-3xl p-8 shadow-xl space-y-6 text-[#39322f]">
        
        {/* Header Logo & Title */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#f8f4ee] text-[#b58349] border border-[#d4a373]/30 mb-3 shadow-xs">
            <Sparkles className="w-6 h-6 text-[#d4a373]" />
          </div>
          <h1 className="font-cinzel text-2xl font-bold text-[#2d2624]">Reset Your Password</h1>
          <p className="text-xs text-gray-500 font-sans mt-1">Enter your new secure password for Suranghi Naar Atelier</p>
        </div>

        {/* Missing Token Warning */}
        {!token ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3 text-center">
            <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
            <p className="text-xs text-amber-800 font-medium">
              This reset link is missing a valid security token. Please request a new password reset from the login screen.
            </p>
            <Link
              to="/"
              onClick={() => openAuthModal && openAuthModal('login')}
              className="inline-block px-5 py-2 bg-[#39322f] text-white text-xs uppercase font-bold tracking-wider rounded-xl hover:bg-[#d4a373] transition-colors"
            >
              Return to Login
            </Link>
          </div>
        ) : isSuccess ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-emerald-900">Password Reset Complete!</h3>
            <p className="text-xs text-emerald-800">
              Your password has been updated. Redirecting you to sign in...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-semibold text-center">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-2xl pl-10 pr-4 py-3 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#39322f] uppercase tracking-wider mb-1 font-bold">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#f8f4ee] border border-[#e8e2d9] rounded-2xl pl-10 pr-4 py-3 text-[#39322f] focus:outline-none focus:border-[#d4a373]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#39322f] hover:bg-[#d4a373] text-[#f7f3ee] hover:text-[#39322f] font-bold py-3.5 px-6 rounded-2xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Resetting Password...' : 'Save New Password'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
