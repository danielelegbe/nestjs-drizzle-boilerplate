import { drizzle } from 'drizzle-orm/aws-data-api/pg';
import { RDSDataClient } from '@aws-sdk/client-rds-data';
import { Resource } from 'sst';

const client = new RDSDataClient({});

export const db = drizzle(client, {
  database: Resource.NestJsSSTPostgres.database,
  secretArn: Resource.NestJsSSTPostgres.secretArn,
  resourceArn: Resource.NestJsSSTPostgres.clusterArn,
});
