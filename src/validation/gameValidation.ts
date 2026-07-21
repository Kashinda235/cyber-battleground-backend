import { z } from 'zod';

export const actionSchema = z.object({
    action_type: z.string().min(1),
    target_id: z.number().int().positive(),
    ability_id: z.number().int().positive(),
});

export const getMovesQuerySchema = z.object({
    player_id: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const chatSchema = z.object({
    message: z.string().min(1),
});

export const stateSchema = z.object({
    gameStatus: z.string().optional(),
    turn: z.number().optional(),
}).passthrough();

export const sessionIdParamSchema = z.object({
    id: z.string().trim().min(1, 'Session ID is required'),
});

export const getChatQuerySchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).default(50),
});