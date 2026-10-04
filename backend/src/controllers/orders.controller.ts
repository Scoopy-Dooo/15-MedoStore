/**
 * معالج الطلبات
 * Orders Controller
 */

import { Request, Response, NextFunction } from 'express';
import { OrdersService } from '../services/orders.service.js';
import { AppError } from '../middlewares/errorHandler.js';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { getRouteParam } from '../utils/routeParams.js';

export class OrdersController {
  private ordersService: OrdersService;

  constructor() {
    this.ordersService = new OrdersService();
  }

  /**
   * إنشاء طلب جديد
   */
  createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        throw new AppError('المستخدم غير مصرح', 401);
      }

      const { items, playerInfo, notes, promoCode } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        throw new AppError('يجب إضافة عنصر واحد على الأقل', 400);
      }

      // التحقق من صحة كل عنصر
      for (const item of items) {
        if (!item.packageId || !item.quantity || item.quantity < 1) {
          throw new AppError('بيانات العنصر غير صالحة', 400);
        }
      }

      const order = await this.ordersService.createOrder({
        userId,
        items,
        playerInfo,
        notes,
        promoCode
      });

      res.status(201).json({
        success: true,
        message: 'تم إنشاء الطلب بنجاح',
        data: order
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * الحصول على طلبات المستخدم
   */
  getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        throw new AppError('المستخدم غير مصرح', 401);
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await this.ordersService.getUserOrders(userId, page, limit);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * الحصول على طلب واحد
   */
  getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = getRouteParam(req, 'orderId');
      const userId = req.user?.id;
      const userRole = req.user?.role;

      // Admin يمكنه رؤية جميع الطلبات
      const order = await this.ordersService.getOrderById(
        orderId,
        userRole === 'ADMIN' || userRole === 'SUPER_ADMIN' ? undefined : userId
      );

      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * الحصول على طلب برقم الطلب
   */
  getOrderByNumber = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderNumber = getRouteParam(req, 'orderNumber');
      const userId = req.user?.id;
      const userRole = req.user?.role;

      const order = await this.ordersService.getOrderByNumber(
        orderNumber,
        userRole === 'ADMIN' || userRole === 'SUPER_ADMIN' ? undefined : userId
      );

      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * تحديث حالة الطلب (Admin)
   */
  updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = getRouteParam(req, 'orderId');
      const { status, paymentStatus } = req.body;

      if (!status) {
        throw new AppError('حالة الطلب مطلوبة', 400);
      }

      if (!Object.values(OrderStatus).includes(status)) {
        throw new AppError('حالة الطلب غير صالحة', 400);
      }

      if (paymentStatus && !Object.values(PaymentStatus).includes(paymentStatus)) {
        throw new AppError('حالة الدفع غير صالحة', 400);
      }

      const order = await this.ordersService.updateOrderStatus(orderId, {
        status,
        paymentStatus
      });

      res.json({
        success: true,
        message: 'تم تحديث حالة الطلب بنجاح',
        data: order
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * إلغاء الطلب
   */
  cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = getRouteParam(req, 'orderId');
      const userId = req.user?.id;
      const userRole = req.user?.role;

      // Admin يمكنه إلغاء أي طلب
      const order = await this.ordersService.cancelOrder(
        orderId,
        userRole === 'ADMIN' || userRole === 'SUPER_ADMIN' ? undefined : userId
      );

      res.json({
        success: true,
        message: 'تم إلغاء الطلب بنجاح',
        data: order
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * الحصول على جميع الطلبات (Admin)
   */
  getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as OrderStatus;
      const paymentStatus = req.query.paymentStatus as PaymentStatus;
      const userId = req.query.userId as string;
      const search = req.query.search as string;

      const result = await this.ordersService.getAllOrders({
        page,
        limit,
        status,
        paymentStatus,
        userId,
        search
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
   * توليد رسالة WhatsApp للطلب
   */
  getWhatsAppMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = getRouteParam(req, 'orderId');
      const userId = req.user?.id;
      const userRole = req.user?.role;

      const order = await this.ordersService.getOrderById(
        orderId,
        userRole === 'ADMIN' || userRole === 'SUPER_ADMIN' ? undefined : userId
      );

      const message = this.ordersService.generateWhatsAppMessage(order);
      const whatsappUrl = `https://wa.me/249908180432?text=${message}`;

      res.json({
        success: true,
        data: {
          message: decodeURIComponent(message),
          whatsappUrl
        }
      });
    } catch (error) {
      next(error);
    }
  };
}
