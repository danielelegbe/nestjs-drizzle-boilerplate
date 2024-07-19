import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { posts } from 'src/core/database/models/models';
import { z } from 'zod';

export const PostCreateInputSchema = createInsertSchema(posts, {
  body: z.string().min(4),
  title: z.string().min(9),
});
export const PostUpdateInputSchema = createInsertSchema(posts).partial();
export const PostSchema = createSelectSchema(posts);

export type PostCreateInput = z.infer<typeof PostCreateInputSchema>;
export type PostUpdateInput = z.infer<typeof PostUpdateInputSchema>;
export type Post = z.infer<typeof PostSchema>;
