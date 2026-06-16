import { getWishlist, addToWishlist, removeFromWishlist, isInWishlist } from '../services/wishlistService.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

const getUserWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getWishlist(req.user._id);
  res.status(200).json(
    new ApiResponse(200, wishlist, 'Wishlist fetched successfully')
  );
});

const addItemToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const wishlist = await addToWishlist(req.user._id, productId);
  res.status(200).json(
    new ApiResponse(200, wishlist, 'Product added to wishlist')
  );
});

const removeItemFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const wishlist = await removeFromWishlist(req.user._id, productId);
  res.status(200).json(
    new ApiResponse(200, wishlist, 'Product removed from wishlist')
  );
});

const checkWishlistItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const inWishlist = await isInWishlist(req.user._id, productId);
  res.status(200).json(
    new ApiResponse(200, { inWishlist }, 'Wishlist status checked')
  );
});

export { getUserWishlist, addItemToWishlist, removeItemFromWishlist, checkWishlistItem };