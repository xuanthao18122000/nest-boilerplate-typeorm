import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationCard, NotificationDetail } from 'src/database/entities';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationCard, NotificationDetail])],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
