import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryExport } from 'src/submodules/database/entities';
import { HistoryExportController } from './history-export.controller';
import { HistoryExportService } from './history-export.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([HistoryExport])],
  controllers: [HistoryExportController],
  providers: [HistoryExportService],
})
export class HistoryExportModule {}
