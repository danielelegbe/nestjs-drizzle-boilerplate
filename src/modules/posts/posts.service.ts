import { Inject, Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PostsRepository } from './posts.repository';
import { Post, PostCreateInput, PostUpdateInputSchema } from './dtos/posts.dto';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class PostsService {
  constructor(
    private postsRepository: PostsRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManger: Cache,
  ) {}

  create(post: PostCreateInput) {
    return this.postsRepository.createOne(post);
  }

  async findAll() {
    const cached = await this.cacheManger.get<Post[]>('posts');

    if (cached) {
      return cached;
    }

    const posts = await this.postsRepository.findAll();

    await this.cacheManger.set('posts', posts, 10);

    return posts;
  }

  findOne(id: number) {
    return this.postsRepository.findOneByIdOrThrow(id);
  }

  update(id: number, updatePostDto: z.infer<typeof PostUpdateInputSchema>) {
    return this.postsRepository.updateOneById(id, updatePostDto);
  }

  remove(id: number) {
    return this.postsRepository.remove(id);
  }
}
