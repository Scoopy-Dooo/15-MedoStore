/**
 * useUpdatePackage Hook
 * React Query mutation hook لتحديث باقة مع دعم التحديثات المتفائلة
 */

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import adminService from '../../services/admin.service';
import type { UpdatePackageData, Package, GetPackagesResponse } from '../../services/types';

export interface UpdatePackageVariables extends UpdatePackageData {
  packageId: string;
}

interface UpdatePackageContext {
  previousPackages?: GetPackagesResponse[];
}

export const useUpdatePackage = (
  options?: Omit<UseMutationOptions<Package, Error, UpdatePackageVariables, UpdatePackageContext>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();

  return useMutation<Package, Error, UpdatePackageVariables, UpdatePackageContext>({
    mutationFn: async ({ packageId, ...data }: UpdatePackageVariables) => {
      const response = await adminService.updatePackage(packageId, data);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'فشل في تحديث الباقة');
      }
      
      return response.data;
    },
    // Optimistic update: يتم تحديث الكاش فوراً قبل استجابة السيرفر
    onMutate: async ({ packageId, ...data }) => {
      // إلغاء أي استعلامات قيد التنفيذ لتجنب التضارب
      await queryClient.cancelQueries({ queryKey: ['packages'] });

      // حفظ البيانات السابقة للتراجع في حالة الفشل
      const previousPackages = queryClient.getQueriesData<GetPackagesResponse>({ queryKey: ['packages'] });

      // تحديث الكاش بشكل متفائل
      queryClient.setQueriesData<GetPackagesResponse>(
        { queryKey: ['packages'] },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            packages: old.packages.map((pkg) =>
              pkg.id === packageId
                ? { ...pkg, ...data }
                : pkg
            ),
          };
        }
      );

      return { previousPackages };
    },
    onSuccess: (updatedPackage, variables, context) => {
      // تحديث الكاش بالبيانات الفعلية من السيرفر
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      if (updatedPackage.gameId) {
        queryClient.invalidateQueries({ queryKey: ['packages', 'game', updatedPackage.gameId] });
      }
      options?.onSuccess?.(updatedPackage, variables, context);
    },
    onError: (error, variables, context) => {
      // التراجع عن التحديث المتفائل في حالة الفشل
      if (context?.previousPackages) {
        context.previousPackages.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
};
