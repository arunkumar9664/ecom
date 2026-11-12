import CartPanel from '../components/cart/CartPanel';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function CartPage() {
  useDocumentTitle('Shopping cart', 'Review the bag before checkout.');
  return (
    <main className="mx-auto w-full max-w-[640px] px-gutter py-8 md:py-12">
      <div className="overflow-hidden rounded-[4px] border border-line bg-white shadow-sm">
        <CartPanel page />
      </div>
    </main>
  );
}
