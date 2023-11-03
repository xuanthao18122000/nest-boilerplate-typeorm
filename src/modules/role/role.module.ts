import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RbacAction, RbacModule, Role, User } from 'src/database/entities';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, RbacModule, RbacAction])],
  providers: [RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
