import { Router } from 'express';
import { GamesController } from '../controllers/games.controller.js';
import { body } from 'express-validator';

const router = Router();
const gamesController = new GamesController();

router.get('/', gamesController.getAllGames);
router.get('/categories', gamesController.getCategories);
router.get('/search', gamesController.searchGames);
router.get('/slug/:slug', gamesController.getGameBySlug);
router.get('/:gameId', gamesController.getGameById);

export default router;

export const createGameValidation = [
  body('name').isString().trim().isLength({ min: 2, max: 100 }),
  body('nameAr').isString().trim().isLength({ min: 2, max: 100 }),
  body('description').optional().isString().isLength({ max: 2000 }),
  body('descriptionAr').optional().isString().isLength({ max: 2000 }),
  body('image').isURL().withMessage('Image must be a valid URL'),
  body('category').isString().trim().notEmpty().isLength({ max: 80 }),
  body('sortOrder').optional().isInt({ min: 0 }).toInt()
];

export const updateGameValidation = [
  body('name').optional().isString().trim().isLength({ min: 2, max: 100 }),
  body('nameAr').optional().isString().trim().isLength({ min: 2, max: 100 }),
  body('description').optional().isString().isLength({ max: 2000 }),
  body('descriptionAr').optional().isString().isLength({ max: 2000 }),
  body('image').optional().isURL().withMessage('Image must be a valid URL'),
  body('category').optional().isString().trim().notEmpty().isLength({ max: 80 }),
  body('isActive').optional().isBoolean().toBoolean(),
  body('sortOrder').optional().isInt({ min: 0 }).toInt()
];
