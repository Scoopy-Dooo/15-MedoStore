/**
 * useDeletePackage Hook
 * React Query mutation hook لحذف باقة
 */

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import adminService from '../../services/admin.service';

export const useDeletePackage = (
  options?: Omit<UseMutationOptions<void, Error, string>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (packageId: string) => {
      const response = await adminService.deletePackage(packageId);
      
      if (!response.success) {
        throw new Error(response.message || 'فشل في حذف الباقة');
      }
    },
    onSuccess: (data, packageId, context) => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      options?.onSuccess?.(data, packageId, context);
    },
    ...options,
  });
};
