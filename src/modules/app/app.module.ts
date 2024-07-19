import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from 'src/modules/app/app.controller';
import { ConfigSchema } from 'src/config/config.schema';
import { DatabaseModule } from 'src/core/database/database.module';
import { PostsModule } from 'src/modules/posts/posts.module';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate(config) {
        return ConfigSchema.parse(config);
      },
    }),
    DatabaseModule,
    PostsModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
