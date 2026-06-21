import express from 'express';
import {
  getDashboardStats,
  getAllOrders,
  getOrderById,
  getAllUsers,
  getUserById,
  changeUserRole,
  deleteUser,
} from '../controllers/adminController.js';
import { isAuthenticated, authorizeRoles } from '../middleware/authMiddleware.js';
import { updateOrderStatus } from '../controllers/orderController.js';
import { deleteReview } from '../controllers/reviewController.js';
import { body, param } from 'express-validator';
import validate from '../middleware/validateMiddleware.js';

const router = express.Router();

router.use(isAuthenticated, authorizeRoles('admin'));

// ─── Dashboard ────────────────────────────────────────
router.get('/stats', getDashboardStats);

// ─── Orders ───────────────────────────────────────────
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);
router.put(
  '/orders/:id/status',
  [body('status').isIn(['processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status')],
  validate,
  updateOrderStatus
);

// ─── Users ────────────────────────────────────────────
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put(
  '/users/:id/role',
  [
    param('id').isMongoId().withMessage('Invalid user ID'),
    body('role').isIn(['user', 'admin']).withMessage('Role must be "user" or "admin"'),
  ],
  validate,
  changeUserRole
);
router.delete(
  '/users/:id',
  param('id').isMongoId().withMessage('Invalid user ID'),
  validate,
  deleteUser
);

// ─── Reviews (moderation) ─────────────────────────────
router.delete(
  '/reviews/:id',
  param('id').isMongoId().withMessage('Invalid review ID'),
  validate,
  deleteReview
);

export default router;