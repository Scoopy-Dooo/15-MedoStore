/**
 * Axios API Configuration
 * إعدادات Axios للاتصال بالـ Backend
 */

import axios from 'axios';
import type { ApiResponse } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor - إضافة Token لكل طلب
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - معالجة الأخطاء وتحديث Token
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Log interceptor errors in development mode
    if (import.meta.env.DEV) {
      console.error('API Interceptor Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });
    }

    const originalRequest = error.config;

    // إذا كان الـ Token منتهي الصلاحية (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // فشل تحديث الـ Token - تسجيل خروج
        if (import.meta.env.DEV) {
          console.error('Token refresh failed:', refreshError);
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // إذا كان المستخدم غير مصرح له بالوصول (403)
    if (error.response?.status === 403) {
      // تسجيل خروج وإعادة توجيه
      if (import.meta.env.DEV) {
        console.error('Access forbidden (403)');
      }
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

// معالجة الاستجابات
export const handleApiResponse = <T>(response: any): ApiResponse<T> => {
  return {
    success: response.data.success || true,
    message: response.data.message,
    data: response.data.data || response.data,
  };
};

// معالجة الأخطاء
export const handleApiError = (error: any): ApiResponse => {
  // Log errors in development mode only
  if (import.meta.env.DEV) {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });
  }

  if (error.response) {
    return {
      success: false,
      message: error.response.data.message || 'حدث خطأ في الخادم',
      error: error.response.data.error,
    };
  } else if (error.request) {
    return {
      success: false,
      message: 'لا يمكن الاتصال بالخادم',
      error: 'Network Error',
    };
  } else {
    return {
      success: false,
      message: 'حدث خطأ غير متوقع',
      error: error.message,
    };
  }
};

export default api;
