/**
 * User Menu Component
 * قائمة المستخدم في Navbar - Unified Style
 */

import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { User, LogOut, Settings, ShoppingBag, LogIn, UserPlus } from 'lucide-react';

export default function UserMenu() {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme } = useApp();
  const isDark = theme === 'dark';

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        {/* Login Button - Ghost Style مع Glassmorphism */}
        <Link to="/login">
          <button
            className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border transition-all duration-300 text-sm font-medium ${
              isDark
                ? 'bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/40 text-white'
                : 'bg-purple-50 border-purple-200 hover:bg-purple-100 hover:border-purple-300 text-gray-900'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">دخول</span>
          </button>
        </Link>

        {/* Register Button - Primary Style مع Glow */}
        <Link to="/register">
          <button
            className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
              isDark
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]'
                : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-md hover:shadow-lg'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">تسجيل</span>
          </button>
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border transition-all duration-300 text-sm font-medium ${
            isDark
              ? 'bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/40 text-white'
              : 'bg-purple-50 border-purple-200 hover:bg-purple-100 hover:border-purple-300 text-gray-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span className="hidden md:inline">{user?.name}</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className={`w-56 ${
          isDark
            ? 'bg-[rgba(20,25,45,0.95)] backdrop-blur-xl border-purple-500/20'
            : 'bg-white/95 backdrop-blur-xl border-purple-200'
        }`}
      >
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {user?.name}
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className={isDark ? 'bg-purple-500/20' : 'bg-purple-200'} />

        <DropdownMenuItem asChild>
          <Link
            to="/profile"
            className={`cursor-pointer ${
              isDark ? 'hover:bg-purple-500/10' : 'hover:bg-purple-50'
            }`}
          >
            <User className="ml-2 w-4 h-4" />
            الملف الشخصي
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            to="/orders"
            className={`cursor-pointer ${
              isDark ? 'hover:bg-purple-500/10' : 'hover:bg-purple-50'
            }`}
          >
            <ShoppingBag className="ml-2 w-4 h-4" />
            طلباتي
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            to="/settings"
            className={`cursor-pointer ${
              isDark ? 'hover:bg-purple-500/10' : 'hover:bg-purple-50'
            }`}
          >
            <Settings className="ml-2 w-4 h-4" />
            الإعدادات
          </Link>
        </DropdownMenuItem>

        {user?.role === 'ADMIN' && (
          <>
            <DropdownMenuSeparator className={isDark ? 'bg-purple-500/20' : 'bg-purple-200'} />
            <DropdownMenuItem asChild>
              <Link
                to="/admin"
                className={`cursor-pointer ${
                  isDark
                    ? 'text-cyan-400 hover:bg-cyan-500/10'
                    : 'text-cyan-600 hover:bg-cyan-50'
                }`}
              >
                <Settings className="ml-2 w-4 h-4" />
                لوحة الإدارة
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator className={isDark ? 'bg-purple-500/20' : 'bg-purple-200'} />

        <DropdownMenuItem
          onClick={logout}
          className={`cursor-pointer ${
            isDark
              ? 'text-red-400 hover:bg-red-500/10'
              : 'text-red-600 hover:bg-red-50'
          }`}
        >
          <LogOut className="ml-2 w-4 h-4" />
          تسجيل الخروج
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
