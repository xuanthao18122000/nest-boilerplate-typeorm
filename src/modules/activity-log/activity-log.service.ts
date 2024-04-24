import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import FilterBuilder from 'src/submodule/common/builder/filter.builder';
import { PaginationOptions } from 'src/submodule/common/builder/pagination-options.builder';
import { listResponse } from 'src/submodule/common/response/response-list.response';
import {
  ActivityLog,
  ActivityLogDetail,
} from 'src/submodule/database/entities';
import { Repository } from 'typeorm';
import { ListActivityLogsDto } from './dto/activity-log.dto';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepo: Repository<ActivityLog>,

    @InjectRepository(ActivityLogDetail)
    private readonly activityLogDetailRepo: Repository<ActivityLogDetail>,
  ) {}

  async getAll(query: ListActivityLogsDto) {
    const { path } = query;
    const entity = {
      entityRepo: this.activityLogRepo,
      alias: 'activity-log',
    };

    const filterBuilder = new FilterBuilder(entity, query)
      .select([
        'id',
        'url',
        'action',
        'method',
        'description',
        'creator',
        'createdAt',
        'updatedAt',
      ])
      .addLeftJoinAndSelect(['id', 'fullName'], 'creator')
      .addNumber('id')
      .addNumber('creatorId')
      .addDate('createdAt', 'createdDateFrom', 'createdDateTo')
      .addPagination()
      .sortBy('id');

    if (path) filterBuilder.addUnAccentString('url', path);

    const [list, total] = await filterBuilder.getManyAndCount();

    return listResponse(list, total, query);
  }
  async getDetails(module: number, query: PaginationOptions) {
    const entity = {
      entityRepo: this.activityLogDetailRepo,
      alias: 'activity-log-detail',
    };
    const filterBuilder = new FilterBuilder(entity)
      .addLeftJoinAndSelect(['id', 'fullName'], 'creator')
      .addNumber('moduleId', module)
      .addPagination()
      .sortBy('id');

    const [list, total] = await filterBuilder.getManyAndCount();
    return listResponse(list, total, query);
  }

  async findOneByActionAndUserId(action: string, creatorId: number) {
    return await this.activityLogRepo
      .createQueryBuilder('activityLog')
      .where('activityLog.action = :action', { action })
      .andWhere('activityLog.creatorId = :creatorId', { creatorId })
      .orderBy('activityLog.createdAt', 'DESC')
      .getOne();
  }

  saveOne(activityLog: Partial<ActivityLog>) {
    return this.activityLogRepo.save(activityLog);
  }

  async create(
    action: string,
    description: string,
    method: number,
    url: string,
    creatorId: number,
  ) {
    const activityLog = this.activityLogRepo.create({
      action,
      description,
      method,
      url,
      creatorId,
    });

    return await this.activityLogRepo.save(activityLog);
  }

  async createLogsDetail(detailLogs: Partial<ActivityLogDetail[]>) {
    return this.activityLogDetailRepo.save(detailLogs);
  }

  async saveActivityLogDetail(detailActivityLogs: ActivityLogDetail[]) {
    if (detailActivityLogs) {
      await this.activityLogDetailRepo.save(detailActivityLogs);
    }
  }
  async createActivityLogDetail<T extends Record<string, any>>(
    action: string,
    table: T,
    body: Record<string, any>,
    creatorId: number,
    moduleId: number,
  ): Promise<ActivityLogDetail[]> | null {
    const activityLog = await this.activityLogRepo.findOneBy({
      action,
      creatorId,
    });

    if (activityLog) {
      const detailActivityLogs: ActivityLogDetail[] = [];

      for (const [key, value] of Object.entries(body)) {
        const detailLog = this.activityLogDetailRepo.create({
          activityLogId: activityLog.id,
          column: key,
          newData: value,
          oldData: table[key],
          creatorId: creatorId,
          action: ActivityLogDetail.ACTION.CREATE,
          moduleId,
        });

        detailActivityLogs.push(detailLog);
      }

      return detailActivityLogs;
    }

    return null;
  }
}
