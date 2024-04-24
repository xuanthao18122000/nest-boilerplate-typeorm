import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActivityLog } from 'src/submodule/common/decorators/activity-log.decorator';
import { GetUser } from 'src/submodule/common/decorators/user.decorator';
import { SendResponse } from 'src/submodule/common/response/send-response';
import { User } from 'src/submodule/database/entities';
import {
  CreateNotificationDto,
  ListNotificationDto,
  StatisticsNotificationDto,
  UpdateNotificationDto,
} from './dto/notification.dto';
import { NotificationService } from './notification.service';

@ApiBearerAuth()
@ApiTags('22. Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('region/statistics')
  @ApiOperation({ summary: 'Thống kê số lượng thông báo' })
  async regionStatistics(@Query() query: StatisticsNotificationDto) {
    const statistics = await this.notificationService.statisticsNotify(query);
    return SendResponse.success(
      statistics,
      'Get statistics notifications successful!',
    );
  }

  @Get()
  @ActivityLog('NOTIFICATION_LIST')
  @ApiOperation({ summary: 'Danh sách thông báo' })
  async getAll(@Query() query: ListNotificationDto) {
    const notificationCards = await this.notificationService.getAll(query);

    return SendResponse.success(
      notificationCards,
      'Get all notifications successful!',
    );
  }

  @Get(':id')
  @ActivityLog('NOTIFICATION_DETAIL')
  @ApiOperation({ summary: 'Chi tiết thông báo' })
  async getOneNotification(@Param('id') id: number) {
    const notification = await this.notificationService.getOne(id);
    return SendResponse.success(
      notification,
      'Get detail notification successful!',
    );
  }

  @Post()
  @ActivityLog('NOTIFICATION_CREATE')
  @ApiOperation({ summary: 'Tạo thông báo' })
  async createNotification(
    @Body() body: CreateNotificationDto,
    @GetUser() creator: User,
  ) {
    const notification = await this.notificationService.create(body, creator);
    return SendResponse.success(
      notification,
      'Create notification successful!',
    );
  }

  @Put(':id')
  @ActivityLog('NOTIFICATION_UPDATE')
  @ApiOperation({ summary: 'Cập nhật thông báo' })
  async updateNotification(
    @Param('id') id: number,
    @Body() body: UpdateNotificationDto,
    @GetUser() updater: User,
  ) {
    const notification = await this.notificationService.update(
      id,
      body,
      updater,
    );
    return SendResponse.success(
      notification,
      'Update notification successful!',
    );
  }
}
