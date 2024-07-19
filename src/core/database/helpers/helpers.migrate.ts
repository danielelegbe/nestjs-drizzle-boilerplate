import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate as drizzleMigrate } from 'drizzle-orm/node-postgres/migrator';
import * as models from '../models/models';
const migrate = async () => {
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL!,
      max: 1,
    });

    const db = drizzle(pool, {
      schema: models,
      logger: true,
    });

    await drizzleMigrate(db, {
      migrationsFolder: 'src/core/database/drizzle',
    });

    await pool.end();

    console.log('Migration complete');
  } catch (error) {
    console.error('Migration failed', error);
  }
};

void migrate();
