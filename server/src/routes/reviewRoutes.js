import express from 'express';
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';
import { createReviewValidator, updateReviewValidator } from '../validators/reviewValidator.js';
import validate from '../middleware/validateMiddleware.js';

const router = express.Router();

// Public — anyone can view reviews
router.get('/product/:productId', getProductReviews);

// Protected — must be logged in
router.post(
  '/product/:productId',
  isAuthenticated,
  createReviewValidator,
  validate,
  createReview
);

router.put(
  '/:id',
  isAuthenticated,
  updateReviewValidator,
  validate,
  updateReview
);

router.delete(
  '/:id',
  isAuthenticated,
  deleteReview
);

export default router;