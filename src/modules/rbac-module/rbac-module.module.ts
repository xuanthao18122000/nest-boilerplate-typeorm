import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  RbacAction,
  RbacModule,
  RoleAction,
} from 'src/submodule/database/entities';
import { RbacModuleController } from './rbac-module.controller';
import { RbacModuleService } from './rbac-module.service';

@Module({
  imports: [TypeOrmModule.forFeature([RbacModule, RbacAction, RoleAction])],
  controllers: [RbacModuleController],
  providers: [RbacModuleService],
})
export class RbacModulesModule {}
