import { NextFunction, Request, Response } from 'express';
import { statusSchema, assignAbilitySchema, createAbilitySchema, playerIdParamSchema, playerAbilityParamSchema, updateAbilitySchema } from '../validation/playerValidation.js';
import { playerService } from '../services/playerService.js';
import { systemService } from '../services/systemService.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const playerController = {
  async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await systemService.getSystemForPlayer(req.user!.playerId);
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

  async listPlayers(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await playerService.listPlayers();
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async deleteAllPlayers(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await playerService.deleteAllPlayers();
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async deletePlayer(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = playerIdParamSchema.parse(req.params);
      const result = await playerService.deletePlayer(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

};
