import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { playerService } from '../services/playerService.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const statusSchema = z.object({
  status: z.enum(['online', 'offline', 'banned']),
});

const assignAbilitySchema = z.object({
  ability_id: z.number().int().positive(),
});

export const playerController = {
  async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await playerService.getMe(req.user!.playerId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = statusSchema.parse(req.body);
      const result = await playerService.updateStatus(req.user!.playerId, data.status);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async listAbilities(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await playerService.listAbilities();
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async getAbilityById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await playerService.getAbilityById(Number(req.params.id));
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async assignAbility(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = assignAbilitySchema.parse(req.body);
      const result = await playerService.assignAbility(Number(req.params.id), data.ability_id);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async getPlayerAbilities(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await playerService.getPlayerAbilities(Number(req.params.id));
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};
