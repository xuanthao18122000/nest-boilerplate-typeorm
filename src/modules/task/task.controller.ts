import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActivityLog } from 'src/submodules/common/decorators/activity-log.decorator';
import { GetUser } from 'src/submodules/common/decorators/user.decorator';
import { ISuccessResponse } from 'src/submodules/common/interfaces';
import { SendResponse } from 'src/submodules/common/response/send-response';
import { Task, User } from 'src/submodules/database/entities';
import {
  CreateTaskDto,
  ListTaskDto,
  StatisticsTasksDto,
  UpdateTaskDto,
} from './dto/task.dto';
import { TaskService } from './task.service';

@ApiBearerAuth()
@ApiTags('14. Tasks')
@Controller('tasks')
@UsePipes(new ValidationPipe({ transform: true }))
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('statistics')
  @ApiOperation({ summary: 'Thống kê tác vụ theo tỉnh' })
  async statistics(@Query() query: StatisticsTasksDto) {
    const statistics = await this.taskService.statisticsTasks(query);
    return SendResponse.success(statistics, 'Get statistics tasks successful!');
  }

  @Post()
  @ApiOperation({ summary: 'Tạo tác vụ' })
  @ActivityLog('API_TASK_CREATE')
  async create(
    @Body() body: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<ISuccessResponse<Task>> {
    const task = await this.taskService.create(body, user);
    return SendResponse.success(task, 'Create task successful!');
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách tác vụ' })
  @ActivityLog('API_TASK_LIST')
  async getAll(@Query() query: ListTaskDto) {
    const tasks = await this.taskService.getAll(query);
    return SendResponse.success(tasks, 'Get all tasks successful!');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết tác vụ' })
  @ActivityLog('API_TASK_DETAIL')
  async getOne(@Param('id') id: number) {
    const task = await this.taskService.getOne(id);
    return SendResponse.success(task, 'Get detail task successful!');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật tác vụ' })
  @ActivityLog('API_TASK_UPDATE')
  async update(
    @Param('id') id: number,
    @Body() body: UpdateTaskDto,
    @GetUser() user: User,
  ) {
    const task = await this.taskService.update(id, body, user);
    return SendResponse.success(task, 'Update task successful!');
  }
}
