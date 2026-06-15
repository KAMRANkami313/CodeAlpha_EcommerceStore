import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { useAuth } from '../hooks/useAuth.js';
import CartItem from '../components/cart/CartItem.jsx';
import CartSummary from '../components/cart/CartSummary.jsx';
import Button from '../components/common/Button.jsx';
import ROUTES from '../constants/ROUTES.js';

const CartPage = () => {
  const { cart } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-surface-300 mb-4" />
        <h2 className="text-2xl font-bold text-surface-800 mb-2">Your cart is waiting</h2>
        <p className="text-surface-500 mb-6">Login to view your cart and start shopping</p>
        <Link to={ROUTES.LOGIN}><Button variant="primary" size="lg">Login to Continue</Button></Link>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-surface-300 mb-4" />
        <h2 className="text-2xl font-bold text-surface-800 mb-2">Your cart is empty</h2>
        <p className="text-surface-500 mb-6">Looks like you haven't added any products yet</p>
        <Link to={ROUTES.PRODUCTS}><Button variant="primary" size="lg" icon={ShoppingBag}>Start Shopping</Button></Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-surface-900 mb-8">Shopping Cart ({cart.totalQuantity} items)</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-surface-200 p-6">
          {cart.items.map((item) => <CartItem key={item.product._id || item.product} item={item} />)}
        </div>
        <div><CartSummary cart={cart} /></div>
      </div>
    </motion.div>
  );
};

export default CartPage;