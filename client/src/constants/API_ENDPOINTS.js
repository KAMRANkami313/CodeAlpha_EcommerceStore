const API = {
  // Auth
  REGISTER: '/api/auth/register',
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  PROFILE: '/api/auth/profile',

  // Products
  PRODUCTS: '/api/products',
  PRODUCT_DETAIL: (id) => `/api/products/${id}`,

  // Cart
  CART: '/api/cart',
  CART_ITEM: (productId) => `/api/cart/${productId}`,

  // Orders
  ORDERS: '/api/orders',
  ORDER_DETAIL: (id) => `/api/orders/${id}`,

  // Payments
  CREATE_PAYMENT_INTENT: '/api/payments/create-payment-intent',

  // Reviews
  PRODUCT_REVIEWS: (productId) => `/api/reviews/product/${productId}`,
  REVIEW_DETAIL: (id) => `/api/reviews/${id}`,

  // Wishlist
  WISHLIST: '/api/wishlist',
  WISHLIST_ITEM: (productId) => `/api/wishlist/${productId}`,
  WISHLIST_CHECK: (productId) => `/api/wishlist/check/${productId}`,

  // Admin
  ADMIN_STATS: '/api/admin/stats',
  ADMIN_ORDERS: '/api/admin/orders',
  ADMIN_ORDER_DETAIL: (id) => `/api/admin/orders/${id}`,
  ADMIN_USERS: '/api/admin/users',
  ADMIN_USER_DETAIL: (id) => `/api/admin/users/${id}`,

  // Health
  HEALTH: '/api/health',
};

export default API;