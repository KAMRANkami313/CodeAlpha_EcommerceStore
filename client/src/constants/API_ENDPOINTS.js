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

  // Reviews
  PRODUCT_REVIEWS: (productId) => `/api/reviews/product/${productId}`,
  REVIEW_DETAIL: (id) => `/api/reviews/${id}`,

  // Wishlist
  WISHLIST: '/api/wishlist',
  WISHLIST_ITEM: (productId) => `/api/wishlist/${productId}`,
  WISHLIST_CHECK: (productId) => `/api/wishlist/check/${productId}`,

  // Health
  HEALTH: '/api/health',
};

export default API;