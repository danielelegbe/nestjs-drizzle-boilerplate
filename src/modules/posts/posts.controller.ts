import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseFilters,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import { ZodValidationPipe } from 'src/pipes/zod.pipe';
import { PostsService } from './posts.service';
import {
  PostCreateInput,
  PostCreateInputSchema,
  PostUpdateInput,
  PostUpdateInputSchema,
} from './dtos/posts.dto';
import { HttpExceptionFilter } from 'src/core/filters/generic.filter';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';

@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(PostCreateInputSchema))
  create(@Body() createPostDto: PostCreateInput) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  async findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.postsService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(PostUpdateInputSchema))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: PostUpdateInput,
  ) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(id);
  }
}
