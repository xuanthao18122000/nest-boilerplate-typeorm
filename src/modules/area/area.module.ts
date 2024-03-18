import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Area, Location } from 'src/submodules/database/entities';
import { LocationService } from '../location/location.service';
import { AreaController } from './area.controller';
import { AreaService } from './area.service';

@Module({
  imports: [TypeOrmModule.forFeature([Area, Location])],
  controllers: [AreaController],
  providers: [AreaService, LocationService],
})
export class AreaModule {}
