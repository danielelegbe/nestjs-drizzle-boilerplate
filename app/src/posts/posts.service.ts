import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

const posts = [
  {
    id: 1,
    title: 'First post',
    body: 'This is the first post',
    userId: 1,
  },
  {
    id: 2,
    title: 'Second post',
    body: 'This is the second post',
    userId: 1,
  },
];

@Injectable()
export class PostsService {
  create(createPostDto: CreatePostDto) {
    return 'This action adds a new post';
  }

  findAll() {
    return posts;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
