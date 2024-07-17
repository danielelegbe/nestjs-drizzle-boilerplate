import { Injectable } from '@nestjs/common';
import { sql } from 'kysely';
import { AbstractRepository } from 'src/database/database.absract';

@Injectable()
export class PostsRepository extends AbstractRepository<'posts'> {
  protected getTableName(): 'posts' {
    return 'posts';
  }

  getCount() {
    return this.db
      .selectFrom('posts')
      .select(({ fn }) => [
        sql<number>`CAST(${fn.countAll()} AS INTEGER)`.as('count'),
      ])
      .executeTakeFirstOrThrow();
  }
}
// constructor(@Inject(KYSELY_SERVICE) private readonly db: KyselyService) {}

// create(createPostDto: z.infer<typeof PostCreateInputSchema>) {
//   return this.db
//     .insertInto('posts')
//     .values(createPostDto)
//     .returningAll()
//     .executeTakeFirst();
// }

// findAll() {
//   return this.db.selectFrom('posts').selectAll().execute();
// }

// findOne(id: number) {
//   return this.db
//     .selectFrom('posts')
//     .selectAll()
//     .where('id', '=', id)
//     .executeTakeFirst();
// }

// update(id: number, updatePostDto: z.infer<typeof PostUpdateInputSchema>) {
//   return this.db
//     .updateTable('posts')
//     .set(updatePostDto as Post)
//     .where('id', '=', id)
//     .returningAll()
//     .executeTakeFirst();
// }

// remove(id: number) {
//   return this.db
//     .deleteFrom('posts')
//     .where('id', '=', id)
//     .returning('id')
//     .executeTakeFirst();
// }
// }
