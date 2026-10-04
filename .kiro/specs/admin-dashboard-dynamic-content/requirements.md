# Requirements Document

## Introduction

This document specifies the requirements for transforming Medo Store from a static hardcoded data system to a fully dynamic, admin-driven content management system. The transformation includes removing static game data, implementing a complete admin dashboard for content management, integrating the frontend with existing backend APIs, and implementing a robust image upload system.

**Current State:**
- Game data hardcoded in `src/app/data/gamesData.ts`
- No admin interface for content management
- Backend services ready (GamesService & PackagesService)
- Prisma database schema complete and operational

**Target State:**
- Fully dynamic content served via API
- Complete admin dashboard for managing games, packages, inventory
- Frontend components connected to backend APIs
- Image upload and management system
- Real-time statistics and analytics dashboard

## Glossary

- **System**: The Medo Store web application including frontend, backend, and database
- **Admin_Dashboard**: The administrative interface for managing store content
- **Frontend**: The React-based customer-facing application
- **Backend**: The Node.js/Express API with Prisma ORM
- **API_Service**: HTTP client services for communicating with backend
- **Image_Upload_System**: The system for uploading and managing game images
- **Static_Data_File**: The file `src/app/data/gamesData.ts` containing hardcoded game information
- **Game_Entity**: A game record in the database with properties (name, image, category, etc.)
- **Package_Entity**: A pricing package associated with a game
- **Content_Manager**: An admin user with permissions to manage games and packages
- **Statistics_Module**: The analytics and reporting section of the admin dashboard

## Requirements

### Requirement 1: Remove Static Data Dependency

**User Story:** As a system administrator, I want to remove all hardcoded game data from the frontend, so that all content is served dynamically from the database.

#### Acceptance Criteria

1. THE System SHALL delete the file `src/app/data/gamesData.ts`
2. THE System SHALL remove all imports of `gamesData` from frontend components
3. THE System SHALL replace all static data references with API calls
4. WHEN the static data file is deleted, THEN no frontend component SHALL fail to compile
5. THE System SHALL ensure zero hardcoded game or package data remains in the frontend codebase

### Requirement 2: Implement API Service Layer

**User Story:** As a frontend developer, I want dedicated API service modules, so that I can easily fetch game and package data from the backend.

#### Acceptance Criteria

1. THE System SHALL create a `games.service.ts` file in `src/services/` directory
2. THE System SHALL create a `packages.service.ts` file in `src/services/` directory  
3. THE System SHALL create an `admin.service.ts` file in `src/services/` directory
4. THE games.service.ts SHALL include methods: `getAllGames()`, `getGameById()`, `getGameBySlug()`, `searchGames()`
5. THE packages.service.ts SHALL include methods: `getPackagesByGameId()`, `getPopularPackages()`
6. THE admin.service.ts SHALL include methods for CRUD operations on games and packages
7. WHEN an API call fails, THEN THE System SHALL return a descriptive error message
8. THE System SHALL use TypeScript interfaces matching backend response schemas
9. THE System SHALL implement proper error handling for network failures
10. THE System SHALL include request/response type definitions for all API methods

### Requirement 3: Integrate React Query for Data Fetching

**User Story:** As a frontend developer, I want React Query for data fetching and caching, so that the application has optimal performance and handles loading/error states automatically.

#### Acceptance Criteria

1. THE System SHALL install React Query (TanStack Query) as a dependency
2. THE System SHALL configure a QueryClient with appropriate default options
3. THE System SHALL wrap the application with QueryClientProvider
4. THE System SHALL implement custom hooks: `useGames()`, `useGame()`, `usePackages()`
5. THE System SHALL implement mutation hooks: `useCreateGame()`, `useUpdateGame()`, `useDeleteGame()`
6. WHEN data is fetched, THEN THE System SHALL cache it according to configured stale time
7. WHEN a mutation succeeds, THEN THE System SHALL invalidate and refetch related queries
8. THE System SHALL handle loading states with skeleton loaders or spinners
9. THE System SHALL handle error states with user-friendly error messages in Arabic and English
10. THE System SHALL implement optimistic updates for better user experience

### Requirement 4: Update Frontend Components to Use API Data

**User Story:** As a customer, I want to see real-time game and package data, so that I always have access to current offerings and prices.

#### Acceptance Criteria

1. THE System SHALL update `Home.tsx` to fetch games using `useGames()` hook
2. THE System SHALL update `Games.tsx` to fetch and display all games from API
3. THE System SHALL update `GameDetail.tsx` to fetch game details and packages from API
4. WHEN `Home.tsx` loads, THEN THE System SHALL display featured/popular games from API
5. WHEN `Games.tsx` loads, THEN THE System SHALL display all active games with pagination
6. WHEN `GameDetail.tsx` loads with a game slug, THEN THE System SHALL fetch and display game details and available packages
7. THE System SHALL display loading states while fetching data
8. WHEN API calls fail, THEN THE System SHALL display error messages in both Arabic and English
9. THE System SHALL implement retry logic for failed API calls
10. THE System SHALL cache API responses to minimize redundant requests

