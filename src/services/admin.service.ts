/**
 * Admin Service
 * خدمة الإدارة للتواصل مع Backend API
 */

import api, { handleApiResponse, handleApiError } from './api';
import type {
  Game,
  Package,
  CreateGameData,
  UpdateGameData,
  CreatePackageData,
  UpdatePackageData,
  DashboardStats,
  UploadImageResponse,
  ApiResponse,
} from './types';

class AdminService {
  // ============================================
  // Games CRUD Operations
  // ============================================

  /**
   * إنشاء لعبة جديدة
   * Create a new game
   */
  async createGame(data: CreateGameData): Promise<ApiResponse<Game>> {
    try {
      const response = await api.post('/admin/games', data);
      return handleApiResponse<Game>(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * تحديث لعبة موجودة
   * Update an existing game
   */
  async updateGame(gameId: string, data: UpdateGameData): Promise<ApiResponse<Game>> {
    try {
      const response = await api.put(`/admin/games/${gameId}`, data);
      return handleApiResponse<Game>(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * حذف لعبة
   * Delete a game
   */
  async deleteGame(gameId: string): Promise<ApiResponse> {
    try {
      const response = await api.delete(`/admin/games/${gameId}`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  // ============================================
  // Packages CRUD Operations
  // ============================================

  /**
   * إنشاء باقة جديدة
   * Create a new package
   */
  async createPackage(data: CreatePackageData): Promise<ApiResponse<Package>> {
    try {
      const response = await api.post('/admin/packages', data);
      return handleApiResponse<Package>(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * تحديث باقة موجودة
   * Update an existing package
   */
  async updatePackage(packageId: string, data: UpdatePackageData): Promise<ApiResponse<Package>> {
    try {
      const response = await api.put(`/admin/packages/${packageId}`, data);
      return handleApiResponse<Package>(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * حذف باقة
   * Delete a package
   */
  async deletePackage(packageId: string): Promise<ApiResponse> {
    try {
      const response = await api.delete(`/admin/packages/${packageId}`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * تحديث مخزون الباقة
   * Update package stock
   */
  async updatePackageStock(packageId: string, stock: number): Promise<ApiResponse<Package>> {
    try {
      const response = await api.patch(`/admin/packages/${packageId}/stock`, { stock });
      return handleApiResponse<Package>(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  // ============================================
  // Dashboard Statistics
  // ============================================

  /**
   * الحصول على إحصائيات لوحة التحكم
   * Get dashboard statistics
   * 
   * @param params - معاملات فلترة التاريخ (اختياري)
   */
  async getDashboardStats(params?: { dateFrom?: string; dateTo?: string }): Promise<ApiResponse<DashboardStats>> {
    try {
      const response = await api.get('/admin/stats', { params });
      return handleApiResponse<DashboardStats>(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  // ============================================
  // Image Upload
  // ============================================

  /**
   * رفع صورة إلى الخادم
   * Upload an image to the server
   * 
   * @param file - ملف الصورة المراد رفعه
   * @param onUploadProgress - دالة callback لتتبع تقدم الرفع (اختياري)
   */
  async uploadImage(
    file: File,
    onUploadProgress?: (progressEvent: { loaded: number; total: number; percentage: number }) => void
  ): Promise<ApiResponse<UploadImageResponse>> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      // Authorization header will be automatically added by api interceptor
      // Axios will automatically set Content-Type with boundary for FormData
      const response = await api.post('/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onUploadProgress && progressEvent.total) {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onUploadProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage,
            });
          }
        },
      });

      return handleApiResponse<UploadImageResponse>(response);
    } catch (error) {
      return handleApiError(error);
    }
  }
}

export default new AdminService();
