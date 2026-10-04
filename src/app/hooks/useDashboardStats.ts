/**
 * useDashboardStats Hook
 * React Query hook لجلب إحصائيات لوحة التحكم مع دعم فلترة التاريخ
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import adminService from '../../services/admin.service';
import type { DashboardStats, GetDashboardStatsParams } from '../../services/types';

/**
 * Hook لجلب إحصائيات لوحة التحكم
 * Fetch dashboard statistics with optional date range filtering
 *
 * @param params  - معاملات فلترة التاريخ (dateFrom, dateTo)
 * @param options - خيارات React Query الإضافية
 */
export const useDashboardStats = (
  params?: GetDashboardStatsParams,
  options?: Omit<UseQueryOptions<DashboardStats>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['dashboard', 'stats', params],
    queryFn: async () => {
      const response = await adminService.getDashboardStats(params);

      if (!response.success || !response.data) {
        throw new Error(response.message || 'فشل في جلب الإحصائيات');
      }

      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 دقيقة - الإحصائيات تحتاج تحديث أسرع
    ...options,
  });
};
