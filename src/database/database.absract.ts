import { Global, Inject, Module } from '@nestjs/common';
import { OperandValueExpressionOrList } from 'kysely';
import { InsertExpression } from 'kysely/dist/cjs/parser/insert-values-parser';
import { ExtractTableAlias } from 'kysely/dist/cjs/parser/table-parser';
import { UpdateObjectExpression } from 'kysely/dist/cjs/parser/update-set-parser';
import { KYSELY_SERVICE, KyselyService } from './database.module';
import { DB } from './database.types';

@Global()
@Module({})
export abstract class AbstractRepository<T extends keyof DB> {
  constructor(@Inject(KYSELY_SERVICE) protected readonly db: KyselyService) {}

  protected abstract getTableName(): T;

  async create(input: InsertExpression<DB, T>) {
    return this.db
      .insertInto(this.getTableName())
      .values(input)
      .returningAll()
      .executeTakeFirst();
  }

  async findAll() {
    return this.db.selectFrom(this.getTableName()).selectAll().execute();
  }

  async findOne(
    id: OperandValueExpressionOrList<DB, ExtractTableAlias<DB, T>, 'id'>,
  ) {
    return this.db
      .selectFrom(this.getTableName())
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async update(
    id: OperandValueExpressionOrList<DB, ExtractTableAlias<DB, T>, 'id'>,
    input: Omit<
      UpdateObjectExpression<
        DB,
        ExtractTableAlias<DB, T>,
        ExtractTableAlias<DB, T>
      >,
      'id'
    >,
  ) {
    return this.db
      .updateTable(this.getTableName())
      .set(input)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();
  }

  async remove(
    id: OperandValueExpressionOrList<DB, ExtractTableAlias<DB, T>, 'id'>,
  ) {
    return this.db
      .deleteFrom(this.getTableName())
      .where('id', '=', id)
      .returning('id')
      .executeTakeFirst();
  }
}
