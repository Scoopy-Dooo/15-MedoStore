/**
 * useCreateGame Hook
 * React Query mutation hook لإنشاء لعبة جديدة
 */

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import adminService from '../../services/admin.service';
import type { CreateGameData, Game } from '../../services/types';

export const useCreateGame = (
  options?: Omit<UseMutationOptions<Game, Error, CreateGameData>, 'mutationFn'>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateGameData) => {
      const response = await adminService.createGame(data);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'فشل في إنشاء اللعبة');
      }
      
      return response.data;
    },
    onSuccess: (newGame, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      queryClient.setQueryData(['game', newGame.id], newGame);
      options?.onSuccess?.(newGame, variables, context);
    },
    ...options,
  });
};
