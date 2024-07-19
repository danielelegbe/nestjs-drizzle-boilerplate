import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { Pool } from 'pg';
import { promisify } from 'util';
import { exec } from 'child_process';
import { Logger } from '@nestjs/common';

const execAsync = promisify(exec);

export class TestDBContainer {
  private readonly logger = new Logger(TestDBContainer.name);
  container: StartedPostgreSqlContainer | undefined;
  pool: Pool | undefined;

  private async startDatabase() {
    return await new PostgreSqlContainer().start();
  }

  private async dbPush(databaseUrl: string) {
    const logs = await execAsync(`DATABASE_URL=${databaseUrl} pnpm db:push`);

    this.logger.debug(logs.stdout);
  }

  async getPool() {
    if (this.pool) {
      return this.pool;
    }

    this.container = await this.startDatabase();

    const databaseUrl = this.container.getConnectionUri();

    await this.dbPush(databaseUrl);

    this.pool = new Pool({
      connectionString: databaseUrl,
      max: 1,
    });

    return this.pool;
  }

  getContainer() {
    if (!this.container) {
      throw new Error('Container not started');
    }

    return this.container;
  }
}
