import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { GamesService } from '../services/games.service.js';
import { AppError } from '../middlewares/errorHandler.js';
import { getRouteParam } from '../utils/routeParams.js';

const parseBooleanQuery = (value: unknown, name: string): boolean | undefined => {
  if (value === undefined) return undefined;
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new AppError(`${name} must be true or false`, 400);
};

const parsePositiveInteger = (
  value: unknown,
  name: string,
  fallback: number,
  maximum: number
): number => {
  if (value === undefined) return fallback;
  if (typeof value !== 'string' || !/^\d+$/.test(value)) {
    throw new AppError(`${name} must be a positive integer`, 400);
  }

  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1 || parsed > maximum) {
    throw new AppError(`${name} must be between 1 and ${maximum}`, 400);
  }

  return parsed;
};

export class GamesController {
  private readonly gamesService = new GamesService();

  getAllGames = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category, search } = req.query;
      if (
        (category !== undefined && typeof category !== 'string') ||
        (search !== undefined && typeof search !== 'string')
      ) {
        throw new AppError('Invalid game filters', 400);
      }

      const result = await this.gamesService.getAllGames({
        category,
        search,
        isActive: parseBooleanQuery(req.query.isActive, 'isActive') ?? true,
        page: parsePositiveInteger(req.query.page, 'page', 1, 1000000),
        limit: parsePositiveInteger(req.query.limit, 'limit', 20, 100)
      });

      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getGameById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const game = await this.gamesService.getGameById(getRouteParam(req, 'gameId'));
      res.json({ success: true, data: game });
    } catch (error) {
      next(error);
    }
  };

  getGameBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const game = await this.gamesService.getGameBySlug(getRouteParam(req, 'slug'));
      res.json({ success: true, data: game });
    } catch (error) {
      next(error);
    }
  };

  searchGames = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query.q;
      if (typeof query !== 'string' || query.trim().length === 0) {
        throw new AppError('Search query is required', 400);
      }

      const result = await this.gamesService.getAllGames({
        search: query.trim(),
        isActive: true,
        page: 1,
        limit: 100
      });

      res.json({ success: true, data: result.games });
    } catch (error) {
      next(error);
    }
  };

  getCategories = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await this.gamesService.getCategories();
      res.json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  };

  createGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const game = await this.gamesService.createGame(req.body);
      res.status(201).json({
        success: true,
        message: 'Game created successfully',
        data: game
      });
    } catch (error) {
      next(error);
    }
  };

  updateGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const game = await this.gamesService.updateGame(
        getRouteParam(req, 'gameId'),
        req.body
      );
      res.json({ success: true, message: 'Game updated successfully', data: game });
    } catch (error) {
      next(error);
    }
  };

  deleteGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.gamesService.deleteGame(getRouteParam(req, 'gameId'));
      res.json({ success: true, message: 'Game deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
