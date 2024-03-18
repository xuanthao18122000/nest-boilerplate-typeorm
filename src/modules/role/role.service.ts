import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { ErrorHttpException } from 'src/submodules/common/exceptions/throw.exception';
import { listResponse } from 'src/submodules/common/response/response-list.response';
import { Role, RoleAction } from 'src/submodules/database/entities';
import { Repository } from 'typeorm';
import { RbacModuleService } from '../rbac-module/rbac-module.service';
import { CreateRolesDto, ListRolesDto, UpdateRolesDto } from './dto/role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,

    @InjectRepository(RoleAction)
    private readonly roleActionRepo: Repository<RoleAction>,

    private readonly rbacModuleService: RbacModuleService,
  ) {}
  async create(body: CreateRolesDto) {
    const { name, permissions } = body;

    await Promise.all([
      this.checkRoleNameNotExisted(name),
      this.rbacModuleService.checkPermissionExisted(permissions),
    ]);

    const role = this.roleRepo.create({
      name,
    });

    const newRole = await this.roleRepo.save(role);

    if (permissions.length !== 0) {
      await this.insertRoleAction(newRole.id, permissions);
    }

    return newRole;
  }

  async insertRoleAction(roleId: number, permissions: string[]): Promise<void> {
    const roleActions: RoleAction[] = [];

    for (const action of permissions) {
      roleActions.push(
        this.roleActionRepo.create({
          roleId,
          action,
        }),
      );
    }

    await this.roleActionRepo.save(roleActions);
  }

  async update(id: number, body: UpdateRolesDto) {
    const { name, status, permissions } = body;

    const role = await this.roleRepo.findOne({
      where: { id },
    });

    if (!role) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'ROLE_NOT_FOUND');
    }

    if (status) role.status = status;
    if (name) {
      await this.checkRoleNameNotExisted(name);
      role.name = name;
    }
    if (permissions) {
      await this.roleActionRepo.delete({ roleId: role.id });
      await this.insertRoleAction(role.id, permissions);
    }

    return await this.roleRepo.save(role);
  }

  async getAll(query: ListRolesDto) {
    const queryBuilder = this.roleRepo
      .createQueryBuilder('role')
      .orderBy('role.id', 'ASC');

    const [list, total] = await queryBuilder.getManyAndCount();
    return listResponse(list, total, query);
  }

  async getOne(id: number) {
    const role = await this.roleRepo
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.actions', 'actions')
      .where('role.id = :id', { id })
      .getOne();

    if (!role) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'ROLE_NOT_FOUND');
    }
    const permissions = _.map(role.actions, 'action');
    return { ...role, permissions };
  }

  async checkRoleNameNotExisted(name: string) {
    const isExistedRole = await this.roleRepo.findOneBy({ name });

    if (isExistedRole) {
      throw ErrorHttpException(HttpStatus.CONFLICT, 'ROLE_NAME_EXISTED');
    }
  }
}
