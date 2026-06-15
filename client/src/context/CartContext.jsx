import { createContext, useContext, useState, useCallback } from 'react';
import { useAuthContext } from './AuthContext.jsx';
import cartService from '../services/cartService.js';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCartContext must be used within CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalQuantity: 0, totalPrice: 0 });
  const { isAuthenticated } = useAuthContext();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await cartService.getCart();
      setCart(response.data);
    } catch {
      // Cart might not exist yet — that's fine
    }
  }, [isAuthenticated]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      const response = await cartService.addToCart(productId, quantity);
      setCart(response.data);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await cartService.updateCartItem(productId, quantity);
      setCart(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update cart');
    }
  };

  const removeItem = async (productId) => {
    try {
      const response = await cartService.removeFromCart(productId);
      setCart(response.data);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove item');
    }
  };

  const emptyCart = async () => {
    try {
      const response = await cartService.clearCart();
      setCart(response.data);
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  };

  const value = { cart, fetchCart, addToCart, updateQuantity, removeItem, emptyCart };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;