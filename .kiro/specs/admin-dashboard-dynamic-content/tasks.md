# Implementation Plan: Admin Dashboard Dynamic Content

## Overview

This implementation plan transforms Medo Store from a static hardcoded system to a fully dynamic, admin-driven content management system. The implementation follows a phased approach:

1. **Foundation**: Install dependencies, create API service layer, integrate React Query
2. **Data Migration**: Remove static data and connect frontend to backend APIs
3. **Admin Infrastructure**: Build admin layout, routing, and authentication
4. **Content Management**: Implement games and packages management interfaces
5. **Media Handling**: Create image upload system with cloud storage
6. **Analytics**: Build statistics dashboard
7. **Polish**: Error handling, loading states, bilingual support, testing

**Technologies**: React + TypeScript + Vite + React Query + shadcn/ui + Tailwind CSS

**Key Requirements Addressed**:
- Req 1: Remove static data dependency
- Req 2-4: API service layer and React Query integration
- Req 5-7: Admin dashboard with games and packages management
- Req 8: Image upload system
- Req 9: Statistics dashboard
- Req 10-18: Search, authentication, validation, bilingual support, responsive design

## Tasks

### Phase 1: Setup and Dependencies

- [x] 1. Install and configure dependencies
  - Install @tanstack/react-query for data fetching and caching
  - Install react-hook-form for form handling
  - Install zod for validation schemas
  - Install @dnd-kit/core and @dnd-kit/sortable for drag-and-drop (game reordering)
  - Verify all shadcn/ui components are installed (table, dialog, form, toast, etc.)
  - _Requirements: 3.1, 3.2_

- [x] 2. Setup React Query provider
  - Create `src/lib/queryClient.ts` with QueryClient configuration
  - Configure default options: staleTime (5 min), gcTime (10 min), retry logic
  - Wrap application with QueryClientProvider in main.tsx or App.tsx
  - Add React Query DevTools for development environment
  - _Requirements: 3.2, 3.3, 15.1, 15.2_

### Phase 2: API Service Layer

- [x] 3. Create TypeScript interfaces for API data
  - Create `src/services/types.ts` with interfaces: Game, Package, CreateGameData, UpdateGameData, CreatePackageData, UpdatePackageData, GetGamesParams, GetPackagesParams, DashboardStats
  - Define pagination interfaces: PaginatedResponse, PaginationParams
  - Define API response wrappers matching backend response structure
  - Export all interfaces for use across services and components
  - _Requirements: 2.8, 2.10_

- [x] 4. Implement games.service.ts
  - Create `src/services/games.service.ts`
  - Implement `getAllGames(params?: GetGamesParams): Promise<GetGamesResponse>`
  - Implement `getGameById(gameId: string): Promise<Game>`
  - Implement `getGameBySlug(slug: string): Promise<Game>`
  - Implement `searchGames(query: string): Promise<Game[]>`
  - Add error handling using handleApiError helper
  - Use TypeScript interfaces for type safety
  - _Requirements: 2.1, 2.4, 2.7, 2.9_

- [x] 5. Implement packages.service.ts
  - Create `src/services/packages.service.ts`
  - Implement `getAllPackages(params?: GetPackagesParams): Promise<PackagesResponse>`
  - Implement `getPackagesByGameId(gameId: string): Promise<Package[]>`
  - Implement `getPopularPackages(limit?: number): Promise<Package[]>`
  - Add error handling and type definitions
  - _Requirements: 2.2, 2.5, 2.7, 2.9_

- [x] 6. Implement admin.service.ts
  - Create `src/services/admin.service.ts`
  - Implement game CRUD: `createGame()`, `updateGame()`, `deleteGame()`
  - Implement package CRUD: `createPackage()`, `updatePackage()`, `deletePackage()`
  - Implement `getDashboardStats(): Promise<DashboardStats>`
  - Implement `uploadImage(file: File): Promise<{ url: string }>`
  - Add proper error handling and response transformation
  - _Requirements: 2.3, 2.6, 2.7, 2.9_

### Phase 3: React Query Hooks

