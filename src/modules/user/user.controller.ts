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
import { User } from 'src/submodules/database/entities';
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
@UsePipes(new ValidationPipe({ transform: true }))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo người dùng' })
  @ActivityLog('API_USER_CREATE')
  async createUser(
    @Body() body: CreateUserDto,
    @GetUser() creator: User,
  ): Promise<ISuccessResponse<User>> {
    const user = await this.userService.create(body, creator);
    return SendResponse.success(user.serialize(), 'Create user successful!');
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách người dùng' })
  @ActivityLog('API_USER_LIST')
  async getAll(@Query() query: ListUserDto): Promise<ISuccessResponse<User>> {
    const users = await this.userService.getAll(query);
    return SendResponse.success(users, 'Get all users successful!');
  }

  @Get('select')
  @ApiOperation({ summary: 'Select danh sách người dùng' })
  async select(@Query() query: ListUserDto): Promise<ISuccessResponse<User>> {
    const users = await this.userService.getAll(query);
    return SendResponse.success(users, 'Select users successful!');
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
  @ActivityLog('API_USER_DETAIL')
  async getOneUser(@Param('id') id: number): Promise<ISuccessResponse<User>> {
    const users = await this.userService.getOne(id);
    return SendResponse.success(users, 'Get detail user successful!');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật người dùng' })
  @ActivityLog('API_USER_UPDATE')
  async updateUser(
    @Param('id') id: number,
    @Body() body: UpdateUserDto,
    @GetUser() updater: User,
  ): Promise<ISuccessResponse<User>> {
    const user = await this.userService.update(id, body, updater);
    return SendResponse.success(user, 'Update user successful!');
  }
}
