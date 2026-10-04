/**
 * useUpdateGame Hook
 * React Query mutation hook لتحديث لعبة
 */

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import adminService from '../../services/admin.service';
import type { UpdateGameData, Game } from '../../services/types';

interface UpdateGameVariables {
  gameId: string;
  data: UpdateGameData;
}

export const useUpdateGame = (
  options?: Omit<UseMutationOptions<Game, Error, UpdateGameVariables>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ gameId, data }: UpdateGameVariables) => {
      const response = await adminService.updateGame(gameId, data);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'فشل في تحديث اللعبة');
      }
      
      return response.data;
    },
    onSuccess: (updatedGame, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      queryClient.invalidateQueries({ queryKey: ['game', variables.gameId] });
      queryClient.setQueryData(['game', variables.gameId], updatedGame);
      options?.onSuccess?.(updatedGame, variables, context);
    },
    ...options,
  });
};
