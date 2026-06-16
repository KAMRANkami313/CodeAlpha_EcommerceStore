import express from 'express';
import {
  getDashboardStats,
  getAllOrders,
  getOrderById,
  getAllUsers,
  getUserById,
} from '../controllers/adminController.js';
import { isAuthenticated, authorizeRoles } from '../middleware/authMiddleware.js';
import { updateOrderStatus } from '../controllers/orderController.js';
import { body } from 'express-validator';
import validate from '../middleware/validateMiddleware.js';

const router = express.Router();

router.use(isAuthenticated, authorizeRoles('admin'));

router.get('/stats', getDashboardStats);
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);
router.put(
  '/orders/:id/status',
  [body('status').isIn(['processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status')],
  validate,
  updateOrderStatus
);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);

export default router;
