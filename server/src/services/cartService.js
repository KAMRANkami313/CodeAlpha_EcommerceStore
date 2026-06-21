import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';

/**
 * Sync cart item prices with the latest product prices from the database.
 * This ensures that if an admin changes a product's price, the cart reflects it.
 * Also removes items where the product no longer exists.
 * Returns the cart with synced data (does NOT save — caller must save if needed).
 */
const syncCartPrices = async (cart) => {
  if (!cart || cart.items.length === 0) return cart;

  const productIds = cart.items.map((item) => item.product);
  const products = await Product.find({ _id: { $in: productIds } }).select('price name images stock isActive');

  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  // Update prices and remove items for deleted/inactive products
  const updatedItems = [];
  for (const item of cart.items) {
    const product = productMap.get(item.product.toString());
    if (!product || !product.isActive) {
      // Product was deleted or deactivated — skip (remove from cart)
      continue;
    }
    // Update price to the latest
    item.price = product.price;
    // Update name and image in case they changed
    item.name = product.name;
    item.image = product.images[0]?.url || item.image;
    updatedItems.push(item);
  }

  cart.items = updatedItems;
  return cart;
};

const getCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product', 'name price images stock');

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  // Sync prices with latest product data
  const wasModified = await syncCartPricesFromDB(cart);
  if (wasModified) {
    await cart.save();
  }

  return cart.populate('items.product', 'name price images stock');
};

/**
 * Sync cart prices from DB — returns true if any item was modified.
 * Separate helper so we can check without saving.
 */
const syncCartPricesFromDB = async (cart) => {
  if (!cart || cart.items.length === 0) return false;

  const productIds = cart.items.map((item) => item.product);
  const products = await Product.find({ _id: { $in: productIds } }).select('price name images stock isActive');
  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  let modified = false;
  const updatedItems = [];

  for (const item of cart.items) {
    const product = productMap.get(item.product.toString());
    if (!product || !product.isActive) {
      modified = true; // Item removed
      continue;
    }
    if (item.price !== product.price || item.name !== product.name) {
      item.price = product.price;
      item.name = product.name;
      item.image = product.images[0]?.url || item.image;
      modified = true;
    }
    updatedItems.push(item);
  }

  if (cart.items.length !== updatedItems.length) {
    cart.items = updatedItems;
  }

  return modified;
};

// Helper: sync, save, populate and return cart after mutation
const populateCart = async (cart) => {
  await syncCartPricesFromDB(cart);
  await cart.save();
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

  // Check stock against TOTAL quantity (existing + new)
  const totalQuantity = existingItem ? existingItem.quantity + quantity : quantity;
  if (product.stock < totalQuantity) {
    throw new ApiError(400, `Insufficient stock. Only ${product.stock} available.`);
  }

  if (existingItem) {
    existingItem.quantity += quantity;
    // Always update price to latest
    existingItem.price = product.price;
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
    // Validate stock before updating quantity
    const product = await Product.findById(productId);
    if (product && product.stock < quantity) {
      throw new ApiError(400, `Insufficient stock. Only ${product.stock} available.`);
    }
    item.quantity = quantity;
    // Sync price
    if (product) {
      item.price = product.price;
    }
  }

  return populateCart(cart);
};

const removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, 'Cart not found');

  cart.items = cart.items.filter((item) => item.product.toString() !== productId);
  return populateCart(cart);
};

const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, 'Cart not found');

  cart.items = [];
  await cart.save();
  return cart.populate('items.product', 'name price images stock');
};

export { getCart, addToCart, updateCartItem, removeFromCart, clearCart };