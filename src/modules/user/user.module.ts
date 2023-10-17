import { Module } from '@nestjs/common';
import { User } from 'src/database/entities';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import FilterBuilder from 'src/common/share/filter.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, FilterBuilder],
})
export class UserModule {}
