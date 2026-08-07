import { z } from 'zod';

export const patchSystemSchema = z.object({
  hostname: z.string().trim().min(1).optional(),
  password: z.string().trim().min(1).optional(),
  mail: z.string().trim().email().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field is required',
});

export const updateNetworkSchema = z.object({
  port: z.coerce.number().int().positive().optional(),
  metadata: z.record(z.any()).optional(),
  status: z.string().trim().min(1).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field is required',
});

export const defenseSchema = z.object({
  firewall_level: z.coerce.number().int().min(0).optional(),
  ids_status: z.boolean().optional(),
  honeypot_active: z.boolean().optional(),
  lockdown_active: z.boolean().optional(),
  autopay_threshold: z.coerce.number().int().min(0).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field is required',
});

export const createAssetSchema = z.object({
  name: z.string().trim().min(1),
  value: z.coerce.number().int().min(0).default(0).optional(),
  size: z.coerce.number().int().min(0).default(0).optional(),
  is_decoy: z.boolean().optional().default(false),
  is_trap: z.boolean().optional().default(false),
});

export const updateAssetSchema = z.object({
  name: z.string().trim().min(1).optional(),
  value: z.coerce.number().int().min(0).optional(),
  size: z.coerce.number().int().min(0).optional(),
  is_decoy: z.boolean().optional(),
  is_trap: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field is required',
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
