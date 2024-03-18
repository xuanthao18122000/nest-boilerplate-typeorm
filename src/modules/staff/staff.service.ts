import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions } from 'src/submodules/common/builder';
import FilterBuilder from 'src/submodules/common/builder/filter.builder';
import UpdateBuilder from 'src/submodules/common/builder/update.builder';
import { ErrorHttpException } from 'src/submodules/common/exceptions/throw.exception';
import { listResponse } from 'src/submodules/common/response/response-list.response';
import { getCurrentDate } from 'src/submodules/common/utils';
import {
  ActivityLogDetail,
  Area,
  Position,
  ROU,
  Staff,
  StaffActivity,
  User,
} from 'src/submodules/database/entities';
import { Repository } from 'typeorm';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { LocationService } from '../location/location.service';
import { CreateStaffDto, ListStaffDto, UpdateStaffDto } from './dto/staff.dto';
@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepo: Repository<Staff>,

    @InjectRepository(Position)
    private positionRepo: Repository<Position>,

    @InjectRepository(Area)
    private areaRepo: Repository<Area>,

    @InjectRepository(ROU)
    private rouRepo: Repository<ROU>,

    @InjectRepository(StaffActivity)
    private staffActivityRepo: Repository<StaffActivity>,

    private readonly locationService: LocationService,

    private readonly activityLogService: ActivityLogService,
  ) {}

  async getAll(query: ListStaffDto) {
    if (typeof query.provinceIds === 'string') {
      query.provinceIds = [query.provinceIds];
    }

    const { isSalesHead = false } = query;
    const select = [
      'staff.id',
      'staff.email',
      'staff.fullName',
      'staff.phoneNumber',
      'staff.address',
      'staff.avatar',
      'staff.status',
      'staff.rouId',
      'staff.areaId',
      'staff.volumeArchived',
      'staff.aseId',
      'staff.salesHeadId',
      'staff.positionId',
      'staff.provinceIds',
      'staff.createdAt',
      'staff.updatedAt',
      'rou.id',
      'rou.name',
      'area.id',
      'area.name',
      'position.id',
      'position.name',
      'position.type',
      'salesHead.id',
      'salesHead.fullName',
      'creator.id',
      'creator.fullName',
    ];

    const entity = {
      entityRepo: this.staffRepo,
      alias: 'staff',
    };

    const filterBuilder = new FilterBuilder(entity, query)
      .addLeftJoin('creator')
      .addLeftJoin('rou')
      .addLeftJoin('area')
      .addLeftJoin('position')
      .addLeftJoin('salesHead')
      .addUnAccentString('fullName')
      .addNumber('id')
      .addNumber('status')
      .addNumber('rouId')
      .addNumber('volumeArchived')
      .addNumber('aseId')
      .addNumber('areaId')
      .addNumber('positionId')
      .addNumber('salesHeadId')
      .addWhereInArray('provinceIds', 'provinceId')
      .addWhereArrayInArrayConditionOR('provinceIds', 'provinceIds')
      .addDate('createdAt', 'createdDateFrom', 'createdDateTo')
      .addPagination()
      .sortBy('id');

    if (isSalesHead) {
      const salesHead = await this.findSalesHeadPosition();
      filterBuilder.addNumber('positionId', salesHead.id);
    }

    const [list, total] = await filterBuilder.queryBuilder
      .select(select)
      .getManyAndCount();

    const listWithProvinces = [];

    for (const item of list) {
      const provinces = await this.locationService.getProvincesByIds(
        item.provinceIds,
      );

      listWithProvinces.push({
        ...item,
        provinces,
      });
    }

    return listResponse(listWithProvinces, total, query);
  }

  async getOne(id: number): Promise<Partial<Staff>> {
    const staff = await this.findStaffByPkRelation(id);
    return staff.serialize();
  }

  async create(body: CreateStaffDto, creator: User): Promise<Partial<Staff>> {
    const { email, areaId, salesHeadId, positionId, provinceIds, rouId } = body;

    const result = await Promise.all([
      this.checkEmailNoneExistence(email),
      this.checkAreaExistence(areaId),
      this.checkROUExistence(rouId),
      this.locationService.getProvincesByIds(provinceIds),
      this.findPositionByPk(positionId),
    ]);

    if (result[4].type === Position.TYPE.SALES && !salesHeadId) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'SALE_HEAD_NOT_FOUND');
    }

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
    const { positionId, salesHeadId, provinceIds, areaId, rouId, status } =
      body;

    const staff = await this.staffRepo.findOneBy({ id });

    const activityDetails =
      await this.activityLogService.createActivityLogDetail(
        'API_STAFF_UPDATE',
        staff,
        body,
        updater.id,
        ActivityLogDetail.MODULE.STAFF,
      );

    if (staff.status === Staff.STATUS.LOCKED) {
      throw ErrorHttpException(HttpStatus.FORBIDDEN, 'STAFF_LOCKED');
    }

    if (positionId) {
      const position = await this.findPositionByPk(positionId);

      if (position.type === Position.TYPE.SALES) {
        staff.salesHeadId = salesHeadId;
      }
    }

    if (areaId) {
      await this.checkAreaExistence(areaId);
    }

    if (rouId) {
      await this.checkROUExistence(rouId);
    }

    if (provinceIds) {
      await this.locationService.getProvincesByIds(provinceIds);
    }

    if (status) {
      staff.changeStatusAt = new Date();
    }

    const dataUpdate = new UpdateBuilder(staff, body)
      .updateColumns([
        'positionId',
        'provinceIds',
        'areaId',
        'rouId',
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

  async findPositionByPk(id: number): Promise<Position> {
    const position = await this.positionRepo.findOneBy({ id });

    if (!position) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'POSITION_NOT_FOUND');
    }

    return position;
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
