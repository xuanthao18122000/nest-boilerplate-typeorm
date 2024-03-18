import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ErrorHttpException } from 'src/submodules/common/exceptions/throw.exception';
import { RbacAction, RbacModule } from 'src/submodules/database/entities';
import { In, Repository } from 'typeorm';
import {
  CreateMultipleRbacActions,
  CreateRbacActions,
} from './dto/rbac-action.dto';

@Injectable()
export class RbacActionService {
  constructor(
    @InjectRepository(RbacModule)
    private readonly rbacModuleRepo: Repository<RbacModule>,

    @InjectRepository(RbacAction)
    private readonly rbacActionRepo: Repository<RbacAction>,
  ) {}

  async create(body: CreateRbacActions) {
    const { key, name, module } = body;

    const [rbacModule, rbacAction] = await Promise.all([
      this.rbacModuleRepo.findOneBy({ key: module }),
      this.rbacActionRepo.findOneBy({ key }),
    ]);

    if (!rbacModule) {
      throw ErrorHttpException(HttpStatus.CONFLICT, 'RBAC_MODULE_NOT_FOUND');
    }

    if (rbacAction) {
      throw ErrorHttpException(HttpStatus.CONFLICT, 'RBAC_ACTION_EXISTED');
    }

    return await this.rbacActionRepo.save({
      key,
      name,
      moduleId: rbacModule.id,
    });
  }

  async createMultiple({ actions }: CreateMultipleRbacActions) {
    const listKeyActions = actions.map((item) => item.key);

    const rbacActions = await this.rbacActionRepo.find({
      where: { key: In(listKeyActions) },
    });

    if (rbacActions.length > 0) {
      throw ErrorHttpException(HttpStatus.CONFLICT, 'RBAC_ACTION_EXISTED');
    }

    const data: Partial<RbacAction>[] = [];

    for (const item of actions) {
      const { key, name, module } = item;
      const rbacModule = await this.rbacModuleRepo.findOneBy({
        key: module,
      });

      if (!rbacModule) {
        throw ErrorHttpException(HttpStatus.CONFLICT, 'RBAC_MODULE_NOT_FOUND');
      }

      data.push({
        name,
        key,
        moduleId: rbacModule.id,
      });
    }

    return await this.rbacActionRepo.save(data);
  }
}
