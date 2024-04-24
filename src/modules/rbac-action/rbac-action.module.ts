import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  RbacAction,
  RbacModule,
  Role,
  RoleAction,
} from 'src/submodule/database/entities';
import { RbacActionController } from './rbac-action.controller';
import { RbacActionService } from './rbac-action.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RbacModule, RbacAction, Role, RoleAction]),
  ],
  controllers: [RbacActionController],
  providers: [RbacActionService],
})
export class RbacActionsModule {}
