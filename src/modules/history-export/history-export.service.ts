import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import * as moment from 'moment';
import FilterBuilder from 'src/submodules/common/builder/filter.builder';
import { listResponse } from 'src/submodules/common/response/response-list.response';
import { getMonthYearLabel } from 'src/submodules/common/utils';
import { HistoryExport, User } from 'src/submodules/database/entities';
import { Repository } from 'typeorm';
import {
  ListHistoryExportDto,
  StatisticsExportsDto,
} from './dto/history-export.dto';

@Injectable()
export class HistoryExportService {
  constructor(
    @InjectRepository(HistoryExport)
    private readonly historyExportRepo: Repository<HistoryExport>,
  ) {}

  async statistics({ year = moment().year() }: StatisticsExportsDto) {
    const data = [];
    for (let i = 1; i < 13; i++) {
      const monthYearLabel = getMonthYearLabel(i, year);
      const { exportQuantity, userExportQuantity } =
        await this.getExportQuantityByMonthYear(i, year);

      data.push({
        name: monthYearLabel,
        exportQuantity,
        userExportQuantity,
      });
    }

    return data;
  }

  async getExportQuantityByMonthYear(month: number, year: number) {
    const [exports, exportQuantity] = await this.historyExportRepo
      .createQueryBuilder('historyExport')
      .andWhere('EXTRACT(MONTH FROM historyExport.createdAt) = :month', {
        month,
      })
      .andWhere('EXTRACT(YEAR FROM historyExport.createdAt) = :year', { year })
      .getManyAndCount();

    const usersNumber = _.map(exports, 'creatorId');
    const userExportQuantity = new Set(usersNumber).size;

    return { exportQuantity, userExportQuantity };
  }

  async getAll(query: ListHistoryExportDto, creator: User) {
    const entity = {
      entityRepo: this.historyExportRepo,
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
      .addNumber('creatorId', creator.id)
      .addPagination()
      .sortBy('id');

    const [list, total] = await filterBuilder.getManyAndCount();
    return listResponse(list, total, query);
  }
}
