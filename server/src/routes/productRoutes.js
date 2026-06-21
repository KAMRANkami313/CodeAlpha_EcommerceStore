import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { isAuthenticated, authorizeRoles } from '../middleware/authMiddleware.js';
import { createProductValidator, updateProductValidator } from '../validators/productValidator.js';
import validate from '../middleware/validateMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Stricter rate limit for search queries (text search is expensive on DB)
const searchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'Too many search requests. Please slow down.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware: apply search rate limiter only when ?search= query param is present
const searchRateLimit = (req, res, next) => {
  if (req.query.search) {
    return searchLimiter(req, res, next);
  }
  next();
};

// Public routes
router.get('/', searchRateLimit, getAllProducts);
router.get('/:id', getProductById);

// Admin-only routes
router.post(
  '/',
  isAuthenticated,
  authorizeRoles('admin'),
  upload.array('images', 5),
  createProductValidator,
  validate,
  createProduct
);

// Update product — support optional new images upload
router.put(
  '/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  upload.array('images', 5),
  updateProductValidator,
  validate,
  updateProduct
);

router.delete(
  '/:id',
  isAuthenticated,
  authorizeRoles('admin'),
  deleteProduct
);

export default router;