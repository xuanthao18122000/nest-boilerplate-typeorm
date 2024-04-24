import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Area,
  Location,
  RbacAction,
  RbacModule,
  Role,
  RoleAction,
  User,
  UserAction,
} from 'src/submodule/database/entities';
import { LocationService } from '../location/location.service';
import { RbacModuleService } from '../rbac-module/rbac-module.service';
import { ROUModule } from '../rou/rou.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      UserAction,
      Area,
      Location,
      RoleAction,
      RbacModule,
      RbacAction,
    ]),
    ROUModule,
  ],
  controllers: [UserController],
  providers: [UserService, LocationService, RbacModuleService],
})
export class UserModule {}
