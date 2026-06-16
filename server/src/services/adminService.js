import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

const getDashboardStats = async () => {
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments({ isActive: true });
  const totalUsers = await User.countDocuments();
  const totalRevenue = await Order.aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);

  const ordersByStatus = await Order.aggregate([
    { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
  ]);

  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name email');

  const revenueByMonth = await Order.aggregate([
    { $match: { paymentStatus: 'paid' } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        revenue: { $sum: '$totalPrice' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);

  const topProducts = await Order.aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        name: { $first: '$items.name' },
        totalSold: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
  ]);

  return {
    totalOrders,
    totalProducts,
    totalUsers,
    totalRevenue: totalRevenue[0]?.total || 0,
    ordersByStatus: ordersByStatus.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    recentOrders,
    revenueByMonth: revenueByMonth.reverse(),
    topProducts,
  };
};

const getAllOrders = async (filters = {}) => {
  const { status, page = 1, limit = 10, search } = filters;
  const query = {};

  if (status && status !== 'all') {
    query.orderStatus = status;
  }

  if (search) {
    query.$or = [
      { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
      { 'shippingAddress.phone': { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('user', 'name email');

  return {
    orders,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit),
    },
  };
};

const getOrderByIdAdmin = async (orderId) => {
  const order = await Order.findById(orderId).populate('user', 'name email phone');
  return order;
};

const getAllUsers = async (filters = {}) => {
  const { page = 1, limit = 10, search, role } = filters;
  const query = {};

  if (role && role !== 'all') {
    query.role = role;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select('-password -refreshToken')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Get order count per user
  const usersWithStats = await Promise.all(
    users.map(async (user) => {
      const orderCount = await Order.countDocuments({ user: user._id });
      const totalSpent = await Order.aggregate([
        { $match: { user: user._id, paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]);
      return {
        ...user.toObject(),
        orderCount,
        totalSpent: totalSpent[0]?.total || 0,
      };
    })
  );

  return {
    users: usersWithStats,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit),
    },
  };
};

const getUserByIdAdmin = async (userId) => {
  const user = await User.findById(userId).select('-password -refreshToken');
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).limit(10);
  return { user, orders };
};

export {
  getDashboardStats,
  getAllOrders,
  getOrderByIdAdmin,
  getAllUsers,
  getUserByIdAdmin,
};