### Requirement 5: Create Admin Dashboard Layout

**User Story:** As a content manager, I want an admin dashboard interface, so that I can manage store content efficiently.

#### Acceptance Criteria

1. THE System SHALL create an `AdminDashboard` page component
2. THE System SHALL create a sidebar navigation component with menu items: Dashboard, Games, Packages, Statistics
3. THE System SHALL implement role-based routing to restrict access to admin users only
4. WHEN a non-admin user attempts to access admin routes, THEN THE System SHALL redirect to the login page
5. THE System SHALL use shadcn/ui components for consistent admin UI
6. THE System SHALL implement a responsive layout that works on desktop and tablet devices
7. THE System SHALL display the logged-in admin's name and avatar in the header
8. THE System SHALL include a logout button in the admin header
9. THE System SHALL maintain sidebar state (collapsed/expanded) in local storage

### Requirement 6: Implement Games Management Interface

**User Story:** As a content manager, I want to manage games (create, edit, delete, activate/deactivate), so that I can control the store's game catalog.

#### Acceptance Criteria

1. THE System SHALL create a Games Management page displaying all games in a table format
2. THE System SHALL display game columns: Image, Name (EN), Name (AR), Category, Status, Actions
3. THE System SHALL provide an "Add Game" button that opens a create game modal/form
4. THE System SHALL provide "Edit" and "Delete" action buttons for each game
5. WHEN "Add Game" is clicked, THEN THE System SHALL display a form with fields: name, nameAr, description, descriptionAr, image, category
6. WHEN a game form is submitted, THEN THE System SHALL validate all required fields
7. WHEN game creation succeeds, THEN THE System SHALL refresh the games list and display a success message
8. WHEN "Edit" is clicked, THEN THE System SHALL populate the form with existing game data
9. WHEN "Delete" is clicked, THEN THE System SHALL display a confirmation dialog
10. WHEN delete is confirmed AND the game has no associated orders, THEN THE System SHALL delete the game
11. WHEN delete is confirmed AND the game has associated orders, THEN THE System SHALL display an error message
12. THE System SHALL provide a toggle switch to activate/deactivate games
13. THE System SHALL implement search functionality to filter games by name or category
14. THE System SHALL implement sorting by name, category, or creation date
15. THE System SHALL implement pagination with configurable page size

### Requirement 7: Implement Packages Management Interface

**User Story:** As a content manager, I want to manage packages (create, edit, delete, set popular, manage inventory), so that I can control pricing and availability.

#### Acceptance Criteria

1. THE System SHALL create a Packages Management page displaying all packages grouped by game
2. THE System SHALL display package columns: Game, Amount, Price, Old Price, Popular, Stock, Status, Actions
3. THE System SHALL provide an "Add Package" button that opens a create package modal/form
4. THE System SHALL provide "Edit" and "Delete" action buttons for each package
5. WHEN "Add Package" is clicked, THEN THE System SHALL display a form with fields: game selection, amount, price, oldPrice, isPopular, stock
6. WHEN a package form is submitted, THEN THE System SHALL validate that price is a positive number
7. WHEN package creation succeeds, THEN THE System SHALL refresh the packages list and display a success message
8. WHEN "Edit" is clicked, THEN THE System SHALL populate the form with existing package data
9. WHEN "Delete" is clicked, THEN THE System SHALL display a confirmation dialog
10. WHEN delete is confirmed AND the package has no associated orders, THEN THE System SHALL delete the package
11. WHEN delete is confirmed AND the package has associated orders, THEN THE System SHALL display an error message
12. THE System SHALL provide a checkbox to mark packages as "popular"
13. THE System SHALL provide input fields to update stock quantities
14. THE System SHALL display stock warnings when inventory is low (< 10 items)
15. THE System SHALL implement filtering by game, price range, and status
16. THE System SHALL implement sorting by price, amount, or creation date

### Requirement 8: Implement Image Upload System

**User Story:** As a content manager, I want to upload game images, so that I can visually represent games in the store.

#### Acceptance Criteria

