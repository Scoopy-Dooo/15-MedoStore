/**
 * useGames Hook
 * React Query hook لجلب قائمة الألعاب
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import gamesService from '../../services/games.service';
import type { GetGamesParams, GetGamesResponse } from '../../services/types';

/**
 * Hook لجلب قائمة الألعاب مع الفلترة والترقيم
 * Fetch games list with filtering and pagination
 * 
 * @param params - معاملات الفلترة والبحث
 * @param options - خيارات React Query الإضافية
 */
export const useGames = (
  params?: GetGamesParams,
  options?: Omit<UseQueryOptions<GetGamesResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['games', params],
    queryFn: async () => {
      const response = await gamesService.getAllGames(params);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'فشل في جلب الألعاب');
      }
      
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};
