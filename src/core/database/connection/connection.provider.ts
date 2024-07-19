import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { Provider } from '@nestjs/common';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const ConnectionProvider: Provider = {
  provide: DATABASE_CONNECTION,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): Pool => {
    const DATABASE_URL = configService.get<string>('DATABASE_URL');

    return new Pool({
      connectionString: DATABASE_URL,
    });
  },
};
