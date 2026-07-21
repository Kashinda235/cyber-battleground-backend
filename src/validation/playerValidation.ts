import { z } from 'zod';

export const statusSchema = z.object({
    status: z.enum(['online', 'offline', 'banned']),
});

export const assignAbilitySchema = z.object({
    ability_id: z.number().int().positive(),
});
