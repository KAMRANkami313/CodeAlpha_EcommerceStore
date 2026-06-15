import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';

const getCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product', 'name price images stock');

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return cart;
};

// Helper: re-populate and return cart after mutation
const populateCart = async (cart) => {
  await cart.populate('items.product', 'name price images stock');
  return cart;
};

const addToCart = async (userId, productId, quantity = 1) => {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  const existingItem = cart.items.find((item) => item.product.toString() === productId);

  // FIX: Check stock against TOTAL quantity (existing + new), not just new quantity
  const totalQuantity = existingItem ? existingItem.quantity + quantity : quantity;
  if (product.stock < totalQuantity) {
    throw new ApiError(400, `Insufficient stock. Only ${product.stock} available.`);
  }

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      name: product.name,
      image: product.images[0]?.url || '',
      price: product.price,
      quantity,
    });
  }

  await cart.save();
  return populateCart(cart);
};

const updateCartItem = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, 'Cart not found');

  const item = cart.items.find((item) => item.product.toString() === productId);
  if (!item) throw new ApiError(404, 'Item not found in cart');

  if (quantity <= 0) {
    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
  } else {
    // FIX: Validate stock before updating quantity
    const product = await Product.findById(productId);
    if (product && product.stock < quantity) {
      throw new ApiError(400, `Insufficient stock. Only ${product.stock} available.`);
    }
    item.quantity = quantity;
  }

  await cart.save();
  return populateCart(cart);
};

const removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, 'Cart not found');

  cart.items = cart.items.filter((item) => item.product.toString() !== productId);
  await cart.save();
  return populateCart(cart);
};

const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, 'Cart not found');

  cart.items = [];
  await cart.save();
  return populateCart(cart);
};

export { getCart, addToCart, updateCartItem, removeFromCart, clearCart };