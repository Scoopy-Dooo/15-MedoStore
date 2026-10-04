# Error Handling Components

This document explains how to use the error handling components in the Medo Store application.

## Components

### 1. ErrorMessage

A component for displaying error messages with optional retry functionality.

#### Features
- Bilingual support (Arabic/English)
- Predefined error types (Network, Authentication, Not Found, Server, Validation)
- Optional retry button
- Custom error messages support
- Uses shadcn/ui Alert component

#### Usage

```tsx
import { ErrorMessage, ErrorType } from './components/ErrorMessage';

// Basic usage with predefined error type
<ErrorMessage type={ErrorType.NETWORK} />

// With retry functionality
<ErrorMessage 
  type={ErrorType.SERVER} 
  onRetry={() => refetch()} 
/>

// With custom messages
<ErrorMessage 
  message="Custom error in English"
  messageAr="رسالة خطأ مخصصة بالعربية"
  onRetry={handleRetry}
/>

// Example in a component
function MyComponent() {
  const { data, error, refetch } = useQuery(...);
  
  if (error) {
    return <ErrorMessage type={ErrorType.SERVER} onRetry={refetch} />;
  }
  
  return <div>{/* component content */}</div>;
}
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| type | ErrorType | UNKNOWN | The type of error to display |
| message | string | undefined | Custom error message in English |
| messageAr | string | undefined | Custom error message in Arabic |
| onRetry | () => void | undefined | Callback function for retry button |
| className | string | '' | Additional CSS classes |

#### Error Types

- `ErrorType.NETWORK` - Connection errors
- `ErrorType.AUTHENTICATION` - Unauthorized access
- `ErrorType.NOT_FOUND` - Resource not found (404)
- `ErrorType.SERVER` - Server errors (500)
- `ErrorType.VALIDATION` - Input validation errors
- `ErrorType.UNKNOWN` - Generic errors

---

### 2. ErrorBoundary

A React error boundary component that catches JavaScript errors in child components.

#### Features
- Catches React component errors
- Bilingual support (Arabic/English)
- Displays error details for debugging
- Retry and "Go Home" buttons
- Component stack trace (expandable)
- Uses shadcn/ui Card component

#### Usage

```tsx
import { ErrorBoundary } from './components/ErrorBoundary';
import { useApp } from './context/AppContext';

// Wrap your app or specific sections
function App() {
  const { language } = useApp();
  
  return (
    <ErrorBoundary language={language}>
      <YourApp />
    </ErrorBoundary>
  );
}

// Wrap specific routes
<ErrorBoundary language={language} onReset={() => console.log('Reset')}>
  <AdminDashboard />
</ErrorBoundary>

// Wrap individual components
<ErrorBoundary language="en">
  <ComplexComponent />
</ErrorBoundary>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | required | Child components to wrap |
| language | 'ar' \| 'en' | 'ar' | Display language |
| onReset | () => void | undefined | Callback when user clicks retry |

#### What Errors Are Caught?

ErrorBoundary catches:
- Rendering errors in child components
- Lifecycle method errors
- Constructor errors in child components

ErrorBoundary does NOT catch:
- Event handler errors (use try-catch)
- Asynchronous code errors (use .catch or try-catch)
- Server-side rendering errors
- Errors in the error boundary itself

---

## Best Practices

### When to Use ErrorMessage
- API call failures
- Network connectivity issues
- Form validation errors
- Permission/authentication errors
- Specific, recoverable errors

### When to Use ErrorBoundary
- Wrap entire application (root level)
- Wrap complex features/modules
- Wrap third-party components
- Isolate error-prone sections
- Prevent entire app crashes

### Example: Complete Error Handling

```tsx
import { ErrorBoundary } from './components/ErrorBoundary';
import { ErrorMessage, ErrorType } from './components/ErrorMessage';
import { useApp } from './context/AppContext';

function MyFeature() {
  const { language } = useApp();
  const { data, error, isLoading, refetch } = useQuery('myData', fetchData);
  
  // Handle API errors with ErrorMessage
  if (error) {
    return <ErrorMessage type={ErrorType.SERVER} onRetry={refetch} />;
  }
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return <div>{/* Render data */}</div>;
}

function App() {
  const { language } = useApp();
  
  // Wrap with ErrorBoundary to catch React errors
  return (
    <ErrorBoundary language={language}>
      <MyFeature />
    </ErrorBoundary>
  );
}
```

---

## Styling

Both components use Tailwind CSS and shadcn/ui components, ensuring consistency with the rest of the application. They automatically adapt to the application's theme (dark/light) and direction (RTL/LTR).

---

## Accessibility

- Semantic HTML structure
- ARIA labels for icon buttons
- Keyboard navigation support
- Screen reader friendly
- High contrast error colors

---

## Testing

```tsx
// Example test for ErrorMessage
test('displays network error message', () => {
  render(<ErrorMessage type={ErrorType.NETWORK} />);
  expect(screen.getByText(/connection error/i)).toBeInTheDocument();
});

// Example test for ErrorBoundary
test('catches errors and displays fallback', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };
  
  render(
    <ErrorBoundary language="en">
      <ThrowError />
    </ErrorBoundary>
  );
  
  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
});
```
