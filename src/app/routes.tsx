/**
 * Application Routes
 * مسارات التطبيق
 *
 * Admin routes use React.lazy() for code splitting to reduce initial bundle size.
 * مسارات الأدمن تستخدم React.lazy() لتقليل حجم الحزمة الأولية.
 */

import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router';
import Root from './pages/Root';
import Home from './pages/Home';
import Games from './pages/Games';
import GameDetail from './pages/GameDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import { ProtectedAdminRoute } from './components/ProtectedAdminRoute';
import { Skeleton } from './components/ui/skeleton';

// ============================================
// Lazy-loaded Admin Pages - تحميل متأخر لصفحات الأدمن
// ============================================

const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const GamesManagement = lazy(() => import('./pages/admin/GamesManagement'));
const PackagesManagement = lazy(() => import('./pages/admin/PackagesManagement'));
const Statistics = lazy(() => import('./pages/admin/Statistics'));

/**
 * Fallback skeleton while admin pages are loading
 * هيكل عظمي يُعرض أثناء تحميل صفحات الأدمن
 */
function AdminPageFallback() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar skeleton */}
      <div className="hidden lg:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4 space-y-3">
          <Skeleton className="h-10 w-full" />
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
      {/* Content skeleton */}
      <div className="flex-1 p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  );
}

/**
 * Wraps a lazy admin component with ProtectedAdminRoute and Suspense
 * يلف مكون أدمن كسول بحماية المسار و Suspense
 */
function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedAdminRoute>
      <Suspense fallback={<AdminPageFallback />}>
        {children}
      </Suspense>
    </ProtectedAdminRoute>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'games', Component: Games },
      { path: 'game/:gameId', Component: GameDetail },
    ],
  },
  { path: '/login', Component: Login },
  { path: '/register', Component: Register },
  { path: '/forgot-password', Component: ForgotPassword },

  // ============================================
  // Admin Routes - مسارات الأدمن (lazy loaded)
  // ============================================
  {
    path: '/admin',
    element: <AdminRoute><Dashboard /></AdminRoute>,
  },
  {
    path: '/admin/games',
    element: <AdminRoute><GamesManagement /></AdminRoute>,
  },
  {
    path: '/admin/packages',
    element: <AdminRoute><PackagesManagement /></AdminRoute>,
  },
  {
    path: '/admin/statistics',
    element: <AdminRoute><Statistics /></AdminRoute>,
  },
]);
