// Unit Tests: games.service.ts - اختبارات خدمة الألعاب
import { describe, it, expect, vi, beforeEach } from 'vitest';
import gamesService from '../../services/games.service';

// Mock the entire api module
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
  id: '1', name: 'PUBG', nameAr: 'ببجي', slug: 'pubg',
  image: 'img.jpg', category: 'Battle Royale',
  isActive: true, sortOrder: 0, createdAt: '', updatedAt: '',
};

const mockGamesData = {
  games: [mockGame],
  pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
};

describe('games.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHandleResponse.mockImplementation((r) => ({ success: true, data: r.data }));
    mockHandleError.mockImplementation(() => ({ success: false, message: 'Network Error' }));
  });

  describe('getAllGames', () => {
    it('returns games on success', async () => {
      mockApi.get.mockResolvedValueOnce({ data: { success: true, data: mockGamesData } });
      mockHandleResponse.mockReturnValueOnce({ success: true, data: mockGamesData });

      const result = await gamesService.getAllGames();

      expect(mockApi.get).toHaveBeenCalledWith('/games', expect.anything());
      expect(result.success).toBe(true);
    });

    it('returns failure on network error', async () => {
      mockApi.get.mockRejectedValueOnce(new Error('Network Error'));
      mockHandleError.mockReturnValueOnce({ success: false, message: 'Network Error' });

      const result = await gamesService.getAllGames();

      expect(result.success).toBe(false);
    });

    it('passes params to the API', async () => {
      mockApi.get.mockResolvedValueOnce({ data: { success: true, data: mockGamesData } });
      mockHandleResponse.mockReturnValueOnce({ success: true, data: mockGamesData });

      await gamesService.getAllGames({ page: 2, limit: 5 });

      expect(mockApi.get).toHaveBeenCalledWith('/games', expect.objectContaining({ params: expect.objectContaining({ page: 2, limit: 5 }) }));
    });
  });

  describe('getGameBySlug', () => {
    it('returns game by slug', async () => {
      mockApi.get.mockResolvedValueOnce({ data: { success: true, data: mockGame } });
      mockHandleResponse.mockReturnValueOnce({ success: true, data: mockGame });

      const result = await gamesService.getGameBySlug('pubg');

      expect(mockApi.get).toHaveBeenCalledWith('/games/slug/pubg');
      expect(result.success).toBe(true);
    });

    it('returns failure for missing game', async () => {
      mockApi.get.mockRejectedValueOnce(new Error('Not found'));
      mockHandleError.mockReturnValueOnce({ success: false, message: 'Not found' });

      const result = await gamesService.getGameBySlug('nope');

      expect(result.success).toBe(false);
    });
  });

  describe('searchGames', () => {
    it('returns search results', async () => {
      mockApi.get.mockResolvedValueOnce({ data: { success: true, data: mockGamesData } });
      mockHandleResponse.mockReturnValueOnce({ success: true, data: mockGamesData });

      const result = await gamesService.searchGames('pubg');

      expect(result.success).toBe(true);
    });
  });
});
