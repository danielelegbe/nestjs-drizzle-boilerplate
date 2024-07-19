import { CanActivate } from '@nestjs/common';

export class MockAuthGuard implements CanActivate {
  canActivate() {
    return true;
  }
}
