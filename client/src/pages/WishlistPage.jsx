import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import useWishlist from '../hooks/useWishlist.js';
import useAuth from '../hooks/useAuth.js';
import ProductCard from '../components/product/ProductCard.jsx';
import Button from '../components/common/Button.jsx';
import ROUTES from '../constants/ROUTES.js';

const WishlistPage = () => {
  const { wishlistProducts, fetchWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Heart className="w-16 h-16 mx-auto text-surface-300 dark:text-surface-600 mb-4" />
        <h2 className="text-2xl font-bold text-surface-800 dark:text-white mb-2">Your wishlist is waiting</h2>
        <p className="text-surface-500 dark:text-surface-400 mb-6">Login to save your favorite products</p>
        <Link to={ROUTES.LOGIN}><Button variant="primary" size="lg">Login to Continue</Button></Link>
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Heart className="w-16 h-16 mx-auto text-surface-300 dark:text-surface-600 mb-4" />
        <h2 className="text-2xl font-bold text-surface-800 dark:text-white mb-2">Your wishlist is empty</h2>
        <p className="text-surface-500 dark:text-surface-400 mb-6">Save items you love by tapping the heart icon</p>
        <Link to={ROUTES.PRODUCTS}><Button variant="primary" size="lg" icon={ShoppingBag}>Browse Products</Button></Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white">My Wishlist</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">{wishlistProducts.length} saved item(s)</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistProducts.map((product, index) => (
          <ProductCard key={product._id} product={product} index={index} />
        ))}
      </div>
    </motion.div>
  );
};

export default WishlistPage;