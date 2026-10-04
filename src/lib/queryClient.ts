/**
 * React Query Client Configuration
 * إعدادات React Query للـ data fetching والـ caching
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * إنشاء QueryClient مع الإعدادات الافتراضية
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes
      staleTime: 5 * 60 * 1000, // 5 minutes
      
      // Keep data in cache for 10 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      
      // Retry failed requests
      retry: (failureCount, error: any) => {
        // Don't retry on 404
        if (error?.response?.status === 404) {
          return false;
        }
        
        // Retry up to 3 times for network errors
        if (!error?.response) {
          return failureCount < 3;
        }
        
        // Retry up to 2 times for server errors (5xx)
        if (error?.response?.status >= 500) {
          return failureCount < 2;
        }
        
        return false;
      },
      
      // Exponential backoff for retries
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch on window focus (disabled for better UX)
      refetchOnWindowFocus: false,
      
      // Refetch on reconnect
      refetchOnReconnect: true,
      
      // Refetch on mount if data is stale
      refetchOnMount: true,
    },
    
    mutations: {
      // Retry failed mutations once
      retry: 1,
      
      // Exponential backoff for mutation retries
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
