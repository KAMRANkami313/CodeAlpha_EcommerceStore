import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as cartService from '../services/cartService.js';

const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user._id);

  res.status(200).json(new ApiResponse(200, cart, 'Cart fetched successfully'));
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.addToCart(req.user._id, productId, quantity);

  res.status(200).json(new ApiResponse(200, cart, 'Item added to cart'));
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await cartService.updateCartItem(req.user._id, req.params.productId, quantity);

  res.status(200).json(new ApiResponse(200, cart, 'Cart item updated'));
});

const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await cartService.removeFromCart(req.user._id, req.params.productId);

  res.status(200).json(new ApiResponse(200, cart, 'Item removed from cart'));
});

const clearCart = asyncHandler(async (req, res) => {
  const cart = await cartService.clearCart(req.user._id);

  res.status(200).json(new ApiResponse(200, cart, 'Cart cleared'));
});

export { getCart, addToCart, updateCartItem, removeFromCart, clearCart };