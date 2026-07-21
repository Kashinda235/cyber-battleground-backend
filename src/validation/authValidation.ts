import { z } from 'zod';

export const registerSchema = z.object({
    username: z.string().min(1),
    role: z.string().optional(),
});

export const loginSchema = z.object({
    username: z.string().min(1),
});