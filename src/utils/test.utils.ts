import { promisify } from 'util';
import { exec } from 'child_process';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { Kysely, PostgresDialect } from 'kysely';
import { DB } from 'src/database/database.types';
import { Pool } from 'pg';

const execAsync = promisify(exec);

async function setupTestContainer() {
  const container = await new PostgreSqlContainer().start();

  return container.getConnectionUri();
}

export async function setupKyselyConnection() {
  const DATABASE_URL = await setupTestContainer();

  const logs = await execAsync(
    `DATABASE_URL=${DATABASE_URL} npx prisma migrate deploy`,
  );

  console.log(logs.stdout);

  const pool = new Pool({
    connectionString: DATABASE_URL,
  });

  return new Kysely<DB>({
    dialect: new PostgresDialect({
      pool,
    }),
  });
}
