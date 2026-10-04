import { useApp } from '../context/AppContext';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';

export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN'
}

interface ErrorMessageProps {
  type?: ErrorType;
  message?: string;
  messageAr?: string;
  onRetry?: () => void;
  className?: string;
}

const errorMessages = {
  NETWORK: {
    en: 'Connection error. Please check your internet connection.',
    ar: 'خطأ في الاتصال. يرجى التحقق من اتصالك بالإنترنت.'
  },
  AUTHENTICATION: {
    en: 'Unauthorized access. Please log in.',
    ar: 'وصول غير مصرح به. يرجى تسجيل الدخول.'
  },
  NOT_FOUND: {
    en: 'Resource not found.',
    ar: 'المورد غير موجود.'
  },
  SERVER: {
    en: 'Server error. Please try again later.',
    ar: 'خطأ في الخادم. يرجى المحاولة لاحقاً.'
  },
  VALIDATION: {
    en: 'Validation error. Please check your input.',
    ar: 'خطأ في التحقق. يرجى التحقق من المدخلات.'
  },
  UNKNOWN: {
    en: 'An unexpected error occurred.',
    ar: 'حدث خطأ غير متوقع.'
  }
};

export function ErrorMessage({ 
  type = ErrorType.UNKNOWN, 
  message, 
  messageAr, 
  onRetry,
  className = ''
}: ErrorMessageProps) {
  const { language } = useApp();
  
  const getErrorMessage = () => {
    if (language === 'ar' && messageAr) {
      return messageAr;
    }
    if (language === 'en' && message) {
      return message;
    }
    
    return errorMessages[type][language];
  };

  const retryButtonText = language === 'ar' ? 'إعادة المحاولة' : 'Retry';

  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>
        {language === 'ar' ? 'خطأ' : 'Error'}
      </AlertTitle>
      <AlertDescription className="flex items-center justify-between gap-4">
        <span>{getErrorMessage()}</span>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
            {retryButtonText}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
