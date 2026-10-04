import { Router } from 'express';
import { body } from 'express-validator';
import { PackagesController } from '../controllers/packages.controller.js';
import { authenticateIfProvided } from '../middlewares/auth.js';

const router = Router();
const packagesController = new PackagesController();

router.use(authenticateIfProvided);

router.get('/', packagesController.getAllPackages);
router.get('/game/:gameId', packagesController.getPackagesByGameId);
router.get('/popular', packagesController.getPopularPackages);
router.get('/:packageId', packagesController.getPackageById);

export default router;

export const createPackageValidation = [
  body('gameId').isString().trim().notEmpty(),
  body('amount').isString().trim().notEmpty().isLength({ max: 100 }),
  body('price').isFloat({ gt: 0 }).toFloat(),
  body('oldPrice').optional({ nullable: true }).isFloat({ min: 0 }).toFloat(),
  body('isPopular').optional().isBoolean().toBoolean(),
  body('stock').optional({ nullable: true }).isInt({ min: 0 }).toInt(),
  body('sortOrder').optional().isInt({ min: 0 }).toInt()
];

export const updatePackageValidation = [
  body('amount').optional().isString().trim().notEmpty().isLength({ max: 100 }),
  body('price').optional().isFloat({ gt: 0 }).toFloat(),
  body('oldPrice').optional({ nullable: true }).isFloat({ min: 0 }).toFloat(),
  body('isPopular').optional().isBoolean().toBoolean(),
  body('isActive').optional().isBoolean().toBoolean(),
  body('stock').optional({ nullable: true }).isInt({ min: 0 }).toInt(),
  body('sortOrder').optional().isInt({ min: 0 }).toInt()
];

export const updateStockValidation = [
  body('stock').isInt({ min: 0 }).toInt()
];
