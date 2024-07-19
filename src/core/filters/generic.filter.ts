import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { type FastifyRequest, type FastifyReply } from 'fastify';
import { DatabaseException } from 'src/core/exceptions/database.exceptions';

@Catch(HttpException, DatabaseException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const status = exception.getStatus();

    response.status(status).send({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      cause: exception.cause,
      message: exception.message,
    });
  }
}
