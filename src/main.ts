import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
  );

  const logger = new Logger('App');

  const configService = app.get(ConfigService);
  const PORT = configService.get<string>('PORT') as string;

  await app.listen(PORT, '0.0.0.0', () => {
    logger.log(`Server is running on port ${PORT}`);
  });
}

void bootstrap();
