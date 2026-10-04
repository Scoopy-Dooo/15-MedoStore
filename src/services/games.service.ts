/**
 * Games Service
 * خدمة الألعاب للتواصل مع Backend API
 */

import api, { handleApiResponse, handleApiError } from './api';
import type {
  Game,
  GetGamesParams,
  GetGamesResponse,
  ApiResponse,
} from './types';

class GamesService {
  /**
   * الحصول على جميع الألعاب مع الفلترة والترقيم
   * Get all games with filtering and pagination
   */
  async getAllGames(params?: GetGamesParams): Promise<ApiResponse<GetGamesResponse>> {
    try {
      const response = await api.get('/games', { params });
      return handleApiResponse<GetGamesResponse>(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * الحصول على لعبة واحدة بالـ ID
   * Get single game by ID
   */
  async getGameById(gameId: string): Promise<ApiResponse<Game>> {
    try {
      const response = await api.get(`/games/${gameId}`);
      return handleApiResponse<Game>(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * الحصول على لعبة بالـ slug
   * Get game by slug
   */
  async getGameBySlug(slug: string): Promise<ApiResponse<Game>> {
    try {
      const response = await api.get(`/games/slug/${slug}`);
      return handleApiResponse<Game>(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * البحث عن الألعاب
   * Search for games
   */
  async searchGames(query: string): Promise<ApiResponse<Game[]>> {
    try {
      const response = await api.get('/games/search', { params: { q: query } });
      return handleApiResponse<Game[]>(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * الحصول على الفئات المتاحة
   * Get available categories
   */
  async getCategories(): Promise<ApiResponse<string[]>> {
    try {
      const response = await api.get('/games/categories');
      return handleApiResponse<string[]>(response);
    } catch (error) {
      return handleApiError(error);
    }
  }
}

export default new GamesService();
