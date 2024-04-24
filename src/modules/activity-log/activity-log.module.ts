import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ActivityLog,
  ActivityLogDetail,
} from 'src/submodule/database/entities';
import { ActivityLogController } from './activity-log.controller';
import { ActivityLogService } from './activity-log.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ActivityLog, ActivityLogDetail])],
  controllers: [ActivityLogController],
  providers: [ActivityLogService],
  exports: [ActivityLogService],
})
export class ActivityLogModule {}
