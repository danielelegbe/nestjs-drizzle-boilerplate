import { Module } from '@nestjs/common';
import { DatabaseService } from './drizzle.service';

@Module({
  providers: [DatabaseService],
})
export class DrizzleModule {}
