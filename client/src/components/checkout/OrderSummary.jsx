import formatCurrency from '../../utils/formatCurrency.js';
import useCart from '../../hooks/useCart.js';

const OrderSummary = () => {
  const { cart } = useCart();
  const shipping = cart.totalPrice > 5000 ? 0 : 150;

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6">
      <h3 className="text-lg font-bold text-surface-800 dark:text-white mb-4">Your Order</h3>
      <div className="divide-y divide-surface-100 dark:divide-surface-700">
        {cart.items.map((item) => (
          <div key={item.product} className="flex justify-between py-2.5">
            <span className="text-sm text-surface-600 dark:text-surface-400">
              {item.name} <span className="text-surface-400 dark:text-surface-500">x{item.quantity}</span>
            </span>
            <span className="text-sm font-medium text-surface-900 dark:text-white">{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-surface-200 dark:border-surface-700 mt-3 pt-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-surface-500 dark:text-surface-400">Subtotal</span>
          <span className="text-surface-900 dark:text-white">{formatCurrency(cart.totalPrice)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-surface-500 dark:text-surface-400">Shipping</span>
          <span className="text-surface-900 dark:text-white">{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
        </div>
        <div className="flex justify-between font-bold text-base pt-2 border-t border-surface-200 dark:border-surface-700">
          <span className="text-surface-800 dark:text-white">Total</span>
          <span className="text-surface-900 dark:text-white">{formatCurrency(cart.totalPrice + shipping)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;