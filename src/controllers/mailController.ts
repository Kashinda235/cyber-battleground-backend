import { NextFunction, Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { mailService } from '../services/mailService.js';
import { sendMailSchema, updateMailSchema, idParamSchema } from '../validation/mailValidation.js';
import {app} from "../app.js";

export const mailController = {
  async inbox(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await mailService.getInbox(req.user!.playerId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async sent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await mailService.getSent(req.user!.playerId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async sendMail(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const data = sendMailSchema.parse(req.body);
      const result = await mailService.sendMail(req.user!.playerId, data);
      if (app.locals.broadcastSendMail) {
        app.locals.broadcastSendMail(result.receiverId, result);
      }
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async updateSeen(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const data = updateMailSchema.parse(req.body);
      const result = await mailService.updateSeen(req.user!.playerId, id, data.isSeen);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async deleteMail(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const result = await mailService.deleteMail(req.user!.playerId, id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};
