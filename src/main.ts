import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const logger = app.get(Logger);

  app.useLogger(logger);

  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');

  const NODE_ENV = configService.get('NODE_ENV');

  await app.listen(PORT, NODE_ENV === 'development' ? '0.0.0.0' : 'localhost');

  logger.log(`Server is running on port ${PORT}`);
}

bootstrap();
