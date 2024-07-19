import { Body, Controller, Post, UseFilters, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiKeyCreateInput,
  ApiKeyCreateInputSchema,
} from './dtos/api-keys.dtos';
import { ZodValidationPipe } from 'src/pipes/zod.pipe';
import { HttpExceptionFilter } from 'src/core/filters/generic.filter';

@Controller('api-keys')
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(ApiKeyCreateInputSchema))
  create(@Body() { userEmail }: ApiKeyCreateInput) {
    return this.authService.create(userEmail);
  }
}
