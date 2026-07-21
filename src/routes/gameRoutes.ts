import { Router } from 'express';
import { gameController } from '../controllers/gameController.js';
import { playerController } from '../controllers/playerController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

export const gameRoutes = Router();

gameRoutes.get('/players/me', authMiddleware, playerController.me);
gameRoutes.patch('/players/status', authMiddleware, playerController.updateStatus);

gameRoutes.get('/abilities', playerController.listAbilities);
gameRoutes.post('/abilities', authMiddleware, adminMiddleware, playerController.createAbility);
gameRoutes.get('/abilities/:id', playerController.getAbilityById);
gameRoutes.post('/players/:id/abilities', authMiddleware, playerController.assignAbility);
gameRoutes.get('/players/:id/abilities', authMiddleware, playerController.getPlayerAbilities);

gameRoutes.post('/actions', authMiddleware, gameController.createAction);
gameRoutes.get('/moves', gameController.getMoves);

gameRoutes.get('/state', gameController.getState);
gameRoutes.patch('/state', authMiddleware, adminMiddleware, gameController.updateState);

gameRoutes.post('/chat', authMiddleware, gameController.postChat);
gameRoutes.get('/chat', gameController.getChat);

gameRoutes.post('/sessions', authMiddleware, gameController.createSession);
gameRoutes.post('/sessions/:id/join', authMiddleware, gameController.joinSession);
gameRoutes.get('/sessions/:id', gameController.getSession);
gameRoutes.get('/sessions/:id/players', gameController.getSessionPlayers);
