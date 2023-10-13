import { Module } from '@nestjs/common';
import { User } from 'src/database/entities';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import FilterBuilderService from 'src/common/filter-builder/filter-builder.service';
import FilterBuilder from 'src/common/share/filter.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, FilterBuilderService, FilterBuilder],
})
export class UserModule {}
