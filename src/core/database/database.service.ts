import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './models/models';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Injectable } from '@nestjs/common';
import { DBConnectionService } from './connection/connection.service';

type DrizzleFn = typeof drizzle<typeof schema>;
const Drizzle = drizzle as unknown as {
  new (...args: Parameters<DrizzleFn>): ReturnType<DrizzleFn>;
};

@Injectable()
export class DatabaseService extends Drizzle {
  private readonly pool: Pool;

  constructor(private readonly dbConnectionService: DBConnectionService) {
    const configService = new ConfigService();

    super(dbConnectionService.getPool(), {
      schema,
      logger: configService.get<string>('NODE_ENV') === 'development',
    });

    this.pool = this.dbConnectionService.getPool();
  }

  async migrate() {
    const configService = new ConfigService();

    const db = drizzle(this.pool, {
      schema,
      logger: configService.get<string>('NODE_ENV') === 'development',
    });

    await migrate(db, {
      migrationsFolder: './src/core/database/drizzle',
    });

    await this.pool.end();
  }
}
