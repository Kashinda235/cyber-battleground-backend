import { z } from 'zod';

export const statusSchema = z.object({
    status: z.enum(['online', 'offline', 'banned']),
});

export const assignAbilitySchema = z.object({
    ability_id: z.number().int().positive(),
});

export const createAbilitySchema = z.object({
    name: z.string().trim().min(1, 'Ability name is required'),
    description: z.string().trim().min(1, 'Description is required'),
    type: z.string().trim().min(1, 'Ability type is required'),
    stats: z.record(z.string(), z.any()).optional().default({}),
});
export const updateAbilitySchema = z.object({
    name: z.string().trim().min(1, 'Ability name is required').optional(),
    description: z.string().trim().min(1, 'Description is required').optional(),
    type: z.string().trim().min(1, 'Ability type is required').optional(),
    stats: z.record(z.string(), z.any()).optional(),
});

export const playerIdParamSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export const playerAbilityParamSchema = z.object({
    playerId: z.coerce.number().int().positive(),
    abilityId: z.coerce.number().int().positive(),
});