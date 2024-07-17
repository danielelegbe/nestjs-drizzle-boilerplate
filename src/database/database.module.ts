import { Global, Logger, Module } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { DB } from './database.types';

export const KYSELY_SERVICE = 'KYSELY_SERVICE';

export type KyselyService = Kysely<DB>;

@Global()
@Module({
  providers: [
    {
      provide: KYSELY_SERVICE,
      inject: [ConfigService, Logger],
      useFactory: async (configService: ConfigService, logger: Logger) => {
        const NODE_ENV = configService.get<string>('NODE_ENV');

        const pool = new Pool({
          connectionString: configService.get<string>('DATABASE_URL'),
        });

        return new Kysely<DB>({
          dialect: new PostgresDialect({
            pool,
            onCreateConnection: async () => {
              logger.log('Connected to kyseley', 'KyselyService');
            },
          }),
          log: NODE_ENV === 'development' ? ['query', 'error'] : undefined,
        });
      },
    },
    Logger,
  ],
  exports: [KYSELY_SERVICE],
})
export class KyselyModule {}
