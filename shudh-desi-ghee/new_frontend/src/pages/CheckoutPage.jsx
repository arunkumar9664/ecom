import { Link } from 'react-router-dom';
import StubPage from './StubPage';
import { brand, paymentMethods } from '../config/brand';

export default function CheckoutPage() {
  return (
    <StubPage
      title="Checkout"
      note={`${brand.guestCheckoutNote} Guests pay with the bag saved in this browser. Signed-in customers use the server bag and saved addresses. Payment methods: ${paymentMethods.razorpay} and ${paymentMethods.cod}. The amount charged is the order total returned by the server.`}
    />
  );
}

export function ShopLinks() {
  const links = [
    ['/shop', 'Shop'],
    ['/cart', 'Bag'],
    ['/checkout', 'Checkout'],
    ['/account', 'Account'],
    ['/wishlist', 'Wishlist'],
    ['/login', 'Sign in'],
    ['/admin', 'Admin'],
  ];
  return (
    <nav className="mx-auto flex max-w-3xl flex-wrap gap-4 px-6 pb-10 font-body text-sm">
      {links.map(([to, label]) => (
        <Link key={to} to={to} className="text-olive underline-offset-4 hover:underline">
          {label}
        </Link>
      ))}
    </nav>
  );
}
