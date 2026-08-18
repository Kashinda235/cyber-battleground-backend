import { NextFunction, Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { systemService } from '../services/systemService.js';
import { patchSystemSchema, updateNetworkSchema, defenseSchema, createAssetSchema, updateAssetSchema, idParamSchema } from '../validation/systemValidation.js';
import { createConnectionSchema, updateConnectionSchema } from '../validation/connectionValidation.js';

export const systemController = {
  async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await systemService.getSystemForPlayer(req.user!.playerId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async listSystems(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await systemService.listSystems();
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async updateSystem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = patchSystemSchema.parse(req.body);
      const result = await systemService.updateSystem(req.user!.playerId, data);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async getNetwork(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await systemService.getNetworkConfigs(req.user!.playerId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async updateNetwork(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const data = updateNetworkSchema.parse(req.body);
      const result = await systemService.updateNetworkConfig(req.user!.playerId, id, data);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async getDefense(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await systemService.getDefense(req.user!.playerId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async updateDefense(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = defenseSchema.parse(req.body);
      const result = await systemService.updateDefense(req.user!.playerId, data);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async listAssets(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await systemService.listAssets(req.user!.playerId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async createAsset(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = createAssetSchema.parse(req.body);
      const result = await systemService.createAsset(req.user!.playerId, data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async updateAsset(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const data = updateAssetSchema.parse(req.body);
      const result = await systemService.updateAsset(req.user!.playerId, id, data);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async deleteAsset(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const result = await systemService.deleteAsset(req.user!.playerId, id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async listConnections(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await systemService.listConnections(req.user!.playerId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async createConnection(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = createConnectionSchema.parse(req.body);
      const result = await systemService.createConnection(req.user!.playerId, data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async updateConnection(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const data = updateConnectionSchema.parse(req.body);
      const result = await systemService.updateConnection(req.user!.playerId, id, data);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async deleteConnection(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const result = await systemService.deleteConnection(req.user!.playerId, id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};
