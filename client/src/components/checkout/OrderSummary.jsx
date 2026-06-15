import formatCurrency from '../../utils/formatCurrency.js';
import useCart from '../../hooks/useCart.js';

const OrderSummary = () => {
  const { cart } = useCart();
  const shipping = cart.totalPrice > 5000 ? 0 : 150;

  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-6">
      <h3 className="text-lg font-bold text-surface-800 mb-4">Your Order</h3>
      <div className="divide-y divide-surface-100">
        {cart.items.map((item) => (
          <div key={item.product} className="flex justify-between py-2.5">
            <span className="text-sm text-surface-600">
              {item.name} <span className="text-surface-400">x{item.quantity}</span>
            </span>
            <span className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-surface-200 mt-3 pt-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-surface-500">Subtotal</span>
          <span>{formatCurrency(cart.totalPrice)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-surface-500">Shipping</span>
          <span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
        </div>
        <div className="flex justify-between font-bold text-base pt-2 border-t border-surface-200">
          <span>Total</span>
          <span>{formatCurrency(cart.totalPrice + shipping)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;