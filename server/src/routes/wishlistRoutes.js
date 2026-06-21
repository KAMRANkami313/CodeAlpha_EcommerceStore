import { Router } from 'express';
import { param } from 'express-validator';
import { isAuthenticated } from '../middleware/authMiddleware.js';
import validate from '../middleware/validateMiddleware.js';
import { getUserWishlist, addItemToWishlist, removeItemFromWishlist, checkWishlistItem } from '../controllers/wishlistController.js';

const router = Router();

// Reusable ObjectId validator for productId param
const productIdValidator = param('productId')
  .isMongoId()
  .withMessage('Invalid product ID format');

router.get('/', isAuthenticated, getUserWishlist);
router.post('/:productId', isAuthenticated, productIdValidator, validate, addItemToWishlist);
router.delete('/:productId', isAuthenticated, productIdValidator, validate, removeItemFromWishlist);
router.get('/check/:productId', isAuthenticated, productIdValidator, validate, checkWishlistItem);

export default router;