import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from 'src/modules/app/app.controller';
import { ConfigSchema } from 'src/config/config.schema';
import { DatabaseModule } from 'src/core/database/database.module';
import { PostsModule } from 'src/modules/posts/posts.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-store';
import { CacheStore } from '@nestjs/common/cache';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate(config) {
        return ConfigSchema.parse(config);
      },
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      useFactory: async () => {
        const configService = new ConfigService();

        const redisUrl = configService.get<string>('REDIS_URL');

        const store = await redisStore({
          url: redisUrl,
        });

        return {
          store: store as unknown as CacheStore,
        };
      },
    }),
    DatabaseModule,
    PostsModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
