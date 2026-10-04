import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

interface ErrorBoundaryProps {
  children: ReactNode;
  language?: 'ar' | 'en';
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

const errorContent = {
  ar: {
    title: 'حدث خطأ غير متوقع',
    description: 'نعتذر عن الإزعاج. حدث خطأ غير متوقع في التطبيق.',
    retry: 'إعادة المحاولة',
    home: 'العودة للصفحة الرئيسية',
    technicalDetails: 'التفاصيل التقنية'
  },
  en: {
    title: 'Something went wrong',
    description: 'We apologize for the inconvenience. An unexpected error occurred in the application.',
    retry: 'Try Again',
    home: 'Back to Home',
    technicalDetails: 'Technical Details'
  }
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = (): void => {
    const { onReset } = this.props;
    
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });

    if (onReset) {
      onReset();
    }
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, language = 'ar' } = this.props;

    if (hasError) {
      const content = errorContent[language];
      const isRTL = language === 'ar';

      return (
        <div 
          className="min-h-screen flex items-center justify-center p-4 bg-background"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-6 w-6" />
                <CardTitle className="text-2xl">{content.title}</CardTitle>
              </div>
              <CardDescription className="text-base mt-2">
                {content.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {error && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-semibold text-sm mb-2">{content.technicalDetails}:</p>
                  <p className="text-sm font-mono text-muted-foreground break-all">
                    {error.toString()}
                  </p>
                  {errorInfo && errorInfo.componentStack && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                        Component Stack
                      </summary>
                      <pre className="text-xs mt-2 overflow-auto max-h-40 text-muted-foreground">
                        {errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={this.handleGoHome}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                {content.home}
              </Button>
              <Button
                onClick={this.handleReset}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {content.retry}
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return children;
  }
}
