/**
 * usePackages Hook
 * React Query hook لجلب قائمة الباقات
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import packagesService from '../../services/packages.service';
import type { GetPackagesParams, GetPackagesResponse } from '../../services/types';

/**
 * Hook لجلب قائمة الباقات مع الفلترة والترقيم
 * Fetch packages list with filtering and pagination
 * 
 * @param params - معاملات الفلترة والبحث
 * @param options - خيارات React Query الإضافية
 */
export const usePackages = (
  params?: GetPackagesParams,
  options?: Omit<UseQueryOptions<GetPackagesResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['packages', params],
    queryFn: async () => {
      const response = await packagesService.getAllPackages(params);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'فشل في جلب الباقات');
      }
      
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};
