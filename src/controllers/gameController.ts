import { NextFunction, Request, Response } from 'express';
import { gameService } from '../services/gameService.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { actionSchema, chatSchema, stateSchema } from '../validation/gameValidation.js'

export const gameController = {
  async createAction(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = actionSchema.parse(req.body);
      const result = await gameService.performAction(req.user!.playerId, {
        actionType: data.action_type,
        targetId: data.target_id,
        abilityId: data.ability_id,
      });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async getMoves(req: Request, res: Response, next: NextFunction) {
    try {
      const playerId = req.query.player_id ? Number(req.query.player_id) : undefined;
      const limit = Number(req.query.limit ?? 50);
      const result = await gameService.getMoveLogs(playerId, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async getState(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await gameService.getState();
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async updateState(req: Request, res: Response, next: NextFunction) {
    try {
      const data = stateSchema.parse(req.body);
      const result = await gameService.updateState(data);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async postChat(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = chatSchema.parse(req.body);
      const result = await gameService.postChat(req.user!.playerId, data.message);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async getChat(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit ?? 50);
      const result = await gameService.getChat(limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async createSession(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await gameService.createSession(req.user!.playerId);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async joinSession(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await gameService.joinSession(req.params.id, req.user!.playerId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async getSession(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await gameService.getSession(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async getSessionPlayers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await gameService.getSessionPlayers(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};
