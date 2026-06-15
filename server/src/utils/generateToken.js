import jwt from 'jsonwebtoken';
import env from '../config/env.js';

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRE,
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

export { generateAccessToken, generateRefreshToken, verifyToken };