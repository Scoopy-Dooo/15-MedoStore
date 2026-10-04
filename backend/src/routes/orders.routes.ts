/**
 * مسارات الطلبات
 * Orders Routes
 */

import { Router } from 'express';
import { OrdersController } from '../controllers/orders.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { body } from 'express-validator';

const router = Router();
const ordersController = new OrdersController();

// التحقق من صحة البيانات لإنشاء الطلب
const createOrderValidation = [
  body('items').isArray({ min: 1 }).withMessage('يجب إضافة عنصر واحد على الأقل'),
  body('items.*.packageId').notEmpty().withMessage('معرف الباقة مطلوب'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('الكمية يجب أن تكون 1 على الأقل'),
  body('promoCode').optional().isString(),
  body('notes').optional().isString().isLength({ max: 500 }).withMessage('الملاحظات طويلة جداً')
];

// مسارات المستخدمين (تتطلب تسجيل الدخول)
router.use(authenticate);

// إنشاء طلب جديد
router.post('/', createOrderValidation, ordersController.createOrder);

// الحصول على طلبات المستخدم
router.get('/my-orders', ordersController.getUserOrders);

// الحصول على طلب واحد
router.get('/:orderId', ordersController.getOrderById);

// الحصول على طلب برقم الطلب
router.get('/number/:orderNumber', ordersController.getOrderByNumber);

// إلغاء طلب
router.patch('/:orderId/cancel', ordersController.cancelOrder);

// توليد رسالة WhatsApp
router.get('/:orderId/whatsapp', ordersController.getWhatsAppMessage);

// مسارات Admin
router.get('/', authorize('ADMIN', 'SUPER_ADMIN'), ordersController.getAllOrders);
router.patch('/:orderId/status', authorize('ADMIN', 'SUPER_ADMIN'), ordersController.updateOrderStatus);

export default router;
