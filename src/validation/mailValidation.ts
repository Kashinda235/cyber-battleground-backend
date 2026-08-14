import { z } from 'zod';

export const sendMailSchema = z.object({
  receiverId: z.coerce.number().int().positive(),
  message: z.string().min(1),
  phishingPayload: z.boolean().optional().default(false),
});

export const updateMailSchema = z.object({
  isSeen: z.boolean(),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
