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
import { GetUser } from 'src/submodules/common/decorators/user.decorator';
import { SendResponse } from 'src/submodules/common/response/send-response';
import { User } from 'src/submodules/database/entities';
import {
  CreateNotificationDto,
  ListNotificationDto,
  StatisticsNotificationDto,
  UpdateNotificationDto,
} from './dto/notification.dto';
import { NotificationService } from './notification.service';

@ApiBearerAuth()
@ApiTags('Notifications')
@Controller('notifications')
@UsePipes(new ValidationPipe({ transform: true }))
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
  @ApiOperation({ summary: 'Danh sách thông báo' })
  async getAll(@Query() query: ListNotificationDto) {
    const notificationCards = await this.notificationService.getAll(query);

    return SendResponse.success(
      notificationCards,
      'Get all notifications successful!',
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết thông báo' })
  async getOneNotification(@Param('id') id: number) {
    const notification = await this.notificationService.getOne(id);
    return SendResponse.success(
      notification,
      'Get detail notification successful!',
    );
  }

  @Post()
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
