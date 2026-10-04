/**
 * Forgot Password Page
 * صفحة نسيت كلمة المرور
 */

import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import authService from '../../services/auth.service';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (): boolean => {
    if (!email.trim()) {
      setError('البريد الإلكتروني مطلوب');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('البريد الإلكتروني غير صالح');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authService.forgotPassword(email.trim());

      if (response.success) {
        setIsSuccess(true);
      } else {
        setError(response.message || 'حدث خطأ. حاول مرة أخرى');
      }
    } catch (err) {
      setError('حدث خطأ أثناء إرسال الطلب');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background to-muted">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-lg shadow-lg p-8 border text-center">
            {/* Success Icon */}
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-2xl font-bold text-foreground mb-3">
              تم إرسال الرابط!
            </h1>
            <p className="text-muted-foreground mb-6">
              تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. 
              يرجى التحقق من صندوق الوارد الخاص بك.
            </p>

            {/* Email Info */}
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-1">
                تم الإرسال إلى:
              </p>
              <p className="font-medium text-foreground">{email}</p>
            </div>

            {/* Tips */}
            <div className="text-right text-sm text-muted-foreground mb-6 space-y-2">
              <p>💡 نصائح:</p>
              <ul className="space-y-1">
                <li>• تحقق من مجلد الرسائل غير المرغوب فيها (Spam)</li>
                <li>• الرابط صالح لمدة ساعة واحدة فقط</li>
                <li>• إذا لم تستلم الرسالة، يمكنك إعادة المحاولة</li>
              </ul>
            </div>

            {/* Back to Login */}
            <Link to="/login">
              <Button className="w-full" size="lg">
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة لتسجيل الدخول
              </Button>
            </Link>

            {/* Resend */}
            <button
              onClick={() => {
                setIsSuccess(false);
                setEmail('');
              }}
              className="mt-4 text-sm text-primary hover:underline"
            >
              إرسال رابط جديد
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-lg p-8 border">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              نسيت كلمة المرور؟
            </h1>
            <p className="text-muted-foreground">
              لا تقلق! أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور
            </p>
          </div>

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
              <Label htmlFor="email">
                <Mail className="inline-block w-4 h-4 ml-1" />
                البريد الإلكتروني
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                disabled={isSubmitting}
                required
                autoFocus
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 ml-2" />
                  إرسال رابط إعادة التعيين
                </>
              )}
            </Button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              العودة لتسجيل الدخول
            </Link>
          </div>

          {/* Help */}
          <div className="mt-6 text-center pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              لا تملك حساب؟{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
