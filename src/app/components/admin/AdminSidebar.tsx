/**
 * Admin Sidebar Component
 * مكون الشريط الجانبي للوحة التحكم الإدارية
 * 
 * Features:
 * - Navigation menu with icons
 * - Active route highlighting
 * - Admin user info display
 * - Logout confirmation dialog
 * - Bilingual support (AR/EN)
 * - Supports collapsed state
 */

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import {
  LayoutDashboard,
  Gamepad2,
  Package,
  BarChart3,
  LogOut,
  Languages,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

interface AdminSidebarProps {
  isCollapsed?: boolean;
}

interface NavItem {
  label: { ar: string; en: string };
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  {
    label: { ar: 'لوحة التحكم', en: 'Dashboard' },
    path: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: { ar: 'إدارة الألعاب', en: 'Games Management' },
    path: '/admin/games',
    icon: Gamepad2,
  },
  {
    label: { ar: 'إدارة الباقات', en: 'Packages Management' },
    path: '/admin/packages',
    icon: Package,
  },
  {
    label: { ar: 'الإحصائيات', en: 'Statistics' },
    path: '/admin/statistics',
    icon: BarChart3,
  },
];

/**
 * AdminSidebar Component
 * Navigation sidebar for admin dashboard
 */
export function AdminSidebar({ isCollapsed = false }: AdminSidebarProps) {
  const { user, logout } = useAuth();
  const { language, toggleLanguage } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const isRTL = language === 'ar';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get user initials for avatar fallback
  const getUserInitials = (name: string | undefined) => {
    if (!name) return 'A';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with User Info */}
      <div className={cn('p-4 border-b border-gray-200', isCollapsed && 'px-2')}>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={user?.avatarUrl} alt={user?.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getUserInitials(user?.name)}
            </AvatarFallback>
          </Avatar>

          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">
                {language === 'ar' ? 'مسؤول' : 'Admin'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const label = item.label[language];

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                    'hover:bg-gray-100',
                    isActive && 'bg-primary text-primary-foreground hover:bg-primary/90',
                    isCollapsed && 'justify-center'
                  )}
                  title={isCollapsed ? label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium text-sm">{label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Language Switcher + Logout Button */}
      <div className={cn('p-4 border-t border-gray-200 space-y-2', isCollapsed && 'px-2')}>
        {/* زر تبديل اللغة */}
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100',
            isCollapsed && 'justify-center px-0'
          )}
          onClick={toggleLanguage}
          title={isCollapsed ? (language === 'ar' ? 'English' : 'عربي') : undefined}
        >
          <Languages className={cn('h-5 w-5', !isCollapsed && (isRTL ? 'ml-2' : 'mr-2'))} />
          {!isCollapsed && (language === 'ar' ? 'English' : 'عربي')}
        </Button>

        {/* زر تسجيل الخروج */}
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50',
            isCollapsed && 'justify-center px-0'
          )}
          onClick={() => setShowLogoutDialog(true)}
          title={isCollapsed ? (language === 'ar' ? 'تسجيل الخروج' : 'Logout') : undefined}
        >
          <LogOut className={cn('h-5 w-5', !isCollapsed && (isRTL ? 'ml-2' : 'mr-2'))} />
          {!isCollapsed && (language === 'ar' ? 'تسجيل الخروج' : 'Logout')}
        </Button>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'ar' ? 'تأكيد تسجيل الخروج' : 'Confirm Logout'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'ar'
                ? 'هل أنت متأكد أنك تريد تسجيل الخروج من لوحة التحكم؟'
                : 'Are you sure you want to logout from the admin dashboard?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700"
            >
              {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
