import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import * as moment from 'moment';
import FilterBuilder from 'src/submodules/common/builder/filter.builder';
import { PaginationOptions } from 'src/submodules/common/builder/pagination-options.builder';
import UpdateBuilder from 'src/submodules/common/builder/update.builder';
import { ErrorHttpException } from 'src/submodules/common/exceptions/throw.exception';
import { IListResponse } from 'src/submodules/common/interfaces';
import { listResponse } from 'src/submodules/common/response/response-list.response';
import {
  ActivityLogDetail,
  ROU,
  Role,
  User,
  UserAction,
} from 'src/submodules/database/entities';
import { Repository } from 'typeorm';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { LocationService } from '../location/location.service';
import { RbacModuleService } from '../rbac-module/rbac-module.service';
import {
  CreateUserDto,
  ListUserDto,
  TopActivityDto,
  UpdateUserDto,
} from './dto/user.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,

    @InjectRepository(UserAction)
    private readonly userActionRepo: Repository<UserAction>,

    @InjectRepository(ROU)
    private readonly rouRepo: Repository<ROU>,

    private readonly locationService: LocationService,

    private readonly rbacModuleService: RbacModuleService,

    private readonly activityLogService: ActivityLogService,
  ) {}

  async getAll(query: ListUserDto): Promise<IListResponse<User>> {
    const entity = {
      entityRepo: this.userRepo,
      alias: 'user',
    };

    const filterBuilder = new FilterBuilder(entity, query)
      .select([
        'id',
        'email',
        'fullName',
        'phoneNumber',
        'avatar',
        'status',
        'createdAt',
        'updatedAt',
      ])
      .addLeftJoinAndSelect(['id', 'name'], 'role')
      .addUnAccentString('fullName')
      .addString('phoneNumber')
      .addString('email')
      .addNumber('id')
      .addNumber('status')
      .addNumber('userId')
      .addDate('createdAt', 'createdDateFrom', 'createdDateTo')
      .addPagination()
      .sortBy('id');

    const [list, total] = await filterBuilder.getManyAndCount();
    return listResponse(list, total, query);
  }

  async getUserActivities({ number }: TopActivityDto) {
    const query: PaginationOptions = { perPage: number, getFull: true };
    const currentMonth = moment().month() + 1;

    const users = await this.userRepo
      .createQueryBuilder('user')
      .select('user.id', 'id')
      .addSelect('user.fullName', 'fullName')
      .addSelect('role.name', 'role')
      .addSelect('COUNT(activityLog.id) as activities')
      .leftJoin('user.role', 'role')
      .leftJoin('user.activityLogs', 'activityLog')
      .where('EXTRACT(MONTH FROM activityLog.createdAt) = :currentMonth', {
        currentMonth,
      })
      .groupBy('user.id')
      .addGroupBy('role.id')
      .orderBy('activities', 'DESC')
      .limit(query.perPage)
      .getRawMany();

    return listResponse(users, users.length, query);
  }

  async getUserRoles() {
    const rolesWithUserCount = await this.roleRepo
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.users', 'user')
      .select('role.name', 'roleName')
      .addSelect('COUNT(user.id)', 'userCount')
      .groupBy('role.id')
      .getRawMany();

    const totalUsers = rolesWithUserCount.reduce(
      (total, { userCount }) => total + parseInt(userCount),
      0,
    );

    const userStats = rolesWithUserCount.map(({ roleName, userCount }) => ({
      role: roleName,
      quantity: parseInt(userCount),
      percent: Math.round((parseInt(userCount) / totalUsers) * 100),
    }));

    const query = { getFull: true };
    return listResponse(userStats, userStats.length, query);
  }

  async getOne(id: number) {
    const user = await this.findUserByPk(id);
    const permissions = _.map(user.actions, 'action');

    return { ...user.serialize(), permissions };
  }

  async create(body: CreateUserDto, creator: User): Promise<User> {
    const { email, provinceId, roleId, rouId, permissions } = body;

    await Promise.all([
      this.checkEmailNoneExistence(email),
      this.checkRoleExistence(roleId),
      this.checkROUExistence(rouId),
      this.checkProvinceExistence(provinceId),
      this.rbacModuleService.checkPermissionExisted(permissions),
    ]);

    const user = this.userRepo.create({ ...body, creatorId: creator.id });
    const newUser = await this.userRepo.save(user);

    if (permissions.length !== 0) {
      await this.insertUserAction(newUser.id, permissions);
    }

    return newUser;
  }

  async update(
    id: number,
    { permissions, ...body }: UpdateUserDto,
    updater: User,
  ) {
    const { status, roleId } = body;

    const user = await this.findUserByPk(id);
    const activityDetails =
      await this.activityLogService.createActivityLogDetail(
        'API_USER_UPDATE',
        user,
        body,
        updater.id,
        ActivityLogDetail.MODULE.USER,
      );

    if (user.status === User.STATUS.LOCKED) {
      throw ErrorHttpException(HttpStatus.FORBIDDEN, 'USER_LOCKED');
    }

    const dataUpdate = new UpdateBuilder(user, body)
      .updateColumns([
        'fullName',
        'phoneNumber',
        'roleId',
        'rouId',
        'provinceId',
        'status',
        'address',
        'avatar',
      ])
      .getNewData();

    if (status || roleId) {
      dataUpdate.token = null;
    }

    await this.userRepo.save(dataUpdate);

    if (permissions) {
      await this.userActionRepo.delete({ userId: user.id });
      await this.insertUserAction(user.id, permissions);
    }

    await this.activityLogService.saveActivityLogDetail(activityDetails);
    const updatedUser = await this.findUserByPk(id);

    return {
      ...updatedUser.serialize(),
      permissions: _.map(updatedUser.actions, 'action'),
    };
  }

  async findUserByPk(id: number): Promise<User> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.actions', 'actions')
      .where('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'USER_NOT_FOUND');
    }

    return user;
  }

  async checkEmailNoneExistence(email: string): Promise<void> {
    const isExistUser = await this.userRepo.findOneBy({
      email,
    });

    if (isExistUser) {
      throw ErrorHttpException(HttpStatus.CONFLICT, 'USER_EXISTED');
    }
  }

  async checkRoleExistence(id: number): Promise<void> {
    const role = await this.roleRepo.findOneBy({ id });

    if (!role) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'ROLE_NOT_FOUND');
    }
  }

  async checkROUExistence(id: number): Promise<void> {
    const rou = await this.rouRepo.findOneBy({ id });

    if (!rou) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'ROU_NOT_FOUND');
    }
  }

  async checkProvinceExistence(id: number): Promise<void> {
    await this.locationService.getProvince(id);
  }

  async insertUserAction(userId: number, permissions: string[]): Promise<void> {
    const userActions: UserAction[] = [];

    for (const action of permissions) {
      userActions.push(
        this.userActionRepo.create({
          userId,
          action,
        }),
      );
    }

    await this.userActionRepo.save(userActions);
  }
}
