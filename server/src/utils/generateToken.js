import jwt from 'jsonwebtoken';
import env from '../config/env.js';

const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId, type: 'access' },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRE }
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId, type: 'refresh' },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRE }
  );
};

const verifyAccessToken = (token) => {
  const decoded = jwt.verify(token, env.JWT_SECRET);
  if (decoded.type !== 'access') {
    throw new jwt.JsonWebTokenError('Invalid token type');
  }
  return decoded;
};

const verifyRefreshToken = (token) => {
  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
  if (decoded.type !== 'refresh') {
    throw new jwt.JsonWebTokenError('Invalid token type');
  }
  return decoded;
};

// Keep backward compatibility
const verifyToken = verifyAccessToken;

export { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken, verifyToken };