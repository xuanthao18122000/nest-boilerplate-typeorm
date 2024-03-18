import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KpiConfiguration } from 'src/submodules/database/entities';
import { KpiConfigureController } from './kpi-configuration.controller';
import { KpiConfigureService } from './kpi-configuration.service';

@Module({
  imports: [TypeOrmModule.forFeature([KpiConfiguration])],
  controllers: [KpiConfigureController],
  providers: [KpiConfigureService],
})
export class KpiConfigureModule {}
