import CheckoutForm from '../components/checkout/CheckoutForm.jsx';
import OrderSummary from '../components/checkout/OrderSummary.jsx';
import useCart from '../hooks/useCart.js';

const CheckoutPage = () => {
  const { cart } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-surface-800 mb-2">Your cart is empty</h2>
        <p className="text-surface-500">Add items to cart before checking out</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-surface-900 mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-surface-200 p-6">
          <CheckoutForm />
        </div>
        <div><OrderSummary /></div>
      </div>
    </div>
  );
};

export default CheckoutPage;