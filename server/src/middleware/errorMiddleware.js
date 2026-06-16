import ApiError from '../utils/ApiError.js';
import env from '../config/env.js';

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Always log full error details server-side
  console.error('=== ERROR START ===');
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);
  console.error('URL:', req.originalUrl);
  console.error('Method:', req.method);
  console.error('IP:', req.ip);
  console.error('=== ERROR END ===');

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid: ${err.path}`;
    error = new ApiError(400, message);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value entered for ${field}. Please use another value.`;
    error = new ApiError(400, message);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = new ApiError(400, 'Validation failed', messages);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token. Please log in again.');
  }
  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Your token has expired. Please log in again.');
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = new ApiError(400, 'File too large. Maximum size is 5MB.');
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    error = new ApiError(400, 'Too many files. Maximum is 5 files per upload.');
  }

  // Stripe signature error
  if (err.type === 'StripeSignatureVerificationError') {
    error = new ApiError(400, 'Invalid payment signature.');
  }

  const isDev = env.NODE_ENV === 'development';

  // In production, hide internal error details
  const response = {
    success: false,
    message: error.message || 'Internal Server Error',
    errors: error.errors || [],
  };

  // Only include stack trace and detailed info in development
  if (isDev) {
    response.stack = err.stack;
    response.details = {
      name: err.name,
      code: err.code,
    };
  }

  // In production, don't expose 500 error messages
  if (!isDev && (error.statusCode === 500 || !error.statusCode)) {
    response.message = 'Something went wrong. Please try again later.';
    response.errors = [];
  }

  res.status(error.statusCode || 500).json(response);
};

export default errorHandler;