import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { createTimestampColumns } from '../helpers/helpers.models';

export const posts = pgTable('posts', {
  ...createTimestampColumns(),
  id: serial('id').primaryKey().notNull(),
  title: text('title').notNull(),
  body: text('body').notNull(),
});

export const apiKeys = pgTable('api_keys', {
  ...createTimestampColumns(),
  id: serial('id').primaryKey().notNull(),
  key: text('key').unique().notNull(),
  userEmail: text('user_email').unique().notNull(),
});
