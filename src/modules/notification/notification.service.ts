import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import * as moment from 'moment';
import FilterBuilder from 'src/submodule/common/builder/filter.builder';
import UpdateBuilder from 'src/submodule/common/builder/update.builder';
import { ErrorHttpException } from 'src/submodule/common/exceptions/throw.exception';
import { listResponse } from 'src/submodule/common/response/response-list.response';
import { Notification, Staff, User } from 'src/submodule/database/entities';
import { Repository } from 'typeorm';
import { LocationService } from '../location/location.service';
import {
  CreateNotificationDto,
  ListNotificationDto,
  StatisticsNotificationDto,
  UpdateNotificationDto,
} from './dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,

    @InjectRepository(Staff)
    private readonly staffRepo: Repository<Staff>,

    private readonly locationService: LocationService,
  ) {}

  async getAll(query: ListNotificationDto) {
    const entity = {
      entityRepo: this.notificationRepo,
      alias: 'notification',
    };

    const notifications = new FilterBuilder(entity, query)
      .addLeftJoinAndSelect(['id', 'fullName', 'email'], 'creator')
      .addUnAccentString('title')
      .addUnAccentString('shortBody')
      .addNumber('id')
      .addNumber('status')
      .addNumber('category', Notification.CATEGORY.GENERAL)
      .addNumber('sendMode')
      .addNumber('typeSchedule')
      .addNumber('typeReceiver')
      .addNumber('creatorId')
      .addDate('sendingSchedule', 'sentDateFrom', 'sentDateTo')
      .addDate('createdAt', 'createdDateFrom', 'createdDateTo')
      .addPagination()
      .sortBy('id');

    const [list, total] = await notifications.getManyAndCount();
    return listResponse(list, total, query);
  }

  async getOne(id: number): Promise<Partial<Notification>> {
    return await this.findNotificationByPk(id);
  }

  async statisticsNotify({
    year = moment().year(),
    provinceId,
  }: StatisticsNotificationDto) {
    const data = [];

    for (let i = 1; i < 13; i++) {
      const queryBuilder = this.notificationRepo
        .createQueryBuilder('notification')
        .select('notification.status, COUNT(notification.id) as count')
        .where('EXTRACT(MONTH FROM notification.createdAt) = :month', {
          month: i,
        })
        .andWhere('EXTRACT(YEAR FROM notification.createdAt) = :year', {
          year,
        });

      if (provinceId) {
        queryBuilder.andWhere(':provinceId = ANY(notification.provinceIds)', {
          provinceId,
        });
      }

      const notifications = await queryBuilder
        .groupBy('notification.status')
        .getRawMany();

      const counts = {
        draft: 0,
        pending: 0,
        accept: 0,
        sending: 0,
        complete: 0,
        cancel: 0,
        reject: 0,
      };

      notifications.forEach((notification) => {
        switch (notification.status) {
          case Notification.STATUS.DRAFT:
            counts.draft = parseInt(notification.count);
            break;
          case Notification.STATUS.PENDING:
            counts.pending = parseInt(notification.count);
            break;
          case Notification.STATUS.ACCEPT:
            counts.accept = parseInt(notification.count);
            break;
          case Notification.STATUS.SENDING:
            counts.sending = parseInt(notification.count);
            break;
          case Notification.STATUS.DONE:
            counts.complete = parseInt(notification.count);
            break;
          case Notification.STATUS.CANCEL:
            counts.cancel = parseInt(notification.count);
            break;
          case Notification.STATUS.REJECT:
            counts.reject = parseInt(notification.count);
            break;
          default:
            break;
        }
      });

      data.push({
        name: `month.${i}`,
        draft: counts.draft,
        pending: counts.pending,
        accept: counts.accept,
        sending: counts.sending,
        complete: counts.complete,
        cancel: counts.cancel,
        reject: counts.reject,
      });
    }

    return data;
  }

  async create(
    {
      title,
      body,
      shortBody,
      category,
      typeReceiver,
      provinceIds,
      receivers,
      typeSchedule,
      sendingSchedule,
      sendMode,
      status,
      attachments,
      repeatAfterHour,
      repeatWeekdays,
      sendingTimeWeekdays,
      startTime,
      endTime,
    }: CreateNotificationDto,
    creator: User,
  ) {
    let receiversNumber: number;

    if (typeReceiver === Notification.TYPE_RECEIVER.ALL) {
      receiversNumber = await this.staffRepo.count({
        where: {
          status: Staff.STATUS.ACTIVE,
        },
      });

      const provinces = await this.locationService.getProvinces();
      provinceIds = _.map(provinces, 'id');
    } else {
      receiversNumber = receivers.length;
    }

    if (status === Notification.STATUS.ACCEPT) {
      status = Notification.STATUS.SENDING;
    }

    const notification = this.notificationRepo.create({
      title,
      body,
      shortBody,
      status,
      category,
      receiversNumber,
      typeReceiver,
      provinceIds,
      receivers,
      sendMode,
      attachments,
      creatorId: creator.id,
    });

    if (sendMode === Notification.SEND_MODE.ONE_TIME) {
      if (typeSchedule === Notification.TYPE_SCHEDULE.SPECIFY_TIME) {
        notification.sendingSchedule = sendingSchedule;
      }

      notification.typeSchedule = typeSchedule;
    }

    if (sendMode === Notification.SEND_MODE.REPEAT_BY_HOUR) {
      notification.repeatAfterHour = repeatAfterHour;
      notification.endTime = endTime;
      notification.startTime = startTime;
    }

    if (sendMode === Notification.SEND_MODE.REPEAT_BY_WEEK) {
      notification.sendingTimeWeekdays = sendingTimeWeekdays;
      notification.repeatWeekdays = repeatWeekdays;
      notification.endTime = endTime;
      notification.startTime = startTime;
    }

    return await this.notificationRepo.save(notification);
  }

  async update(id: number, body: UpdateNotificationDto, updater: User) {
    const { status, rejectReason, typeReceiver, receivers } = body;

    if (typeReceiver) {
      if (typeReceiver === Notification.TYPE_RECEIVER.ALL) {
        body.receiversNumber = await this.staffRepo.count({
          where: {
            status: Staff.STATUS.ACTIVE,
          },
        });

        const provinces = await this.locationService.getProvinces();
        body.provinceIds = _.map(provinces, 'id');
      } else {
        if (receivers) {
          body.receiversNumber = receivers.length;
        } else {
          body.receiversNumber = await this.countStaffInProvinces(
            body.provinceIds,
          );
        }
      }
    }

    let notification = await this.notificationRepo
      .createQueryBuilder('notification')
      .where('notification.id = :id', { id })
      .getOne();

    if (notification.status === Notification.STATUS.DRAFT) {
      notification = new UpdateBuilder(notification, body)
        .updateColumns([
          'title',
          'body',
          'shortBody',
          'category',
          'provinceIds',
          'attachments',
          'receivers',
          'sendMode',
          'sendingSchedule',
          'sendingSchedule',
          'typeSchedule',
          'repeatAfterHour',
          'sendingTimeWeekdays',
          'repeatWeekdays',
          'endTime',
          'startTime',
        ])
        .getNewData();

      await this.updateReceiverNumberNotification(notification, body);
    }

    if (status) {
      if (status === Notification.STATUS.ACCEPT) {
        notification.approvedDate = moment().toDate();
        notification.approvedById = updater.id;
      }
      if (status === Notification.STATUS.REJECT) {
        notification.rejectInfo = {
          rejectedById: updater.id,
          rejectedBy: updater.fullName,
          rejectReason,
          rejectAt: moment().toDate(),
        };
      }

      notification.status = status;
    }

    await this.notificationRepo.save(notification);
    return this.findNotificationByPk(id);
  }

  private countStaffInProvinces(provinceIds: number[]) {
    return this.staffRepo
      .createQueryBuilder('staff')
      .where('staff.status = :status', { status: Staff.STATUS.ACTIVE })
      .andWhere(
        `(SELECT COUNT(*) FROM UNNEST(staff.provinceIds) AS id WHERE id = ANY(:provinceIds)) = :provinceCount`,
        {
          provinceIds: provinceIds,
          provinceCount: provinceIds.length,
        },
      )
      .getCount();
  }

  private async updateReceiverNumberNotification(
    notification: Notification,
    { typeReceiver, receivers }: UpdateNotificationDto,
  ): Promise<void> {
    if (!typeReceiver) return;

    let receiversNumber = 0;

    if (typeReceiver === Notification.TYPE_RECEIVER.ALL) {
      receiversNumber = await this.staffRepo.count({
        where: {
          status: Staff.STATUS.ACTIVE,
        },
      });
    } else {
      receiversNumber = receivers?.length || notification.receivers.length;
    }

    notification.typeReceiver = typeReceiver;
    notification.receiversNumber = receiversNumber;
  }

  async findNotificationByPk(id: number): Promise<Notification> {
    const notification = await this.notificationRepo
      .createQueryBuilder('notification')
      .select([
        'notification',
        'creator.id',
        'creator.fullName',
        'creator.email',
        'approvedBy.id',
        'approvedBy.fullName',
        'approvedBy.email',
      ])
      .leftJoin('notification.creator', 'creator')
      .leftJoin('notification.approvedBy', 'approvedBy')
      .where('notification.id = :id', { id })
      .getOne();

    if (!notification) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'NOTIFY_NOT_FOUND');
    }

    return notification;
  }
}
