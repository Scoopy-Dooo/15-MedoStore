/**
 * خدمة الألعاب
 * Games Service
 */

import prisma from '../config/database.js';
import { AppError } from '../middlewares/errorHandler.js';
import { Prisma } from '@prisma/client';

interface CreateGameData {
  name: string;
  nameAr: string;
  description?: string;
  descriptionAr?: string;
  image: string;
  category: string;
  sortOrder?: number;
}

interface UpdateGameData {
  name?: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  image?: string;
  category?: string;
  isActive?: boolean;
  sortOrder?: number;
}

interface GetGamesParams {
  category?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export class GamesService {
  /**
   * الحصول على جميع الألعاب
   */
  async getAllGames(params: GetGamesParams) {
    const {
      category,
      isActive,
      search,
      page = 1,
      limit = 20
    } = params;

    const skip = (page - 1) * limit;

    const where: Prisma.GameWhereInput = {
      ...(category && { category }),
      ...(isActive !== undefined && { isActive }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { nameAr: { contains: search } },
          { category: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const [games, total] = await Promise.all([
      prisma.game.findMany({
        where,
        skip,
        take: limit,
        orderBy: { sortOrder: 'asc' },
        include: {
          _count: {
            select: {
              packages: true
            }
          }
        }
      }),
      prisma.game.count({ where })
    ]);

    return {
      games,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * الحصول على لعبة واحدة مع باقاتها
   */
  async getGameById(gameId: string) {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        packages: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    if (!game) {
      throw new AppError('اللعبة غير موجودة', 404);
    }

    return game;
  }

  /**
   * الحصول على لعبة بالـ slug
   */
  async getGameBySlug(slug: string) {
    const game = await prisma.game.findUnique({
      where: { slug },
      include: {
        packages: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    if (!game) {
      throw new AppError('اللعبة غير موجودة', 404);
    }

    return game;
  }

  /**
   * إنشاء لعبة جديدة (Admin)
   */
  async createGame(data: CreateGameData) {
    // إنشاء slug من الاسم
    const slug = this.generateSlug(data.name);

    // التحقق من عدم تكرار الـ slug
    const existingGame = await prisma.game.findUnique({
      where: { slug }
    });

    if (existingGame) {
      throw new AppError('اللعبة موجودة بالفعل', 400);
    }

    const game = await prisma.game.create({
      data: {
        ...data,
        slug
      }
    });

    return game;
  }

  /**
   * تحديث لعبة (Admin)
   */
  async updateGame(gameId: string, data: UpdateGameData) {
    // إذا تم تحديث الاسم، نحدث الـ slug
    const updateData: any = { ...data };

    if (data.name) {
      const newSlug = this.generateSlug(data.name);
      
      // التحقق من عدم تكرار الـ slug
      const existingGame = await prisma.game.findFirst({
        where: {
          slug: newSlug,
          NOT: { id: gameId }
        }
      });

      if (existingGame) {
        throw new AppError('اللعبة موجودة بالفعل بهذا الاسم', 400);
      }

      updateData.slug = newSlug;
    }

    const game = await prisma.game.update({
      where: { id: gameId },
      data: updateData,
      include: {
        _count: {
          select: {
            packages: true
          }
        }
      }
    });

    return game;
  }

  /**
   * حذف لعبة (Admin)
   */
  async deleteGame(gameId: string) {
    // التحقق من عدم وجود طلبات مرتبطة
    const ordersCount = await prisma.orderItem.count({
      where: {
        package: {
          gameId
        }
      }
    });

    if (ordersCount > 0) {
      throw new AppError('لا يمكن حذف اللعبة لوجود طلبات مرتبطة بها', 400);
    }

    // حذف اللعبة (Cascade سيحذف الباقات تلقائياً)
    await prisma.game.delete({
      where: { id: gameId }
    });
  }

  /**
   * الحصول على الفئات المتاحة
   */
  async getCategories() {
    const games = await prisma.game.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category']
    });

    return games.map(g => g.category);
  }

  /**
   * الحصول على أشهر الألعاب
   */
  async getPopularGames(limit: number = 6) {
    // استعلام للحصول على الألعاب الأكثر طلباً
    const popularGames = await prisma.$queryRaw<Array<{
      id: string;
      name: string;
      nameAr: string;
      image: string;
      category: string;
      ordersCount: bigint;
    }>>`
      SELECT 
        g.id,
        g.name,
        g."nameAr",
        g.image,
        g.category,
        COUNT(DISTINCT o.id) as "ordersCount"
      FROM games g
      INNER JOIN packages p ON p."gameId" = g.id
      INNER JOIN order_items oi ON oi."packageId" = p.id
      INNER JOIN orders o ON o.id = oi."orderId"
      WHERE g."isActive" = true
      GROUP BY g.id, g.name, g."nameAr", g.image, g.category
      ORDER BY "ordersCount" DESC
      LIMIT ${limit}
    `;

    return popularGames.map(game => ({
      ...game,
      ordersCount: Number(game.ordersCount)
    }));
  }

  /**
   * إنشاء slug من النص
   */
  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
