import { Minus, Plus, Trash2 } from 'lucide-react';
import formatCurrency from '../../utils/formatCurrency.js';
import useCart from '../../hooks/useCart.js';

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-4 py-4 border-b border-surface-100 last:border-0">
      {/* Image */}
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-100 shrink-0">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-surface-300">No img</div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-surface-800 line-clamp-1">{item.name}</h3>
        <p className="text-sm text-primary-600 font-semibold mt-0.5">{formatCurrency(item.price)}</p>

        <div className="flex items-center justify-between mt-2">
          {/* Quantity Controls */}
          <div className="flex items-center gap-1 bg-surface-100 rounded-lg">
            <button
              onClick={() => updateQuantity(item.product._id || item.product, item.quantity - 1)}
              className="p-1.5 hover:bg-surface-200 rounded-l-lg cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 text-sm font-medium">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.product._id || item.product, item.quantity + 1)}
              className="p-1.5 hover:bg-surface-200 rounded-r-lg cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Remove */}
          <button
            onClick={() => removeItem(item.product._id || item.product)}
            className="p-2 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;