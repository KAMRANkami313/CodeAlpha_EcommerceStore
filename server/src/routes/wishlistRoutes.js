import { Router } from 'express';
import { isAuthenticated } from '../middleware/authMiddleware.js';
import { getUserWishlist, addItemToWishlist, removeItemFromWishlist, checkWishlistItem } from '../controllers/wishlistController.js';

const router = Router();

router.get('/', isAuthenticated, getUserWishlist);
router.post('/:productId', isAuthenticated, addItemToWishlist);
router.delete('/:productId', isAuthenticated, removeItemFromWishlist);
router.get('/check/:productId', isAuthenticated, checkWishlistItem);

export default router;
