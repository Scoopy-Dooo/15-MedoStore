// Unit Tests: packages.service.ts - اختبارات خدمة الباقات
import { describe, it, expect, vi, beforeEach } from 'vitest';
import packagesService from '../../services/packages.service';

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

const mockPackage = {
  id: 'p1', gameId: '1', amount: '60', price: 5000,
  isPopular: true, isActive: true, stock: 50, sortOrder: 0,
  createdAt: '', updatedAt: '',
};

const mockPaginatedResponse = {
  packages: [mockPackage],
  pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
};

describe('packages.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHandleResponse.mockImplementation((r) => ({ success: true, data: r.data }));
    mockHandleError.mockImplementation(() => ({ success: false, message: 'Error' }));
  });

  it('getAllPackages returns packages', async () => {
    mockApi.get.mockResolvedValueOnce({ data: { success: true, data: mockPaginatedResponse } });
    mockHandleResponse.mockReturnValueOnce({ success: true, data: mockPaginatedResponse });

    const result = await packagesService.getAllPackages();

    expect(result.success).toBe(true);
    expect(mockApi.get).toHaveBeenCalledWith('/packages', expect.anything());
  });

  it('getAllPackages returns failure on error', async () => {
    mockApi.get.mockRejectedValueOnce(new Error('Network Error'));
    mockHandleError.mockReturnValueOnce({ success: false, message: 'Network Error' });

    const result = await packagesService.getAllPackages();

    expect(result.success).toBe(false);
  });

  it('getPackagesByGameId returns packages', async () => {
    mockApi.get.mockResolvedValueOnce({ data: { success: true, data: [mockPackage] } });
    mockHandleResponse.mockReturnValueOnce({ success: true, data: [mockPackage] });

    const result = await packagesService.getPackagesByGameId('1');

    expect(result.success).toBe(true);
  });

  it('getPackagesByGameId returns failure on error', async () => {
    mockApi.get.mockRejectedValueOnce(new Error('Not found'));
    mockHandleError.mockReturnValueOnce({ success: false, message: 'Not found' });

    const result = await packagesService.getPackagesByGameId('nonexistent');

    expect(result.success).toBe(false);
  });

  it('getPopularPackages returns popular packages', async () => {
    mockApi.get.mockResolvedValueOnce({ data: { success: true, data: mockPaginatedResponse } });
    mockHandleResponse.mockReturnValueOnce({ success: true, data: mockPaginatedResponse });

    const result = await packagesService.getPopularPackages();

    expect(result.success).toBe(true);
  });

  it('getPopularPackages returns failure on error', async () => {
    mockApi.get.mockRejectedValueOnce(new Error('Network Error'));
    mockHandleError.mockReturnValueOnce({ success: false, message: 'Network Error' });

    const result = await packagesService.getPopularPackages();

    expect(result.success).toBe(false);
  });
});
