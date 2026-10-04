// Unit Tests: admin.service.ts - اختبارات خدمة الإدارة
import { describe, it, expect, vi, beforeEach } from 'vitest';
import adminService from '../../services/admin.service';

// Mock the entire api module to intercept the custom axios instance
vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
  handleApiResponse: vi.fn((r) => ({ success: true, data: r.data })),
  handleApiError: vi.fn(() => ({ success: false, message: 'Error' })),
}));

import api, { handleApiResponse, handleApiError } from '../../services/api';
const mockApi = vi.mocked(api);
const mockHandleResponse = vi.mocked(handleApiResponse);
const mockHandleError = vi.mocked(handleApiError);

const mockGame = {
  id: '1', name: 'Free Fire', nameAr: 'فري فاير', slug: 'free-fire',
  image: 'img.jpg', category: 'Battle Royale', isActive: true, sortOrder: 0,
  createdAt: '', updatedAt: '',
};

const mockPackage = {
  id: 'p1', gameId: '1', amount: '60', price: 5000,
  isPopular: false, isActive: true, stock: 100, sortOrder: 0,
  createdAt: '', updatedAt: '',
};

describe('admin.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHandleResponse.mockImplementation((r) => ({ success: true, data: r.data }));
    mockHandleError.mockImplementation(() => ({ success: false, message: 'Error' }));
  });

  it('createGame returns success', async () => {
    mockApi.post.mockResolvedValueOnce({ data: { success: true, data: mockGame } });
    mockHandleResponse.mockReturnValueOnce({ success: true, data: mockGame });

    const result = await adminService.createGame({ name: 'Free Fire', nameAr: 'فري فاير', image: 'img.jpg', category: 'Battle Royale' });

    expect(result.success).toBe(true);
    expect(mockApi.post).toHaveBeenCalledWith('/admin/games', expect.any(Object));
  });

  it('createGame returns failure on error', async () => {
    mockApi.post.mockRejectedValueOnce(new Error('Server error'));
    mockHandleError.mockReturnValueOnce({ success: false, message: 'Server error' });

    const result = await adminService.createGame({ name: 'T', nameAr: 'ت', image: 'img.jpg', category: 'Other' });

    expect(result.success).toBe(false);
  });

  it('updateGame returns success', async () => {
    mockApi.put.mockResolvedValueOnce({ data: { success: true, data: mockGame } });
    mockHandleResponse.mockReturnValueOnce({ success: true, data: mockGame });

    const result = await adminService.updateGame('1', { name: 'Updated' });

    expect(result.success).toBe(true);
    expect(mockApi.put).toHaveBeenCalledWith('/admin/games/1', { name: 'Updated' });
  });

  it('deleteGame returns success', async () => {
    mockApi.delete.mockResolvedValueOnce({ data: { success: true } });
    mockHandleResponse.mockReturnValueOnce({ success: true });

    const result = await adminService.deleteGame('1');

    expect(result.success).toBe(true);
    expect(mockApi.delete).toHaveBeenCalledWith('/admin/games/1');
  });

  it('deleteGame returns failure when game has orders', async () => {
    mockApi.delete.mockRejectedValueOnce(new Error('Has orders'));
    mockHandleError.mockReturnValueOnce({ success: false, message: 'Cannot delete' });

    const result = await adminService.deleteGame('1');

    expect(result.success).toBe(false);
  });

  it('createPackage returns success', async () => {
    mockApi.post.mockResolvedValueOnce({ data: { success: true, data: mockPackage } });
    mockHandleResponse.mockReturnValueOnce({ success: true, data: mockPackage });

    const result = await adminService.createPackage({ gameId: '1', amount: '60', price: 5000 });

    expect(result.success).toBe(true);
  });

  it('deletePackage returns success', async () => {
    mockApi.delete.mockResolvedValueOnce({ data: { success: true } });
    mockHandleResponse.mockReturnValueOnce({ success: true });

    const result = await adminService.deletePackage('p1');

    expect(result.success).toBe(true);
    expect(mockApi.delete).toHaveBeenCalledWith('/admin/packages/p1');
  });

  it('getDashboardStats returns data', async () => {
    const mockStats = { totalGames: 10, totalActiveGames: 8, totalPackages: 50, totalActivePackages: 45, totalOrders: 200, totalRevenue: 1000000, totalUsers: 500, recentOrders: [], popularGames: [], lowStockPackages: [] };
    mockApi.get.mockResolvedValueOnce({ data: { success: true, data: mockStats } });
    mockHandleResponse.mockReturnValueOnce({ success: true, data: mockStats });

    const result = await adminService.getDashboardStats();

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it('getDashboardStats returns failure on network error', async () => {
    mockApi.get.mockRejectedValueOnce(new Error('Network Error'));
    mockHandleError.mockReturnValueOnce({ success: false, message: 'Network Error' });

    const result = await adminService.getDashboardStats();

    expect(result.success).toBe(false);
  });
});
