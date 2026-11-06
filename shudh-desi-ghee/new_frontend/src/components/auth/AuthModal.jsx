import { useRef } from 'react';
import { useShop } from '../../context/ShopContext';
import useFocusTrap from '../../hooks/useFocusTrap';
import AuthForm from './AuthForm';

export default function AuthModal() {
  const { isAuthModalOpen, authModalTab, closeAuthModal } = useShop();
  const panel = useRef(null);
  useFocusTrap(isAuthModalOpen, panel, closeAuthModal);
  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[85] flex items-end justify-center bg-ink/40 sm:items-center" role="dialog" aria-modal="true" aria-label="Sign in">
      <button type="button" className="absolute inset-0" aria-label="Close sign in" onClick={closeAuthModal} />
      <div ref={panel} className="relative max-h-[90vh] w-full max-w-md overflow-y-auto bg-paper p-6 sm:p-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-3xl text-ink">Account</h2>
          <button type="button" onClick={closeAuthModal} className="font-body text-sm text-ink">Close</button>
        </div>
        <AuthForm initialTab={authModalTab} onDone={closeAuthModal} />
      </div>
    </div>
  );
}
