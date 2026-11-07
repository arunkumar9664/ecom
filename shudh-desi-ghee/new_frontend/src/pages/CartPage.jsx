import CartPanel from '../components/cart/CartPanel';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function CartPage() {
  useDocumentTitle('Shopping cart', 'Review the bag before checkout.');
  return (
    <main className="mx-auto w-full max-w-[420px] bg-white">
      <CartPanel page />
    </main>
  );
}
