import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Location,
  ROU,
  RbacAction,
  RbacModule,
  Role,
  RoleAction,
  User,
  UserAction,
} from 'src/submodules/database/entities';
import { LocationService } from '../location/location.service';
import { RbacModuleService } from '../rbac-module/rbac-module.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      UserAction,
      ROU,
      Location,
      RoleAction,
      RbacModule,
      RbacAction,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, LocationService, RbacModuleService],
})
export class UserModule {}
