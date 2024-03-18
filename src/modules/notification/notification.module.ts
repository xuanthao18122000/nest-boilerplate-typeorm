import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Location,
  Notification,
  NotificationDetail,
  Staff,
} from 'src/submodules/database/entities';
import { LocationService } from '../location/location.service';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notification,
      NotificationDetail,
      Staff,
      Location,
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, LocationService],
})
export class NotificationModule {}
