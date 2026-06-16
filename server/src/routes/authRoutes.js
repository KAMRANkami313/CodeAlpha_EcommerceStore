import express from 'express';
import { register, login, logout, refreshToken, getProfile, updateProfile } from '../controllers/authController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';
import { registerValidator, loginValidator, updateProfileValidator } from '../validators/authValidator.js';
import validate from '../middleware/validateMiddleware.js';

const router = express.Router();

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/refresh-token', refreshToken);
router.post('/logout', isAuthenticated, logout);
router.get('/profile', isAuthenticated, getProfile);
router.put('/profile', isAuthenticated, updateProfileValidator, validate, updateProfile);

export default router;