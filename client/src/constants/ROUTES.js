/**
 * Frontend route constants — used by React Router for page navigation.
 * These are PAGE routes (URLs the user sees in the browser).
 *
 * For API endpoint constants, see API_ENDPOINTS.js
 */
const ROUTES = {
  // ─── Public / Store ────────────────────────────────
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id) => `/products/${id}`,
  CART: '/cart',
  LOGIN: '/login',
  REGISTER: '/register',
  CHECKOUT: '/checkout',
  ORDER_SUCCESS: '/order-success',
  PROFILE: '/profile',
  ORDER_DETAIL: (id) => `/orders/${id}`,
  WISHLIST: '/wishlist',

  // ─── Admin ─────────────────────────────────────────
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_USERS: '/admin/users',
};

export default ROUTES;