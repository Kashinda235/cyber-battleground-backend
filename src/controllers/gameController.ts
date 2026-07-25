import { NextFunction, Request, Response } from 'express';
import { gameService } from '../services/gameService.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { actionSchema, chatSchema, sessionIdParamSchema, stateSchema, getMovesQuerySchema, getChatQuerySchema } from '../validation/gameValidation.js';
import {app} from "../app.js";

export const gameController = {
  async createAction(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = actionSchema.parse(req.body);
      const result = await gameService.performAction(req.user!.playerId, {
        actionType: data.action_type,
        targetId: data.target_id,
        abilityId: data.ability_id,
      });
      if(app.locals.broadcastPerformedAction) {
        app.locals.broadcastPerformedAction(result.moveLog);
      }
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async getMoves(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = getMovesQuerySchema.parse(req.query);
      const result = await gameService.getMoveLogs(parsed.player_id, parsed.limit);
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
      if (app.locals.broadcastGameState) {
        app.locals.broadcastGameState(result);
      }
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async postChat(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = chatSchema.parse(req.body);
      const result = await gameService.postChat(req.user!.playerId, data.message);
      if (app.locals.broadcastMessage) {
        app.locals.broadcastMessage(result);
      }
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async getChat(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = getChatQuerySchema.parse(req.query);
      const result = await gameService.getChat(parsed.limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async deleteMoveLogs(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await gameService.deleteMoveLogs();
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async deleteChatLogs(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await gameService.deleteChatLogs();
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async resetGame(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await gameService.resetGame();
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
      const { id } = sessionIdParamSchema.parse(req.params);
      const result = await gameService.joinSession(id, req.user!.playerId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async getSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = sessionIdParamSchema.parse(req.params);
      const result = await gameService.getSession(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async getSessionPlayers(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = sessionIdParamSchema.parse(req.params);
      const result = await gameService.getSessionPlayers(id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};
