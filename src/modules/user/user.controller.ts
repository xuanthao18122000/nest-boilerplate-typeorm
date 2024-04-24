import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActivityLog } from 'src/submodule/common/decorators/activity-log.decorator';
import { GetUser } from 'src/submodule/common/decorators/user.decorator';
import { ISuccessResponse } from 'src/submodule/common/interfaces';
import { SendResponse } from 'src/submodule/common/response/send-response';
import { User } from 'src/submodule/database/entities';
import {
  CreateUserDto,
  ListUserDto,
  TopActivityDto,
  UpdateUserDto,
} from './dto/user.dto';

import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('3. Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo người dùng' })
  @ActivityLog('USER_CREATE')
  async createUser(
    @Body() body: CreateUserDto,
    @GetUser() creator: User,
  ): Promise<ISuccessResponse<User>> {
    const user = await this.userService.create(body, creator);
    return SendResponse.success(user.serialize(), 'Create user successful!');
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách người dùng' })
  @ActivityLog('USER_LIST')
  async getAll(@Query() query: ListUserDto) {
    const users = await this.userService.getAll(query);
    return SendResponse.success(users, 'Get all users successful!');
  }

  @Get('activities/statistics')
  @ApiOperation({ summary: 'Top người dùng hoạt động tích cực nhất tháng' })
  async getUserActivities(@Query() query: TopActivityDto) {
    const users = await this.userService.getUserActivities(query);
    return SendResponse.success(
      users,
      'Get top most active in month successful!',
    );
  }

  @Get('roles/statistics')
  @ApiOperation({ summary: `Thông kê ODs's Type` })
  async getUserRoles() {
    const users = await this.userService.getUserRoles();
    return SendResponse.success(users, `Get ODs's Type statistics successful!`);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Chi tiết người dùng',
  })
  @ActivityLog('USER_DETAIL')
  async getOneUser(@Param('id') id: number): Promise<ISuccessResponse<User>> {
    const users = await this.userService.getOne(id);
    return SendResponse.success(users, 'Get detail user successful!');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật người dùng' })
  @ActivityLog('USER_UPDATE')
  async updateUser(
    @Param('id') id: number,
    @Body() body: UpdateUserDto,
    @GetUser() updater: User,
  ): Promise<ISuccessResponse<User>> {
    const user = await this.userService.update(id, body, updater);
    return SendResponse.success(user, 'Update user successful!');
  }
}
