import { Router } from 'express';
import { gameController } from '../controllers/gameController.js';
import { playerController } from '../controllers/playerController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

export const gameRoutes = Router();

gameRoutes.get('/players/me', authMiddleware, playerController.me);
gameRoutes.patch('/players/status', authMiddleware, playerController.updateStatus);
gameRoutes.get('/players', authMiddleware, playerController.listPlayers);
gameRoutes.delete('/players', authMiddleware, adminMiddleware, playerController.deleteAllPlayers);
gameRoutes.delete('/players/:id', authMiddleware, adminMiddleware, playerController.deletePlayer);
gameRoutes.delete('/players/:id/abilities', authMiddleware, adminMiddleware, playerController.deleteAllPlayerAbilities);
gameRoutes.delete('/players/:playerId/abilities/:abilityId', authMiddleware, adminMiddleware, playerController.deletePlayerAbility);
gameRoutes.post('/players/:id/abilities', authMiddleware, playerController.assignAbility);
gameRoutes.get('/players/:id/abilities', authMiddleware, playerController.getPlayerAbilities);

gameRoutes.get('/abilities', playerController.listAbilities);
gameRoutes.post('/abilities', authMiddleware, adminMiddleware, playerController.createAbility);
gameRoutes.patch('/abilities/:id', authMiddleware, adminMiddleware, playerController.updateAbility);
gameRoutes.delete('/abilities', authMiddleware, adminMiddleware, playerController.deleteAllAbilities);
gameRoutes.delete('/abilities/:id', authMiddleware, adminMiddleware, playerController.deleteAbility);
gameRoutes.get('/abilities/:id', playerController.getAbilityById);

gameRoutes.post('/actions', authMiddleware, gameController.createAction);
gameRoutes.get('/moves', gameController.getMoves);
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
