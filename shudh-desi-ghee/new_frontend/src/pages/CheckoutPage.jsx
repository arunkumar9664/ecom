import StubPage from './StubPage';
import { useShop } from '../context/ShopContext';
import { brand, MOCK_DISABLED_MESSAGE, paymentMethods } from '../config/brand';

export default function CheckoutPage() {
  const { useMockData } = useShop();
  const note = useMockData
    ? MOCK_DISABLED_MESSAGE
    : `${brand.guestCheckoutNote} Guests pay with the bag saved in this browser. Signed-in customers use the server bag and saved addresses. Payment methods: ${paymentMethods.razorpay} and ${paymentMethods.cod}. The amount charged is the order total returned by the server.`;
  return <StubPage title="Checkout" note={note} />;
}
