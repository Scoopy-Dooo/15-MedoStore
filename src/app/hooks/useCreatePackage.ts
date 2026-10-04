/**
 * useCreatePackage Hook
 * React Query mutation hook لإنشاء باقة جديدة
 */

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import adminService from '../../services/admin.service';
import type { CreatePackageData, Package } from '../../services/types';

export const useCreatePackage = (
  options?: Omit<UseMutationOptions<Package, Error, CreatePackageData>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePackageData) => {
      const response = await adminService.createPackage(data);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'فشل في إنشاء الباقة');
      }
      
      return response.data;
    },
    onSuccess: (newPackage, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      queryClient.invalidateQueries({ queryKey: ['packages', 'game', variables.gameId] });
      options?.onSuccess?.(newPackage, variables, context);
    },
    ...options,
  });
};
