import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import FilterBuilder from 'src/submodules/common/builder/filter.builder';
import { listResponse } from 'src/submodules/common/response/response-list.response';
import { getCurrentDateParts } from 'src/submodules/common/utils';
import { Staff, VisitingHistory } from 'src/submodules/database/entities';
import { Repository } from 'typeorm';
import { ListLocationLookupDto } from './dto/location-lookup.dto';

@Injectable()
export class LocationLookupService {
  constructor(
    @InjectRepository(VisitingHistory)
    private visitingHistoryRepo: Repository<VisitingHistory>,

    @InjectRepository(Staff)
    private staffRepo: Repository<Staff>,
  ) {}

  async getAll(query: ListLocationLookupDto) {
    const { day, month, year } = getCurrentDateParts();

    const entity = {
      entityRepo: this.visitingHistoryRepo,
      alias: 'visitingHistory',
    };
    const whereFilterDate =
      'EXTRACT(MONTH FROM visitingHistory.checkInTime) = :month AND EXTRACT(YEAR FROM visitingHistory.checkInTime) = :year AND EXTRACT(DAY FROM visitingHistory.checkInTime) = :day';

    const whereFilterDateRelation =
      'EXTRACT(MONTH FROM visitingHistories.checkInTime) = :month AND EXTRACT(YEAR FROM visitingHistories.checkInTime) = :year AND EXTRACT(DAY FROM visitingHistories.checkInTime) = :day';

    const locationLookups = new FilterBuilder(entity, query)
      .addLeftJoinAndSelect(['id', 'name'], 'orp')
      .addLeftJoinAndSelect(['id', 'fullName', 'avatar', 'areaId'], 'staff')
      .addLeftJoinAndSelect(['id', 'name'], 'area', 'staff')
      .addLeftJoinAndSelect(
        ['id', 'isCheckedIn', 'isCheckedOut', 'checkOutTime'],
        'visitingHistories',
        'staff',
      )
      .addUnAccentStringForJoinedTable('staff', 'fullName', 'staffName')
      .addUnAccentStringForJoinedTable('orp', 'name', 'orpName')
      .addNumber('areaId', undefined, 'staff')
      .addNumber('staffId')
      .andWhere('isCheckedIn', true)
      .andWhere('isCheckedOut', false)
      .andFullWhere(whereFilterDate, { month, year, day })
      .andFullWhere(whereFilterDateRelation, { month, year, day })
      .addPagination()
      .sortBy('checkInTime');

    const [list, total] = await locationLookups.getManyAndCount();

    const listWithVisitPlan = this.createVisitPlanData(list);
    return listResponse(listWithVisitPlan, total, query);
  }

  async getOne(staffId: number) {
    const { day, month, year } = getCurrentDateParts();

    const entity = {
      entityRepo: this.visitingHistoryRepo,
      alias: 'visitingHistory',
    };

    const whereFilterDate =
      'EXTRACT(MONTH FROM visitingHistory.checkInTime) = :month AND EXTRACT(YEAR FROM visitingHistory.checkInTime) = :year AND EXTRACT(DAY FROM visitingHistory.checkInTime) = :day';

    const locationLookups = new FilterBuilder(entity)
      .addLeftJoinAndSelect(['id', 'name', 'type'], 'orp')
      .addLeftJoinAndSelect(['id', 'fullName', 'avatar', 'areaId'], 'staff')
      .addLeftJoinAndSelect(['id', 'name'], 'area', 'staff')
      .addNumber('staffId', staffId)
      .andFullWhere(whereFilterDate, { month, year, day })
      .addPagination()
      .sortBy('checkInTime');

    const [list, total] = await locationLookups.getManyAndCount();

    const listWithLatestVisit = [];

    for (const item of list) {
      const latestVisit = await this.visitingHistoryRepo.findOneBy({
        staffId,
        orpId: item.orpId,
        isCheckedOut: true,
      });

      listWithLatestVisit.push({
        ...item,
        latestVisit: latestVisit?.checkOutTime || null,
      });
    }

    return listResponse(listWithLatestVisit, total, { getFull: true });
  }

  createVisitPlanData(list: VisitingHistory[]) {
    return _.map(list, (item) => ({
      ...item,
      visitPlan: this.calculateVisitPlan(item.staff.visitingHistories),
    }));
  }

  calculateVisitPlan(visitingHistories: VisitingHistory[]): string {
    const checkedOutCount = _.filter(visitingHistories, 'isCheckedOut').length;
    const totalCount = visitingHistories.length;
    return `${checkedOutCount}/${totalCount}`;
  }
}
