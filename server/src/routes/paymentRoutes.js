import express from 'express';
import { createPaymentIntent, stripeWebhook } from '../controllers/paymentController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

// Webhook route must use raw body — mounted before express.json() in app.js
// Still defining here for organization, but will be mounted separately
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// Authenticated routes
router.post('/create-payment-intent', isAuthenticated, createPaymentIntent);

export default router;