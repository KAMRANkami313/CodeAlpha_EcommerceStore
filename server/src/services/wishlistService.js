import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';

const getWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId }).populate(
    'items.product',
    'name price compareAtPrice images ratings numOfReviews stock category'
  );

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, items: [] });
  }

  // Filter out items where product was deleted
  wishlist.items = wishlist.items.filter((item) => item.product !== null);

  return wishlist;
};

const addToWishlist = async (userId, productId) => {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');

  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, items: [] });
  }

  const exists = wishlist.items.some(
    (item) => item.product.toString() === productId.toString()
  );
  if (exists) {
    throw new ApiError(400, 'Product already in wishlist');
  }

  wishlist.items.push({ product: productId });
  await wishlist.save();

  return wishlist.populate(
    'items.product',
    'name price compareAtPrice images ratings numOfReviews stock category'
  );
};

const removeFromWishlist = async (userId, productId) => {
  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) throw new ApiError(404, 'Wishlist not found');

  wishlist.items = wishlist.items.filter(
    (item) => item.product.toString() !== productId.toString()
  );
  await wishlist.save();

  return wishlist.populate(
    'items.product',
    'name price compareAtPrice images ratings numOfReviews stock category'
  );
};

const isInWishlist = async (userId, productId) => {
  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) return false;
  return wishlist.items.some(
    (item) => item.product.toString() === productId.toString()
  );
};

export { getWishlist, addToWishlist, removeFromWishlist, isInWishlist };