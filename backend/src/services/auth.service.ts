/**
 * خدمة المصادقة
 * Authentication Service
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import { AppError } from '../middlewares/errorHandler.js';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

interface UpdateProfileData {
  name?: string;
  phone?: string;
  avatar?: string;
}

export class AuthService {
  /**
   * تسجيل مستخدم جديد
   */
  async register(data: RegisterData) {
    const { name, email, password, phone } = data;

    // التحقق من وجود المستخدم
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone: phone || '' }
        ]
      }
    });

    if (existingUser) {
      throw new AppError('البريد الإلكتروني أو رقم الهاتف مستخدم بالفعل', 400);
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء المستخدم
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true
      }
    });

    // إنشاء Tokens
    const accessToken = this.generateAccessToken(user.id, email, user.role);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      user,
      accessToken,
      refreshToken
    };
  }

  /**
   * تسجيل الدخول
   */
  async login(email: string, password: string) {
    // البحث عن المستخدم
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        isActive: true
      }
    });

    if (!user) {
      throw new AppError('البريد الإلكتروني أو كلمة المرور غير صحيحة', 401);
    }

    if (!user.isActive) {
      throw new AppError('الحساب محظور. يرجى التواصل مع الدعم', 403);
    }

    // التحقق من كلمة المرور
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError('البريد الإلكتروني أو كلمة المرور غير صحيحة', 401);
    }

    // تحديث آخر تسجيل دخول
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // إنشاء Tokens
    const accessToken = this.generateAccessToken(user.id, email, user.role);
    const refreshToken = this.generateRefreshToken(user.id);

    // حذف كلمة المرور من الاستجابة
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken
    };
  }

  /**
   * تحديث Access Token
   */
  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || 'refresh-secret'
      ) as { userId: string };

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true
        }
      });

      if (!user || !user.isActive) {
        throw new AppError('مستخدم غير صالح', 401);
      }

      const accessToken = this.generateAccessToken(user.id, user.email, user.role);

      return { accessToken };
    } catch (error) {
      throw new AppError('Refresh token غير صالح', 401);
    }
  }

  /**
   * الحصول على الملف الشخصي
   */
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        loyaltyPoints: true,
        isVerified: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            reviews: true,
            wishlist: true
          }
        }
      }
    });

    if (!user) {
      throw new AppError('المستخدم غير موجود', 404);
    }

    return user;
  }

  /**
   * تحديث الملف الشخصي
   */
  async updateProfile(userId: string, data: UpdateProfileData) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        loyaltyPoints: true
      }
    });

    return user;
  }

  /**
   * نسيت كلمة المرور
   */
  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // عدم إظهار أن المستخدم غير موجود (أمان)
      return;
    }

    // إنشاء token لإعادة التعيين (مؤقت - 1 ساعة)
    const resetToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    // هنا يتم إرسال البريد الإلكتروني (سيتم تطبيقه لاحقاً)
    // await emailService.sendPasswordReset(email, resetToken);
  }

  /**
   * إعادة تعيين كلمة المرور
   */
  async resetPassword(token: string, newPassword: string) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'secret'
      ) as { userId: string };

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: decoded.userId },
        data: { password: hashedPassword }
      });
    } catch (error) {
      throw new AppError('الرابط غير صالح أو منتهي الصلاحية', 400);
    }
  }

  /**
   * التحقق من البريد الإلكتروني
   */
  async verifyEmail(token: string) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'secret'
      ) as { userId: string };

      await prisma.user.update({
        where: { id: decoded.userId },
        data: { isVerified: true }
      });
    } catch (error) {
      throw new AppError('رابط التحقق غير صالح', 400);
    }
  }

  /**
   * إنشاء Access Token
   */
  private generateAccessToken(userId: string, email: string, role: string): string {
    return jwt.sign(
      { userId, email, role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
  }

  /**
   * إنشاء Refresh Token
   */
  private generateRefreshToken(userId: string): string {
    return jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );
  }
}
