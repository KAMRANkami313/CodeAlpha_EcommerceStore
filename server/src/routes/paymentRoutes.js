import express from 'express';
import { createPaymentIntent } from '../controllers/paymentController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

// NOTE: The Stripe webhook route is mounted directly in app.js BEFORE express.json()
// to ensure the raw body is available for signature verification.
// Do NOT re-register /webhook here — it will break signature validation.

// Authenticated routes
router.post('/create-payment-intent', isAuthenticated, createPaymentIntent);

export default router;