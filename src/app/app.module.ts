import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from 'src/app/app.controller';
import { ConfigSchema } from 'src/config/config.schema';
import { KyselyModule } from 'src/database/database.module';
import { PostsModule } from 'src/posts/posts.module';

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
  controllers: [AppController],
})
export class AppModule {}
