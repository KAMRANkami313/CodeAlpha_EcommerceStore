import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';

const createOrder = async (userId, orderData) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, 'Your cart is empty. Add items before placing an order.');
  }

  // ─── Atomic stock verification & reservation ──────────────
  // Use findOneAndUpdate with a condition to prevent race conditions.
  // We verify AND decrement in a single atomic operation.
  for (const item of cart.items) {
    const updated = await Product.findOneAndUpdate(
      { _id: item.product, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } },
      { new: true }
    );

    if (!updated) {
      // Stock was insufficient — roll back any previously decremented stock
      for (const prevItem of cart.items) {
        if (prevItem.product.toString() === item.product.toString()) break; // stop at the failed item
        await Product.findByIdAndUpdate(prevItem.product, {
          $inc: { stock: prevItem.quantity },
        });
      }

      const product = await Product.findById(item.product);
      if (!product) {
        throw new ApiError(404, `Product ${item.name} no longer exists`);
      }
      throw new ApiError(400, `Insufficient stock for ${item.name}. Available: ${product.stock}`);
    }
  }

  const itemsPrice = cart.totalPrice;
  const shippingPrice = itemsPrice > 5000 ? 0 : 150; // Free shipping over PKR 5000
  const totalPrice = itemsPrice + shippingPrice;

  const order = await Order.create({
    user: userId,
    items: cart.items,
    shippingAddress: orderData.shippingAddress,
    itemsPrice,
    shippingPrice,
    totalPrice,
    paymentMethod: orderData.paymentMethod,
    stripePaymentId: orderData.stripePaymentId || null,
    paymentStatus: orderData.paymentMethod === 'Card' && orderData.stripePaymentId ? 'paid' : 'pending',
  });

  // Clear the cart
  cart.items = [];
  await cart.save();

  return order;
};

const getOrderById = async (orderId, userId) => {
  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) throw new ApiError(404, 'Order not found');
  return order;
};

const getMyOrders = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const total = await Order.countDocuments({ user: userId });

  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    orders,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  };
};

const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');

  order.orderStatus = status;

  if (status === 'delivered') {
    order.deliveredAt = new Date();
    order.paymentStatus = 'paid';
  }

  if (status === 'cancelled') {
    // Restore stock atomically
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }
  }

  await order.save();
  return order;
};

export { createOrder, getOrderById, getMyOrders, updateOrderStatus };