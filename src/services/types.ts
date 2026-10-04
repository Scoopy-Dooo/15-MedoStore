/**
 * TypeScript Types & Interfaces
 * واجهات TypeScript للبيانات
 */

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'USER' | 'ADMIN';
  loyaltyPoints: number;
  isVerified: boolean;
  createdAt: string;
  _count?: {
    orders: number;
    reviews: number;
    wishlist: number;
  };
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  avatar?: string;
}

// ============================================
// Game & Package Interfaces
// ============================================

/**
 * Game Entity
 */
export interface Game {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  image: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    packages: number;
  };
  packages?: Package[];
}

/**
 * Package Entity
 */
export interface Package {
  id: string;
  gameId: string;
  amount: string;
  price: number;
  oldPrice?: number;
  isPopular: boolean;
  isActive: boolean;
  stock: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  game?: {
    id: string;
    name: string;
    nameAr: string;
    image: string;
    category: string;
  };
}

/**
 * Create Game Data
 */
export interface CreateGameData {
  name: string;
  nameAr: string;
  description?: string;
  descriptionAr?: string;
  image: string;
  category: string;
  sortOrder?: number;
}

/**
 * Update Game Data
 */
export interface UpdateGameData {
  name?: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  image?: string;
  category?: string;
  isActive?: boolean;
  sortOrder?: number;
}

/**
 * Create Package Data
 */
export interface CreatePackageData {
  gameId: string;
  amount: string;
  price: number;
  oldPrice?: number;
  isPopular?: boolean;
  stock?: number;
  sortOrder?: number;
}

/**
 * Update Package Data
 */
export interface UpdatePackageData {
  amount?: string;
  price?: number;
  oldPrice?: number;
  isPopular?: boolean;
  isActive?: boolean;
  stock?: number;
  sortOrder?: number;
}

/**
 * Get Games Parameters
 */
export interface GetGamesParams {
  category?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Date Range Filter for Statistics
 * نطاق التاريخ لفلترة الإحصائيات
 */
export type DateRangePreset = 'today' | 'last7days' | 'last30days' | 'custom';

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface GetDashboardStatsParams {
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Get Packages Parameters
 */
export interface GetPackagesParams {
  gameId?: string;
  isPopular?: boolean;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'amount' | 'createdAt' | 'sortOrder';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// ============================================
// Pagination Interfaces
// ============================================

/**
 * Pagination Metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

/**
 * Games Response
 */
export interface GetGamesResponse {
  games: Game[];
  pagination: PaginationMeta;
}

/**
 * Packages Response
 */
export interface GetPackagesResponse {
  packages: Package[];
  pagination: PaginationMeta;
}

// ============================================
// Dashboard Statistics
// ============================================

/**
 * Dashboard Statistics
 */
export interface DashboardStats {
  totalGames: number;
  totalActiveGames: number;
  totalPackages: number;
  totalActivePackages: number;
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  recentOrders: {
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
    user: {
      name: string;
      email: string;
    };
  }[];
  popularGames: {
    id: string;
    name: string;
    nameAr: string;
    image: string;
    ordersCount: number;
  }[];
  lowStockPackages: {
    id: string;
    amount: string;
    stock: number;
    game: {
      name: string;
      nameAr: string;
    };
  }[];
}

// ============================================
// Image Upload
// ============================================

/**
 * Upload Image Response
 */
export interface UploadImageResponse {
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
  format?: string;
  size?: number;
}
