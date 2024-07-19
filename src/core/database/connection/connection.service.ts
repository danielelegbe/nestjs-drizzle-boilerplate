import { Pool } from 'pg';
import { DATABASE_CONNECTION } from './connection.provider';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class DBConnectionService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly pool: Pool) {}

  getPool() {
    return this.pool;
  }
}
