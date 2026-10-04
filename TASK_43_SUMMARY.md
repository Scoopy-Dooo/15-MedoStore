# Task 43: Update Admin API Services with Auth Headers

## Summary - ملخص

### Changes Made - التغييرات المنفذة

#### 1. Enhanced 403 Handling in API Interceptor
**File**: `src/services/api.ts`

Added comprehensive 403 (Forbidden) error handling to the response interceptor:
- Automatic logout on 403 responses
- Clear all authentication tokens
- Redirect to login page
- Prevent unauthorized admin access

#### 2. Optimized Image Upload Auth Headers
**File**: `src/services/admin.service.ts`

Improved the uploadImage method:
- Removed explicit Content-Type header for multipart/form-data
- Let Axios automatically set correct Content-Type with boundary
- Ensures Authorization header is properly injected by interceptor

### Verification - التحقق

✅ All admin service methods use the api interceptor
✅ Authorization header automatically injected for all requests
✅ 401 responses handled with token refresh
✅ 403 responses handled with logout and redirect
✅ No TypeScript errors
✅ Requirement 11.7 fully addressed

### Testing - الاختبار

Manual testing recommended:
- Admin creates/updates content with valid token
- Admin request with expired token (should auto-refresh)
- Admin request with invalid/missing token (should redirect)
- Non-admin user attempts admin action (should get 403 and redirect)

---
**Status**: ✅ Completed
