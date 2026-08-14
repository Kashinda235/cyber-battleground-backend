import { z } from 'zod';

export const sendMailSchema = z.object({
  receiver_id: z.coerce.number().int().positive(),
  message: z.string().min(1),
  phishing_payload: z.boolean().optional().default(false),
  metadata: z.record(z.any()).optional(),
});

export const updateMailSchema = z.object({
  is_seen: z.boolean(),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
