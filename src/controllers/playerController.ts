import { NextFunction, Request, Response } from 'express';
import { statusSchema, assignAbilitySchema, createAbilitySchema, playerIdParamSchema, playerAbilityParamSchema, updateAbilitySchema } from '../validation/playerValidation.js';
import { playerService } from '../services/playerService.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

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

  async listPlayers(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await playerService.listPlayers();
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

  async createAbility(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = createAbilitySchema.parse(req.body);
      const result = await playerService.createAbility(data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async updateAbility(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = playerIdParamSchema.parse(req.params);
      const data = updateAbilitySchema.parse(req.body);
      const result = await playerService.updateAbility(id, data);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async getAbilityById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = playerIdParamSchema.parse(req.params);
      const result = await playerService.getAbilityById(id);
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
      const { id } = playerIdParamSchema.parse(req.params);
      const result = await playerService.getPlayerAbilities(id);
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

  async deleteAllAbilities(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await playerService.deleteAllAbilities();
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async deleteAbility(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = playerIdParamSchema.parse(req.params);
      const result = await playerService.deleteAbility(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async deleteAllPlayerAbilities(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = playerIdParamSchema.parse(req.params);
      const result = await playerService.deleteAllPlayerAbilities(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async deletePlayerAbility(req: Request, res: Response, next: NextFunction) {
    try {
      const { playerId, abilityId } = playerAbilityParamSchema.parse(req.params);
      const result = await playerService.deletePlayerAbility(playerId, abilityId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};
