import { z } from 'zod';

export const ConfigSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z
    .enum(['test', 'development', 'production'])
    .default('development'),
  DATABASE_URL: z.string(),
});
