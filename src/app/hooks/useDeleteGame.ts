/**
 * useDeleteGame Hook
 * React Query mutation hook لحذف لعبة
 */

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import adminService from '../../services/admin.service';

export const useDeleteGame = (
  options?: Omit<UseMutationOptions<void, Error, string>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (gameId: string) => {
      const response = await adminService.deleteGame(gameId);
      
      if (!response.success) {
        throw new Error(response.message || 'فشل في حذف اللعبة');
      }
    },
    onSuccess: (data, gameId, context) => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      queryClient.removeQueries({ queryKey: ['game', gameId] });
      options?.onSuccess?.(data, gameId, context);
    },
    ...options,
  });
};