- [x] 7. Create query hooks for data fetching
  - Create `src/app/hooks/useGames.ts` with useGames hook (staleTime: 5 min)
  - Create `src/app/hooks/useGame.ts` with useGame hook (staleTime: 10 min)
  - Create `src/app/hooks/usePackages.ts` with usePackages hook (staleTime: 5 min)
  - Create `src/app/hooks/useGamePackages.ts` for packages by game ID
  - Create `src/app/hooks/useDashboardStats.ts` for statistics
  - Configure proper queryKey structure for cache management
  - _Requirements: 3.4, 3.6, 15.1, 15.2_

- [x] 8. Create mutation hooks for data modification
  - Create `src/app/hooks/useCreateGame.ts` with optimistic updates
  - Create `src/app/hooks/useUpdateGame.ts` with cache invalidation
  - Create `src/app/hooks/useDeleteGame.ts` with cache invalidation
  - Create `src/app/hooks/useCreatePackage.ts`
  - Create `src/app/hooks/useUpdatePackage.ts`
  - Create `src/app/hooks/useDeletePackage.ts`
  - Create `src/app/hooks/useUploadImage.ts` with progress tracking
  - Implement onSuccess callbacks to invalidate relevant queries
  - Implement onError callbacks for toast notifications
  - _Requirements: 3.5, 3.7, 3.10, 15.3, 15.4_

### Phase 4: Remove Static Data and Connect Frontend

- [x] 9. Update Home.tsx to use API data
  - Replace static gamesData imports with useGames hook
  - Fetch featured/popular games using API
  - Add loading skeleton while fetching (using shadcn/ui skeleton)
  - Add error handling with retry button
  - Implement bilingual error messages
  - _Requirements: 4.1, 4.4, 4.7, 4.8, 16.1_

- [x] 10. Update Games.tsx to use API data
  - Replace static gamesData with useGames hook
  - Implement pagination with page parameter
  - Add loading skeletons for game cards
  - Add error boundary with user-friendly messages
  - Implement retry logic for failed requests
  - _Requirements: 4.2, 4.5, 4.7, 4.8, 4.9, 16.2_

- [x] 11. Update GameDetail.tsx to use API data
  - Replace static game data with useGame hook (by slug)
  - Fetch game packages using useGamePackages hook
  - Add loading states for game details and packages
  - Handle 404 errors when game not found
  - Add error handling with bilingual messages
  - _Requirements: 4.3, 4.6, 4.7, 4.8, 4.9, 16.3_

- [x] 12. Delete static data file and clean up imports
  - Delete `src/app/data/gamesData.ts` file
  - Search and remove all imports of gamesData across codebase
  - Verify no compilation errors after deletion
  - Run build to ensure no broken references
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

### Phase 5: Admin Dashboard Layout and Routing

- [x] 13. Create admin route structure and protected routes
  - Define admin routes in src/app/routes.tsx: /admin, /admin/games, /admin/packages, /admin/statistics
  - Create `src/app/components/ProtectedAdminRoute.tsx` component
  - Implement role checking (ADMIN or SUPER_ADMIN) using auth context
  - Redirect to login if user not authenticated
  - Display "Access Denied" message if user not authorized
  - _Requirements: 5.3, 5.4, 11.1, 11.2, 11.3, 11.4_

- [x] 14. Implement AdminLayout component
  - Create `src/app/components/admin/AdminLayout.tsx`
  - Implement responsive layout with sidebar and main content area
  - Use shadcn/ui Sheet component for mobile sidebar
  - Add header with breadcrumb navigation
  - Persist sidebar collapsed state in localStorage
  - Support desktop (>= 1024px) and tablet (768-1023px) layouts
  - _Requirements: 5.1, 5.2, 5.6, 5.9, 18.1, 18.2_

- [x] 15. Create AdminSidebar component
  - Create `src/app/components/admin/AdminSidebar.tsx`
  - Add navigation menu items: Dashboard, Games Management, Packages Management, Statistics
  - Highlight active route using react-router's useLocation
  - Add icons from lucide-react for each menu item
  - Display admin user name and avatar in sidebar header
  - Add logout button with confirmation dialog
  - _Requirements: 5.2, 5.7, 5.8_

- [x] 16. Create admin dashboard home page
  - Create `src/app/pages/admin/Dashboard.tsx`
  - Display welcome message with admin name
  - Add quick stats cards: Total Games, Total Packages, Total Orders
  - Add quick action buttons: Add Game, Add Package, View Statistics
  - Use shadcn/ui Card components for layout
  - _Requirements: 5.1, 9.9_

