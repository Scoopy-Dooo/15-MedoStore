/**
 * خدمة لوحة التحكم الإدارية
 * Admin Dashboard Service
 */

import prisma from '../config/database.js';
import { AppError } from '../middlewares/errorHandler.js';
import { Prisma } from '@prisma/client';

interface DashboardStats {
  users: {
    total: number;
    active: number;
    verified: number;
    newThisMonth: number;
  };
  orders: {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    totalRevenue: number;
    averageOrderValue: number;
  };
  games: {
    total: number;
    active: number;
  };
  packages: {
    total: number;
    popular: number;
  };
}

export class AdminService {
  /**
   * الحصول على إحصائيات Dashboard الرئيسية
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // إحصائيات المستخدمين
    const [totalUsers, activeUsers, verifiedUsers, newUsersThisMonth] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isVerified: true } }),
      prisma.user.count({
        where: {
          createdAt: { gte: firstDayOfMonth }
        }
      })
    ]);

    // إحصائيات الطلبات
    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      completedOrders,
      ordersWithTotals
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'PROCESSING' } }),
      prisma.order.count({ where: { status: 'COMPLETED' } }),
      prisma.order.aggregate({
        _sum: { total: true },
        _count: true
      })
    ]);

    const totalRevenue = Number(ordersWithTotals._sum.total || 0);
    const averageOrderValue = ordersWithTotals._count > 0 
      ? totalRevenue / ordersWithTotals._count 
      : 0;

    // إحصائيات الألعاب والباقات
    const [totalGames, activeGames, totalPackages, popularPackages] = await Promise.all([
      prisma.game.count(),
      prisma.game.count({ where: { isActive: true } }),
      prisma.package.count(),
      prisma.package.count({ where: { isPopular: true } })
    ]);

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        verified: verifiedUsers,
        newThisMonth: newUsersThisMonth
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        processing: processingOrders,
        completed: completedOrders,
        totalRevenue,
        averageOrderValue
      },
      games: {
        total: totalGames,
        active: activeGames
      },
      packages: {
        total: totalPackages,
        popular: popularPackages
      }
    };
  }

  /**
   * الحصول على آخر الطلبات
   */
  async getRecentOrders(limit: number = 10) {
    return prisma.order.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            package: {
              include: {
                game: {
                  select: {
                    name: true,
                    nameAr: true
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  /**
   * الحصول على آخر المستخدمين
   */
  async getRecentUsers(limit: number = 10) {
    return prisma.user.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            orders: true
          }
        }
      }
    });
  }

  /**
   * الحصول على جميع المستخدمين (مع فلترة وبحث)
   */
  async getAllUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
  }) {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      role, 
      isActive 
    } = params;

    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } }
        ]
      }),
      ...(role && { role }),
      ...(isActive !== undefined && { isActive })
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          isVerified: true,
          isActive: true,
          loyaltyPoints: true,
          createdAt: true,
          lastLogin: true,
          _count: {
            select: {
              orders: true,
              reviews: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * تحديث حالة المستخدم
   */
  async updateUserStatus(userId: string, isActive: boolean) {
    return prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true
      }
    });
  }

  /**
   * تحديث دور المستخدم
   */
  async updateUserRole(userId: string, role: 'USER' | 'ADMIN' | 'SUPER_ADMIN') {
    return prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });
  }

  /**
   * حذف مستخدم
   */
  async deleteUser(userId: string) {
    // التحقق من عدم وجود طلبات معلقة
    const pendingOrders = await prisma.order.count({
      where: {
        userId,
        status: { in: ['PENDING', 'PROCESSING'] }
      }
    });

    if (pendingOrders > 0) {
      throw new AppError('لا يمكن حذف المستخدم لوجود طلبات معلقة', 400);
    }

    await prisma.user.delete({
      where: { id: userId }
    });
  }

  /**
   * الحصول على إحصائيات مفصلة لمستخدم
   */
  async getUserStats(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            orders: true,
            reviews: true,
            wishlist: true,
            referrals: true
          }
        }
      }
    });

    if (!user) {
      throw new AppError('المستخدم غير موجود', 404);
    }

    // إحصائيات الطلبات
    const orderStats = await prisma.order.groupBy({
      by: ['status'],
      where: { userId },
      _count: true,
      _sum: { total: true }
    });

    const orders = {
      total: user._count.orders,
      byStatus: orderStats.reduce((acc, stat) => {
        acc[stat.status] = {
          count: stat._count,
          revenue: Number(stat._sum.total || 0)
        };
        return acc;
      }, {} as Record<string, { count: number; revenue: number }>)
    };

    // آخر الطلبات
    const recentOrders = await prisma.order.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            package: {
              include: {
                game: true
              }
            }
          }
        }
      }
    });

    return {
      user,
      orders,
      recentOrders,
      stats: {
        totalSpent: Number(
          orderStats.reduce((sum, stat) => sum + Number(stat._sum.total || 0), 0)
        ),
        averageOrderValue: user._count.orders > 0
          ? Number(
              orderStats.reduce((sum, stat) => sum + Number(stat._sum.total || 0), 0)
            ) / user._count.orders
          : 0,
        reviewsCount: user._count.reviews,
        wishlistCount: user._count.wishlist,
        referralsCount: user._count.referrals
      }
    };
  }
}
