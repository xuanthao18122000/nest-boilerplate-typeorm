import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorHttpException } from 'src/common/exceptions/throw.exception';
import { RbacAction, RbacModule, Role, User } from 'src/database/entities';
import { Repository } from 'typeorm';
import { CreateRolesDto } from './dto/create-roles.dto';
import { ListRolesDto } from './dto/list-roles.dto';
import { UpdateRolesDto } from './dto/update-roles.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(RbacModule)
    private readonly rbacModuleRepo: Repository<RbacModule>,

    @InjectRepository(RbacAction)
    private readonly rbacActionRepo: Repository<RbacAction>,
  ) {}
  async create(body: CreateRolesDto) {
    const { key } = body;

    const role = await this.roleRepo.findOne({ where: { key: key } });
    if (role) {
      throw ErrorHttpException(HttpStatus.CONFLICT, 'ROLE_EXISTED');
    }
    return await this.roleRepo.save(role);
  }
  async updateRole(id: number, body: UpdateRolesDto) {
    const { listActions } = body;
    if (listActions?.length === 0) {
      throw ErrorHttpException(HttpStatus.BAD_REQUEST, 'ROLE_NOT_NULL');
    }
    const role = await this.roleRepo.findOne({
      where: { id },
    });
    if (!role) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'ROLE_NOT_FOUND');
    }

    return await this.roleRepo.save(role);
  }

  async getAll(query: ListRolesDto) {
    console.log(query);
    const rolesQuery = this.roleRepo
      .createQueryBuilder('role')
      .orderBy('role.id', 'ASC');

    const roles = await rolesQuery.getMany();
    return roles;
  }
  async getOne(id: number) {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) {
      throw ErrorHttpException(HttpStatus.NOT_FOUND, 'ROLE_NOT_FOUND');
    }
    return role;
  }
}
