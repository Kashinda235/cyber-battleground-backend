import { z } from 'zod';

export const createConnectionSchema = z.object({
  target_ip: z.string().trim().min(1),
  status: z.enum(['blocked', 'friend', 'bot']),
});

export const updateConnectionSchema = z.object({
  status: z.enum(['blocked', 'friend', 'bot']),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field is required',
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
