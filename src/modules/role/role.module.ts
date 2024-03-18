import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  RbacAction,
  RbacModule,
  Role,
  RoleAction,
} from 'src/submodules/database/entities';
import { RbacModuleService } from '../rbac-module/rbac-module.service';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, RoleAction, RbacModule, RbacAction]),
  ],
  controllers: [RoleController],
  providers: [RoleService, RbacModuleService],
})
export class RoleModule {}
