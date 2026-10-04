/**
 * Login Page
 * صفحة تسجيل الدخول
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import AuthContainer from '../components/AuthContainer';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const { t } = useTranslation();
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setError('البريد الإلكتروني مطلوب');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('البريد الإلكتروني غير صالح');
      return false;
    }

    if (!formData.password) {
      setError('كلمة المرور مطلوبة');
      return false;
    }

    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (success) {
        navigate('/');
      } else {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0f1a] via-[#1a1f35] to-[#0b0f1a]">
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 mx-auto ${
            isDark ? 'border-purple-500' : 'border-purple-600'
          }`}></div>
          <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            جاري التحميل...
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthContainer
      title={t('login')}
      subtitle="مرحباً بك في متجر ميدو"
    >
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className={isDark ? 'text-gray-300' : 'text-gray-700'}>
            <Mail className="inline-block w-4 h-4 ml-1" />
            البريد الإلكتروني
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
            required
            className={`transition-all duration-300 ${
              isDark
                ? 'bg-white/5 border-purple-500/20 focus:border-purple-500/60 focus:shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                : 'bg-white border-purple-200 focus:border-purple-400'
            }`}
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className={isDark ? 'text-gray-300' : 'text-gray-700'}>
            <Lock className="inline-block w-4 h-4 ml-1" />
            كلمة المرور
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              className={`transition-all duration-300 ${
                isDark
                  ? 'bg-white/5 border-purple-500/20 focus:border-purple-500/60 focus:shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                  : 'bg-white border-purple-200 focus:border-purple-400'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                isDark
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Forgot Password */}
        <div className="text-left">
          <Link
            to="/forgot-password"
            className={`text-sm transition-colors ${
              isDark
                ? 'text-cyan-400 hover:text-cyan-300'
                : 'text-cyan-600 hover:text-cyan-500'
            }`}
          >
            نسيت كلمة المرور؟
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className={`w-full transition-all duration-300 ${
            isDark
              ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]'
              : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
          }`}
          disabled={isSubmitting}
          size="lg"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
              جاري تسجيل الدخول...
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4 ml-2" />
              تسجيل الدخول
            </>
          )}
        </Button>
      </form>

      {/* Register Link */}
      <div className="mt-6 text-center pt-6 border-t border-purple-500/20">
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          ليس لديك حساب؟{' '}
          <Link
            to="/register"
            className={`font-medium transition-colors ${
              isDark
                ? 'text-cyan-400 hover:text-cyan-300'
                : 'text-cyan-600 hover:text-cyan-500'
            }`}
          >
            إنشاء حساب جديد
          </Link>
        </p>
      </div>
    </AuthContainer>
  );
}
