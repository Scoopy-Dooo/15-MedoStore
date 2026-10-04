/**
 * معالج لوحة التحكم الإدارية
 * Admin Dashboard Controller
 */

import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service.js';
import { AppError } from '../middlewares/errorHandler.js';

export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  /**
   * الحصول على إحصائيات Dashboard
   */
  getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await this.adminService.getDashboardStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * الحصول على آخر الطلبات
   */
  getRecentOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const orders = await this.adminService.getRecentOrders(limit);

      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * الحصول على آخر المستخدمين
   */
  getRecentUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const users = await this.adminService.getRecentUsers(limit);

      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * الحصول على جميع المستخدمين
   */
  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = req.query.search as string;
      const role = req.query.role as string;
      const isActive = req.query.isActive === 'true' ? true : 
                      req.query.isActive === 'false' ? false : undefined;

      const result = await this.adminService.getAllUsers({
        page,
        limit,
        search,
        role,
        isActive
      });

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * تحديث حالة المستخدم
   */
  updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const { isActive } = req.body;

      if (typeof isActive !== 'boolean') {
        throw new AppError('isActive يجب أن يكون true أو false', 400);
      }

      const user = await this.adminService.updateUserStatus(userId, isActive);

      res.json({
        success: true,
        message: isActive ? 'تم تفعيل المستخدم بنجاح' : 'تم إيقاف المستخدم بنجاح',
        data: user
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * تحديث دور المستخدم
   */
  updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!['USER', 'ADMIN', 'SUPER_ADMIN'].includes(role)) {
        throw new AppError('الدور غير صالح', 400);
      }

      const user = await this.adminService.updateUserRole(userId, role);

      res.json({
        success: true,
        message: 'تم تحديث دور المستخدم بنجاح',
        data: user
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * حذف مستخدم
   */
  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;

      await this.adminService.deleteUser(userId);

      res.json({
        success: true,
        message: 'تم حذف المستخدم بنجاح'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * الحصول على إحصائيات مستخدم
   */
  getUserStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;

      const stats = await this.adminService.getUserStats(userId);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  };
}
