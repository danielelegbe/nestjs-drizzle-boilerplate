import { timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const createTimestampColumns = () => {
  return {
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => sql`now()`)
      .notNull(),
  };
};
