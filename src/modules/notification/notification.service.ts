import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import FilterBuilder from 'src/common/builder/filter.builder';
import { throwHttpException } from 'src/common/exceptions/throw.exception';
import { listResponse } from 'src/common/response/response-list.response';
import { NotificationCard } from 'src/database/entities';
import { Repository } from 'typeorm';
import {
  CreateNotificationDto,
  ListNotificationDto,
  UpdateNotificationDto,
} from './dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationCard)
    private notificationCardRepo: Repository<NotificationCard>,
  ) {}

  async getAll(query: ListNotificationDto) {
    const { page = 1, perPage = 10 } = query;
    const entity = {
      entityRepo: this.notificationCardRepo,
      alias: 'notification',
    };
    const select = [
      'id',
      'title',
      'body',
      'shortBody',
      'sendingSchedule',
      'creator',
      'typeSchedule',
      'category',
      'status',
      'isAutoNotification',
      'typeReference',
      'linkedObject',
      'receivers',
      'meta',
      'createdAt',
      'updatedAt',
    ];

    const filterBuilder = new FilterBuilder<
      NotificationCard,
      ListNotificationDto
    >(entity, query)
      .addSelect(select)
      .addNumber('category')
      .addNumber('typeSchedule')
      .addNumber('creatorId')
      .addNumber('typeReceiver')

      .addUnAccentString('title')
      .addDate('createdAt', 'sentDateFrom', 'sentDateTo')
      .addPagination()
      .sortBy('id');

    const [list, total] = await filterBuilder.queryBuilder.getManyAndCount();

    return listResponse(list, total, page, perPage);
  }

  async getOne(id: number): Promise<Partial<Notification>> {
    const notificationCard = await this.findNotificationCardByPk(id);

    if (!notificationCard) {
      throwHttpException(HttpStatus.NOT_FOUND, 'NOTIFY_NOT_FOUND');
    }
    return notificationCard.serialize();
  }

  async create(body: CreateNotificationDto) {
    const { title } = body;

    const notificationCard = this.notificationCardRepo.create({
      title,
    });

    return await this.notificationCardRepo.save(notificationCard);
  }

  async update(id: number, body: UpdateNotificationDto) {
    const { status } = body;

    const notificationCard = await this.notificationCardRepo.findOneBy({ id });
    if (!notificationCard) {
      throwHttpException(HttpStatus.NOT_FOUND, 'NOTIFY_NOT_FOUND');
    }
    if (status) notificationCard.status = status;

    return await this.notificationCardRepo.save(notificationCard);
  }

  async findNotificationCardByPk(id: number): Promise<NotificationCard> {
    const notification = await this.notificationCardRepo.findOneBy({ id });
    if (!notification) {
      throwHttpException(HttpStatus.NOT_FOUND, 'NOTIFY_NOT_FOUND');
    }
    return notification;
  }
}
