import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';
import prisma from '../config/database.js';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string; role: string };
    }
  }
}

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new AppError('غير مصرح', 401);
    
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    
    if (!user || !user.isActive) throw new AppError('مستخدم غير صالح', 401);
    
    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (error) {
    next(new AppError('غير مصرح', 401));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('ليس لديك صلاحية', 403));
    }
    next();
  };
};
