/**
 * معالج المصادقة
 * Authentication Controller
 */

import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { AppError } from '../middlewares/errorHandler.js';
import { validationResult } from 'express-validator';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * تسجيل مستخدم جديد
   */
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // التحقق من صحة البيانات
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const { name, email, password, phone } = req.body;

      const result = await this.authService.register({ 
        name, 
        email, 
        password, 
        phone 
      });

      res.status(201).json({
        success: true,
        message: 'تم التسجيل بنجاح',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * تسجيل الدخول
   */
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const { email, password } = req.body;

      const result = await this.authService.login(email, password);

      res.json({
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * تحديث Token
   */
  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new AppError('Refresh token مطلوب', 400);
      }

      const result = await this.authService.refreshToken(refreshToken);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * تسجيل الخروج
   */
  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // يمكن إضافة منطق لإبطال Token هنا
      res.json({
        success: true,
        message: 'تم تسجيل الخروج بنجاح'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * الحصول على الملف الشخصي
   */
  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('غير مصرح', 401);
      }

      const profile = await this.authService.getProfile(req.user.id);

      res.json({
        success: true,
        data: profile
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * تحديث الملف الشخصي
   */
  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('غير مصرح', 401);
      }

      const { name, phone, avatar } = req.body;

      const updatedProfile = await this.authService.updateProfile(
        req.user.id,
        { name, phone, avatar }
      );

      res.json({
        success: true,
        message: 'تم تحديث الملف الشخصي بنجاح',
        data: updatedProfile
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * نسيت كلمة المرور
   */
  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      await this.authService.forgotPassword(email);

      res.json({
        success: true,
        message: 'تم إرسال رابط إعادة تعيين كلمة المرور للبريد الإلكتروني'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * إعادة تعيين كلمة المرور
   */
  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, newPassword } = req.body;

      await this.authService.resetPassword(token, newPassword);

      res.json({
        success: true,
        message: 'تم تغيير كلمة المرور بنجاح'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * التحقق من البريد الإلكتروني
   */
  verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;

      await this.authService.verifyEmail(token);

      res.json({
        success: true,
        message: 'تم التحقق من البريد الإلكتروني بنجاح'
      });
    } catch (error) {
      next(error);
    }
  };
}