### Phase 6: Games Management Interface

- [x] 17. Create GamesManagement page with table
  - Create `src/app/pages/admin/GamesManagement.tsx`
  - Use shadcn/ui Table component for games list
  - Display columns: Thumbnail, Name (EN), Name (AR), Category, Status, Packages Count, Actions
  - Implement loading skeleton table rows using shadcn/ui Skeleton
  - Add error handling with retry button
  - _Requirements: 6.1, 6.2, 16.1_

- [x] 18. Implement search and filtering for games
  - Add search input with debounce (300ms) to filter by name
  - Add category filter dropdown using shadcn/ui Select
  - Add status filter (All, Active, Inactive)
  - Display active filter tags using shadcn/ui Badge
  - Add "Clear Filters" button to reset all filters
  - Update URL query parameters with filters
  - _Requirements: 6.13, 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 19. Implement sorting and pagination for games
  - Add sortable column headers (Name, Category, Created Date)
  - Implement server-side pagination with page size selector (10, 20, 50)
  - Use shadcn/ui Pagination component
  - Preserve sort and page state in URL parameters
  - _Requirements: 6.14, 6.15, 10.6, 10.7, 10.8_

- [x] 20. Create GameForm component for create/edit
  - Create `src/app/components/admin/GameForm.tsx`
  - Use react-hook-form with zod schema validation
  - Add form fields: name (EN), nameAr, description (EN), descriptionAr, category, image upload
  - Implement validation: name required (min 2 chars), nameAr required (min 2 chars), image required, category required
  - Display field-specific error messages below inputs
  - Use shadcn/ui Form, Input, Textarea, Select components
  - Support bilingual labels and placeholders
  - _Requirements: 6.5, 6.6, 12.1, 12.2, 12.3, 12.4, 13.5_

- [x] 21. Implement create game functionality
  - Add "Add Game" button that opens Dialog with GameForm
  - Handle form submission using useCreateGame mutation hook
  - Display loading spinner on submit button during API call
  - Disable form during submission to prevent double submission
  - Show success toast notification (bilingual) on success
  - Close dialog and refresh games list on success
  - Display validation errors from backend if any
  - _Requirements: 6.3, 6.6, 6.7, 13.3, 13.4, 16.4, 16.5_

- [x] 22. Implement edit game functionality
  - Add "Edit" button in actions column that opens Dialog with GameForm
  - Pre-populate form with existing game data
  - Handle form submission using useUpdateGame mutation hook
  - Invalidate game detail and games list cache on success
  - Show success toast notification (bilingual)
  - Close dialog and refresh data on success
  - _Requirements: 6.4, 6.8, 13.3, 13.4_

- [x] 23. Implement delete game functionality
  - Add "Delete" button in actions column
  - Show confirmation dialog with game name before deletion
  - Use shadcn/ui AlertDialog for confirmation
  - Handle deletion using useDeleteGame mutation hook
  - Display error if game has associated orders (cannot delete)
  - Show success toast notification on successful deletion
  - Invalidate games list cache on success
  - _Requirements: 6.4, 6.9, 6.10, 6.11, 13.3, 13.4_

- [x] 24. Implement activate/deactivate toggle for games
  - Add toggle switch in Status column using shadcn/ui Switch
  - Handle toggle using useUpdateGame mutation hook
  - Update game isActive status optimistically
  - Revert on error with error toast notification
  - _Requirements: 6.12, 3.10_

### Phase 7: Packages Management Interface

- [x] 25. Create PackagesManagement page with table
  - Create `src/app/pages/admin/PackagesManagement.tsx`
  - Use shadcn/ui Table component for packages list
  - Display columns: Game Name, Amount, Price (SDG), Old Price, Popular Badge, Stock, Status, Actions
  - Group packages by game or show game name in each row
  - Highlight low stock (< 10) with warning badge using shadcn/ui Badge
  - _Requirements: 7.1, 7.2, 7.14_

- [x] 26. Implement filtering and sorting for packages
  - Add game filter dropdown (filter by specific game)
  - Add price range filter inputs (min price, max price)
  - Add status filter (All, Active, Inactive)
  - Add sorting by Price, Amount, Created Date
  - Implement server-side filtering and sorting
  - _Requirements: 7.15, 7.16_

