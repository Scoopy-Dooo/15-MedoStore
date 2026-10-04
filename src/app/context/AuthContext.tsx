/**
 * Authentication Context
 * سياق المصادقة لإدارة حالة تسجيل الدخول
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '../../services/auth.service';
import type {
  User,
  AuthState,
  LoginCredentials,
  RegisterData,
  UpdateProfileData,
} from '../../services/types';
import { toast } from 'sonner';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: UpdateProfileData) => Promise<boolean>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // تحميل البيانات من localStorage عند البداية
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const userStr = localStorage.getItem('user');

      if (accessToken && refreshToken && userStr) {
        try {
          const user = JSON.parse(userStr);
          setState({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });

          // تحديث بيانات المستخدم من الخادم
          await refreshUserProfile();
        } catch (error) {
          localStorage.clear();
          setState({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  /**
   * تسجيل الدخول
   */
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await authService.login(credentials);

      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        setState({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });

        toast.success(response.message || 'تم تسجيل الدخول بنجاح');
        return true;
      } else {
        toast.error(response.message || 'فشل تسجيل الدخول');
        return false;
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء تسجيل الدخول');
      return false;
    }
  };

  /**
   * تسجيل مستخدم جديد
   */
  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const response = await authService.register(data);

      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        setState({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });

        toast.success(response.message || 'تم التسجيل بنجاح');
        return true;
      } else {
        toast.error(response.message || 'فشل التسجيل');
        return false;
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء التسجيل');
      return false;
    }
  };

  /**
   * تسجيل الخروج
   */
  const logout = () => {
    authService.logout();

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });

    toast.success('تم تسجيل الخروج بنجاح');
  };

  /**
   * تحديث الملف الشخصي
   */
  const updateProfile = async (data: UpdateProfileData): Promise<boolean> => {
    try {
      const response = await authService.updateProfile(data);

      if (response.success && response.data) {
        const updatedUser = response.data;
        localStorage.setItem('user', JSON.stringify(updatedUser));

        setState((prev) => ({
          ...prev,
          user: updatedUser,
        }));

        toast.success(response.message || 'تم تحديث الملف الشخصي بنجاح');
        return true;
      } else {
        toast.error(response.message || 'فشل تحديث الملف الشخصي');
        return false;
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث الملف الشخصي');
      return false;
    }
  };

  /**
   * تحديث بيانات المستخدم من الخادم
   */
  const refreshUserProfile = async (): Promise<void> => {
    try {
      const response = await authService.getProfile();

      if (response.success && response.data) {
        const updatedUser = response.data;
        localStorage.setItem('user', JSON.stringify(updatedUser));

        setState((prev) => ({
          ...prev,
          user: updatedUser,
        }));
      }
    } catch (error) {
      // فشل تحديث الملف الشخصي
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateProfile,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
