import { NextFunction, Request, Response } from 'express';
import { authService } from '../services/authService.js';
import { z } from 'zod';

const registerSchema = z.object({
  username: z.string().min(1),
  role: z.string().optional(),
});

const loginSchema = z.object({
  username: z.string().min(1),
});

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = registerSchema.parse(req.body);
      const result = await authService.register(data.username, data.role || 'spectator');
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = loginSchema.parse(req.body);
      const result = await authService.login(data.username);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};
