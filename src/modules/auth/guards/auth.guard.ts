import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    this.logger.debug('Checking API key', authHeader);

    if (!authHeader) {
      throw new UnauthorizedException('Please provide an authorization header');
    }

    const isValid = await this.authService.verify(authHeader);

    if (!isValid) {
      this.logger.error('Invalid API key');
      throw new UnauthorizedException('Unauthorized');
    }

    return true;
  }
}
