/**
 * مسارات لوحة التحكم الإدارية
 * Admin Dashboard Routes
 */

import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { GamesController } from '../controllers/games.controller.js';
import { createGameValidation, updateGameValidation } from './games.routes.js';
import { PackagesController } from '../controllers/packages.controller.js';
import {
  createPackageValidation,
  updatePackageValidation,
  updateStockValidation
} from './packages.routes.js';
import { UploadController } from '../controllers/upload.controller.js';
import { uploadSingleImage } from '../middlewares/imageUpload.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = Router();
const adminController = new AdminController();
const gamesController = new GamesController();
const packagesController = new PackagesController();
const uploadController = new UploadController();

// جميع المسارات تتطلب صلاحيات Admin
router.use(authenticate);
router.use(authorize('ADMIN', 'SUPER_ADMIN'));

// Dashboard Stats
router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/dashboard/recent-orders', adminController.getRecentOrders);
router.get('/dashboard/recent-users', adminController.getRecentUsers);

// Game management
router.post('/games', createGameValidation, gamesController.createGame);
router.put('/games/:gameId', updateGameValidation, gamesController.updateGame);
router.delete('/games/:gameId', gamesController.deleteGame);

// Package management
router.post('/packages', createPackageValidation, packagesController.createPackage);
router.put('/packages/:packageId', updatePackageValidation, packagesController.updatePackage);
router.delete('/packages/:packageId', packagesController.deletePackage);
router.patch(
  '/packages/:packageId/stock',
  updateStockValidation,
  packagesController.updateStock
);
router.post('/upload', uploadSingleImage, uploadController.uploadImage);

// User Management
router.get('/users', adminController.getAllUsers);
router.get('/users/:userId/stats', adminController.getUserStats);
router.patch('/users/:userId/status', adminController.updateUserStatus);
router.patch('/users/:userId/role', adminController.updateUserRole);
router.delete('/users/:userId', adminController.deleteUser);

export default router;
