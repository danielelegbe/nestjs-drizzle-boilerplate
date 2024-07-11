import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import configuration from './config';


@Module({
  imports: [ConfigModule.forRoot({
    load: [configuration],
  }), PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
