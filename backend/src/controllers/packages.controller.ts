import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { PackagesService } from '../services/packages.service.js';
import { AppError } from '../middlewares/errorHandler.js';
import { getRouteParam } from '../utils/routeParams.js';

const parsePositiveInteger = (
  value: unknown,
  name: string,
  fallback: number,
  maximum: number
): number => {
  if (value === undefined) return fallback;
  if (typeof value !== 'string' || !/^\d+$/.test(value)) {
    throw new AppError(`${name} must be a positive integer`, 400);
  }

  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1 || parsed > maximum) {
    throw new AppError(`${name} must be between 1 and ${maximum}`, 400);
  }

  return parsed;
};

const parseBooleanQuery = (value: unknown, name: string): boolean | undefined => {
  if (value === undefined) return undefined;
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new AppError(`${name} must be true or false`, 400);
};

const parsePriceQuery = (value: unknown, name: string): number | undefined => {
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || value.trim() === '') {
    throw new AppError(`${name} must be a valid non-negative number`, 400);
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new AppError(`${name} must be a valid non-negative number`, 400);
  }

  return parsed;
};

const allowedSortFields = ['price', 'amount', 'createdAt', 'sortOrder'] as const;

export class PackagesController {
  private readonly packagesService = new PackagesService();

  getAllPackages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { gameId, sortBy, sortOrder } = req.query;
      if (
        (gameId !== undefined && typeof gameId !== 'string') ||
        (sortBy !== undefined &&
          (typeof sortBy !== 'string' ||
            !allowedSortFields.includes(sortBy as (typeof allowedSortFields)[number]))) ||
        (sortOrder !== undefined && sortOrder !== 'asc' && sortOrder !== 'desc')
      ) {
        throw new AppError('Invalid package filters', 400);
      }

      const requestedActive = parseBooleanQuery(req.query.isActive, 'isActive');
      const isAdmin = req.user?.role === 'ADMIN' || req.user?.role === 'SUPER_ADMIN';
      const result = await this.packagesService.getAllPackages({
        gameId,
        isPopular: parseBooleanQuery(req.query.isPopular, 'isPopular'),
        isActive: requestedActive ?? (isAdmin ? undefined : true),
        minPrice: parsePriceQuery(req.query.minPrice, 'minPrice'),
        maxPrice: parsePriceQuery(req.query.maxPrice, 'maxPrice'),
        sortBy: sortBy as (typeof allowedSortFields)[number] | undefined,
        sortOrder: sortOrder as 'asc' | 'desc' | undefined,
        page: parsePositiveInteger(req.query.page, 'page', 1, 1000000),
        limit: parsePositiveInteger(req.query.limit, 'limit', 50, 100)
      });

      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getPackagesByGameId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const packages = await this.packagesService.getPackagesByGameId(
        getRouteParam(req, 'gameId')
      );
      res.json({ success: true, data: packages });
    } catch (error) {
      next(error);
    }
  };

  getPopularPackages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = parsePositiveInteger(req.query.limit, 'limit', 10, 100);
      const packages = await this.packagesService.getPopularPackages(limit);
      res.json({ success: true, data: packages });
    } catch (error) {
      next(error);
    }
  };

  getPackageById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const packageData = await this.packagesService.getPackageById(
        getRouteParam(req, 'packageId')
      );
      if (
        !packageData.isActive &&
        req.user?.role !== 'ADMIN' &&
        req.user?.role !== 'SUPER_ADMIN'
      ) {
        throw new AppError('الباقة غير موجودة', 404);
      }

      res.json({ success: true, data: packageData });
    } catch (error) {
      next(error);
    }
  };

  createPackage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const { gameId, amount, price, oldPrice, isPopular, stock, sortOrder } = req.body;
      const packageData = await this.packagesService.createPackage({
        gameId,
        amount,
        price,
        oldPrice: oldPrice ?? undefined,
        isPopular,
        stock: stock ?? undefined,
        sortOrder
      });

      res.status(201).json({
        success: true,
        message: 'Package created successfully',
        data: packageData
      });
    } catch (error) {
      next(error);
    }
  };

  updatePackage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const { amount, price, oldPrice, isPopular, isActive, stock, sortOrder } = req.body;
      const packageData = await this.packagesService.updatePackage(
        getRouteParam(req, 'packageId'),
        {
          amount,
          price,
          oldPrice,
          isPopular,
          isActive,
          stock: stock === null ? 999 : stock,
          sortOrder
        }
      );

      res.json({ success: true, message: 'Package updated successfully', data: packageData });
    } catch (error) {
      next(error);
    }
  };

  deletePackage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.packagesService.deletePackage(getRouteParam(req, 'packageId'));
      res.json({ success: true, message: 'Package deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  updateStock = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const packageData = await this.packagesService.updateStock(
        getRouteParam(req, 'packageId'),
        req.body.stock
      );
      res.json({ success: true, message: 'Stock updated successfully', data: packageData });
    } catch (error) {
      next(error);
    }
  };
}
