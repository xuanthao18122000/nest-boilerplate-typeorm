import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Area,
  Location,
  Position,
  ROU,
  Staff,
  StaffActivity,
} from 'src/submodules/database/entities';
import { LocationService } from '../location/location.service';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Staff,
      Position,
      Area,
      ROU,
      Location,
      StaffActivity,
    ]),
  ],
  controllers: [StaffController],
  providers: [StaffService, LocationService],
})
export class StaffModule {}
