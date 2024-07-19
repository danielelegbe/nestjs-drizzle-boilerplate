import { Injectable } from '@nestjs/common';
import { AbstractRepository } from 'src/core/database/database.absract';
import { posts } from 'src/core/database/models/models';

@Injectable()
export class PostsRepository extends AbstractRepository<typeof posts> {
  protected tableName = posts;
  protected modelName = 'Post';
}
