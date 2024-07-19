import { HttpException, HttpStatus } from '@nestjs/common';

export class DatabaseException extends HttpException {
  static NotFound(entity: string) {
    throw new DatabaseException(
      `${entity} could not be found`,
      HttpStatus.NOT_FOUND,
    );
  }

  static Conflict(entity: string) {
    throw new DatabaseException(
      `${entity} already exists`,
      HttpStatus.CONFLICT,
    );
  }
}
