import { Injectable, Logger } from '@nestjs/common';
import {
  PostCreateInputSchema,
  PostUpdateInputSchema,
} from 'src/database/zod-schema';
import { z } from 'zod';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);
  constructor(private postsRepository: PostsRepository) {}

  create(post: z.infer<typeof PostCreateInputSchema>) {
    return this.postsRepository.create(post);
  }

  async findAll() {
    return this.postsRepository.findAll();
  }

  findOne(id: number) {
    return this.postsRepository.findOne(id);
  }

  update(id: number, updatePostDto: z.infer<typeof PostUpdateInputSchema>) {
    return this.postsRepository.update(id, updatePostDto);
  }

  remove(id: number) {
    return this.postsRepository.remove(id);
  }
}
