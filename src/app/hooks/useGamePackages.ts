/**
 * useGamePackages Hook
 * React Query hook لجلب باقات لعبة معينة
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import packagesService from '../../services/packages.service';
import type { Package } from '../../services/types';

/**
 * Hook لجلب باقات لعبة معينة
 * Fetch packages for a specific game
 * 
 * @param gameId - معرّف اللعبة
 * @param options - خيارات React Query الإضافية
 */
export const useGamePackages = (
  gameId: string,
  options?: Omit<UseQueryOptions<Package[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['packages', 'game', gameId],
    queryFn: async () => {
      const response = await packagesService.getPackagesByGameId(gameId);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'فشل في جلب الباقات');
      }
      
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!gameId,
    ...options,
  });
};
