import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  KpiVolume,
  Location,
  ORP,
  ORPManagement,
  ROU,
  Staff,
} from 'src/submodules/database/entities';
import { LocationService } from '../location/location.service';
import { KpiVolumeController } from './kpi-volume.controller';
import { KpiVolumeService } from './kpi-volume.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ORP,
      Staff,
      ORPManagement,
      KpiVolume,
      Location,
      ROU,
    ]),
  ],
  controllers: [KpiVolumeController],
  providers: [KpiVolumeService, LocationService],
})
export class KpiVolumeModule {}
