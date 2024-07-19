import {
  BadRequestException,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  private readonly logger = new Logger('ZodValidationPipe');

  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (e) {
      if (e instanceof ZodError) {
        throw new BadRequestException('Validation failed', {
          cause: e.errors,
        });
      }

      this.logger.error('Error while validating input', e);
      throw new BadRequestException('Unknown validation error');
    }
  }
}
