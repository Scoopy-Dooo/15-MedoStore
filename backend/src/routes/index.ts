import { Router } from 'express';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';
import gamesRoutes from './games.routes.js';
import packagesRoutes from './packages.routes.js';
// import ordersRoutes from './orders.routes.js';  // معطل مؤقتاً

const router = Router();

router.use('/auth', authRoutes);
router.use('/games', gamesRoutes);
router.use('/packages', packagesRoutes);
router.use('/admin', adminRoutes);
// router.use('/orders', ordersRoutes);  // معطل مؤقتاً

export default router;
