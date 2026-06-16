import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as stripeService from '../services/stripeService.js';

const createPaymentIntent = asyncHandler(async (req, res) => {
  const result = await stripeService.createPaymentIntent(req.user._id);
  res.status(200).json(new ApiResponse(200, result, 'Payment intent created successfully'));
});

const stripeWebhook = async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'];
    const result = await stripeService.handleWebhook(req.body, signature);
    res.status(200).json(result);
  } catch (err) {
    console.error('Stripe webhook error:', err.message);
    res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }
};

export { createPaymentIntent, stripeWebhook };