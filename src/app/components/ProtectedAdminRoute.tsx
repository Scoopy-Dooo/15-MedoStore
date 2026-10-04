/**
 * ProtectedAdminRoute Component
 * مكون لحماية مسارات لوحة التحكم الإدارية
 */

import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const { language } = useTranslation();

  // انتظار تحميل حالة المصادقة
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400" />
      </div>
    );
  }

  // إعادة توجيه لصفحة تسجيل الدخول إذا لم يكن مصادقاً
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // التحقق من صلاحيات الإدارة
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {language === 'ar'
              ? 'عذراً، ليس لديك صلاحية الوصول لهذه الصفحة. هذه الصفحة مخصصة للمسؤولين فقط.'
              : 'Sorry, you do not have permission to access this page. This page is for administrators only.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
};
