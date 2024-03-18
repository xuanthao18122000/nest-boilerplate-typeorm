import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey, Task, Ticket } from 'src/submodules/database/entities';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Survey, Ticket])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
