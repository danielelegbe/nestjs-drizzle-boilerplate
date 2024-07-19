import { Injectable, Logger } from '@nestjs/common';
import { z } from 'zod';
import { PostsRepository } from './posts.repository';
import { PostCreateInput, PostUpdateInputSchema } from './dtos/posts.dto';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);
  constructor(private postsRepository: PostsRepository) {}

  create(post: PostCreateInput) {
    return this.postsRepository.createOne(post);
  }

  async findAll() {
    return this.postsRepository.findAll();
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
