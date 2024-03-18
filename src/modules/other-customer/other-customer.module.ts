import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Area, ORP, ROU, Staff } from 'src/submodules/database/entities';
import { OtherCustomerController } from './other-customer.controller';
import { OtherCustomerService } from './other-customer.service';

@Module({
  imports: [TypeOrmModule.forFeature([ORP, ROU, Area, Staff])],
  controllers: [OtherCustomerController],
  providers: [OtherCustomerService],
})
export class OtherCustomerModule {}
