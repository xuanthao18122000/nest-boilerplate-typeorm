import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import FilterBuilder from 'src/submodules/common/builder/filter.builder';
import UpdateBuilder from 'src/submodules/common/builder/update.builder';
import { ErrorHttpException } from 'src/submodules/common/exceptions/throw.exception';
import { listResponse } from 'src/submodules/common/response/response-list.response';
import { getPreviousMonthAndYear } from 'src/submodules/common/utils';
import { Area, ORP, ROU, Staff, User } from 'src/submodules/database/entities';
import { Repository } from 'typeorm';
import {
  CreateOtherCustomerDto,
  ListOtherCustomerDto,
  StatisticsOCsDto,
  UpdateOtherCustomerDto,
} from './dto/other-customer.dto';

@Injectable()
export class OtherCustomerService {
  constructor(
    @InjectRepository(ORP)
    private orpRepo: Repository<ORP>,

    @InjectRepository(Staff)
    private staffRepo: Repository<Staff>,

    @InjectRepository(ROU)
    private rouRepo: Repository<ROU>,

    @InjectRepository(Area)
    private areaRepo: Repository<Area>,
  ) {}

  async statistics({
    month = moment().month() + 1,
    year = moment().year(),
    provinceId,
    districtId,
  }: StatisticsOCsDto) {
    const { previousMonth, previousYear } = getPreviousMonthAndYear(
      month,
      year,
    );

    const [OD, previousOD, RTL, previousRTL, PC, previousPC, OC, previousOC] =
      await Promise.all([
        this.getORPByMonthYear(
          ORP.TYPE.OFFICIAL_DISTRIBUTOR,
          month,
          year,
          provinceId,
          districtId,
        ),
        this.getORPByMonthYear(
          ORP.TYPE.OFFICIAL_DISTRIBUTOR,
          previousMonth,
          previousYear,
          provinceId,
          districtId,
        ),
        this.getORPByMonthYear(
          ORP.TYPE.RETAILER,
          month,
          year,
          provinceId,
          districtId,
        ),
        this.getORPByMonthYear(
          ORP.TYPE.RETAILER,
          previousMonth,
          previousYear,
          provinceId,
          districtId,
        ),
        this.getORPByMonthYear(
          ORP.TYPE.POTENTIAL_CUSTOMER,
          month,
          year,
          provinceId,
          districtId,
        ),
        this.getORPByMonthYear(
          ORP.TYPE.POTENTIAL_CUSTOMER,
          previousMonth,
          previousYear,
          provinceId,
          districtId,
        ),
        this.getORPByMonthYear(
          ORP.TYPE.OTHER_CUSTOMER,
          month,
          year,
          provinceId,
          districtId,
        ),
        this.getORPByMonthYear(
          ORP.TYPE.OTHER_CUSTOMER,
          previousMonth,
          previousYear,
          provinceId,
          districtId,
        ),
      ]);

    const OD_growth =
      previousOD === 0 ? 0 : ((OD - previousOD) / previousOD) * 100;
    const RTL_growth =
      previousRTL === 0 ? 0 : ((RTL - previousRTL) / previousRTL) * 100;
    const PC_growth =
      previousPC === 0 ? 0 : ((PC - previousPC) / previousPC) * 100;
    const OC_growth =
      previousOC === 0 ? 0 : ((OC - previousOC) / previousOC) * 100;

    return [
      {
        name: 'OD',
        total: OD,
        growth: OD_growth,
      },
      {
        name: 'RTL',
        total: RTL,
        growth: RTL_growth,
      },
      {
        name: 'Potential Customer',
        total: PC,
        growth: PC_growth,
      },
      {
        name: 'Other Customer',
        total: OC,
        growth: OC_growth,
      },
    ];
  }

  async getORPByMonthYear(
    type: number,
    month: number,
    year: number,
    provinceId?: number,
    districtId?: number,
  ) {
    const queryBuilder = this.orpRepo
      .createQueryBuilder('orp')
      .where('orp.type = :type', { type })
      .andWhere('EXTRACT(MONTH FROM orp.createdAt) = :month', { month })
      .andWhere('EXTRACT(YEAR FROM orp.createdAt) = :year', { year });

    if (provinceId) {
      queryBuilder.andWhere('orp.provinceId = :provinceId', { provinceId });
    }
    if (districtId) {
      queryBuilder.andWhere('orp.districtId = :districtId', { districtId });
    }

    return queryBuilder.getCount();
  }

