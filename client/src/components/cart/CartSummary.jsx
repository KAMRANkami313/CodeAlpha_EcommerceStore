import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import formatCurrency from '../../utils/formatCurrency.js';
import Button from '../common/Button.jsx';
import ROUTES from '../../constants/ROUTES.js';

const CartSummary = ({ cart }) => {
  const shipping = cart.totalPrice > 5000 ? 0 : 150;
  const total = cart.totalPrice + shipping;

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 sticky top-24">
      <h3 className="text-lg font-bold text-surface-800 dark:text-white mb-4">Order Summary</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-surface-500 dark:text-surface-400">Subtotal ({cart.totalQuantity} items)</span>
          <span className="font-medium text-surface-900 dark:text-white">{formatCurrency(cart.totalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-surface-500 dark:text-surface-400">Shipping</span>
          <span className="font-medium text-surface-900 dark:text-white">{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
        </div>
        {shipping > 0 && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400">Add {formatCurrency(5000 - cart.totalPrice)} more for free shipping!</p>
        )}
        <div className="border-t border-surface-200 dark:border-surface-700 pt-3">
          <div className="flex justify-between text-base">
            <span className="font-semibold text-surface-800 dark:text-white">Total</span>
            <span className="font-bold text-surface-900 dark:text-white">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      <Link to={ROUTES.CHECKOUT} className="block mt-6 no-underline">
        <Button variant="accent" size="lg" className="w-full" icon={ShoppingBag}>
          Proceed to Checkout
        </Button>
      </Link>
    </div>
  );
};

export default CartSummary;