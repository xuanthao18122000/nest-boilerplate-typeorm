import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import FilterBuilder from 'src/submodules/common/builder/filter.builder';
import UpdateBuilder from 'src/submodules/common/builder/update.builder';
import { ErrorHttpException } from 'src/submodules/common/exceptions/throw.exception';
import { listResponse } from 'src/submodules/common/response/response-list.response';
import { VisitingHistory } from 'src/submodules/database/entities';
import { Repository } from 'typeorm';
import {
  ListVisitingHistoryDto,
  UpdateVisitingHistoryDto,
} from './dto/visiting-history.dto';

@Injectable()
export class VisitingHistoryService {
  constructor(
    @InjectRepository(VisitingHistory)
    private visitingHistoryRepo: Repository<VisitingHistory>,
  ) {}

  async getAll(query: ListVisitingHistoryDto) {
    const entity = {
      entityRepo: this.visitingHistoryRepo,
      alias: 'visitingHistory',
    };

    const visitingHistories = new FilterBuilder(entity, query)
      .addLeftJoinAndSelect(['id', 'fullName'], 'staff')
      .addLeftJoinAndSelect(['id', 'name'], 'orp')
      .addUnAccentStringForJoinedTable('staff', 'fullName', 'staffName')
      .addUnAccentStringForJoinedTable('orp', 'name', 'orpName')
      .addNumber('staffId')
      .addNumber('status')
      .addDate('createdAt', 'createdDateFrom', 'createdDateTo')
      .addPagination()
      .sortBy('id');

    const [list, total] = await visitingHistories.getManyAndCount();
    return listResponse(list, total, query);
  }

  async getVisitingStatus() {
    const { NOT_STARTED, PROCESSING, COMPLETED, REJECTED } =
      VisitingHistory.STATUS;

    const [total, notStarted, processing, complete, failed] = await Promise.all(
      [
        this.visitingHistoryRepo.count(),
        this.getCountByStatus(NOT_STARTED),
        this.getCountByStatus(PROCESSING),
        this.getCountByStatus(COMPLETED),
        this.getCountByStatus(REJECTED),
      ],
    );

    return { total, notStarted, processing, complete, failed };
  }

  async getCountByStatus(status: number): Promise<number> {
    return this.visitingHistoryRepo.count({
      where: { status },
    });
  }

  async getOne(id: number) {
    const visitingHistory = await this.findVisitingHistoryByPk(id);
    return visitingHistory;
  }

  async update(id: number, body: UpdateVisitingHistoryDto) {
    const visitingHistory = await this.findVisitingHistoryByPk(id);

    const dataUpdate = new UpdateBuilder(visitingHistory, body)
      .updateColumns(['status', 'reasonCancel'])
      .getNewData();

    const updatedVH = await this.visitingHistoryRepo.save(dataUpdate);
    return updatedVH.serialize();
  }

  async findVisitingHistoryByPk(id: number) {
    const visitingHistory = await this.visitingHistoryRepo
      .createQueryBuilder('visitingHistory')
      .select([
        'visitingHistory',
        'tickets',
        'orp.id',
        'orp.name',
        'orp.address',
        'orp.lat',
        'orp.lng',
        'staff.id',
        'staff.fullName',
        'position.id',
        'position.name',
        'area.id',
        'area.name',
      ])
      .leftJoin('visitingHistory.orp', 'orp')
      .leftJoin('visitingHistory.tickets', 'tickets')
      .leftJoin('visitingHistory.staff', 'staff')
      .leftJoin('staff.position', 'position')
      .leftJoin('staff.area', 'area')
      .where('visitingHistory.id = :id', { id })
      .getOne();

    if (!visitingHistory) {
      throw ErrorHttpException(
        HttpStatus.NOT_FOUND,
        'VISITING_HISTORY_NOT_FOUND',
      );
    }

    return visitingHistory;
  }
}
