import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigureTracking } from 'src/submodules/database/entities';
import { ConfigTrackingController } from './configure-tracking.controller';
import { ConfigTrackingService } from './configure-tracking.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConfigureTracking])],
  controllers: [ConfigTrackingController],
  providers: [ConfigTrackingService],
})
export class ConfigTrackingModule {}