1. THE System SHALL create an image upload component with drag-and-drop functionality
2. THE System SHALL provide a file picker button as an alternative to drag-and-drop
3. WHEN an image is selected or dropped, THEN THE System SHALL validate that the file is an image (JPEG, PNG, WebP, GIF)
4. WHEN an image file size exceeds 5MB, THEN THE System SHALL display an error message
5. WHEN an image is selected, THEN THE System SHALL display a preview of the image
6. THE System SHALL provide a "Remove" button to clear the selected image
7. THE System SHALL implement an upload progress indicator
8. THE System SHALL upload images to cloud storage (Cloudinary, AWS S3, or similar) OR save to public server directory
9. WHEN image upload completes, THEN THE System SHALL return the image URL
10. THE System SHALL save the image URL in the game entity
11. THE System SHALL implement image optimization (compression, resizing) before upload
12. WHEN upload fails, THEN THE System SHALL display a user-friendly error message and allow retry

### Requirement 9: Implement Statistics Dashboard

**User Story:** As a content manager, I want to view store statistics and analytics, so that I can make informed decisions about inventory and content.

#### Acceptance Criteria

1. THE System SHALL create a Statistics Dashboard page
2. THE System SHALL display a card showing total number of active games
3. THE System SHALL display a card showing total number of available packages
4. THE System SHALL display a card showing total revenue (from completed orders)
5. THE System SHALL display a card showing total number of orders
6. THE System SHALL display a list or chart of top 5 most popular games (by order count)
7. THE System SHALL display a list of low-stock packages (stock < 10)
8. THE System SHALL implement date range filters for statistics
9. WHEN the dashboard loads, THEN THE System SHALL fetch and display all statistics
10. THE System SHALL update statistics in real-time or with manual refresh button
11. THE System SHALL display loading skeletons while fetching statistics

### Requirement 10: Implement Search and Filtering

**User Story:** As a customer, I want to search and filter games, so that I can quickly find what I'm looking for.

#### Acceptance Criteria

1. THE System SHALL implement a search input on the Games page
2. WHEN a user types in the search input, THEN THE System SHALL debounce the input and search games by name
3. THE System SHALL implement category filter dropdown
4. WHEN a category is selected, THEN THE System SHALL filter games to show only that category
5. THE System SHALL display filter tags showing active filters
6. THE System SHALL provide a "Clear Filters" button to reset all filters
7. THE System SHALL update the URL with search and filter parameters
8. THE System SHALL preserve search and filter state when navigating back to the Games page
9. WHEN no games match the search/filter criteria, THEN THE System SHALL display a "No games found" message

### Requirement 11: Implement Admin Authentication and Authorization

**User Story:** As a system administrator, I want admin routes protected by authentication and authorization, so that only authorized users can access admin features.

#### Acceptance Criteria

1. THE System SHALL check user role before rendering admin routes
2. WHEN a user without ADMIN role attempts to access admin routes, THEN THE System SHALL redirect to home page
3. THE System SHALL display "Access Denied" message for unauthorized access attempts
4. THE System SHALL implement a ProtectedAdminRoute component
5. THE System SHALL verify admin JWT token on every admin API request
6. WHEN an admin token expires, THEN THE System SHALL log out the admin and redirect to login
7. THE System SHALL implement role checking middleware on backend admin routes

### Requirement 12: Implement Data Validation

**User Story:** As a system administrator, I want all data validated before saving, so that the database maintains data integrity.

#### Acceptance Criteria

1. THE System SHALL validate that game names (English and Arabic) are not empty
2. THE System SHALL validate that game images are valid URLs or file uploads
3. THE System SHALL validate that categories are not empty
4. THE System SHALL validate that package prices are positive numbers
5. THE System SHALL validate that package amounts are not empty strings
6. THE System SHALL validate that stock quantities are non-negative integers
7. WHEN validation fails on the frontend, THEN THE System SHALL display field-specific error messages
8. WHEN validation fails on the backend, THEN THE System SHALL return a 400 error with descriptive messages
9. THE System SHALL implement consistent validation rules on both frontend and backend
10. THE System SHALL sanitize all text inputs to prevent XSS attacks

### Requirement 13: Implement Bilingual Support

**User Story:** As a user, I want the admin dashboard and error messages in Arabic and English, so that I can use the system in my preferred language.

#### Acceptance Criteria

1. THE System SHALL support Arabic and English languages in the admin dashboard
2. THE System SHALL use the existing translation system for admin interface
3. THE System SHALL display success messages in both Arabic and English
4. THE System SHALL display error messages in both Arabic and English
5. THE System SHALL display form labels and placeholders in both languages
6. THE System SHALL persist language preference in local storage
7. THE System SHALL support RTL layout for Arabic language

### Requirement 14: Implement Game Ordering

**User Story:** As a content manager, I want to reorder games for display priority, so that I can control which games appear first.

#### Acceptance Criteria

