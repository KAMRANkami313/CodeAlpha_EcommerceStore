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

router.get('/', getAllProducts);
router.get('/:id', getProductById);

router.post(
  '/',
  isAuthenticated,
  authorizeRoles('admin'),
  upload.array('images', 5),
  createProductValidator,
  validate,
  createProduct
);

router.put(
  '/:id',
  isAuthenticated,
  authorizeRoles('admin'),
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