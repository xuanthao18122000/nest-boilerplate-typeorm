import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff, VisitingHistory } from 'src/submodules/database/entities';
import { LocationLookupController } from './location-lookup.controller';
import { LocationLookupService } from './location-lookup.service';

@Module({
  imports: [TypeOrmModule.forFeature([VisitingHistory, Staff])],
  controllers: [LocationLookupController],
  providers: [LocationLookupService],
})
export class LocationLookupModule {}
