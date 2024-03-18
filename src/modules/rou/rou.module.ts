import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location, ROU } from 'src/submodules/database/entities';
import { LocationService } from '../location/location.service';
import { ROUController } from './rou.controller';
import { ROUService } from './rou.service';

@Module({
  imports: [TypeOrmModule.forFeature([ROU, Location])],
  controllers: [ROUController],
  providers: [ROUService, LocationService],
})
export class ROUModule {}
