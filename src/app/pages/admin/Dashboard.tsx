/**
 * Admin Dashboard Home Page
 * الصفحة الرئيسية للوحة التحكم الإدارية
 * 
 * Features:
 * - Welcome message with admin name
 * - Quick stats cards (Total Games, Packages, Orders)
 * - Quick action buttons
 * - Bilingual support
 * - Responsive layout
 */

import { Link } from 'react-router';
import { Plus, Gamepad2, Package, BarChart3, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useDashboardStats } from '../../hooks/useDashboardStats';

/**
 * Dashboard Component
 * Main admin dashboard page with overview stats and quick actions
 */
export default function Dashboard() {
  const { user } = useAuth();
  const { language } = useApp();
  const { data: stats, isLoading, isError, refetch } = useDashboardStats();

  const isRTL = language === 'ar';

  const statsCards = [
    {
      title: { ar: 'إجمالي الألعاب', en: 'Total Games' },
      value: stats?.totalActiveGames ?? 0,
      icon: Gamepad2,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: { ar: 'إجمالي الباقات', en: 'Total Packages' },
      value: stats?.totalActivePackages ?? 0,
      icon: Package,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: { ar: 'إجمالي الطلبات', en: 'Total Orders' },
      value: stats?.totalOrders ?? 0,
      icon: TrendingUp,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const quickActions = [
    {
      label: { ar: 'إضافة لعبة', en: 'Add Game' },
      path: '/admin/games',
      icon: Plus,
      variant: 'default' as const,
    },
    {
      label: { ar: 'إضافة باقة', en: 'Add Package' },
      path: '/admin/packages',
      icon: Plus,
      variant: 'outline' as const,
    },
    {
      label: { ar: 'عرض الإحصائيات', en: 'View Statistics' },
      path: '/admin/statistics',
      icon: BarChart3,
      variant: 'outline' as const,
    },
  ];

  return (
    <AdminLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'ar' ? `مرحباً، ${user?.name}` : `Welcome, ${user?.name}`}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'ar'
              ? 'إليك نظرة عامة على نشاط المتجر'
              : "Here's an overview of your store activity"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons
            <>
              {[1, 2, 3].map((i) => (
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
          ) : isError ? (
            // Error state
            <Card className="col-span-full">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-red-600 mb-4">
                    {language === 'ar'
                      ? 'فشل تحميل الإحصائيات'
                      : 'Failed to load statistics'}
                  </p>
                  <Button onClick={() => refetch()} variant="outline">
                    {language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Stats cards
            statsCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card key={card.title.en}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {card.title[language]}
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

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.path}
                    asChild
                    variant={action.variant}
                    className="h-auto py-6"
                  >
                    <Link to={action.path} className="flex flex-col items-center gap-2">
                      <Icon className="h-6 w-6" />
                      <span>{action.label[language]}</span>
                    </Link>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Additional Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'ar' ? 'نصائح' : 'Tips'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className={`space-y-2 text-gray-600 ${isRTL ? 'pr-4' : 'pl-4'} list-disc`}>
              <li>
                {language === 'ar'
                  ? 'تأكد من تحديث الألعاب والباقات بانتظام للحفاظ على تجربة المستخدم'
                  : 'Make sure to update games and packages regularly to maintain user experience'}
              </li>
              <li>
                {language === 'ar'
                  ? 'راقب المخزون بانتظام لتجنب نفاد الباقات'
                  : 'Monitor inventory regularly to avoid running out of packages'}
              </li>
              <li>
                {language === 'ar'
                  ? 'استخدم صفحة الإحصائيات لتحليل أداء المتجر'
                  : 'Use the statistics page to analyze store performance'}
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
