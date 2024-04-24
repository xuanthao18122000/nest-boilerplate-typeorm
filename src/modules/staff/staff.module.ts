import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Area,
  KpiVolume,
  Location,
  Position,
  ProductTransaction,
  Staff,
  StaffActivity,
} from 'src/submodule/database/entities';
import { AreaModule } from '../area/area.module';
import { LocationModule } from '../location/location.module';
import { ROUModule } from '../rou/rou.module';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Staff,
      Position,
      Area,
      Location,
      KpiVolume,
      StaffActivity,
      ProductTransaction,
    ]),
    ROUModule,
    AreaModule,
    LocationModule,
  ],
  controllers: [StaffController],
  providers: [StaffService],
  exports: [StaffService],
})
export class StaffModule {}
