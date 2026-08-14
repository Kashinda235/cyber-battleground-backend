import { Router } from 'express';
import { gameController } from '../controllers/gameController.js';
import { playerController } from '../controllers/playerController.js';
import { systemController } from '../controllers/systemController.js';
import { mailController } from '../controllers/mailController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

export const gameRoutes = Router();

gameRoutes.get('/players/me', authMiddleware, playerController.me);
gameRoutes.patch('/players/status', authMiddleware, playerController.updateStatus);
gameRoutes.get('/players', authMiddleware, playerController.listPlayers);
gameRoutes.delete('/players', authMiddleware, adminMiddleware, playerController.deleteAllPlayers);
gameRoutes.delete('/players/:id', authMiddleware, adminMiddleware, playerController.deletePlayer);

gameRoutes.get('/systems', authMiddleware, systemController.listSystems);
gameRoutes.patch('/system', authMiddleware, systemController.updateSystem);
gameRoutes.get('/system/network', authMiddleware, systemController.getNetwork);
gameRoutes.patch('/system/network/:id', authMiddleware, systemController.updateNetwork);
gameRoutes.get('/system/defense', authMiddleware, systemController.getDefense);
gameRoutes.patch('/system/defense', authMiddleware, systemController.updateDefense);

gameRoutes.get('/system/assets', authMiddleware, systemController.listAssets);
gameRoutes.post('/system/assets', authMiddleware, systemController.createAsset);
gameRoutes.patch('/system/assets/:id', authMiddleware, systemController.updateAsset);
gameRoutes.delete('/system/assets/:id', authMiddleware, systemController.deleteAsset);

gameRoutes.get('/player/connections', authMiddleware, systemController.listConnections);
gameRoutes.post('/player/connections', authMiddleware, systemController.createConnection);
gameRoutes.patch('/player/connections/:id', authMiddleware, systemController.updateConnection);
gameRoutes.delete('/player/connections/:id', authMiddleware, systemController.deleteConnection);

gameRoutes.get('/mail/inbox', authMiddleware, mailController.inbox);
gameRoutes.get('/mail/sent', authMiddleware, mailController.sent);
gameRoutes.post('/mail', authMiddleware, mailController.sendMail);
gameRoutes.patch('/mail/:id', authMiddleware, mailController.updateSeen);
gameRoutes.delete('/mail/:id', authMiddleware, mailController.deleteMail);

gameRoutes.post('/actions', authMiddleware, gameController.createAction);
gameRoutes.get('/actions', gameController.getMoves);
gameRoutes.delete('/actions', authMiddleware, adminMiddleware, gameController.deleteMoveLogs);

gameRoutes.get('/state', gameController.getState);
gameRoutes.patch('/state', authMiddleware, adminMiddleware, gameController.updateState);

gameRoutes.post('/chat', authMiddleware, gameController.postChat);
gameRoutes.get('/chat', gameController.getChat);
gameRoutes.delete('/chat', authMiddleware, adminMiddleware, gameController.deleteChatLogs);

gameRoutes.post('/admin/reset-game', authMiddleware, adminMiddleware, gameController.resetGame);

gameRoutes.post('/sessions', authMiddleware, gameController.createSession);
gameRoutes.post('/sessions/:id/join', authMiddleware, gameController.joinSession);
gameRoutes.get('/sessions/:id', gameController.getSession);
gameRoutes.get('/sessions/:id/players', gameController.getSessionPlayers);
