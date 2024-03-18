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
import { PaginationOptions } from 'src/submodules/common/builder';
import { ActivityLog } from 'src/submodules/common/decorators/activity-log.decorator';
import { GetUser } from 'src/submodules/common/decorators/user.decorator';
import { ISuccessResponse } from 'src/submodules/common/interfaces';
import { SendResponse } from 'src/submodules/common/response/send-response';
import { Staff, User } from 'src/submodules/database/entities';
import { CreateStaffDto, ListStaffDto, UpdateStaffDto } from './dto/staff.dto';
import { StaffService } from './staff.service';

@ApiBearerAuth()
@ApiTags('5. Staffs')
@Controller('staffs')
@UsePipes(new ValidationPipe({ transform: true }))
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo nhân viên' })
  @ActivityLog('API_STAFF_CREATE')
  async create(
    @Body() body: CreateStaffDto,
    @GetUser() user: User,
  ): Promise<ISuccessResponse<Staff>> {
    const staff = await this.staffService.create(body, user);
    return SendResponse.success(staff, 'Create staff successful!');
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách nhân viên' })
  @ActivityLog('API_STAFF_LIST')
  async getAll(@Query() query: ListStaffDto) {
    const staffs = await this.staffService.getAll(query);
    return SendResponse.success(staffs, 'Get all staffs successful!');
  }

  @Get('select')
  @ApiOperation({ summary: 'Select danh sách nhân viên' })
  async select(@Query() query: ListStaffDto) {
    const staffs = await this.staffService.getAll(query);
    return SendResponse.success(staffs, 'Select staffs successful!');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết nhân viên' })
  @ActivityLog('API_STAFF_DETAIL')
  async getOneStaff(@Param('id') id: number) {
    const staff = await this.staffService.getOne(id);
    return SendResponse.success(staff, 'Get detail staff successful!');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật nhân viên' })
  @ActivityLog('API_STAFF_UPDATE')
  async updateStaff(
    @Param('id') id: number,
    @Body() body: UpdateStaffDto,
    @GetUser() updater: User,
  ) {
    const staff = await this.staffService.update(id, body, updater);
    return SendResponse.success(staff, 'Update staff successful!');
  }

  @Put('logout/:id')
  @ApiOperation({ summary: 'Đăng xuất nhân viên' })
  @ActivityLog('API_STAFF_UPDATE')
  async logOutStaff(@Param('id') id: number, @GetUser() updater: User) {
    const staff = await this.staffService.logOutStaff(id, updater);
    return SendResponse.success(staff, 'Logout staff successful!');
  }

  @Get('activities/:staffId')
  @ApiOperation({ summary: 'Danh sách nhân viên' })
  @ActivityLog('API_STAFF_LIST')
  async getActivitiesLogin(
    @Param('staffId') staffId: number,
    @Query() query: PaginationOptions,
  ) {
    const staffs = await this.staffService.getActivitiesLogin(staffId, query);
    return SendResponse.success(staffs, 'Get all staffs successful!');
  }
}
