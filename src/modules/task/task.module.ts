import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey, Task, Ticket } from 'src/submodule/database/entities';
import { AreaModule } from '../area/area.module';
import { LocationModule } from '../location/location.module';
import { ROUModule } from '../rou/rou.module';
import { StaffModule } from '../staff/staff.module';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Survey, Ticket]),
    ROUModule,
    AreaModule,
    StaffModule,
    LocationModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
