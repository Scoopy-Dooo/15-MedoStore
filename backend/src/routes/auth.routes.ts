/**
 * مسارات المصادقة
 * Authentication Routes
 */

import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { loginLimiter } from '../middlewares/rateLimiter.js';
import { body } from 'express-validator';

const router = Router();
const authController = new AuthController();

// التحقق من صحة البيانات
const registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('الاسم يجب أن يكون حرفين على الأقل'),
  body('email').isEmail().withMessage('البريد الإلكتروني غير صالح'),
  body('password').isLength({ min: 8 }).withMessage('كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
  body('phone').optional().isMobilePhone('ar-SD').withMessage('رقم الهاتف غير صالح')
];

const loginValidation = [
  body('email').isEmail().withMessage('البريد الإلكتروني غير صالح'),
  body('password').notEmpty().withMessage('كلمة المرور مطلوبة')
];

// المسارات
router.post('/register', registerValidation, authController.register);
router.post('/login', loginLimiter, loginValidation, authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authenticate, authController.logout);
router.get('/profile', authenticate, authController.getProfile);
router.patch('/profile', authenticate, authController.updateProfile);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/verify-email', authController.verifyEmail);

export default router;
