import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as reviewService from '../services/reviewService.js';

const createReview = asyncHandler(async (req, res) => {
  const review = await reviewService.createReview(
    req.user._id,
    req.params.productId,
    req.body
  );

  res.status(201).json(new ApiResponse(201, review, 'Review created successfully'));
});

const getProductReviews = asyncHandler(async (req, res) => {
  const result = await reviewService.getProductReviews(
    req.params.productId,
    req.query.page,
    req.query.limit
  );

  res.status(200).json(new ApiResponse(200, result, 'Reviews fetched successfully'));
});

const updateReview = asyncHandler(async (req, res) => {
  const review = await reviewService.updateReview(
    req.params.id,
    req.user._id,
    req.body
  );

  res.status(200).json(new ApiResponse(200, review, 'Review updated successfully'));
});

const deleteReview = asyncHandler(async (req, res) => {
  const result = await reviewService.deleteReview(req.params.id, req.user._id);

  res.status(200).json(new ApiResponse(200, result, 'Review deleted successfully'));
});

export { createReview, getProductReviews, updateReview, deleteReview };