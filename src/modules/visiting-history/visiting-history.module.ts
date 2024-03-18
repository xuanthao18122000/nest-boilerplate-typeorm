import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitingHistory } from 'src/submodules/database/entities';
import { VisitingHistoryController } from './visiting-history.controller';
import { VisitingHistoryService } from './visiting-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([VisitingHistory])],
  controllers: [VisitingHistoryController],
  providers: [VisitingHistoryService],
})
export class VisitingHistoryModule {}
