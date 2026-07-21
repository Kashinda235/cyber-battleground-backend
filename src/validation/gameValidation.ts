import { z } from 'zod';

export const actionSchema = z.object({
    action_type: z.string().min(1),
    target_id: z.number().int().positive(),
    ability_id: z.number().int().positive(),
});

export const chatSchema = z.object({
    message: z.string().min(1),
});

export const stateSchema = z.object({
    gameStatus: z.string().optional(),
    turn: z.number().optional(),
}).passthrough();
