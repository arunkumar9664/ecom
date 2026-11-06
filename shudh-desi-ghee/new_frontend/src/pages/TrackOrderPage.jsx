import { Navigate } from 'react-router-dom';
import { useShop } from '../hooks/useShop';
import AuthForm from '../components/auth/AuthForm';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function TrackOrderPage() {
  const { currentUser } = useShop();
  useDocumentTitle('Track an order', 'Sign in to see orders on your account.');
  if (currentUser) return <Navigate to="/orders" replace />;
  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="font-heading text-4xl text-ink">Track an order</h1>
      <p className="mt-3 font-body text-sm text-muted">Sign in to see orders on your account. Guest orders are not looked up from this page.</p>
      <div className="mt-6 bg-white p-6">
        <AuthForm />
      </div>
    </main>
  );
}
