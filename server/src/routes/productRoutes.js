import express from 'express';
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

// Public routes
router.get('/', getAllProducts);
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
  upload.array('images', 5), // Accept optional new images on update
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