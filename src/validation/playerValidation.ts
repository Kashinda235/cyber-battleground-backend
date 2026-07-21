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
    stats: z.record(z.any()).optional().default({}),
});
