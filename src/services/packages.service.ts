/**
 * Packages Service
 * خدمة الباقات للتواصل مع Backend API
 */

import api, { handleApiResponse, handleApiError } from './api';
import type {
  Package,
  GetPackagesParams,
  GetPackagesResponse,
  ApiResponse,
} from './types';

class PackagesService {
  /**
   * الحصول على جميع الباقات مع الفلترة والترقيم
   * Get all packages with filtering and pagination
   */
  async getAllPackages(params?: GetPackagesParams): Promise<ApiResponse<GetPackagesResponse>> {
    try {
      const response = await api.get('/packages', { params });
      return handleApiResponse<GetPackagesResponse>(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * الحصول على باقات لعبة معينة
   * Get packages for a specific game
   */
  async getPackagesByGameId(gameId: string): Promise<ApiResponse<Package[]>> {
    try {
      const response = await api.get(`/packages/game/${gameId}`);
      return handleApiResponse<Package[]>(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * الحصول على الباقات الشائعة
   * Get popular packages
   */
  async getPopularPackages(limit?: number): Promise<ApiResponse<Package[]>> {
    try {
      const params = limit ? { limit } : undefined;
      const response = await api.get('/packages/popular', { params });
      return handleApiResponse<Package[]>(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * الحصول على باقة واحدة بالـ ID
   * Get single package by ID
   */
  async getPackageById(packageId: string): Promise<ApiResponse<Package>> {
    try {
      const response = await api.get(`/packages/${packageId}`);
      return handleApiResponse<Package>(response);
    } catch (error) {
      return handleApiError(error);
    }
  }
}

export default new PackagesService();
