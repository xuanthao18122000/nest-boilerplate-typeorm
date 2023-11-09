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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { SendResponse } from 'src/common/response/send-response';
import {
  CreateNotificationDto,
  ListNotificationDto,
  UpdateNotificationDto,
} from './dto/notification.dto';
import { NotificationService } from './notification.service';

@ApiBearerAuth()
@ApiTags('5. Notifications')
@Controller('notifications')
@UsePipes(new ValidationPipe({ transform: true }))
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getAll(@Query() query: ListNotificationDto, @Res() response: Response) {
    const notificationCards = await this.notificationService.getAll(query);

    return SendResponse.success(
      notificationCards,
      'Get all notifications successful',
      response,
    );
  }

  @Get(':id')
  async getOneNotification(@Param('id') id: number) {
    const notification = await this.notificationService.getOne(id);
    return SendResponse.success(
      notification,
      'Get detail notification successful',
    );
  }

  @Post()
  async createNotification(@Body() body: CreateNotificationDto) {
    const notification = await this.notificationService.create(body);
    return SendResponse.success(notification, 'Create notification successful');
  }

  @Put()
  async updateNotification(
    @Param('id') id: number,
    @Body() body: UpdateNotificationDto,
  ) {
    const notification = await this.notificationService.update(id, body);
    return SendResponse.success(notification, 'Update notification successful');
  }
}
