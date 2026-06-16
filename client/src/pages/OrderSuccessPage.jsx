import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import ROUTES from '../constants/ROUTES.js';

const OrderSuccessPage = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-3">Order Placed!</h1>
        <p className="text-surface-500 dark:text-surface-400 mb-8 leading-relaxed">
          Thank you for your order! We'll send you a confirmation email with your order details and tracking information.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to={ROUTES.PRODUCTS}><Button variant="primary" icon={ShoppingBag}>Continue Shopping</Button></Link>
          <Link to={ROUTES.PROFILE}><Button variant="secondary">View Orders</Button></Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;