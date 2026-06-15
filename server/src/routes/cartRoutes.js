import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';
import { body } from 'express-validator';
import validate from '../middleware/validateMiddleware.js';

const router = express.Router();

router.use(isAuthenticated);

router.get('/', getCart);
router.post(
  '/',
  [
    body('productId').notEmpty().withMessage('Product ID is required'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  ],
  validate,
  addToCart
);
router.put(
  '/:productId',
  [body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer')],
  validate,
  updateCartItem
);
router.delete('/:productId', removeFromCart);
router.delete('/', clearCart);

export default router;