import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { SendResponse } from 'src/common/response/send-response';
import {
  CreateNotificationDto,
  ListNotificationDto,
  UpdateNotificationDto,
} from './dto/notification.dto';
import { NotificationService } from './notification.service';

@ApiBearerAuth()
@ApiTags('6. Notifications')
@Controller('notifications')
@UsePipes(new ValidationPipe({ transform: true }))
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách thông báo' })
  async getAll(@Query() query: ListNotificationDto, @Res() response: Response) {
    const notificationCards = await this.notificationService.getAll(query);

    return SendResponse.success(
      notificationCards,
      'Get all notifications successful!',
      response,
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
  async createNotification(@Body() body: CreateNotificationDto) {
    const notification = await this.notificationService.create(body);
    return SendResponse.success(
      notification,
      'Create notification successful!',
    );
  }

  @Put()
  @ApiOperation({ summary: 'Cập nhật thông báo' })
  async updateNotification(
    @Param('id') id: number,
    @Body() body: UpdateNotificationDto,
  ) {
    const notification = await this.notificationService.update(id, body);
    return SendResponse.success(
      notification,
      'Update notification successful!',
    );
  }
}
