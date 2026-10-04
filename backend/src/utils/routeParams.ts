import type { Request } from 'express';
import { AppError } from '../middlewares/errorHandler.js';

export const getRouteParam = (req: Request, name: string): string => {
  const value = req.params[name];

  if (typeof value !== 'string' || value.length === 0) {
    throw new AppError('معرّف المسار غير صالح', 400);
  }

  return value;
};
