import { Navigate } from 'react-router-dom';
import { useShop } from '../hooks/useShop';
import useDocumentTitle from '../hooks/useDocumentTitle';
import AuthForm from '../components/auth/AuthForm';

export default function LoginPage({ tab = 'login' }) {
  const { currentUser } = useShop();
  useDocumentTitle(tab === 'register' ? 'Register' : 'Sign in', 'Sign in to Field & Hearth.');
  if (currentUser) return <Navigate to="/account" replace />;
  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="font-heading text-4xl text-ink">{tab === 'register' ? 'Register' : 'Sign in'}</h1>
      <div className="mt-6 bg-white p-6">
        <AuthForm initialTab={tab} />
      </div>
    </main>
  );
}
