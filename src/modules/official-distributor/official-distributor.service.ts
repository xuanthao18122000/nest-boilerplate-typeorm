import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import FilterBuilder from 'src/submodules/common/builder/filter.builder';
import UpdateBuilder from 'src/submodules/common/builder/update.builder';
import { ErrorHttpException } from 'src/submodules/common/exceptions/throw.exception';
import { listResponse } from 'src/submodules/common/response/response-list.response';
import { getMonthYearLabel } from 'src/submodules/common/utils';
import { ORP, ROU, User } from 'src/submodules/database/entities';
import { Repository } from 'typeorm';
import {
  ContributionODDto,
  CreateODDto,
  ListODDto,
  RegionODDto,
  UpdateODDto,
} from './dto/official-distributor.dto';

export interface MonthResult {
  name: string;
  [key: string]: number | string;
}

@Injectable()
export class ODService {
  constructor(
    @InjectRepository(ORP)
    private orpRepo: Repository<ORP>,

    @InjectRepository(ROU)
    private rouRepo: Repository<ROU>,
  ) {}

  async create(body: CreateODDto, creator: User) {
    const newOD = this.orpRepo.create({
      ...body,
      type: ORP.TYPE.OFFICIAL_DISTRIBUTOR,
      creatorId: creator.id,
    });

    const OD = await this.orpRepo.save(newOD);
    return OD;
  }

  async getAll(query: ListODDto) {
    const entity = {
      entityRepo: this.orpRepo,
      alias: 'od',
    };

    const ODs = new FilterBuilder(entity, query)
      .addLeftJoinAndSelect(['id', 'fullName', 'phoneNumber'], 'creator')
      .addLeftJoinAndSelect(['id', 'fullName', 'phoneNumber'], 'manager')
      .addLeftJoinAndSelect(['id', 'name'], 'rou')
      .addNumber('type', ORP.TYPE.OFFICIAL_DISTRIBUTOR)
      .addUnAccentString('name')
      .addUnAccentString('longName')
      .addString('phoneNumber')
      .addNumber('provinceId')
      .addNumber('managerId')
      .addNumber('odType')
      .addNumber('areaId')
      .addNumber('rouId')
      .addNumber('status')
      .addNumber('size')
      .addNumber('id')
      .addDate('createdAt', 'createdDateFrom', 'createdDateTo')
      .addPagination()
      .sortBy('id');

    const [list, total] = await ODs.getManyAndCount();
    return listResponse(list, total, query);
  }

  async contributionStatistics(query: ContributionODDto) {
    const { rouId, provinceId, month, year } = query;
    const [ficoStats, competitorsStats] = await Promise.all([
      this.fetchODStatistics(
        ORP.OD_TYPE.FICO_YTL,
        rouId,
        provinceId,
        month,
        year,
      ),
      this.fetchODStatistics(
        ORP.OD_TYPE.COMPETITORS,
        rouId,
        provinceId,
        month,
        year,
      ),
    ]);

    const total = ficoStats.total + competitorsStats.total;

    const list = [
      this.createODStats('Fico-YTL ODs', ficoStats.total, total),
      this.createODStats('Competitors ODs', competitorsStats.total, total),
    ];

    return listResponse(list, list.length, { getFull: true });
  }

  private async fetchODStatistics(
    odType: number,
    rouId?: number,
    provinceId?: number,
    month?: number,
    year?: number,
  ) {
    const filterBuilder = this.orpRepo
      .createQueryBuilder('orp')
      .where('orp.type = :type', { type: ORP.TYPE.OFFICIAL_DISTRIBUTOR })
      .andWhere('orp.odType = :odType', { odType });

    if (month && year) {
      filterBuilder
        .andWhere('EXTRACT(MONTH FROM orp.createdAt) = :month', {
          month,
        })
        .andWhere('EXTRACT(YEAR FROM orp.createdAt) = :year', {
          year,
        });
    }
    if (rouId) {
      filterBuilder.andWhere('orp.rouId = :rouId', { rouId });
    }
    if (provinceId) {
      filterBuilder.andWhere('orp.provinceId = :provinceId', { provinceId });
    }

    const [ods, total] = await filterBuilder.getManyAndCount();
    return { ods, total };
  }

  private createODStats(name: string, quantity: number, total: number) {
    return {
      name,
      quantity,
      percent: Math.round((quantity / total) * 100) | 0,
    };
  }

  async regionStatistics(query: RegionODDto) {
    const { rouId, provinceId, year = moment().year() } = query;
    const ROUs = await this.rouRepo
      .createQueryBuilder('rou')
      .where('rou.status = :status', { status: ROU.STATUS.ACTIVE })
      .getMany();

    if (provinceId) {
    }

    const result: MonthResult[] = [];

    for (let i = 1; i < 13; i++) {
      const monthYearLabel = getMonthYearLabel(i, year);

      const monthResult: MonthResult = { name: monthYearLabel };

      for (const rou of ROUs) {
        if (!rouId || rou.id === rouId) {
          const countOds = await this.getCountOdsForMonth(i, year, rou.id);

          monthResult[rou.name] = countOds;
        }
      }

      result.push(monthResult);
    }

    return result;
  }

  private async getCountOdsForMonth(
    month: number,
    year: number,
    rouId: number,
  ) {
    return this.orpRepo
      .createQueryBuilder('orp')
      .where('orp.type = :type', { type: ORP.TYPE.OFFICIAL_DISTRIBUTOR })
      .andWhere('orp.rouId = :rouId', { rouId })
      .andWhere('EXTRACT(MONTH FROM orp.createdAt) = :month', { month })
      .andWhere('EXTRACT(YEAR FROM orp.createdAt) = :year', { year })
      .getCount();
  }

  async getOne(id: number) {
    const OD = await this.findODByPk(id);
    return OD;
  }

  async update(id: number, body: UpdateODDto) {
    const OD = await this.findODByPk(id);

    const dataUpdate = new UpdateBuilder(OD, body)
      .updateColumns([
        'name',
        'longName',
        'image',
        'images',
        'lat',
        'lng',
        'status',
        'address',
        'contactKey',
        'phoneNumber',
        'presenter',
        'size',
        'provinceId',
        'areaId',
        'districtId',
        'wardId',
        'managerId',
        'rouId',
        'odType',
        'contactInformation',
      ])
      .getNewData();

    return await this.orpRepo.save(dataUpdate);
  }

  async findODByPk(id: number) {
    const OD = await this.orpRepo.findOneBy({
      id,
      type: ORP.TYPE.OFFICIAL_DISTRIBUTOR,
    });

    if (!OD) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'OD_NOT_FOUND');
    }

    return OD;
  }
}
