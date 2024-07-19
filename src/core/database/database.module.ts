import { Global, Logger, Module, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ConnectionProvider } from './connection/connection.provider';
import { DBConnectionService } from './connection/connection.service';

@Global()
@Module({
  providers: [DatabaseService, DBConnectionService, ConnectionProvider],
  exports: [DatabaseService],
})
export class DatabaseModule implements OnModuleInit {
  private readonly logger = new Logger(DatabaseModule.name);

  onModuleInit() {
    this.logger.log('Database module initialized');
  }
}
