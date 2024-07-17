import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import {
  PostCreateInputSchema,
  PostUpdateInputSchema,
} from 'src/database/zod-schema';
import { ZodValidationPipe } from 'src/pipes/zod.pipe';
import { z } from 'zod';
import { PostsService } from './posts.service';
import { Post as PostModel } from 'src/database/zod-schema';

@Controller('posts')
export class PostsController {
  private readonly logger = new Logger('PostsController');
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(PostCreateInputSchema))
  create(@Body() createPostDto: z.infer<typeof PostCreateInputSchema>) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const post = await this.postsService.findOne(+id);

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return post;
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(z.any()))
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: z.infer<typeof PostUpdateInputSchema>,
  ) {
    const post = await this.postsService.update(+id, updatePostDto);

    return this.handleMissingPost(post, id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const post = await this.postsService.remove(+id);

    return this.handleMissingPost(post, id);
  }

  private handleMissingPost(post: Partial<PostModel> | undefined, id: string) {
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return post;
  }
}
