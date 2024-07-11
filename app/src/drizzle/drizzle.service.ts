import { Injectable, OnModuleInit } from '@nestjs/common';
import { AwsDataApiPgDatabase, drizzle } from 'drizzle-orm/aws-data-api/pg';
import * as schema from './schema';
import { Resource } from 'sst';
import { RDSDataClient } from '@aws-sdk/client-rds-data';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(private db: AwsDataApiPgDatabase<typeof schema>) {}

  async onModuleInit() {
    const client = new RDSDataClient({});
    const sql = drizzle(client, {
      database: Resource.NestJsSSTPostgres.database,
      secretArn: Resource.NestJsSSTPostgres.secretArn,
      resourceArn: Resource.NestJsSSTPostgres.clusterArn,
      schema,
    });

    this.db = sql;
  }
}
