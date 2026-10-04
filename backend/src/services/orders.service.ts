/**
 * خدمة الطلبات
 * Orders Service
 */

import prisma from '../config/database.js';
import { AppError } from '../middlewares/errorHandler.js';
import { Prisma, OrderStatus, PaymentStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

interface CreateOrderData {
  userId: string;
  items: Array<{
    packageId: string;
    quantity: number;
  }>;
  playerInfo?: any;
  notes?: string;
  promoCode?: string;
}

interface UpdateOrderStatusData {
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
}

export class OrdersService {
  /**
   * إنشاء طلب جديد
   */
  async createOrder(data: CreateOrderData) {
    const { userId, items, playerInfo, notes, promoCode } = data;

    // التحقق من وجود المستخدم
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('المستخدم غير موجود', 404);
    }

    if (!user.isActive) {
      throw new AppError('حساب المستخدم معطل', 403);
    }

    // التحقق من وجود عناصر الطلب
    if (!items || items.length === 0) {
      throw new AppError('الطلب يجب أن يحتوي على عنصر واحد على الأقل', 400);
    }

    // جلب معلومات الباقات والتحقق من التوفر
    const packageIds = items.map(item => item.packageId);
    const packages = await prisma.package.findMany({
      where: {
        id: { in: packageIds },
        isActive: true
      }
    });

    if (packages.length !== packageIds.length) {
      throw new AppError('بعض الباقات غير متوفرة', 404);
    }

    // التحقق من المخزون
    for (const item of items) {
      const pkg = packages.find(p => p.id === item.packageId);
      if (!pkg) {
        throw new AppError('باقة غير موجودة', 404);
      }

      if (pkg.stock < item.quantity) {
        throw new AppError(`المخزون غير كافٍ للباقة: ${pkg.amount}`, 400);
      }
    }

    // حساب المجموع الفرعي
    let subtotal = new Decimal(0);
    for (const item of items) {
      const pkg = packages.find(p => p.id === item.packageId);
      if (pkg) {
        const itemTotal = pkg.price.mul(item.quantity);
        subtotal = subtotal.add(itemTotal);
      }
    }

    // حساب الخصم إذا وجد كود ترويجي
    let discount = new Decimal(0);
    if (promoCode) {
      const promo = await prisma.promoCode.findUnique({
        where: { code: promoCode }
      });

      if (promo && promo.isActive) {
        // التحقق من صلاحية الكود
        if (promo.expiresAt && promo.expiresAt < new Date()) {
          throw new AppError('الكود الترويجي منتهي الصلاحية', 400);
        }

        if (promo.usedCount >= promo.maxUses) {
          throw new AppError('الكود الترويجي تم استخدامه بالكامل', 400);
        }

        // حساب الخصم
        discount = subtotal.mul(promo.discount).div(100);

        // تحديث عدد الاستخدامات
        await prisma.promoCode.update({
          where: { id: promo.id },
          data: { usedCount: { increment: 1 } }
        });
      }
    }

    // حساب المجموع النهائي
    const total = subtotal.sub(discount);

    // توليد رقم الطلب
    const orderNumber = await this.generateOrderNumber();

    // إنشاء الطلب مع العناصر في معاملة واحدة
    const order = await prisma.$transaction(async (tx) => {
      // إنشاء الطلب
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          subtotal,
          discount,
          total,
          playerInfo,
          notes,
          promoCode: promoCode || null,
          items: {
            create: items.map(item => {
              const pkg = packages.find(p => p.id === item.packageId);
              return {
                packageId: item.packageId,
                quantity: item.quantity,
                price: pkg!.price
              };
            })
          }
        },
        include: {
          items: {
            include: {
              package: {
                include: {
                  game: true
                }
              }
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        }
      });

      // خصم من المخزون
      for (const item of items) {
        await tx.package.update({
          where: { id: item.packageId },
          data: {
            stock: { decrement: item.quantity }
          }
        });
      }

      return newOrder;
    });

    return order;
  }

  /**
   * الحصول على طلبات المستخدم
   */
  async getUserOrders(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              package: {
                include: {
                  game: {
                    select: {
                      name: true,
                      nameAr: true,
                      image: true
                    }
                  }
                }
              }
            }
          }
        }
      }),
      prisma.order.count({ where: { userId } })
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * الحصول على طلب واحد
   */
  async getOrderById(orderId: string, userId?: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            package: {
              include: {
                game: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        transaction: true
      }
    });

    if (!order) {
      throw new AppError('الطلب غير موجود', 404);
    }

    // إذا تم تمرير userId، تحقق من أن الطلب يخص المستخدم
    if (userId && order.userId !== userId) {
      throw new AppError('غير مصرح لك بعرض هذا الطلب', 403);
    }

    return order;
  }

  /**
   * الحصول على طلب برقم الطلب
   */
  async getOrderByNumber(orderNumber: string, userId?: string) {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            package: {
              include: {
                game: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    if (!order) {
      throw new AppError('الطلب غير موجود', 404);
    }

    if (userId && order.userId !== userId) {
      throw new AppError('غير مصرح لك بعرض هذا الطلب', 403);
    }

    return order;
  }

  /**
   * تحديث حالة الطلب (Admin)
   */
  async updateOrderStatus(orderId: string, data: UpdateOrderStatusData) {
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      throw new AppError('الطلب غير موجود', 404);
    }

    // التحقق من إمكانية التحديث
    if (order.status === OrderStatus.CANCELLED || order.status === OrderStatus.REFUNDED) {
      throw new AppError('لا يمكن تحديث طلب ملغي أو مسترجع', 400);
    }

    const updateData: any = {
      status: data.status
    };

    if (data.paymentStatus) {
      updateData.paymentStatus = data.paymentStatus;
    }

    if (data.status === OrderStatus.COMPLETED) {
      updateData.completedAt = new Date();
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        items: {
          include: {
            package: {
              include: {
                game: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    return updatedOrder;
  }

  /**
   * إلغاء الطلب
   */
  async cancelOrder(orderId: string, userId?: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true
      }
    });

    if (!order) {
      throw new AppError('الطلب غير موجود', 404);
    }

    // التحقق من الملكية إذا كان المستخدم عادي
    if (userId && order.userId !== userId) {
      throw new AppError('غير مصرح لك بإلغاء هذا الطلب', 403);
    }

    // التحقق من إمكانية الإلغاء
    if (order.status === OrderStatus.COMPLETED) {
      throw new AppError('لا يمكن إلغاء طلب مكتمل', 400);
    }

    if (order.status === OrderStatus.CANCELLED || order.status === OrderStatus.REFUNDED) {
      throw new AppError('الطلب ملغي مسبقاً', 400);
    }

    // إلغاء الطلب وإرجاع المخزون
    const cancelledOrder = await prisma.$transaction(async (tx) => {
      // تحديث حالة الطلب
      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.CANCELLED,
          updatedAt: new Date()
        },
        include: {
          items: {
            include: {
              package: {
                include: {
                  game: true
                }
              }
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        }
      });

      // إرجاع المخزون
      for (const item of order.items) {
        await tx.package.update({
          where: { id: item.packageId },
          data: {
            stock: { increment: item.quantity }
          }
        });
      }

      return updated;
    });

    return cancelledOrder;
  }

  /**
   * الحصول على جميع الطلبات (Admin)
   */
  async getAllOrders(params: {
    page?: number;
    limit?: number;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    userId?: string;
    search?: string;
  }) {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      userId,
      search
    } = params;

    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {
      ...(status && { status }),
      ...(paymentStatus && { paymentStatus }),
      ...(userId && { userId }),
      ...(search && {
        OR: [
          { orderNumber: { contains: search, mode: 'insensitive' } },
          { user: { name: { contains: search, mode: 'insensitive' } } },
          { user: { email: { contains: search, mode: 'insensitive' } } }
        ]
      })
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              package: {
                include: {
                  game: {
                    select: {
                      name: true,
                      nameAr: true,
                      image: true
                    }
                  }
                }
              }
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        }
      }),
      prisma.order.count({ where })
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * توليد رقم الطلب
   */
  private async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;

    // البحث عن آخر رقم طلب لهذا اليوم
    const lastOrder = await prisma.order.findFirst({
      where: {
        orderNumber: {
          startsWith: `MEDO-${dateStr}`
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNumber.split('-')[2]);
      sequence = lastSequence + 1;
    }

    const sequenceStr = String(sequence).padStart(4, '0');
    return `MEDO-${dateStr}-${sequenceStr}`;
  }

  /**
   * توليد رسالة WhatsApp للطلب
   */
  generateWhatsAppMessage(order: any): string {
    const items = order.items
      .map((item: any) => {
        const game = item.package.game;
        return `• ${game.nameAr || game.name}: ${item.package.amount} x${item.quantity}`;
      })
      .join('\n');

    const playerInfoStr = order.playerInfo
      ? `\n*معلومات اللاعب:*\n${JSON.stringify(order.playerInfo, null, 2)}`
      : '';

    const message = `
🎮 *طلب جديد من Medo Store*

*رقم الطلب:* ${order.orderNumber}
*الاسم:* ${order.user.name}
*الهاتف:* ${order.user.phone || 'غير متوفر'}

*العناصر:*
${items}

*المجموع الفرعي:* ${order.subtotal} جنيه
*الخصم:* ${order.discount} جنيه
*المجموع النهائي:* ${order.total} جنيه
${playerInfoStr}

${order.notes ? `*ملاحظات:*\n${order.notes}` : ''}

_تم إرسال الطلب بتاريخ: ${new Date(order.createdAt).toLocaleString('ar-SD')}_
    `.trim();

    return encodeURIComponent(message);
  }
}
