import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { PaginationOptions } from 'src/submodule/common/builder';
import FilterBuilder from 'src/submodule/common/builder/filter.builder';
import UpdateBuilder from 'src/submodule/common/builder/update.builder';
import { ErrorHttpException } from 'src/submodule/common/exceptions/throw.exception';
import { listResponse } from 'src/submodule/common/response/response-list.response';
import {
  getCurrentDate,
  getFirstAndEndDayOfMonth,
} from 'src/submodule/common/utils';
import {
  ActivityLogDetail,
  KpiVolume,
  Position,
  ProductTransaction,
  Staff,
  StaffActivity,
  User,
} from 'src/submodule/database/entities';
import { Brackets, Repository } from 'typeorm';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { AreaService } from '../area/area.service';
import { LocationService } from '../location/location.service';
import { ROUService } from '../rou/rou.service';
import {
  CreateStaffDto,
  ListStaffDto,
  StatisticsStaffDto,
  UpdateStaffDto,
} from './dto/staff.dto';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepo: Repository<Staff>,

    @InjectRepository(Position)
    private positionRepo: Repository<Position>,

    @InjectRepository(StaffActivity)
    private staffActivityRepo: Repository<StaffActivity>,

    @InjectRepository(KpiVolume)
    private kpiVolumeRepo: Repository<KpiVolume>,

    @InjectRepository(ProductTransaction)
    private productTransactionRepo: Repository<ProductTransaction>,

    private readonly areaService: AreaService,

    private readonly rouService: ROUService,

    private readonly locationService: LocationService,

    private readonly activityLogService: ActivityLogService,
  ) {}

  async getAll(query: ListStaffDto) {
    const select = [
      'staff.id',
      'staff.email',
      'staff.fullName',
      'staff.phoneNumber',
      'staff.address',
      'staff.avatar',
      'staff.status',
      'staff.rouId',
      'staff.provinceIds',
      'staff.areaIds',
      'staff.isAllProvinces',
      'staff.isAllAreas',
      'staff.volumeArchived',
      'staff.aseId',
      'staff.positionId',
      'staff.createdAt',
      'staff.updatedAt',
      'area.id',
      'area.name',
      'rou.id',
      'rou.name',
      'position.id',
      'position.name',
      'position.type',
      'creator.id',
      'creator.fullName',
      'orpManagements.id',
    ];

    const entity = {
      entityRepo: this.staffRepo,
      alias: 'staff',
    };

    const filterBuilder = new FilterBuilder(entity, query)
      .addLeftJoin('orpManagements')
      .addLeftJoin('creator')
      .addLeftJoin('area')
      .addLeftJoin('rou')
      .addLeftJoin('position')
      .addUnAccentString('fullName')
      .addUnAccentString('salesHead')
      .addNumber('id')
      .addNumber('status')
      .addNumber('volumeArchived')
      .addNumber('aseId')
      .addNumber('areaId')
      .addNumber('positionId')
      .addWhereInArray('rouIds', 'rouId')
      .addWhereInArray('provinceIds', 'provinceId')
      .addWhereInNumber('rouId', 'rouIds')
      .addWhereArrayInArray('provinceIds', 'provinceIds')
      .addDate('createdAt', 'createdDateFrom', 'createdDateTo')
      .addPagination()
      .sortBy('id');

    const [list, total] = await filterBuilder.queryBuilder
      .select(select)
      .getManyAndCount();

    return listResponse(list, total, query);
  }

  async getOne(id: number): Promise<Partial<Staff>> {
    const staff = await this.findStaffByPkRelation(id);
    return staff.serialize();
  }

  async create(body: CreateStaffDto, creator: User): Promise<Partial<Staff>> {
    const { email, areaIds, provinceIds, rouId } = body;

    await Promise.all([
      this.checkEmailNoneExistence(email),
      this.areaService.checkAreaIdsExistence(areaIds),
      this.rouService.checkRouExistence(rouId),
      this.locationService.getAndCheckProvincesByIds(provinceIds),
    ]);

    const staff = await this.createAndSaveStaff({
      ...body,
      creatorId: creator.id,
    });

    return staff.serialize();
  }

  async update(
    id: number,
    body: UpdateStaffDto,
    updater: User,
  ): Promise<Partial<Staff>> {
    const { provinceIds, areaIds, rouId, status } = body;

    const staff = await this.staffRepo.findOneBy({ id });

    const activityDetails =
      await this.activityLogService.createActivityLogDetail(
        'STAFF_UPDATE',
        staff,
        body,
        updater.id,
        ActivityLogDetail.MODULE.STAFF,
      );

    if (staff.status === Staff.STATUS.LOCKED) {
      throw ErrorHttpException(HttpStatus.FORBIDDEN, 'STAFF_LOCKED');
    }

    if (rouId) {
      await this.rouService.checkRouExistence(rouId);
    }

    if (provinceIds) {
      await this.locationService.getAndCheckProvincesByIds(provinceIds);
    }

    if (areaIds) {
      await this.areaService.checkAreaIdsExistence(areaIds);
    }

    if (status) {
      staff.token = null;
      staff.changeStatusAt = new Date();
    }

    const dataUpdate = new UpdateBuilder(staff, body)
      .updateColumns([
        'salesHead',
        'isAllProvinces',
        'isAllAreas',
        'provinceIds',
        'rouId',
        'areaIds',
        'positionId',
        'aseId',
        'status',
        'address',
        'avatar',
        'email',
        'volumeArchived',
        'fullName',
        'phoneNumber',
      ])
      .getNewData();

    const updatedStaff = await this.staffRepo.save(dataUpdate);

    await this.activityLogService.saveActivityLogDetail(activityDetails);
    return updatedStaff.serialize();
  }

  async logOutStaff(staffId: number, updater: User) {
    const staffActivity = await this.staffActivityRepo.findOne({
      where: { staffId },
      order: { id: 'DESC' },
    });

    if (!staffActivity) return;

    staffActivity.logOutType = StaffActivity.LOGOUT_TYPE.USER;
    staffActivity.logOutBy = updater.fullName;
    staffActivity.logoutTime = getCurrentDate();

    await this.staffActivityRepo.save(staffActivity);

    const staff = await this.findStaffByPkRelation(staffId);
    staff.token = null;

    const updatedStaff = await this.staffRepo.save(staff);
    return updatedStaff.serialize();
  }

  async getStatistics({ rouId, month, year }: StatisticsStaffDto) {
    const provinces = await this.locationService.getProvinceByRouId(rouId);
    const statistics = [];

    for (const province of provinces) {
      const [staffsCreateInMonthNumber, staffs] = await Promise.all([
        this.staffRepo
          .createQueryBuilder('staff')
          .andWhere('staff.status = :status', { status: Staff.STATUS.ACTIVE })
          .andWhere('EXTRACT(MONTH FROM staff.createdAt) = :month', {
            month,
          })
          .andWhere('EXTRACT(YEAR FROM staff.createdAt) = :year', {
            year,
          })
          .getCount(),
        this.staffRepo
          .createQueryBuilder('staff')
          .andWhere('staff.status = :status', { status: Staff.STATUS.ACTIVE })
          .andWhere(`:provinceId = ANY(staff.provinceIds)`, {
            provinceId: province.id,
          })
          .getMany(),
      ]);

      const staffIds = staffs.map((staff) => staff.id);

      const [targetVolume, currentVolume] = await Promise.all([
        this.getTargetVolumeStaff(staffIds, month, year),
        this.getCurrentVolumeStaff(staffIds, month, year),
      ]);

      statistics.push({
        ...province,
        staffsCreateInMonthNumber,
        targetVolume,
        currentVolume,
      });
    }

    return statistics;
  }

  async getTargetVolumeStaff(
    staffIds: number[],
    month: number,
    year: number,
  ): Promise<number> {
    const entity = {
      entityRepo: this.kpiVolumeRepo,
      alias: 'kpiVolume',
    };

    if (staffIds.length === 0) {
      return 0;
    }

    const filterBuilder = new FilterBuilder(entity, { getFull: true })
      .addLeftJoinAndSelect(['id', 'staffId'], 'orpManagement')
      .addWhereInNumber('staffId', undefined, staffIds, 'orpManagement')
      .addNumber('month', month)
      .addNumber('year', year);

    const kpiVolumes = await filterBuilder.getMany();
    return _.sumBy(kpiVolumes, (kpi: KpiVolume) => Number(kpi.targetVolume));
  }

  async getCurrentVolumeStaff(staffIds: number[], month: number, year: number) {
    const { startDate, endDate } = getFirstAndEndDayOfMonth(month, year);
    const entity = {
      entityRepo: this.productTransactionRepo,
      alias: 'productTransaction',
    };

    if (staffIds.length === 0) {
      return 0;
    }

    const filterBuilder = new FilterBuilder(entity, { getFull: true })
      .addLeftJoinAndSelect(['id', 'createdBy'], 'productManagement')
      .addWhereInNumber('createdBy', undefined, staffIds, 'productManagement')
      .addDate('createdAt', undefined, undefined, startDate, endDate);

    const productTransaction = await filterBuilder.getMany();

    return _.sumBy(productTransaction, (pt: ProductTransaction) =>
      Number(pt.volume),
    );
  }

  async countStaffsInAreaByMonth(
    areaId: number,
    provinceId: number,
    rouId: number,
    endDate: Date,
  ) {
    const entity = {
      entityRepo: this.staffRepo,
      alias: 'staff',
    };

    const filterBuilder = new FilterBuilder(entity, { getFull: true })
      .addDate('createdAt', undefined, undefined, undefined, endDate)
      .addPagination()
      .sortBy('id');

    filterBuilder.queryBuilder.andWhere(
      new Brackets((qb) => {
        qb.where(
          'staff.isAllProvinces = :isAllProvinces AND staff.rouId = :rouId',
          {
            isAllProvinces: true,
            rouId,
          },
        )
          .orWhere(
            'staff.isAllAreas = :isAllAreas AND :provinceId = ANY(staff.provinceIds)',
            {
              isAllAreas: true,
              provinceId,
            },
          )
          .orWhere(`:areaId = ANY(staff.areaIds)`, { areaId });
      }),
    );

    const total = await filterBuilder.queryBuilder.getCount();
    return total;
  }

  async getActivitiesLogin(staffId: number, query: PaginationOptions) {
    const entity = {
      entityRepo: this.staffActivityRepo,
      alias: 'staffActivity',
    };

    const filterBuilder = new FilterBuilder(entity, query)
      .addNumber('staffId', staffId)
      .addPagination()
      .sortBy('id');

    const [list, total] = await filterBuilder.getManyAndCount();
    return listResponse(list, total, query);
  }

  async findStaffByPkRelation(id: number): Promise<Staff> {
    const entity = {
      entityRepo: this.staffRepo,
      alias: 'staff',
    };

    const filterBuilder = new FilterBuilder(entity)
      .addNumber('id', id)
      .addLeftJoinAndSelect(['id', 'fullName', 'email'], 'creator');

    const staff = await filterBuilder.getOne();

    if (!staff) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'STAFF_NOT_FOUND');
    }

    return staff;
  }

  async findSalesHeadPosition(): Promise<Position> {
    const salesHead = await this.positionRepo.findOneBy({
      type: Position.TYPE.SALES_HEAD,
    });

    if (!salesHead) {
      console.log('🚀 SALES HEAD HAS NOT BEEN SET UP YET! 🚀');
      throw ErrorHttpException(HttpStatus.INTERNAL_SERVER_ERROR, 'BACKEND');
    }

    return salesHead;
  }

  async getStaffActive(email: string): Promise<void> {
    const isExistStaff = await this.staffRepo.findOneBy({
      email,
    });

    if (isExistStaff) {
      throw ErrorHttpException(HttpStatus.CONFLICT, 'STAFF_EXISTED');
    }
  }

  private async checkEmailNoneExistence(email: string): Promise<void> {
    const isExistStaff = await this.staffRepo.findOneBy({
      email,
    });

    if (isExistStaff) {
      throw ErrorHttpException(HttpStatus.CONFLICT, 'STAFF_EXISTED');
    }
  }

  private async createAndSaveStaff(data: Partial<Staff>) {
    const staff = this.staffRepo.create(data);
    return await this.staffRepo.save(staff);
  }
}
