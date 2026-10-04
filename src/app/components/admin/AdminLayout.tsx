/**
 * Admin Layout Component
 * مكون تخطيط لوحة التحكم الإدارية
 * 
 * Features:
 * - Responsive sidebar (collapsible on desktop, drawer on mobile)
 * - Breadcrumb navigation
 * - Persists sidebar state in localStorage
 * - RTL/LTR support
 * - Mobile-friendly with Sheet component
 */

import { useState, useEffect, ReactNode } from 'react';
import { useLocation, Link } from 'react-router';
import { Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import { useApp } from '../../context/AppContext';
import { cn } from '../ui/utils';

interface AdminLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

const SIDEBAR_STATE_KEY = 'admin-sidebar-collapsed';

/**
 * AdminLayout Component
 * Responsive layout for admin dashboard with collapsible sidebar
 */
export function AdminLayout({ children, sidebar }: AdminLayoutProps) {
  const { language } = useApp();
  const location = useLocation();
  const isRTL = language === 'ar';

  // Sidebar collapsed state (desktop only)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_STATE_KEY);
    return saved === 'true';
  });

  // Mobile sheet state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem(SIDEBAR_STATE_KEY, String(isCollapsed));
  }, [isCollapsed]);

  // Generate breadcrumbs from current path
  const breadcrumbs = getBreadcrumbs(location.pathname, language);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-900', isRTL ? 'rtl' : 'ltr')}>
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side={isRTL ? 'right' : 'left'} className="w-64 p-0">
              {sidebar}
            </SheetContent>
          </Sheet>

          <div className="flex-1 px-4">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.path} className="flex items-center">
                    {index > 0 && (
                      <BreadcrumbSeparator className="mx-2">
                        {isRTL ? '\\' : '/'}
                      </BreadcrumbSeparator>
                    )}
                    <BreadcrumbItem>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={crumb.path}>{crumb.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </header>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen">
        {/* Sidebar */}
        <aside
          className={cn(
            'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all duration-300 flex-shrink-0',
            isRTL ? 'border-l' : 'border-r',
            isCollapsed ? 'w-16' : 'w-64'
          )}
        >
          {sidebar}

          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className={cn(
              'absolute bottom-4 bg-white border border-gray-200 rounded-full p-1.5',
              'hover:bg-gray-50 transition-colors shadow-sm',
              isRTL
                ? isCollapsed
                  ? 'left-4'
                  : 'left-60'
                : isCollapsed
                ? 'right-4'
                : 'right-60'
            )}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isRTL ? (
              isCollapsed ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )
            ) : isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Header with Breadcrumbs */}
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-10">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.path} className="flex items-center">
                    {index > 0 && (
                      <BreadcrumbSeparator className="mx-2">
                        {isRTL ? '\\' : '/'}
                      </BreadcrumbSeparator>
                    )}
                    <BreadcrumbItem>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage className="font-medium">
                          {crumb.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={crumb.path}>{crumb.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          {/* Page Content */}
          <div className="p-6">{children}</div>
        </main>
      </div>

      {/* Mobile Main Content */}
      <main className="lg:hidden">
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
}

/**
 * Generate breadcrumbs from pathname
 */
function getBreadcrumbs(pathname: string, language: 'ar' | 'en') {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: Array<{ label: string; path: string }> = [];

  // Translation map for routes
  const routeLabels: Record<string, Record<'ar' | 'en', string>> = {
    admin: {
      ar: 'لوحة التحكم',
      en: 'Dashboard',
    },
    games: {
      ar: 'إدارة الألعاب',
      en: 'Games Management',
    },
    packages: {
      ar: 'إدارة الباقات',
      en: 'Packages Management',
    },
    statistics: {
      ar: 'الإحصائيات',
      en: 'Statistics',
    },
  };

  let currentPath = '';
  segments.forEach((segment) => {
    currentPath += `/${segment}`;
    const label = routeLabels[segment]?.[language] || segment;
    breadcrumbs.push({ label, path: currentPath });
  });

  return breadcrumbs;
}
