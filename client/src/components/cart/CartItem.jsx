import { Minus, Plus, Trash2 } from 'lucide-react';
import formatCurrency from '../../utils/formatCurrency.js';
import useCart from '../../hooks/useCart.js';

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-4 py-4 border-b border-surface-100 dark:border-surface-700 last:border-0">
      {/* Image */}
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-100 dark:bg-surface-700 shrink-0">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-surface-300 dark:text-surface-600">No img</div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-surface-800 dark:text-white line-clamp-1">{item.name}</h3>
        <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold mt-0.5">{formatCurrency(item.price)}</p>

        <div className="flex items-center justify-between mt-2">
          {/* Quantity Controls */}
          <div className="flex items-center gap-1 bg-surface-100 dark:bg-surface-700 rounded-lg">
            <button
              onClick={() => updateQuantity(item.product._id || item.product, item.quantity - 1)}
              className="p-1.5 hover:bg-surface-200 dark:hover:bg-surface-600 rounded-l-lg cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5 text-surface-700 dark:text-surface-300" />
            </button>
            <span className="px-3 text-sm font-medium text-surface-900 dark:text-white">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.product._id || item.product, item.quantity + 1)}
              className="p-1.5 hover:bg-surface-200 dark:hover:bg-surface-600 rounded-r-lg cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-surface-700 dark:text-surface-300" />
            </button>
          </div>

          {/* Remove */}
          <button
            onClick={() => removeItem(item.product._id || item.product)}
            className="p-2 text-surface-400 dark:text-surface-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;