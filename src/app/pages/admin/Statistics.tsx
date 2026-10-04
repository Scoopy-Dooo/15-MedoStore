/**
 * Statistics Dashboard Page
 * صفحة لوحة الإحصائيات
 * 
 * Features:
 * - Key metrics cards (games, packages, orders, revenue)
 * - Popular games list
 * - Low stock packages alert
 * - Date range filter
 * - Responsive grid layout
 * - Bilingual support
 */

import { useState } from 'react';
import { Package, Gamepad2, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { DateRangeFilter } from '../../components/admin/DateRangeFilter';
import { useApp } from '../../context/AppContext';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { cn } from '../../components/ui/utils';

/**
 * Statistics Component
 * Main statistics page with comprehensive metrics
 */
export default function Statistics() {
  const { language } = useApp();
  const isRTL = language === 'ar';

  // حالة نطاق التاريخ المختار
  const [dateFrom, setDateFrom] = useState<string | undefined>(undefined);
  const [dateTo, setDateTo] = useState<string | undefined>(undefined);

  const { data: stats, isLoading, isError, refetch } = useDashboardStats(
    dateFrom || dateTo ? { dateFrom, dateTo } : undefined
  );

  /** معالج تغيير نطاق التاريخ من مكوّن DateRangeFilter */
  const handleDateRangeChange = (from?: string, to?: string) => {
    setDateFrom(from);
    setDateTo(to);
  };

  // Translation strings
  const t = {
    title: {
      ar: 'الإحصائيات',
      en: 'Statistics',
    },
    refresh: {
      ar: 'تحديث',
      en: 'Refresh',
    },
    overview: {
      ar: 'نظرة عامة',
      en: 'Overview',
    },
    totalGames: {
      ar: 'إجمالي الألعاب',
      en: 'Total Games',
    },
    totalPackages: {
      ar: 'إجمالي الباقات',
      en: 'Total Packages',
    },
    totalOrders: {
      ar: 'إجمالي الطلبات',
      en: 'Total Orders',
    },
    totalRevenue: {
      ar: 'إجمالي الإيرادات',
      en: 'Total Revenue',
    },
    popularGames: {
      ar: 'الألعاب الأكثر طلباً',
      en: 'Popular Games',
    },
    lowStockPackages: {
      ar: 'الباقات منخفضة المخزون',
      en: 'Low Stock Packages',
    },
    game: {
      ar: 'اللعبة',
      en: 'Game',
    },
    package: {
      ar: 'الباقة',
      en: 'Package',
    },
    amount: {
      ar: 'الكمية',
      en: 'Amount',
    },
    stock: {
      ar: 'المخزون',
      en: 'Stock',
    },
    orders: {
      ar: 'الطلبات',
      en: 'Orders',
    },
    noData: {
      ar: 'لا توجد بيانات',
      en: 'No data available',
    },
    errorLoading: {
      ar: 'فشل تحميل الإحصائيات',
      en: 'Failed to load statistics',
    },
    retry: {
      ar: 'إعادة المحاولة',
      en: 'Retry',
    },
  };

  // Stats cards data
  const statsCards = [
    {
      title: t.totalGames[language],
      value: stats?.totalActiveGames ?? 0,
      icon: Gamepad2,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: t.totalPackages[language],
      value: stats?.totalActivePackages ?? 0,
      icon: Package,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: t.totalOrders[language],
      value: stats?.totalOrders ?? 0,
      icon: TrendingUp,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: t.totalRevenue[language],
      value: stats?.totalRevenue 
        ? `${stats.totalRevenue.toLocaleString()} ${language === 'ar' ? 'ج.س' : 'SDG'}`
        : '0',
      icon: TrendingUp,
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ];

  return (
    <AdminLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t.title[language]}
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            {/* فلتر نطاق التاريخ */}
            <DateRangeFilter onChange={handleDateRangeChange} />
            {/* زر التحديث اليدوي */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin', !isRTL && 'mr-2', isRTL && 'ml-2')} />
              {t.refresh[language]}
            </Button>
          </div>
        </div>

        {/* Error State */}
        {isError && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">{t.errorLoading[language]}</p>
                <Button onClick={() => refetch()} variant="outline">
                  {t.retry[language]}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards Grid */}
        {!isError && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                // Loading skeletons
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-10 rounded-full" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-8 w-16" />
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : (
                // Stats cards
                statsCards.map((card, index) => {
                  const Icon = card.icon;
                  return (
                    <Card key={index}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                          {card.title}
                        </CardTitle>
                        <div className={`${card.bgColor} p-2 rounded-full`}>
                          <Icon className={`h-5 w-5 ${card.iconColor}`} />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{card.value}</div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>

            {/* Popular Games */}
            <Card>
              <CardHeader>
                <CardTitle>{t.popularGames[language]}</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : stats?.popularGames && stats.popularGames.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t.game[language]}</TableHead>
                        <TableHead className="text-right">{t.orders[language]}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.popularGames.slice(0, 5).map((game) => (
                        <TableRow key={game.id}>
                          <TableCell className="flex items-center gap-3">
                            <img
                              src={game.image}
                              alt={language === 'ar' ? game.nameAr : game.name}
                              className="h-10 w-10 rounded object-cover"
                            />
                            <span className="font-medium">
                              {language === 'ar' ? game.nameAr : game.name}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="secondary">{game.ordersCount}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    {t.noData[language]}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Low Stock Packages */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <CardTitle>{t.lowStockPackages[language]}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : stats?.lowStockPackages && stats.lowStockPackages.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t.game[language]}</TableHead>
                        <TableHead>{t.amount[language]}</TableHead>
                        <TableHead className="text-right">{t.stock[language]}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.lowStockPackages.map((pkg) => (
                        <TableRow key={pkg.id}>
                          <TableCell className="font-medium">
                            {language === 'ar' ? pkg.game.nameAr : pkg.game.name}
                          </TableCell>
                          <TableCell>{pkg.amount}</TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant={pkg.stock === 0 ? 'destructive' : 'default'}
                              className={pkg.stock > 0 && pkg.stock < 5 ? 'bg-yellow-500' : ''}
                            >
                              {pkg.stock}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    {t.noData[language]}
                  </p>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
