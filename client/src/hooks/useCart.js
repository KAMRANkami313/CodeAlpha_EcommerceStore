import { useCartContext } from '../context/CartContext.jsx';

const useCart = () => {
  const { cart, fetchCart, addToCart, updateQuantity, removeItem, emptyCart } = useCartContext();
  return { cart, fetchCart, addToCart, updateQuantity, removeItem, emptyCart };
};

export default useCart;