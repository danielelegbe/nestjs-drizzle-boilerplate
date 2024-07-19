import { Injectable, Logger } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import * as crypto from 'node:crypto';
import * as bcrypt from 'bcrypt';
import { apiKeys } from 'src/core/database/models/models';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly authRepository: AuthRepository) {}

  async create(userEmail: string) {
    const exists = await this.authRepository.findOneByKey(
      'userEmail',
      userEmail,
    );

    if (exists) {
      return this.authRepository.throwConflict('Email');
    }

    const apiKey = this.generateApiKey();
    const hashedKey = this.hashApiKey(apiKey);

    const result = await this.authRepository.createApiKey(userEmail, hashedKey);

    return {
      ...result,
      apiKey,
    };
  }

  async verify(apiKey: string): Promise<boolean> {
    const hashFromRequest = this.hashApiKey(apiKey);

    const result = await this.authRepository.findOneByKey(
      'key',
      hashFromRequest,
      {
        key: apiKeys.key,
      },
    );

    return !!result;
  }

  private generateApiKey(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  private hashApiKey(apiKey: string) {
    return crypto.createHash('sha256').update(apiKey).digest('hex');
  }
}
