import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ROU } from 'src/submodule/database/entities';
import { AreaModule } from '../area/area.module';
import { LocationModule } from '../location/location.module';
import { ROUController } from './rou.controller';
import { ROUService } from './rou.service';

@Module({
  imports: [TypeOrmModule.forFeature([ROU]), AreaModule, LocationModule],
  controllers: [ROUController],
  providers: [ROUService],
  exports: [ROUService],
})
export class ROUModule {}
