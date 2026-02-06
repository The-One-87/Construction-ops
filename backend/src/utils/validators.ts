import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(3),
});

export const createClientSchema = z.object({
  name: z.string().min(1),
  brand: z.string().min(1),
  industry: z.string().min(1),
  primaryColor: z.string().optional(),
  logo: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  config: z.record(z.any()),
});

export const modulePayloadSchema = z.record(z.any());