- [x] 27. Create PackageForm component for create/edit
  - Create `src/app/components/admin/PackageForm.tsx`
  - Use react-hook-form with zod schema validation
  - Add fields: game selection, amount, price, oldPrice (optional), isPopular checkbox, stock
  - Validate: gameId required, amount required, price > 0, oldPrice > price (if provided), stock >= 0
  - Display validation errors below inputs
  - Use shadcn/ui Form, Select, Input, Checkbox components
  - _Requirements: 7.5, 7.6, 12.5, 12.6, 12.7_

- [x] 28. Implement create package functionality
  - Add "Add Package" button that opens Dialog with PackageForm
  - Handle form submission using useCreatePackage mutation hook
  - Show success toast notification on success
  - Close dialog and refresh packages list on success
  - Display backend validation errors if any
  - _Requirements: 7.3, 7.6, 7.7, 13.3, 13.4_

- [x] 29. Implement edit package functionality
  - Add "Edit" button in actions column that opens Dialog with PackageForm
  - Pre-populate form with existing package data
  - Handle submission using useUpdatePackage mutation hook
  - Invalidate packages cache on success
  - Show success toast notification
  - _Requirements: 7.4, 7.8, 13.3, 13.4_

- [x] 30. Implement delete package functionality
  - Add "Delete" button in actions column
  - Show confirmation dialog before deletion
  - Handle deletion using useDeletePackage mutation hook
  - Display error if package has associated orders
  - Show success toast notification on success
  - _Requirements: 7.4, 7.9, 7.10, 7.11, 13.3, 13.4_

- [x] 31. Implement popular package toggle and stock updates
  - Add toggle switch for isPopular in table
  - Add inline stock input field with quick update button
  - Handle updates using useUpdatePackage mutation hook
  - Implement optimistic updates for better UX
  - _Requirements: 7.12, 7.13_

### Phase 8: Image Upload System

- [x] 32. Create ImageUpload component
  - Create `src/app/components/admin/ImageUpload.tsx`
  - Implement drag-and-drop area using HTML5 drag events
  - Add file picker button as alternative to drag-and-drop
  - Display image preview when file selected
  - Add "Remove" button to clear selected image
  - Style with dashed border and upload icon
  - _Requirements: 8.1, 8.2, 8.5, 8.6_

- [x] 33. Implement image validation and preview
  - Validate file type: accept only JPEG, PNG, WebP, GIF
  - Validate file size: max 5MB
  - Display validation error messages below upload area
  - Show image preview using URL.createObjectURL
  - Display file name and size
  - _Requirements: 8.3, 8.4, 8.5, 8.12_

- [x] 34. Implement image upload with progress tracking
  - Implement upload progress indicator using shadcn/ui Progress
  - Use useUploadImage mutation hook with onUploadProgress callback
  - Upload to Cloudinary, AWS S3, or backend public directory
  - Display upload progress percentage
  - Handle upload errors with retry button
  - Return uploaded image URL on success
  - _Requirements: 8.7, 8.8, 8.9, 8.12_

- [x] 35. Integrate ImageUpload into GameForm
  - Add ImageUpload component to GameForm
  - Connect image URL to form state using react-hook-form
  - Display current image if editing existing game
  - Allow replacing existing image
  - Validate image URL before form submission
  - _Requirements: 8.10, 8.11_

### Phase 9: Statistics Dashboard

- [x] 36. Create Statistics dashboard page
  - Create `src/app/pages/admin/Statistics.tsx`
  - Use grid layout for stat cards (responsive: 1 col mobile, 2 cols tablet, 4 cols desktop)
  - Fetch statistics using useDashboardStats hook
  - Add manual refresh button
  - Display loading skeletons while fetching
  - _Requirements: 9.1, 9.9, 9.10, 9.11_

- [x] 37. Create StatsCard component and implement key metrics
  - Create `src/app/components/admin/StatsCard.tsx`
  - Display card with icon, title, value, and optional trend indicator
  - Implement cards: Total Active Games, Total Available Packages, Total Revenue, Total Orders
  - Use icons from lucide-react
  - Use shadcn/ui Card component for styling
  - _Requirements: 9.2, 9.3, 9.4, 9.5_

