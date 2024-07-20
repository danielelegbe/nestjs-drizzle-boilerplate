import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { PgInsertValue, SelectedFields } from 'drizzle-orm/pg-core';
import { eq, Table } from 'drizzle-orm';
import { PgUpdateSetSource } from 'drizzle-orm/pg-core/query-builders/update';
import { DatabaseException } from '../exceptions/database.exceptions';

@Global()
@Module({})
export abstract class AbstractRepository<T extends Table> {
  constructor(protected readonly db: DatabaseService) {}

  protected abstract tableName: T;
  protected abstract modelName: string;

  async createOne(input: PgInsertValue<T>): Promise<T['$inferSelect']> {
    const [result] = await this.db
      .insert(this.tableName)
      .values(input)
      .returning();

    return result ?? null;
  }

  findAll(fields?: SelectedFields): Promise<Partial<T>['$inferSelect'][]> {
    return this.db
      .select(fields as SelectedFields)
      .from(this.tableName)
      .execute();
  }

  async findOneById(
    id: T['$inferSelect']['id'],
    fields?: SelectedFields,
  ): Promise<Partial<T['$inferSelect']> | null> {
    const [result] = await this.db
      .select(fields as SelectedFields)
      .from(this.tableName)
      .where(eq(this.tableName['id'], id));

    return result ?? null;
  }

  async findOneByKey(
    key: keyof T,
    value: unknown,
    fields?: SelectedFields,
  ): Promise<T['$inferSelect'] | null> {
    const [result] = await this.db
      .select(fields as SelectedFields)
      .from(this.tableName)
      .where(eq(this.tableName[key as string], value))
      .execute();

    return result ?? null;
  }

  async findOneByIdOrThrow(
    id: T['$inferSelect']['id'],
    fields?: SelectedFields,
  ) {
    const result = await this.findOneById(id, fields);

    return result ?? this.throwNotFound();
  }

  async findOneByKeyOrThrow(
    key: keyof T,
    value: unknown,
    fields?: SelectedFields,
  ) {
    const result = await this.findOneByKey(key, value, fields);

    return result ?? this.throwNotFound();
  }

  async updateOneById(
    id: T['$inferSelect']['id'],
    input: PgUpdateSetSource<T>,
  ): Promise<Partial<T['$inferSelect']>> {
    const [result] = await this.db
      .update(this.tableName)
      .set(input)
      .where(eq(this.tableName['id'], id))
      .returning();

    return result ?? this.throwNotFound();
  }

  async remove(
    id: T['$inferSelect']['id'],
  ): Promise<Pick<T['$inferSelect'], 'id'>> {
    const [deleted] = await this.db
      .delete(this.tableName)
      .where(eq(this.tableName['id'], id))
      .returning({
        id: this.tableName['id'],
      });

    return deleted ?? this.throwNotFound();
  }

  throwNotFound(field?: string) {
    return DatabaseException.NotFound(field ?? this.modelName);
  }

  throwConflict(field?: string) {
    return DatabaseException.Conflict(field ?? this.modelName);
  }
}
