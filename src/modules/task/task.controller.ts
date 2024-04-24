import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationOptions } from 'src/submodule/common/builder';
import { ActivityLog } from 'src/submodule/common/decorators/activity-log.decorator';
import { GetUser } from 'src/submodule/common/decorators/user.decorator';
import { ISuccessResponse } from 'src/submodule/common/interfaces';
import { SendResponse } from 'src/submodule/common/response/send-response';
import { Task, User } from 'src/submodule/database/entities';
import { CreateTaskDto, ListTaskDto, UpdateTaskDto } from './dto/task.dto';
import { TaskService } from './task.service';

@ApiBearerAuth()
@ApiTags('14. Tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo tác vụ' })
  @ActivityLog('TASK_CREATE')
  async create(
    @Body() body: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<ISuccessResponse<Task>> {
    const task = await this.taskService.create(body, user);
    return SendResponse.success(task, 'Create task successful!');
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách tác vụ' })
  @ActivityLog('TASK_LIST')
  async getAll(@Query() query: ListTaskDto) {
    const tasks = await this.taskService.getAll(query);
    return SendResponse.success(tasks, 'Get all tasks successful!');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết tác vụ' })
  @ActivityLog('TASK_DETAIL')
  async getOne(@Param('id') id: number) {
    const task = await this.taskService.getOne(id);
    return SendResponse.success(task, 'Get detail task successful!');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật tác vụ' })
  @ActivityLog('TASK_UPDATE')
  async update(
    @Param('id') id: number,
    @Body() body: UpdateTaskDto,
    @GetUser() user: User,
  ) {
    const task = await this.taskService.update(id, body, user);
    return SendResponse.success(task, 'Update task successful!');
  }

  @Get('survey-results/:taskId')
  @ApiOperation({ summary: 'Chi tiết tác vụ' })
  @ActivityLog('TASK_SURVEY_VIEW')
  async surveyResults(
    @Param('taskId') taskId: number,
    @Query() query: PaginationOptions,
  ) {
    const task = await this.taskService.surveyResults(taskId, query);
    return SendResponse.success(task, 'Get detail task successful!');
  }
}
