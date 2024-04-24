import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import FilterBuilder from 'src/submodule/common/builder/filter.builder';
import { SORT_ENUM } from 'src/submodule/common/enums';
import { ErrorHttpException } from 'src/submodule/common/exceptions/throw.exception';
import { listResponse } from 'src/submodule/common/response/response-list.response';
import {
  RbacAction,
  RbacModule,
  RoleAction,
} from 'src/submodule/database/entities';
import { In, Repository } from 'typeorm';
import {
  CreateMultipleRbacModules,
  CreateRbacActions,
  CreateRbacModules,
  ListRbacModulesDto,
} from './dto/rbac-module.dto';

@Injectable()
export class RbacModuleService {
  constructor(
    @InjectRepository(RbacModule)
    private readonly rbacModuleRepo: Repository<RbacModule>,

    @InjectRepository(RbacAction)
    private readonly rbacActionRepo: Repository<RbacAction>,

    @InjectRepository(RoleAction)
    private readonly roleActionRepo: Repository<RoleAction>,
  ) {}

  async getAll(query: ListRbacModulesDto) {
    const { roleId } = query;
    const entity = {
      entityRepo: this.rbacModuleRepo,
      alias: 'module',
    };

    const filterBuilder = new FilterBuilder(entity, query)
      .addLeftJoinAndSelect(['id', 'key', 'name'], 'actions')
      .addNumber('status')
      .addPagination()
      .sortBy('id', SORT_ENUM.ASC);

    if (roleId) {
      const keys = await this.getKeysFromRoleAction(roleId);
      filterBuilder.addWhereInString('key', 'roleId', keys, 'actions');
    }

    const [list, total] = await filterBuilder.getManyAndCount();
    return listResponse(list, total, query);
  }

  async create(body: CreateRbacModules): Promise<RbacModule> {
    const { key } = body;
    const modules = await this.rbacModuleRepo.findOneBy({ key });
    if (modules) {
      throw ErrorHttpException(HttpStatus.CONFLICT, 'RBAC_MODULE_EXISTED');
    }
    return await this.rbacModuleRepo.save(body);
  }

  async createMultiple({
    modules,
  }: CreateMultipleRbacModules): Promise<RbacModule[]> {
    const listKey = modules.map((item) => item.key);

    const rbacModules = await this.rbacModuleRepo.find({
      where: { key: In(listKey) },
    });

    if (rbacModules.length > 0) {
      throw ErrorHttpException(HttpStatus.CONFLICT, 'RBAC_MODULE_EXISTED');
    }

    return await this.rbacModuleRepo.save(modules);
  }

  async createRbacAction(body: CreateRbacActions) {
    const { key, name, moduleId } = body;
    const actions = await this.rbacActionRepo.findOneBy({ key });
    if (actions) {
      throw ErrorHttpException(HttpStatus.CONFLICT, 'RBAC_ACTION_EXISTED');
    }
    const rbac = this.rbacActionRepo.create({
      key,
      name,
      moduleId,
    });
    return await this.rbacActionRepo.save(rbac);
  }

  async createRbacActionMulti(body: CreateRbacActions[]) {
    const listKey = [];
    for (const item of body) {
      listKey.push(item.key);
    }

    const actions = await this.rbacActionRepo.find({
      where: { key: In(listKey) },
    });

    if (actions.length > 0) {
      throw ErrorHttpException(HttpStatus.CONFLICT, 'RBAC_ACTION_EXISTED');
    }
    return await this.rbacActionRepo.save(body);
  }

  async checkPermissionExisted(permissions: string[]) {
    const rbacActions = await this.rbacActionRepo.find({
      where: { key: In(permissions) },
    });

    if (rbacActions.length !== permissions.length) {
      throw ErrorHttpException(HttpStatus.CONFLICT, 'RBAC_ACTION_NOT_FOUND');
    }
  }

  async getKeysFromRoleAction(roleId: number): Promise<string[]> {
    const roleActions = await this.roleActionRepo
      .createQueryBuilder('roleAction')
      .where('roleAction.roleId = :roleId', { roleId })
      .getMany();

    const keys = _.map(roleActions, 'action');
    return keys;
  }
}
