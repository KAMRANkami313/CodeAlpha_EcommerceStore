import ApiError from '../utils/ApiError.js';
import { verifyToken } from '../utils/generateToken.js';
import User from '../models/User.js';

const isAuthenticated = async (req, res, next) => {
  try {
    let token;

    // Check for token in cookies or Authorization header
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    } else if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Not authenticated. Please log in to access this resource.');
    }

    // Verify token
    const decoded = verifyToken(token);

    // Find user
    const user = await User.findById(decoded.id).select('-password -refreshToken');

    if (!user) {
      throw new ApiError(401, 'User belonging to this token no longer exists.');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(
        new ApiError(403, `Role '${req.user?.role}' is not authorized to access this resource.`)
      );
    }
    next();
  };
};

export { isAuthenticated, authorizeRoles };