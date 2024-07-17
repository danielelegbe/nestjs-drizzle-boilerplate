import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { ConfigSchema } from './config/config.schema';
import { KyselyModule } from './database/database.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate(config) {
        return ConfigSchema.parse(config);
      },
    }),
    LoggerModule.forRoot(),
    KyselyModule,
    PostsModule,
  ],
})
export class AppModule {}