- [x] 38. Implement popular games chart/list
  - Display top 5 most popular games by order count
  - Use recharts BarChart or list with badges
  - Show game name and order count
  - Add "View Details" link to each game
  - _Requirements: 9.6_

- [x] 39. Implement low stock packages list
  - Display packages with stock < 10
  - Use shadcn/ui Table or list with warning badges
  - Show game name, package amount, current stock
  - Add "Update Stock" quick action button
  - Sort by stock level (lowest first)
  - _Requirements: 9.7_

- [x] 40. Implement date range filter for statistics
  - Add date range picker using shadcn/ui Calendar with Popover
  - Add preset options: Today, Last 7 Days, Last 30 Days, Custom Range
  - Filter statistics by selected date range
  - Update all charts and metrics when range changes
  - _Requirements: 9.8_

### Phase 10: Authentication and Authorization

- [x] 41. Implement admin role checking in ProtectedAdminRoute
  - Check user.role from auth context
  - Allow access only for ADMIN or SUPER_ADMIN roles
  - Redirect to home page if role not authorized
  - Display toast notification for access denied
  - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [x] 42. Implement token validation on admin routes
  - Verify JWT token exists in localStorage
  - Check token expiration before rendering admin routes
  - Trigger token refresh if token expired but refresh token valid
  - Logout user if both tokens invalid
  - _Requirements: 11.5, 11.6_

- [x] 43. Update admin API services with auth headers
  - Ensure all admin service methods include Authorization header
  - Use existing api interceptor for automatic token injection
  - Handle 401/403 responses with logout and redirect
  - _Requirements: 11.7_

### Phase 11: Error Handling and Loading States

- [x] 44. Create error handling components
  - Create `src/app/components/ErrorMessage.tsx` for displaying errors
  - Create `src/app/components/ErrorBoundary.tsx` for catching React errors
  - Support bilingual error messages (Arabic/English)
  - Add retry button for recoverable errors
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6_

- [x] 45. Implement loading skeletons for all data fetching
  - Create skeleton components for GameCard, ProductCard, Table rows
  - Use shadcn/ui Skeleton component
  - Display skeletons in Home.tsx, Games.tsx, GameDetail.tsx while loading
  - Display skeleton table rows in admin pages while loading
  - Implement smooth transitions between loading and loaded states
  - _Requirements: 16.1, 16.2, 16.3, 16.6, 16.7_

- [x] 46. Implement button loading states
  - Add loading spinner to all action buttons during API calls
  - Disable buttons during submission to prevent double submission
  - Use shadcn/ui Button's loading state prop
  - Show loading state in Create, Update, Delete buttons
  - _Requirements: 16.4, 16.5_

- [x] 47. Implement retry logic and error logging
  - Configure React Query retry logic: 3 retries for network errors, 2 retries for server errors
  - Implement exponential backoff for retries
  - Add "Retry" button to error messages
  - Log errors to console in development mode
  - _Requirements: 17.7, 17.8, 17.9_

### Phase 12: Bilingual Support and Translations

- [x] 48. Add admin dashboard translations
  - Extend `src/app/data/translations.ts` with admin translations
  - Add translations for: Dashboard, Games Management, Packages Management, Statistics, form labels, button text, success/error messages
  - Support both Arabic and English for all admin UI text
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [x] 49. Implement RTL layout support for admin dashboard
  - Add RTL layout switching based on language in AdminLayout
  - Set document.documentElement.dir to 'rtl' or 'ltr'
  - Adjust table alignment and form layouts for RTL
  - Test all admin pages in both LTR and RTL modes
  - _Requirements: 13.6, 13.7_

- [x] 50. Implement language persistence
  - Persist language preference in localStorage
  - Load language preference on app initialization
  - Add language switcher in admin header
  - _Requirements: 13.6_

### Phase 13: Drag-and-Drop Game Ordering (Optional)

- [x] 51. Implement game reordering with drag-and-drop
  - Integrate @dnd-kit/core and @dnd-kit/sortable in GamesManagement table
  - Add drag handle icon to each game row
  - Update game sortOrder when dragged to new position
  - Call useUpdateGame mutation to persist new order
  - Implement optimistic updates for smooth UX
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