  async create(body: CreateOtherCustomerDto, creator: User) {
    const { areaId, rouId, provinceId, managerId } = body;
    await Promise.all([
      this.checkAreaExistence(areaId),
      this.checkROUExistence(rouId),
      this.checkStaffExistence(managerId),
      this.checkProvinceExistence(provinceId),
    ]);

    const newOC = this.orpRepo.create({
      ...body,
      type: ORP.TYPE.OTHER_CUSTOMER,
      creatorId: creator.id,
    });

    return await this.orpRepo.save(newOC);
  }

  async getAll(query: ListOtherCustomerDto) {
    const entity = {
      entityRepo: this.orpRepo,
      alias: 'otherCustomer',
    };

    const otherCustomers = new FilterBuilder(entity, query)
      .select([
        'id',
        'name',
        'email',
        'image',
        'phoneNumber',
        'category',
        'priority',
        'rouId',
        'provinceId',
        'areaId',
        'districtId',
        'wardId',
        'address',
        'workingUnit',
        'createdAt',
        'updatedAt',
      ])
      .addLeftJoinAndSelect(['id', 'fullName', 'phoneNumber'], 'creator')
      .addLeftJoinAndSelect(['id', 'fullName', 'phoneNumber'], 'manager')
      .addLeftJoinAndSelect(['id', 'name'], 'rou')
      .addLeftJoinAndSelect(['id', 'name'], 'province')
      .addLeftJoinAndSelect(['id', 'name'], 'area')
      .addLeftJoinAndSelect(['id', 'name'], 'district')
      .addNumber('type', ORP.TYPE.OTHER_CUSTOMER)
      .addNumber('id')
      .addUnAccentString('name')
      .addUnAccentString('longName')
      .addNumber('rouId')
      .addNumber('areaId')
      .addNumber('districtId')
      .addUnAccentString('address')
      .addUnAccentString('workingUnit')
      .addString('phoneNumber')
      .addNumber('category')
      .addNumber('priority')
      .addNumber('status')
      .addString('email')
      .addDate('createdAt', 'createdDateFrom', 'createdDateTo')
      .addPagination()
      .sortBy('id');

    const [list, total] = await otherCustomers.getManyAndCount();
    return listResponse(list, total, query);
  }

  async update(id: number, body: UpdateOtherCustomerDto) {
    const otherCustomer = await this.findOCByPk(id);

    const dataUpdate = new UpdateBuilder(otherCustomer, body)
      .updateColumns([
        'name',
        'longName',
        'email',
        'phoneNumber',
        'workingUnit',
        'size',
        'category',
        'priority',
        'managerId',
        'image',
        'images',
        'provinceId',
        'districtId',
        'wardId',
        'areaId',
        'address',
        'lat',
        'lng',
        'contactInformation',
      ])
      .getNewData();

    return await this.orpRepo.save(dataUpdate);
  }

  async findOCByPk(id: number) {
    const otherCustomer = await this.orpRepo.findOneBy({
      id,
      type: ORP.TYPE.OTHER_CUSTOMER,
    });

    if (!otherCustomer) {
      throw ErrorHttpException(
        HttpStatus.NOT_FOUND,
        'OTHER_CUSTOMER_NOT_FOUND',
      );
    }

    return otherCustomer;
  }

  async checkAreaExistence(id: number): Promise<void> {
    const area = await this.areaRepo.findOneBy({ id });

    if (!area) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'AREA_NOT_FOUND');
    }
  }

  async checkROUExistence(id: number): Promise<void> {
    const rou = await this.rouRepo.findOneBy({ id });

    if (!rou) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'ROU_NOT_FOUND');
    }
  }

  async checkStaffExistence(id: number): Promise<void> {
    const staff = await this.staffRepo.findOneBy({ id });

    if (!staff) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'STAFF_NOT_FOUND');
    }
  }

  private async checkProvinceExistence(id: number): Promise<void> {
    console.log(id);
  }
}
