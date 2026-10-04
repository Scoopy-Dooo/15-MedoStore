/**
 * مسارات لوحة التحكم الإدارية
 * Admin Dashboard Routes
 */

import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();
const adminController = new AdminController();

// جميع المسارات تتطلب صلاحيات Admin
router.use(authenticate);
router.use(authorize('ADMIN', 'SUPER_ADMIN'));

// Dashboard Stats
router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/dashboard/recent-orders', adminController.getRecentOrders);
router.get('/dashboard/recent-users', adminController.getRecentUsers);

// User Management
router.get('/users', adminController.getAllUsers);
router.get('/users/:userId/stats', adminController.getUserStats);
router.patch('/users/:userId/status', adminController.updateUserStatus);
router.patch('/users/:userId/role', adminController.updateUserRole);
router.delete('/users/:userId', adminController.deleteUser);

export default router;