1. THE System SHALL add a `sortOrder` field to game entities
2. THE System SHALL provide drag-and-drop functionality to reorder games in admin interface
3. WHEN a game is dragged to a new position, THEN THE System SHALL update its `sortOrder` value
4. THE System SHALL sort games by `sortOrder` ascending by default
5. WHEN games have the same `sortOrder`, THEN THE System SHALL sort alphabetically as secondary sort

### Requirement 15: Implement Caching Strategy

**User Story:** As a system administrator, I want effective caching to reduce server load, so that the application performs optimally.

#### Acceptance Criteria

1. THE System SHALL cache game list data for 5 minutes
2. THE System SHALL cache individual game details for 10 minutes
3. THE System SHALL invalidate game cache when games are created, updated, or deleted
4. THE System SHALL invalidate package cache when packages are created, updated, or deleted
5. WHEN an admin updates content, THEN THE System SHALL clear relevant caches immediately
6. THE System SHALL implement stale-while-revalidate caching strategy

### Requirement 16: Implement Loading States

**User Story:** As a user, I want visual feedback during data loading, so that I know the application is working.

#### Acceptance Criteria

1. THE System SHALL display skeleton loaders while fetching game lists
2. THE System SHALL display skeleton loaders while fetching game details
3. THE System SHALL display skeleton loaders while fetching packages
4. THE System SHALL display spinner on admin action buttons during API calls
5. THE System SHALL disable action buttons during API calls to prevent double submission
6. THE System SHALL display progress indicators during image uploads
7. THE System SHALL implement smooth transitions between loading and loaded states

### Requirement 17: Implement Error Handling

**User Story:** As a user, I want clear error messages when something goes wrong, so that I understand what happened and what to do next.

#### Acceptance Criteria

1. WHEN a network error occurs, THEN THE System SHALL display "Connection error. Please check your internet connection."
2. WHEN a 404 error occurs, THEN THE System SHALL display "Resource not found."
3. WHEN a 401/403 error occurs, THEN THE System SHALL display "Unauthorized access." and redirect to login
4. WHEN a 500 error occurs, THEN THE System SHALL display "Server error. Please try again later."
5. WHEN validation fails, THEN THE System SHALL display field-specific error messages
6. THE System SHALL display error messages in toast notifications or alert components
7. THE System SHALL log errors to console for debugging purposes
8. THE System SHALL implement automatic retry for transient errors
9. THE System SHALL provide a "Retry" button for failed operations

### Requirement 18: Implement Responsive Design

**User Story:** As a user, I want the admin dashboard to work on different screen sizes, so that I can manage content from various devices.

#### Acceptance Criteria

1. THE System SHALL implement responsive layouts for admin dashboard on desktop (>= 1024px), tablet (768-1023px)
2. THE System SHALL collapse sidebar on tablet and mobile devices
3. THE System SHALL stack form fields vertically on smaller screens
4. THE System SHALL use responsive tables with horizontal scrolling on small screens
5. THE System SHALL scale images appropriately for different screen sizes
6. THE System SHALL ensure touch-friendly button and input sizes on mobile devices
7. THE System SHALL test and verify functionality on Chrome, Firefox, Safari, and Edge browsers

### Requirement 19: Implement Activity Logging (Optional)

**User Story:** As a system administrator, I want to see logs of admin actions, so that I can audit changes to the system.

#### Acceptance Criteria

1. IF activity logging is implemented, THEN THE System SHALL log game creation with user, timestamp, and game details
2. IF activity logging is implemented, THEN THE System SHALL log game updates with changed fields
3. IF activity logging is implemented, THEN THE System SHALL log game deletions
4. IF activity logging is implemented, THEN THE System SHALL log package creation, updates, and deletions
5. IF activity logging is implemented, THEN THE System SHALL provide an Activity Log page in admin dashboard
6. IF activity logging is implemented, THEN THE System SHALL filter activity logs by action type, user, and date range

### Requirement 20: Implement Bulk Operations (Optional)

**User Story:** As a content manager, I want to perform bulk operations on games and packages, so that I can make mass changes efficiently.

#### Acceptance Criteria

1. IF bulk operations are implemented, THEN THE System SHALL provide checkboxes to select multiple games
2. IF bulk operations are implemented, THEN THE System SHALL provide a "Bulk Actions" dropdown with options: Activate, Deactivate, Delete
3. IF bulk operations are implemented, WHEN bulk activate is selected, THEN THE System SHALL activate all selected games
4. IF bulk operations are implemented, WHEN bulk deactivate is selected, THEN THE System SHALL deactivate all selected games
5. IF bulk operations are implemented, WHEN bulk delete is selected, THEN THE System SHALL display a confirmation dialog
6. IF bulk operations are implemented, WHEN bulk delete is confirmed, THEN THE System SHALL delete all selected games without associated orders

