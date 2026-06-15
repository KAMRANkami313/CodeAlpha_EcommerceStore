import express from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { isAuthenticated, authorizeRoles } from '../middleware/authMiddleware.js';
import { createOrderValidator } from '../validators/orderValidator.js';
import validate from '../middleware/validateMiddleware.js';
import { body } from 'express-validator';

const router = express.Router();

router.use(isAuthenticated);

router.post('/', createOrderValidator, validate, createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);
router.put(
  '/:id/status',
  authorizeRoles('admin'),
  [body('status').isIn(['processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status')],
  validate,
  updateOrderStatus
);

export default router;