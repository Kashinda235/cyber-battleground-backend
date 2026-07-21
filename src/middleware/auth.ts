import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export interface AuthenticatedRequest extends Request {
  user?: {
    playerId: number;
    username: string;
    role: string;
  };
}

export const authMiddleware = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized', 401));
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { playerId: number; username: string; role: string };
    req.user = payload;
    return next();
  } catch {
    return next(new AppError('Invalid token', 401));
  }
};

export const adminMiddleware = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return next(new AppError('Admin only', 403));
  }
  return next();
};
