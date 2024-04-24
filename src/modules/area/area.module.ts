import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Area,
  Location,
  ProductTransaction,
  Staff,
} from 'src/submodule/database/entities';
import { LocationService } from '../location/location.service';
import { AreaController } from './area.controller';
import { AreaService } from './area.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Area, Location, ProductTransaction, Staff]),
  ],
  controllers: [AreaController],
  providers: [AreaService, LocationService],
  exports: [AreaService],
})
export class AreaModule {}
