import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { apiKeys } from 'src/core/database/models/models';
import { z } from 'zod';

export const ApiKeyCreateInputSchema = createInsertSchema(apiKeys).pick({
  userEmail: true,
});

export const ApiKeySchema = createSelectSchema(apiKeys);

export type ApiKey = z.infer<typeof ApiKeySchema>;
export type ApiKeyCreateInput = z.infer<typeof ApiKeyCreateInputSchema>;
