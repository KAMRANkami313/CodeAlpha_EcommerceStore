import Stripe from 'stripe';
import env from '../config/env.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import ApiError from '../utils/ApiError.js';

export const isStripeConfigured = !!(env.STRIPE_SECRET_KEY && env.STRIPE_SECRET_KEY.length > 10);

// Only initialize Stripe if the key is properly configured
const stripe = isStripeConfigured ? new Stripe(env.STRIPE_SECRET_KEY) : null;

/**
 * Create a Stripe PaymentIntent for the user's cart
 */
const createPaymentIntent = async (userId) => {
  if (!isStripeConfigured || !stripe) {
    throw new ApiError(503, 'Stripe is not configured. Please use Cash on Delivery instead.');
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, 'Your cart is empty.');
  }

  // Verify stock availability
  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (!product) throw new ApiError(404, `Product ${item.name} no longer exists`);
    if (product.stock < item.quantity) {
      throw new ApiError(400, `Insufficient stock for ${item.name}. Available: ${product.stock}`);
    }
  }

  const itemsPrice = cart.totalPrice;
  const shippingPrice = itemsPrice > 5000 ? 0 : 150;
  const totalAmount = itemsPrice + shippingPrice;

  // Stripe expects amount in smallest currency unit (paisa for PKR)
  const amountInPaisa = Math.round(totalAmount * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInPaisa,
    currency: 'usd',
    metadata: {
      userId: userId.toString(),
      itemsPrice: itemsPrice.toString(),
      shippingPrice: shippingPrice.toString(),
      totalAmount: totalAmount.toString(),
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    totalAmount,
    itemsPrice,
    shippingPrice,
  };
};

/**
 * Handle Stripe webhook events
 */
const handleWebhook = async (payload, signature) => {
  if (!isStripeConfigured || !stripe || !env.STRIPE_WEBHOOK_SECRET) {
    throw new ApiError(503, 'Stripe webhook not configured');
  }

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    env.STRIPE_WEBHOOK_SECRET
  );

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      // Find order by stripePaymentId and update payment status
      const order = await Order.findOne({ stripePaymentId: paymentIntent.id });
      if (order) {
        order.paymentStatus = 'paid';
        await order.save();
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      const order = await Order.findOne({ stripePaymentId: paymentIntent.id });
      if (order) {
        order.paymentStatus = 'failed';
        // Restore stock for failed payment
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity },
          });
        }
        order.orderStatus = 'cancelled';
        await order.save();
      }
      break;
    }

    default:
      // Unhandled event type
      break;
  }

  return { received: true };
};

export { createPaymentIntent, handleWebhook };