### Phase 14: Responsive Design and Browser Testing

- [x] 52. Implement responsive layouts for admin dashboard
  - Test admin layout on desktop (>= 1024px), tablet (768-1023px)
  - Collapse sidebar to hamburger menu on tablet and mobile
  - Stack form fields vertically on smaller screens
  - Use horizontal scrolling for tables on small screens
  - Scale images and cards appropriately
  - Ensure touch-friendly button sizes (min 44x44px)
  - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6_

- [x] 53. Test admin dashboard across browsers
  - Test functionality on Chrome, Firefox, Safari, Edge
  - Verify form submissions work correctly
  - Verify image uploads work correctly
  - Verify drag-and-drop works (if implemented)
  - Fix any browser-specific issues
  - _Requirements: 18.7_

### Phase 15: Performance Optimization

- [x] 54. Implement code splitting for admin routes
  - Use React.lazy() to lazy load admin page components
  - Wrap lazy components with React.Suspense
  - Add loading fallback for lazy-loaded routes
  - Optimize bundle size by splitting admin code from customer-facing code
  - _Requirements: 15.6_

- [x] 55. Optimize images and implement lazy loading
  - Add lazy loading to game images using loading="lazy"
  - Implement responsive images with srcset (if using cloud storage)
  - Use WebP format with fallbacks where possible
  - Optimize image thumbnails for table views (smaller sizes)
  - _Requirements: 4.10_

### Phase 16: Testing

- [x]* 56. Write unit tests for API services
  - Test games.service.ts methods with mocked axios
  - Test packages.service.ts methods with mocked axios
  - Test admin.service.ts methods with mocked axios
  - Test error handling scenarios
  - Test response transformation

- [x] 57. Write unit tests for React Query hooks
  - Test useGames hook with mocked service
  - Test useCreateGame mutation hook
  - Test useUpdateGame mutation hook
  - Test cache invalidation on mutations
  - Use @tanstack/react-query testing utilities

- [x]* 58. Write integration tests for admin workflows
  - Test complete game creation flow
  - Test game editing flow
  - Test game deletion flow
  - Test package creation flow
  - Test image upload flow
  - Use React Testing Library

- [ ]* 59. Write E2E tests for critical paths (optional)
  - Test admin login and dashboard access
  - Test game creation with image upload
  - Test package creation workflow
  - Test customer viewing updated content
  - Use Playwright or Cypress

### Phase 17: Documentation and Deployment Preparation

- [x] 60. Update environment configuration
  - Document required environment variables in .env.example
  - Add VITE_API_URL, VITE_UPLOAD_URL, VITE_CLOUDINARY_* (if using Cloudinary)
  - Create separate .env.development and .env.production templates
  - Document all API endpoints used by frontend

- [x] 61. Optimize production build
  - Configure Vite build options for code splitting
  - Set up manual chunks for vendor libraries
  - Enable minification and tree-shaking
  - Test production build locally
  - Verify bundle sizes are reasonable (< 500KB initial)

- [x] 62. Final testing and bug fixes
  - Perform full user acceptance testing of all admin features
  - Test all customer-facing features with dynamic data
  - Fix any bugs discovered during testing
  - Verify bilingual support works correctly
  - Test error scenarios and edge cases

- [x] 63. Deployment and monitoring
  - Deploy frontend to production environment
  - Verify environment variables are correctly set
  - Test admin dashboard in production
  - Monitor for errors using browser console or error tracking service
  - Verify API connectivity and performance

## Notes

- **Tasks marked with `*` are optional** and can be skipped for faster MVP delivery
- **Incremental Development**: Each phase builds on the previous one; complete phases sequentially
- **Testing Strategy**: Optional test tasks provide comprehensive coverage but can be implemented after MVP launch
- **Property-Based Testing**: Not included as this feature primarily involves UI components, API integration, and CRUD operations which are better suited for example-based tests and integration tests
- **Checkpoints**: After phases 6, 8, and 11, ensure all tests pass and verify functionality manually
- **Requirements Traceability**: Each task references specific requirements for full coverage
- **Bilingual Support**: All user-facing text must support both Arabic and English
- **Security**: All admin routes must verify authentication and authorization
- **Performance**: React Query caching reduces API calls; lazy loading optimizes bundle size
