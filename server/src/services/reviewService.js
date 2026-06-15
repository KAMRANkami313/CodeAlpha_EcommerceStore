import Review from '../models/Review.js';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';

// Helper: recalculate product ratings after review change
const updateProductRatings = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratings: Math.round(stats[0].avgRating * 10) / 10,
      numOfReviews: stats[0].count,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratings: 0,
      numOfReviews: 0,
    });
  }
};

const createReview = async (userId, productId, reviewData) => {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');

  // Check if user already reviewed this product
  const existingReview = await Review.findOne({ user: userId, product: productId });
  if (existingReview) {
    throw new ApiError(400, 'You have already reviewed this product');
  }

  const review = await Review.create({
    user: userId,
    product: productId,
    rating: reviewData.rating,
    comment: reviewData.comment,
  });

  await updateProductRatings(productId);

  return review.populate('user', 'name');
};

const getProductReviews = async (productId, page = 1, limit = 10) => {
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Review.countDocuments({ product: productId });

  const reviews = await Review.find({ product: productId })
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  return {
    reviews,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    },
  };
};

const updateReview = async (reviewId, userId, reviewData) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new ApiError(404, 'Review not found');

  if (review.user.toString() !== userId.toString()) {
    throw new ApiError(403, 'You can only update your own reviews');
  }

  review.rating = reviewData.rating || review.rating;
  review.comment = reviewData.comment || review.comment;
  await review.save();

  await updateProductRatings(review.product);

  return review.populate('user', 'name');
};

const deleteReview = async (reviewId, userId) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new ApiError(404, 'Review not found');

  if (review.user.toString() !== userId.toString()) {
    throw new ApiError(403, 'You can only delete your own reviews');
  }

  const productId = review.product;
  await Review.findByIdAndDelete(reviewId);

  await updateProductRatings(productId);

  return { message: 'Review deleted successfully' };
};

export { createReview, getProductReviews, updateReview, deleteReview };