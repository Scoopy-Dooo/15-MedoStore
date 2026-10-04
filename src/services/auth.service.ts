/**
 * Authentication Service
 * خدمة المصادقة للتواصل مع Backend API
 */

import api, { handleApiResponse, handleApiError } from './api';
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  UpdateProfileData,
  ApiResponse,
  User,
} from './types';

class AuthService {
  /**
   * تسجيل مستخدم جديد
   */
  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await api.post('/auth/register', data);
      return handleApiResponse<AuthResponse>(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * تسجيل الدخول
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await api.post('/auth/login', credentials);
      return handleApiResponse<AuthResponse>(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * تسجيل الخروج
   */
  async logout(): Promise<ApiResponse> {
    try {
      const response = await api.post('/auth/logout');
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * الحصول على الملف الشخصي
   */
  async getProfile(): Promise<ApiResponse<User>> {
    try {
      const response = await api.get('/auth/profile');
      return handleApiResponse<User>(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * تحديث الملف الشخصي
   */
  async updateProfile(data: UpdateProfileData): Promise<ApiResponse<User>> {
    try {
      const response = await api.put('/auth/profile', data);
      return handleApiResponse<User>(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * نسيت كلمة المرور
   */
  async forgotPassword(email: string): Promise<ApiResponse> {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * إعادة تعيين كلمة المرور
   */
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse> {
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword,
      });
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * تحديث الـ Token
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<{ accessToken: string }>> {
    try {
      const response = await api.post('/auth/refresh', { refreshToken });
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }
}

export default new AuthService();
