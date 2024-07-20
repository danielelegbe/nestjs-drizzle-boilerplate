import { Inject, Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PostsRepository } from './posts.repository';
import { PostCreateInput, PostUpdateInputSchema } from './dtos/posts.dto';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';

@Injectable()
export class PostsService {
  constructor(
    private postsRepository: PostsRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManger: CacheStore,
  ) {}

  create(post: PostCreateInput) {
    return this.postsRepository.createOne(post);
  }

  async findAll() {
    return await this.postsRepository.findAll();
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
