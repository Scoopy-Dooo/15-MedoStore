/**
 * useGame Hook
 * React Query hook لجلب لعبة واحدة
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import gamesService from '../../services/games.service';
import type { Game } from '../../services/types';

/**
 * Hook لجلب لعبة واحدة بالـ ID
 * Fetch single game by ID
 * 
 * @param gameId - معرّف اللعبة
 * @param options - خيارات React Query الإضافية
 */
export const useGame = (
  gameId: string,
  options?: Omit<UseQueryOptions<Game>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['game', gameId],
    queryFn: async () => {
      const response = await gamesService.getGameById(gameId);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'فشل في جلب اللعبة');
      }
      
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!gameId,
    ...options,
  });
};

/**
 * Hook لجلب لعبة واحدة بالـ slug
 * Fetch single game by slug
 * 
 * @param slug - slug اللعبة
 * @param options - خيارات React Query الإضافية
 */
export const useGameBySlug = (
  slug: string,
  options?: Omit<UseQueryOptions<Game>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['game', 'slug', slug],
    queryFn: async () => {
      const response = await gamesService.getGameBySlug(slug);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'فشل في جلب اللعبة');
      }
      
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!slug,
    ...options,
  });
};
