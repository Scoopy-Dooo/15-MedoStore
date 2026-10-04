/**
 * خدمة الباقات
 * Packages Service
 */

import prisma from '../config/database.js';
import { AppError } from '../middlewares/errorHandler.js';
import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

interface CreatePackageData {
  gameId: string;
  amount: string;
  price: number;
  oldPrice?: number | null;
  isPopular?: boolean;
  stock?: number;
  sortOrder?: number;
}

interface UpdatePackageData {
  amount?: string;
  price?: number;
  oldPrice?: number | null;
  isPopular?: boolean;
  isActive?: boolean;
  stock?: number;
  sortOrder?: number;
}

interface GetPackagesParams {
  gameId?: string;
  isPopular?: boolean;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'amount' | 'createdAt' | 'sortOrder';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export class PackagesService {
  /**
   * الحصول على جميع الباقات
   */
  async getAllPackages(params: GetPackagesParams) {
    const {
      gameId,
      isPopular,
      isActive,
      minPrice,
      maxPrice,
      sortBy = 'sortOrder',
      sortOrder = 'asc',
      page = 1,
      limit = 50
    } = params;

    const skip = (page - 1) * limit;

    const where: Prisma.PackageWhereInput = {
      ...(gameId && { gameId }),
      ...(isPopular !== undefined && { isPopular }),
      ...(isActive !== undefined && { isActive }),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined && { gte: new Decimal(minPrice) }),
              ...(maxPrice !== undefined && { lte: new Decimal(maxPrice) })
            }
          }
        : {})
    };

    // تحديد حقل الترتيب
    const orderByField: Prisma.PackageOrderByWithRelationInput = {
      [sortBy]: sortOrder
    };

    const [packages, total] = await Promise.all([
      prisma.package.findMany({
        where,
        skip,
        take: limit,
        orderBy: orderByField,
        include: {
          game: {
            select: {
              id: true,
              name: true,
              nameAr: true,
              image: true,
              category: true
            }
          }
        }
      }),
      prisma.package.count({ where })
    ]);

    return {
      packages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * الحصول على باقة واحدة
   */
  async getPackageById(packageId: string) {
    const packageData = await prisma.package.findUnique({
      where: { id: packageId },
      include: {
        game: true
      }
    });

    if (!packageData) {
      throw new AppError('الباقة غير موجودة', 404);
    }

    return packageData;
  }

  /**
   * الحصول على باقات لعبة معينة
   */
  async getPackagesByGameId(gameId: string) {
    const packages = await prisma.package.findMany({
      where: {
        gameId,
        isActive: true
      },
      orderBy: { sortOrder: 'asc' }
    });

    return packages;
  }

  /**
   * إنشاء باقة جديدة (Admin)
   */
  async createPackage(data: CreatePackageData) {
    // التحقق من وجود اللعبة
    const game = await prisma.game.findUnique({
      where: { id: data.gameId }
    });

    if (!game) {
      throw new AppError('اللعبة غير موجودة', 404);
    }

    const packageData = await prisma.package.create({
      data: {
        ...data,
        price: new Decimal(data.price),
        oldPrice: data.oldPrice != null ? new Decimal(data.oldPrice) : undefined
      },
      include: {
        game: {
          select: {
            name: true,
            nameAr: true
          }
        }
      }
    });

    return packageData;
  }

  /**
   * تحديث باقة (Admin)
   */
  async updatePackage(packageId: string, data: UpdatePackageData) {
    const updateData: Prisma.PackageUpdateInput = {
      ...(data.amount !== undefined && { amount: data.amount }),
      ...(data.price !== undefined && { price: new Decimal(data.price) }),
      ...(data.oldPrice !== undefined && {
        oldPrice: data.oldPrice === null ? null : new Decimal(data.oldPrice)
      }),
      ...(data.isPopular !== undefined && { isPopular: data.isPopular }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(data.stock !== undefined && { stock: data.stock }),
      ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder })
    };

    const packageData = await prisma.package.update({
      where: { id: packageId },
      data: updateData,
      include: {
        game: {
          select: {
            name: true,
            nameAr: true
          }
        }
      }
    });

    return packageData;
  }

  /**
   * حذف باقة (Admin)
   */
  async deletePackage(packageId: string) {
    // التحقق من عدم وجود طلبات مرتبطة
    const ordersCount = await prisma.orderItem.count({
      where: { packageId }
    });

    if (ordersCount > 0) {
      throw new AppError('لا يمكن حذف الباقة لوجود طلبات مرتبطة بها', 400);
    }

    await prisma.package.delete({
      where: { id: packageId }
    });
  }

  /**
   * الحصول على الباقات الشائعة
   */
  async getPopularPackages(limit: number = 10) {
    const packages = await prisma.package.findMany({
      where: {
        isPopular: true,
        isActive: true
      },
      take: limit,
      orderBy: { sortOrder: 'asc' },
      include: {
        game: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            image: true
          }
        }
      }
    });

    return packages;
  }

  /**
   * تحديث المخزون (Admin)
   */
  async updateStock(packageId: string, stock: number) {
    if (stock < 0) {
      throw new AppError('المخزون لا يمكن أن يكون سالباً', 400);
    }

    const packageData = await prisma.package.update({
      where: { id: packageId },
      data: { stock },
      select: {
        id: true,
        amount: true,
        stock: true,
        game: {
          select: {
            name: true,
            nameAr: true
          }
        }
      }
    });

    return packageData;
  }

  /**
   * التحقق من توفر الباقة
   */
  async checkAvailability(packageId: string, quantity: number = 1): Promise<boolean> {
    const packageData = await prisma.package.findUnique({
      where: { id: packageId },
      select: {
        isActive: true,
        stock: true
      }
    });

    if (!packageData || !packageData.isActive) {
      return false;
    }

    return packageData.stock >= quantity;
  }

  /**
   * خصم من المخزون (عند الطلب)
   */
  async decrementStock(packageId: string, quantity: number = 1) {
    const packageData = await prisma.package.findUnique({
      where: { id: packageId },
      select: { stock: true }
    });

    if (!packageData || packageData.stock < quantity) {
      throw new AppError('المخزون غير كافٍ', 400);
    }

    await prisma.package.update({
      where: { id: packageId },
      data: {
        stock: {
          decrement: quantity
        }
      }
    });
  }

  /**
   * إضافة للمخزون (عند الإلغاء/الاسترجاع)
   */
  async incrementStock(packageId: string, quantity: number = 1) {
    await prisma.package.update({
      where: { id: packageId },
      data: {
        stock: {
          increment: quantity
        }
      }
    });
  }
}
