import { createContext, useContext, useState, useCallback } from 'react';
import { useAuthContext } from './AuthContext.jsx';
import wishlistService from '../services/wishlistService.js';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

export const useWishlistContext = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlistContext must be used within WishlistProvider');
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const { isAuthenticated } = useAuthContext();

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await wishlistService.getWishlist();
      const products = response.data.items
        .filter((item) => item.product)
        .map((item) => item.product);
      setWishlistProducts(products);
    } catch {
      // silently fail
    }
  }, [isAuthenticated]);

  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }
    try {
      const isInList = wishlistProducts.some((p) => p._id === productId);
      if (isInList) {
        await wishlistService.removeFromWishlist(productId);
        setWishlistProducts((prev) => prev.filter((p) => p._id !== productId));
        toast.success('Removed from wishlist');
      } else {
        const response = await wishlistService.addToWishlist(productId);
        // Re-fetch to get populated product data
        const fresh = await wishlistService.getWishlist();
        const products = fresh.data.items
          .filter((item) => item.product)
          .map((item) => item.product);
        setWishlistProducts(products);
        toast.success('Added to wishlist!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
    }
  };

  const isInWishlist = (productId) => wishlistProducts.some((p) => p._id === productId);

  const wishlistCount = wishlistProducts.length;

  const value = { wishlistProducts, wishlistCount, fetchWishlist, toggleWishlist, isInWishlist };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export default WishlistContext;